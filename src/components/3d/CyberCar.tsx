import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Zap, Eye, Gauge, Compass, Shield, Activity } from 'lucide-react';
import { sound } from '../../utils/audio';

export const CyberCar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [driveMode, setDriveMode] = useState<'cruise' | 'boost'>('cruise');
  const [lightsOn, setLightsOn] = useState<boolean>(true);
  const [speedMph, setSpeedMph] = useState<number>(142);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // References for Three.js animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Car references
  const carPivotRef = useRef<THREE.Group | null>(null);
  const carBodyGroupRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const frontWheelsRef = useRef<THREE.Group[]>([]);
  const headlightsRef = useRef<THREE.SpotLight[]>([]);
  const headlightMeshesRef = useRef<THREE.Mesh[]>([]);
  const underglowLightRef = useRef<THREE.PointLight | null>(null);
  const underglowPlaneRef = useRef<THREE.Mesh | null>(null);
  const exhaustParticlesRef = useRef<{ pos: Float32Array; vel: Float32Array; life: Float32Array; geometry: THREE.BufferGeometry } | null>(null);
  const windParticlesRef = useRef<{ pos: Float32Array; vel: Float32Array; geometry: THREE.BufferGeometry } | null>(null);
  const roadGridRef = useRef<THREE.Group | null>(null);

  const speedMultiplierRef = useRef<number>(1.0);
  const targetSpeedMultiplierRef = useRef<number>(1.0);

  // Interactive mouse / tilt
  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    isDragging: boolean;
    lastMouseX: number;
    orbitY: number;
  }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    lastMouseX: 0,
    orbitY: 0,
  });

  // Toggle Drive Mode
  const toggleDriveMode = () => {
    if (driveMode === 'cruise') {
      setDriveMode('boost');
      targetSpeedMultiplierRef.current = 2.4;
      sound.playWhoosh();
    } else {
      setDriveMode('cruise');
      targetSpeedMultiplierRef.current = 1.0;
      sound.playClick();
    }
  };

  // Toggle Lights
  const toggleLights = () => {
    const nextState = !lightsOn;
    setLightsOn(nextState);
    sound.playClick();
    headlightsRef.current.forEach((sl) => {
      sl.intensity = nextState ? (driveMode === 'boost' ? 8.0 : 5.0) : 0;
    });
    headlightMeshesRef.current.forEach((m) => {
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = nextState ? 2.5 : 0.2;
      }
    });
    if (underglowLightRef.current) {
      underglowLightRef.current.intensity = nextState ? 3.5 : 0.8;
    }
    if (underglowPlaneRef.current) {
      const mat = underglowPlaneRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = nextState ? 0.75 : 0.2;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Viewport intersection observer to save power when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0c0c10, 0.0018);

    const camera = new THREE.PerspectiveCamera(46, width / height, 1, 2200);
    camera.position.set(160, 95, 230);
    camera.lookAt(0, 10, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x1a1a24, 2.2);
    scene.add(ambientLight);

    // Cool key light
    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 2.2);
    keyLight.position.set(160, 240, 200);
    scene.add(keyLight);

    // Dynamic crimson rim light
    const rimLightLeft = new THREE.DirectionalLight(0xef4444, 4.5);
    rimLightLeft.position.set(-260, 140, -180);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xff1e42, 3.8);
    rimLightRight.position.set(260, 120, -160);
    scene.add(rimLightRight);

    // Neon ground underglow point light
    const underglowLight = new THREE.PointLight(0xdc2626, 3.5, 380);
    underglowLight.position.set(0, -12, 0);
    scene.add(underglowLight);
    underglowLightRef.current = underglowLight;

    // Root Car Pivot
    const carPivot = new THREE.Group();
    const carBodyGroup = new THREE.Group();
    carPivot.add(carBodyGroup);
    scene.add(carPivot);
    carPivotRef.current = carPivot;
    carBodyGroupRef.current = carBodyGroup;

    // ==========================================
    // PROCEDURAL 3D CYBERCAR CONSTRUCTION
    // ==========================================
    // Materials
    const obsidianPaint = new THREE.MeshStandardMaterial({
      color: 0x141419,
      metalness: 0.85,
      roughness: 0.28,
    });

    const carbonTrim = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.6,
      roughness: 0.45,
    });

    const cockpitGlass = new THREE.MeshStandardMaterial({
      color: 0x0d131f,
      metalness: 0.95,
      roughness: 0.08,
      transparent: true,
      opacity: 0.88,
    });

    const crimsonNeon = new THREE.MeshStandardMaterial({
      color: 0xff1e42,
      emissive: 0xef4444,
      emissiveIntensity: 2.8,
      roughness: 0.2,
      metalness: 0.2,
    });

    const laserWhiteNeon = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe2e8f0,
      emissiveIntensity: 3.2,
      roughness: 0.1,
    });

    const alloyRimMaterial = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.9,
      roughness: 0.2,
    });

    const tireRubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.15,
    });

    const brakeDiscMaterial = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.95,
      roughness: 0.25,
    });

    // 1. Lower Chassis / Undertray
    const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(48, 5, 142), carbonTrim);
    lowerChassis.position.set(0, -4, 0);
    carBodyGroup.add(lowerChassis);

    // Front Aerodynamic Carbon Splitter
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(54, 2, 28), carbonTrim);
    splitter.position.set(0, -5.5, 68);
    carBodyGroup.add(splitter);

    // Splitter endplates
    const leftSplitterWinglet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 6, 12), crimsonNeon);
    leftSplitterWinglet.position.set(27, -3.5, 74);
    carBodyGroup.add(leftSplitterWinglet);
    const rightSplitterWinglet = leftSplitterWinglet.clone();
    rightSplitterWinglet.position.x = -27;
    carBodyGroup.add(rightSplitterWinglet);

    // 2. Main Sculpted Body Fuselage
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(46, 12, 110), obsidianPaint);
    mainBody.position.set(0, 3, -4);
    carBodyGroup.add(mainBody);

    // Aerodynamic Hood Wedge
    const hoodGeo = new THREE.BufferGeometry();
    // Sloped aerodynamic front hood vertices
    const hw = 23; // half-width
    const hoodVertices = new Float32Array([
      // Top sloped facet
      -hw + 2, 8, 48,    hw - 2, 8, 48,    hw - 4, -2, 78,
      -hw + 2, 8, 48,    hw - 4, -2, 78,   -hw + 4, -2, 78,
      // Left slope
      -hw + 2, 8, 48,   -hw + 4, -2, 78,   -hw, -2, 48,
      // Right slope
      hw - 2, 8, 48,     hw, -2, 48,       hw - 4, -2, 78,
    ]);
    hoodGeo.setAttribute('position', new THREE.BufferAttribute(hoodVertices, 3));
    hoodGeo.computeVertexNormals();
    const hoodMesh = new THREE.Mesh(hoodGeo, obsidianPaint);
    carBodyGroup.add(hoodMesh);

    // Hood central air vent inset (crimson intake)
    const hoodVent = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 20), crimsonNeon);
    hoodVent.position.set(0, 4.2, 56);
    hoodVent.rotation.x = -0.32;
    carBodyGroup.add(hoodVent);

    // 3. Widebody Wheel Arches / Fenders
    const fenderGeo = new THREE.BoxGeometry(6, 10, 34);
    // Front Fenders
    const frontFenderLeft = new THREE.Mesh(fenderGeo, obsidianPaint);
    frontFenderLeft.position.set(24, 2, 44);
    carBodyGroup.add(frontFenderLeft);
    const frontFenderRight = frontFenderLeft.clone();
    frontFenderRight.position.x = -24;
    carBodyGroup.add(frontFenderRight);

    // Rear Muscle Fenders (wider for aggressive stance)
    const rearFenderGeo = new THREE.BoxGeometry(7, 12, 38);
    const rearFenderLeft = new THREE.Mesh(rearFenderGeo, obsidianPaint);
    rearFenderLeft.position.set(24.5, 3, -44);
    carBodyGroup.add(rearFenderLeft);
    const rearFenderRight = rearFenderLeft.clone();
    rearFenderRight.position.x = -24.5;
    carBodyGroup.add(rearFenderRight);

    // Side aero intake pods
    const sidePodLeft = new THREE.Mesh(new THREE.BoxGeometry(4, 8, 44), carbonTrim);
    sidePodLeft.position.set(23, 0, 0);
    carBodyGroup.add(sidePodLeft);
    const sidePodRight = sidePodLeft.clone();
    sidePodRight.position.x = -23;
    carBodyGroup.add(sidePodRight);

    // Crimson neon side runner lines
    const sideStripeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 46), crimsonNeon);
    sideStripeLeft.position.set(25.2, -3.2, 0);
    carBodyGroup.add(sideStripeLeft);
    const sideStripeRight = sideStripeLeft.clone();
    sideStripeRight.position.x = -25.2;
    carBodyGroup.add(sideStripeRight);

    // 4. Sleek Aerodynamic Cockpit Canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(32, 9.5, 52), cockpitGlass);
    canopy.position.set(0, 11, -8);
    canopy.rotation.x = -0.06;
    carBodyGroup.add(canopy);

    // Cockpit Roof Spine
    const roofSpine = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 48), obsidianPaint);
    roofSpine.position.set(0, 16.2, -8);
    carBodyGroup.add(roofSpine);

    // Interior Holographic Core / AI HUD (Visible through glass)
    const interiorHUD = new THREE.Mesh(
      new THREE.BoxGeometry(16, 4, 1),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    interiorHUD.position.set(0, 9.5, 12);
    interiorHUD.rotation.x = 0.25;
    carBodyGroup.add(interiorHUD);

    // 5. Active Aero Rear Wing / Spoiler
    const wingPylonLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, 12, 8), carbonTrim);
    wingPylonLeft.position.set(15, 11, -66);
    wingPylonLeft.rotation.x = -0.3;
    carBodyGroup.add(wingPylonLeft);
    const wingPylonRight = wingPylonLeft.clone();
    wingPylonRight.position.x = -15;
    carBodyGroup.add(wingPylonRight);

    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(54, 2, 14), carbonTrim);
    wingBlade.position.set(0, 16.5, -69);
    wingBlade.rotation.x = 0.08;
    carBodyGroup.add(wingBlade);

    // Wing neon trailing edge
    const wingNeonEdge = new THREE.Mesh(new THREE.BoxGeometry(54, 0.8, 1.2), crimsonNeon);
    wingNeonEdge.position.set(0, 16.8, -75.8);
    carBodyGroup.add(wingNeonEdge);

    // Wing vertical endplates
    const wingEndplateLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7, 16), crimsonNeon);
    wingEndplateLeft.position.set(27, 16.5, -69);
    carBodyGroup.add(wingEndplateLeft);
    const wingEndplateRight = wingEndplateLeft.clone();
    wingEndplateRight.position.x = -27;
    carBodyGroup.add(wingEndplateRight);

    // 6. Rear Diffuser & Exhaust Thrusters
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(44, 3, 20), carbonTrim);
    diffuser.position.set(0, -3.8, -68);
    diffuser.rotation.x = 0.22;
    carBodyGroup.add(diffuser);

    // Continuous Cyber LED Taillight Strip
    const taillightBar = new THREE.Mesh(new THREE.BoxGeometry(46, 2.2, 1.5), crimsonNeon);
    taillightBar.position.set(0, 4.5, -60.5);
    carBodyGroup.add(taillightBar);

    // Dual Plasma Exhaust Nozzles
    const exhaustLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.2, 8, 16),
      carbonTrim
    );
    exhaustLeft.rotation.x = Math.PI / 2;
    exhaustLeft.position.set(11, -0.5, -62);
    carBodyGroup.add(exhaustLeft);

    const exhaustFlameLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 0.8, 6, 12),
      crimsonNeon
    );
    exhaustFlameLeft.rotation.x = Math.PI / 2;
    exhaustFlameLeft.position.set(11, -0.5, -67);
    carBodyGroup.add(exhaustFlameLeft);

    const exhaustRight = exhaustLeft.clone();
    exhaustRight.position.x = -11;
    carBodyGroup.add(exhaustRight);

    const exhaustFlameRight = exhaustFlameLeft.clone();
    exhaustFlameRight.position.x = -11;
    carBodyGroup.add(exhaustFlameRight);

    // 7. Laser Headlights & Forward Beams
    const headlightLeft = new THREE.Mesh(new THREE.BoxGeometry(9, 2, 2.5), laserWhiteNeon);
    headlightLeft.position.set(15, 0.5, 78);
    headlightLeft.rotation.y = -0.22;
    carBodyGroup.add(headlightLeft);
    headlightMeshesRef.current.push(headlightLeft);

    const headlightRight = new THREE.Mesh(new THREE.BoxGeometry(9, 2, 2.5), laserWhiteNeon);
    headlightRight.position.set(-15, 0.5, 78);
    headlightRight.rotation.y = 0.22;
    carBodyGroup.add(headlightRight);
    headlightMeshesRef.current.push(headlightRight);

    // Spotlights projecting on ground ahead
    const spotL = new THREE.SpotLight(0xffffff, 5.0, 420, Math.PI / 6, 0.45, 1.5);
    spotL.position.set(15, 2, 76);
    spotL.target.position.set(20, -10, 260);
    scene.add(spotL);
    scene.add(spotL.target);
    headlightsRef.current.push(spotL);

    const spotR = new THREE.SpotLight(0xffffff, 5.0, 420, Math.PI / 6, 0.45, 1.5);
    spotR.position.set(-15, 2, 76);
    spotR.target.position.set(-20, -10, 260);
    scene.add(spotR);
    scene.add(spotR.target);
    headlightsRef.current.push(spotR);

    // Volumetric Light Projection Cones
    const beamGeo = new THREE.ConeGeometry(38, 160, 24, 1, true);
    beamGeo.translate(0, 80, 0);
    beamGeo.rotateX(Math.PI / 2);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beamMeshL = new THREE.Mesh(beamGeo, beamMat);
    beamMeshL.position.set(15, 0, 78);
    beamMeshL.rotation.y = 0.08;
    carBodyGroup.add(beamMeshL);

    const beamMeshR = new THREE.Mesh(beamGeo, beamMat);
    beamMeshR.position.set(-15, 0, 78);
    beamMeshR.rotation.y = -0.08;
    carBodyGroup.add(beamMeshR);

    // 8. 4 Highly-Detailed Wheels with Alloy Rims and Calipers
    const createWheel = (isFront: boolean, isLeft: boolean) => {
      const wheelAssembly = new THREE.Group();

      // Outer Rubber Tire with Tread
      const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(13.5, 13.5, 7.5, 24),
        tireRubberMaterial
      );
      tire.rotation.z = Math.PI / 2;
      wheelAssembly.add(tire);

      // Alloy Rim Barrel
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(10.5, 10.5, 7.8, 18),
        alloyRimMaterial
      );
      rim.rotation.z = Math.PI / 2;
      wheelAssembly.add(rim);

      // 6 Aerodynamic Rim Spokes
      for (let i = 0; i < 6; i++) {
        const spoke = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 18, 1.2),
          alloyRimMaterial
        );
        spoke.position.x = isLeft ? 3.8 : -3.8;
        spoke.rotation.x = (i * Math.PI) / 3;
        wheelAssembly.add(spoke);
      }

      // Center Hubcap with Crimson Dot
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 3.5, 8.2, 16),
        crimsonNeon
      );
      hub.rotation.z = Math.PI / 2;
      wheelAssembly.add(hub);

      // Stationary Caliper & Disc Group (caliper doesn't spin with wheel)
      const brakeAssembly = new THREE.Group();
      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(9, 9, 1.2, 16),
        brakeDiscMaterial
      );
      disc.rotation.z = Math.PI / 2;
      brakeAssembly.add(disc);

      const caliper = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 6.5, 6.5),
        crimsonNeon
      );
      caliper.position.set(isLeft ? 1.5 : -1.5, 6, 0);
      brakeAssembly.add(caliper);

      const fullWheelUnit = new THREE.Group();
      fullWheelUnit.add(wheelAssembly);
      fullWheelUnit.add(brakeAssembly);

      return { fullWheelUnit, wheelAssembly, isFront };
    };

    const wheelConfigs = [
      { isFront: true, isLeft: true, x: 25, y: -2, z: 44 },
      { isFront: true, isLeft: false, x: -25, y: -2, z: 44 },
      { isFront: false, isLeft: true, x: 25.5, y: -2, z: -44 },
      { isFront: false, isLeft: false, x: -25.5, y: -2, z: -44 },
    ];

    wheelsRef.current = [];
    frontWheelsRef.current = [];

    wheelConfigs.forEach((cfg) => {
      const { fullWheelUnit, wheelAssembly, isFront } = createWheel(cfg.isFront, cfg.isLeft);
      fullWheelUnit.position.set(cfg.x, cfg.y, cfg.z);
      carBodyGroup.add(fullWheelUnit);
      wheelsRef.current.push(wheelAssembly);
      if (isFront) {
        frontWheelsRef.current.push(fullWheelUnit);
      }
    });

    // 9. Crimson Neon Ground Underglow Shadow Plane
    const underglowCanvas = document.createElement('canvas');
    underglowCanvas.width = 256;
    underglowCanvas.height = 256;
    const uCtx = underglowCanvas.getContext('2d');
    if (uCtx) {
      const grad = uCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
      grad.addColorStop(0.35, 'rgba(220, 38, 38, 0.55)');
      grad.addColorStop(0.75, 'rgba(153, 27, 27, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      uCtx.fillStyle = grad;
      uCtx.fillRect(0, 0, 256, 256);
    }
    const underglowTex = new THREE.CanvasTexture(underglowCanvas);
    const underglowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 240),
      new THREE.MeshBasicMaterial({
        map: underglowTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })
    );
    underglowPlane.rotation.x = -Math.PI / 2;
    underglowPlane.position.y = -15.5;
    carPivot.add(underglowPlane);
    underglowPlaneRef.current = underglowPlane;

    // ==========================================
    // DYNAMIC ROAD / PERSPECTIVE GRID
    // ==========================================
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);
    roadGridRef.current = roadGroup;

    // Moving road grid lines
    const lineCount = 35;
    const roadLines: THREE.Mesh[] = [];
    const roadLineGeo = new THREE.PlaneGeometry(140, 1.8);
    const roadLineMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.28,
    });

    for (let i = 0; i < lineCount; i++) {
      const rLine = new THREE.Mesh(roadLineGeo, roadLineMat);
      rLine.rotation.x = -Math.PI / 2;
      rLine.position.set(0, -16, (i / lineCount) * 800 - 400);
      roadGroup.add(rLine);
      roadLines.push(rLine);
    }

    // Long perspective speed strip markers
    const centerStripGeo = new THREE.PlaneGeometry(2.5, 30);
    const centerStripMat = new THREE.MeshBasicMaterial({
      color: 0xff1e42,
      transparent: true,
      opacity: 0.8,
    });
    const centerStrips: THREE.Mesh[] = [];
    for (let i = 0; i < 16; i++) {
      const strip = new THREE.Mesh(centerStripGeo, centerStripMat);
      strip.rotation.x = -Math.PI / 2;
      strip.position.set(0, -15.8, i * 55 - 400);
      roadGroup.add(strip);
      centerStrips.push(strip);
    }

    // ==========================================
    // WIND-TUNNEL STREAMLINE PARTICLES
    // ==========================================
    const WIND_PARTICLE_COUNT = 90;
    const windPos = new Float32Array(WIND_PARTICLE_COUNT * 3);
    const windVel = new Float32Array(WIND_PARTICLE_COUNT);

    for (let i = 0; i < WIND_PARTICLE_COUNT; i++) {
      windPos[i * 3] = (Math.random() - 0.5) * 54;
      windPos[i * 3 + 1] = 2 + Math.random() * 20;
      windPos[i * 3 + 2] = 120 + Math.random() * 200;
      windVel[i] = 12 + Math.random() * 8;
    }

    const windGeometry = new THREE.BufferGeometry();
    windGeometry.setAttribute('position', new THREE.BufferAttribute(windPos, 3));

    const windMaterial = new THREE.PointsMaterial({
      color: 0xfca5a5,
      size: 2.4,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const windPoints = new THREE.Points(windGeometry, windMaterial);
    scene.add(windPoints);
    windParticlesRef.current = { pos: windPos, vel: windVel, geometry: windGeometry };

    // ==========================================
    // TWIN EXHAUST PLASMA PARTICLES
    // ==========================================
    const EXHAUST_COUNT = 80;
    const exPos = new Float32Array(EXHAUST_COUNT * 3);
    const exVel = new Float32Array(EXHAUST_COUNT * 3);
    const exLife = new Float32Array(EXHAUST_COUNT);

    for (let i = 0; i < EXHAUST_COUNT; i++) {
      const isLeft = i % 2 === 0;
      exPos[i * 3] = isLeft ? 11 : -11;
      exPos[i * 3 + 1] = -0.5;
      exPos[i * 3 + 2] = -67;
      exLife[i] = Math.random();
    }

    const exGeometry = new THREE.BufferGeometry();
    exGeometry.setAttribute('position', new THREE.BufferAttribute(exPos, 3));
    const exMaterial = new THREE.PointsMaterial({
      color: 0xff3b30,
      size: 4.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const exPoints = new THREE.Points(exGeometry, exMaterial);
    scene.add(exPoints);
    exhaustParticlesRef.current = { pos: exPos, vel: exVel, life: exLife, geometry: exGeometry };

    // Interactive mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.targetX = x * 90;
      mouseRef.current.targetY = y * 60;

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.lastMouseX;
        mouseRef.current.orbitY += deltaX * 0.012;
        mouseRef.current.lastMouseX = e.clientX;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.lastMouseX = e.clientX;
      setIsInteracting(true);
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
      setIsInteracting(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth transition for speed multiplier
      speedMultiplierRef.current +=
        (targetSpeedMultiplierRef.current - speedMultiplierRef.current) * 0.06;

      // Update live MPH in state periodically
      const currentCalculatedMph = Math.round(140 * speedMultiplierRef.current);
      setSpeedMph((prev) => (Math.abs(prev - currentCalculatedMph) > 1 ? currentCalculatedMph : prev));

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Suspension bounce / vibration
      const bounce = Math.sin(elapsed * 18 * speedMultiplierRef.current) * (0.4 * speedMultiplierRef.current);

      if (carPivotRef.current && carBodyGroupRef.current) {
        carPivotRef.current.position.y = bounce;

        // Front steering angle based on mouse X
        const steerAngle = (mouseRef.current.targetX / 90) * 0.28;
        frontWheelsRef.current.forEach((fw) => {
          fw.rotation.y = steerAngle;
        });

        // Car chassis banking into turns
        const bankRoll = -steerAngle * 0.18;
        const pitchTilt = (mouseRef.current.y / 60) * 0.08;
        carBodyGroupRef.current.rotation.z = bankRoll;
        carBodyGroupRef.current.rotation.x = pitchTilt;

        // Interactive or ambient orbit rotation
        if (!mouseRef.current.isDragging) {
          // Slow dynamic glide around 3/4 hero angle
          const heroBaseAngle = -0.32;
          const wobble = Math.sin(elapsed * 0.6) * 0.08;
          carPivotRef.current.rotation.y +=
            (heroBaseAngle + wobble + (mouseRef.current.x / 90) * 0.22 - carPivotRef.current.rotation.y) * 0.05;
        } else {
          carPivotRef.current.rotation.y = mouseRef.current.orbitY;
        }
      }

      // Rotate wheel tires & rims synchronized with velocity
      const wheelRotSpeed = 16 * speedMultiplierRef.current * delta;
      wheelsRef.current.forEach((w) => {
        w.rotation.x += wheelRotSpeed;
      });

      // Move Road Grid underneath car
      const roadSpeed = 380 * speedMultiplierRef.current * delta;
      roadLines.forEach((line) => {
        line.position.z -= roadSpeed;
        if (line.position.z < -400) {
          line.position.z += 800;
        }
      });
      centerStrips.forEach((strip) => {
        strip.position.z -= roadSpeed;
        if (strip.position.z < -400) {
          strip.position.z += 800;
        }
      });

      // Update Wind-Tunnel Streamlines
      if (windParticlesRef.current) {
        const { pos, vel, geometry } = windParticlesRef.current;
        const windSpeedFactor = speedMultiplierRef.current;
        for (let i = 0; i < WIND_PARTICLE_COUNT; i++) {
          pos[i * 3 + 2] -= vel[i] * windSpeedFactor * (delta * 60);

          // Flow over hood & roof curvature
          const z = pos[i * 3 + 2];
          if (z > 40 && z < 75) {
            pos[i * 3 + 1] = 5 + (75 - z) * 0.25;
          } else if (z > -30 && z <= 40) {
            pos[i * 3 + 1] = 14 + Math.sin((z + 30) * 0.05) * 2;
          } else if (z <= -30 && z > -75) {
            pos[i * 3 + 1] = 16;
          }

          // Reset particle to front
          if (pos[i * 3 + 2] < -180) {
            pos[i * 3 + 2] = 220 + Math.random() * 80;
            pos[i * 3] = (Math.random() - 0.5) * 54;
            pos[i * 3 + 1] = 2 + Math.random() * 14;
          }
        }
        geometry.attributes.position.needsUpdate = true;
      }

      // Update Twin Exhaust Plasma Particles
      if (exhaustParticlesRef.current) {
        const { pos, life, geometry } = exhaustParticlesRef.current;
        const exSpeed = 220 * speedMultiplierRef.current * delta;
        for (let i = 0; i < EXHAUST_COUNT; i++) {
          pos[i * 3 + 2] -= exSpeed * 0.35;
          life[i] += delta * 2.8 * speedMultiplierRef.current;

          if (life[i] > 1.0 || pos[i * 3 + 2] < -150) {
            life[i] = 0;
            const isLeft = i % 2 === 0;
            pos[i * 3] = (isLeft ? 11 : -11) + (Math.random() - 0.5) * 2;
            pos[i * 3 + 1] = -0.5 + (Math.random() - 0.5) * 2;
            pos[i * 3 + 2] = -67;
          }
        }
        geometry.attributes.position.needsUpdate = true;
      }

      // Exhaust flame flicker intensity
      const flamePulse = 0.85 + Math.sin(elapsed * 32) * 0.25 * speedMultiplierRef.current;
      exhaustFlameLeft.scale.set(flamePulse, flamePulse, flamePulse * speedMultiplierRef.current);
      exhaustFlameRight.scale.set(flamePulse, flamePulse, flamePulse * speedMultiplierRef.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none"
      onMouseLeave={() => {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
      }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full ${
          isInteracting ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        title="Click & Drag to rotate • Cybercar 3D Engine"
      />

      {/* Top High-Tech Telemetry Overlay HUD */}
      <div className="absolute top-3 right-3 sm:right-6 z-20 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c0c10]/85 border border-red-500/30 backdrop-blur-md shadow-glow-red">
          <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-[11px] font-mono font-semibold text-red-400">
            {speedMph} <span className="text-[9px] text-slate-400">MPH</span>
          </span>
          <span className="mx-1 text-slate-600">|</span>
          <span className="text-[10px] font-mono text-slate-300 uppercase">
            {driveMode === 'boost' ? 'WARP OVERDRIVE' : 'AERO CRUISE'}
          </span>
        </div>
      </div>

      {/* Top-Left Drivetrain Pill */}
      <div className="absolute top-3 left-3 sm:left-6 z-20 hidden sm:flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c0c10]/80 border border-white/10 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-mono text-slate-300">
            CHASSIS: <span className="text-white font-bold">CYBER-GT APEX</span>
          </span>
        </div>
      </div>

      {/* Bottom Interactive Dashboard Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-[#101014]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        {/* Drive Mode Toggle: Cruise vs Hyper Boost */}
        <button
          type="button"
          onClick={toggleDriveMode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all active:scale-95 ${
            driveMode === 'boost'
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-[0_0_15px_rgba(239,68,68,0.8)] border border-red-400/80 animate-pulse'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-red-500/40'
          }`}
          title="Toggle Hyper Boost Speed"
        >
          <Zap className={`w-3.5 h-3.5 ${driveMode === 'boost' ? 'text-yellow-300 animate-bounce' : 'text-red-400'}`} />
          <span>{driveMode === 'boost' ? 'HYPER BOOST' : 'CRUISE'}</span>
        </button>

        {/* Headlight & Underglow Switch */}
        <button
          type="button"
          onClick={toggleLights}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all active:scale-95 ${
            lightsOn
              ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-glow-red'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
          }`}
          title="Toggle Laser Headlights & Neon Underglow"
        >
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">LIGHTS</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              lightsOn ? 'bg-red-500 animate-ping shadow-[0_0_6px_rgba(239,68,68,1)]' : 'bg-slate-600'
            }`}
          />
        </button>

        {/* Dynamic Telemetry Status */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono text-slate-400">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span>AERO: 0.21 Cd</span>
        </div>
      </div>

      {/* Floating Drag Hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono text-slate-400 opacity-60 transition-opacity">
        Drag to orbit • 360° dynamic view
      </div>
    </div>
  );
};

