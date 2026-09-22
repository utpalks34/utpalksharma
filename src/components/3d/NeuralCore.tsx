import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export const NeuralCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number>(0);

  // Car model references
  const carPivotRef = useRef<THREE.Group | null>(null);
  const carGroupRef = useRef<THREE.Group | null>(null);
  const tiltXRef = useRef<number>(0);
  const tiltYRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const carMaxDimRef = useRef<number>(1);

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // IntersectionObserver to pause rendering when hero is out of view
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

    const camera = new THREE.PerspectiveCamera(52, width / height, 1, 2000);
    camera.position.set(0, 20, 580);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x262632, 1.6);
    scene.add(ambientLight);

    // Cool white key light
    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 2.0);
    keyLight.position.set(180, 300, 380);
    scene.add(keyLight);

    // Dual crimson rim lights for glowing body contours
    const rimLightRight = new THREE.DirectionalLight(0xef4444, 5.2);
    rimLightRight.position.set(380, 220, -320);
    scene.add(rimLightRight);

    const rimLightLeft = new THREE.DirectionalLight(0xff1e42, 4.6);
    rimLightLeft.position.set(-380, 180, -320);
    scene.add(rimLightLeft);

    // Crimson underglow point light
    const underglowLight = new THREE.PointLight(0xdc2626, 2.0, 600);
    underglowLight.position.set(0, -90, 0);
    scene.add(underglowLight);

    // Car Root Pivot Group
    const carPivot = new THREE.Group();
    const carGroup = new THREE.Group();
    carPivot.add(carGroup);
    scene.add(carPivot);
    carPivotRef.current = carPivot;
    carGroupRef.current = carGroup;

    // Contact shadow underneath car wheels
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const gradient = sCtx.createRadialGradient(128, 128, 10, 128, 128, 115);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.6)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.22)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = gradient;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(520, 300),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -90;
    carPivot.add(shadowMesh);

    // Setup DRACOLoader and GLTFLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      '/bmw_m4.glb',
      (gltf) => {
        const model = gltf.scene;

        // Traverse and tune materials to matte obsidian & crimson reflections
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  // Car body paint
                  if (mat.name === 'Meshesbody151Mtl') {
                    mat.color.set('#18191d'); // Matte obsidian gunmetal
                    mat.roughness = 0.32;
                    mat.metalness = 0.78;
                  } else if (mat.name === 'Mesheswindows1Mtl') {
                    mat.transparent = true;
                    mat.opacity = 0.82;
                    mat.roughness = 0.08;
                    mat.metalness = 0.95;
                  } else if (mat.name === 'Caliper1Mtl') {
                    mat.color.set('#ef4444'); // Crimson calipers
                    mat.metalness = 0.5;
                    mat.roughness = 0.25;
                  } else if (mat.name.toLowerCase().includes('rim')) {
                    mat.color.set('#22252c'); // Satin titanium wheels
                    mat.roughness = 0.25;
                    mat.metalness = 0.85;
                  } else if (mat.name === 'Meshesredlight1Mtl' || mat.name === 'Meshestail71Mtl') {
                    mat.color.set('#ef4444');
                    mat.emissive.set('#ff1e42');
                    mat.emissiveIntensity = 1.6;
                  } else if (mat.name === 'Meshesheadlight51Mtl' || mat.name === 'Meshesled11Mtl') {
                    mat.emissive.set('#e2e8f0');
                    mat.emissiveIntensity = 0.85;
                  }
                }
              });
            }
          }
        });

        // Center BMW M4 geometry exactly at (0, 0, 0)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x = -center.x;
        model.position.y = -center.y + 12;
        model.position.z = -center.z;

        // Calculate prominent presentation scale (460 on desktop, 340 on mobile)
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        carMaxDimRef.current = maxDim;
        const targetDim = (container.clientWidth || window.innerWidth) < 640 ? 340 : 460;
        carPivot.scale.setScalar(targetDim / maxDim);

        carGroup.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading BMW M4 model:', error);
        setIsLoading(false);
      }
    );

    // Mouse listener for parallax tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.targetX = x * 180;
      mouseRef.current.targetY = y * 180;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);

      // Re-scale car for viewport
      if (carPivotRef.current && carMaxDimRef.current > 0) {
        const targetDim = w < 640 ? 340 : 460;
        carPivotRef.current.scale.setScalar(targetDim / carMaxDimRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      // Save GPU cycles when hero section is out of viewport
      if (!isVisibleRef.current) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Parallax tilt (5-8° max = ~0.09-0.14 rad) easing back to center on mouse leave
      const targetTiltX = (mouseRef.current.y / 180) * 0.09;
      const targetTiltY = (mouseRef.current.x / 180) * 0.12;
      tiltXRef.current += (targetTiltX - tiltXRef.current) * 0.06;
      tiltYRef.current += (targetTiltY - tiltYRef.current) * 0.06;

      // Vertical float/bob (~2.5s loop, small amplitude ~6 units) for hovering feel
      const floatOffset = Math.sin(elapsedTime * 2.4) * 6.0;

      // BMW M4 animations
      if (carPivotRef.current && carGroupRef.current) {
        carPivotRef.current.position.y = floatOffset;

        // Parallax tilt on inner group
        carGroupRef.current.rotation.x = tiltXRef.current;
        carGroupRef.current.rotation.z = -tiltYRef.current * 0.35;

        // Continuous ambient slow auto-rotation on Y-axis (~22s per full revolution)
        const autoRot = elapsedTime * 0.28;
        carPivotRef.current.rotation.y = autoRot + tiltYRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      dracoLoader.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center select-none"
      onMouseLeave={() => {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
      }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Lightweight Thematic Loading Fallback */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 transition-opacity duration-500 bg-[#0c0c10]/40 backdrop-blur-[2px]">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
            <div
              className="w-8 h-8 rounded-full border border-rose-500/30 border-b-rose-400 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
            />
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,1)]" />
          </div>
          <div className="mt-3 flex flex-col items-center gap-1">
            <span className="text-[11px] font-mono text-red-400 font-semibold tracking-wider uppercase">
              BMW M4 G82
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              INITIALIZING 3D ENGINE...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
