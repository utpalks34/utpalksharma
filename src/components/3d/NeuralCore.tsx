import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../../utils/audio';

type GeometryMode = 'sphere' | 'torus' | 'grid';

export const NeuralCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<GeometryMode>('sphere');
  const [isHovered, setIsHovered] = useState(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number>(0);
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const currentPositionsRef = useRef<Float32Array | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const PARTICLE_COUNT = 1800;

  // Compute positions for shapes
  const generatePositions = (mode: GeometryMode): Float32Array => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      if (mode === 'sphere') {
        // Fibonacci sphere distribution
        const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
        const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
        const radius = 220 + (Math.random() - 0.5) * 45;

        pos[idx] = radius * Math.cos(theta) * Math.sin(phi);
        pos[idx + 1] = radius * Math.sin(theta) * Math.sin(phi);
        pos[idx + 2] = radius * Math.cos(phi);
      } else if (mode === 'torus') {
        // Torus / Ring accelerator
        const u = (i / PARTICLE_COUNT) * Math.PI * 2 * 4;
        const v = Math.random() * Math.PI * 2;
        const R = 230;
        const r = 60 + (Math.random() - 0.5) * 20;

        pos[idx] = (R + r * Math.cos(v)) * Math.cos(u);
        pos[idx + 1] = (R + r * Math.cos(v)) * Math.sin(u);
        pos[idx + 2] = r * Math.sin(v);
      } else {
        // Distributed 3D Grid / Neural Matrix
        const side = Math.cbrt(PARTICLE_COUNT);
        const x = (i % side) - side / 2;
        const y = (Math.floor(i / side) % side) - side / 2;
        const z = Math.floor(i / (side * side)) - side / 2;
        const spacing = 32;

        pos[idx] = x * spacing + (Math.random() - 0.5) * 12;
        pos[idx + 1] = y * spacing + (Math.random() - 0.5) * 12;
        pos[idx + 2] = z * spacing + (Math.random() - 0.5) * 12;
      }
    }

    return pos;
  };

  const handleModeSwitch = (mode: GeometryMode) => {
    setCurrentMode(mode);
    sound.playWhoosh();
    targetPositionsRef.current = generatePositions(mode);
  };

  const triggerPulse = () => {
    sound.playChime();
    if (!currentPositionsRef.current) return;
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      currentPositionsRef.current[i] *= 1.45;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 2000);
    camera.position.z = 600;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Positions & Initial Geometry
    const initialPositions = generatePositions('sphere');
    const currentPositions = new Float32Array(initialPositions);
    currentPositionsRef.current = currentPositions;
    targetPositionsRef.current = initialPositions;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    // Particle Colors: Matte Black & Crimson Red Palette
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const colorA = new THREE.Color('#ff1e42'); // Vivid Neon Red
    const colorB = new THREE.Color('#dc2626'); // Crimson
    const colorC = new THREE.Color('#7f1d1d'); // Deep Blood Red

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = i / PARTICLE_COUNT;
      const c = p < 0.5 ? colorA.clone().lerp(colorB, p * 2) : colorB.clone().lerp(colorC, (p - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular particle texture with crimson glow
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 30, 66, 0.95)');
      grad.addColorStop(0.6, 'rgba(185, 28, 28, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 14,
      map: texture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, pointsMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Crimson Synaptic Connecting Lines
    const MAX_LINE_SEGMENTS = 500;
    const linePositions = new Float32Array(MAX_LINE_SEGMENTS * 6);
    const lineColors = new Float32Array(MAX_LINE_SEGMENTS * 6);
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const lineSegments = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lineSegments);
    linesRef.current = lineSegments;

    // Orbiting Agent Nodes (Crimson & Ruby Wireframe Orbs)
    const agentNodes: THREE.Mesh[] = [];
    const nodeColors = ['#ff1e42', '#ef4444', '#dc2626', '#f43f5e', '#b91c1c'];

    for (let i = 0; i < 5; i++) {
      const orbGeo = new THREE.SphereGeometry(10, 16, 16);
      const orbMat = new THREE.MeshBasicMaterial({
        color: nodeColors[i],
        wireframe: true,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      scene.add(orb);
      agentNodes.push(orb);
    }

    // Mouse listener
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
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Rotate particle group
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.18 + mouseRef.current.x * 0.002;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 + mouseRef.current.y * 0.002;
      }

      // Morph particle positions towards target
      if (currentPositionsRef.current && targetPositionsRef.current && geometry.attributes.position) {
        const cur = currentPositionsRef.current;
        const target = targetPositionsRef.current;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;

        let moved = false;
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          const diff = target[i] - cur[i];
          if (Math.abs(diff) > 0.01) {
            cur[i] += diff * 0.06;
            moved = true;
          }
        }

        if (moved) {
          posAttr.needsUpdate = true;
        }
      }

      // Dynamic Synaptic Lines in Crimson Red
      if (lineSegments && currentPositionsRef.current) {
        const cur = currentPositionsRef.current;
        let lineIdx = 0;
        const linePos = lineSegments.geometry.attributes.position.array as Float32Array;
        const lineCol = lineSegments.geometry.attributes.color.array as Float32Array;

        for (let i = 0; i < 180 && lineIdx < MAX_LINE_SEGMENTS; i++) {
          const p1 = (i * 9) % PARTICLE_COUNT;
          const p2 = (p1 + 27) % PARTICLE_COUNT;

          const x1 = cur[p1 * 3], y1 = cur[p1 * 3 + 1], z1 = cur[p1 * 3 + 2];
          const x2 = cur[p2 * 3], y2 = cur[p2 * 3 + 1], z2 = cur[p2 * 3 + 2];

          const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
          if (dist < 130) {
            const ptr = lineIdx * 6;
            linePos[ptr] = x1;
            linePos[ptr + 1] = y1;
            linePos[ptr + 2] = z1;
            linePos[ptr + 3] = x2;
            linePos[ptr + 4] = y2;
            linePos[ptr + 5] = z2;

            const alpha = 1 - dist / 130;
            // Crimson Red line color
            lineCol[ptr] = 1.0 * alpha; lineCol[ptr + 1] = 0.12 * alpha; lineCol[ptr + 2] = 0.25 * alpha;
            lineCol[ptr + 3] = 0.8 * alpha; lineCol[ptr + 4] = 0.05 * alpha; lineCol[ptr + 5] = 0.15 * alpha;

            lineIdx++;
          }
        }

        lineSegments.geometry.setDrawRange(0, lineIdx * 2);
        lineSegments.geometry.attributes.position.needsUpdate = true;
        lineSegments.geometry.attributes.color.needsUpdate = true;
      }

      // Orbiting Agent Nodes
      agentNodes.forEach((orb, i) => {
        const angle = elapsedTime * 0.45 + (i * Math.PI * 2) / agentNodes.length;
        const radius = 280;
        orb.position.x = Math.cos(angle) * radius;
        orb.position.z = Math.sin(angle) * radius;
        orb.position.y = Math.sin(elapsedTime * 1.5 + i) * 60;
        orb.rotation.x += 0.02;
        orb.rotation.y += 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Interactive Controls HUD in Matte Black & Crimson */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-[#101014]/90 border border-white/10 backdrop-blur-md shadow-2xl transition-all hover:scale-105">
        <span className="text-[10px] font-mono font-medium text-slate-400 px-2 tracking-wider uppercase hidden sm:inline">
          3D Core:
        </span>
        <button
          onClick={() => handleModeSwitch('sphere')}
          className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
            currentMode === 'sphere'
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-glow-red'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Neural Sphere
        </button>
        <button
          onClick={() => handleModeSwitch('torus')}
          className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
            currentMode === 'torus'
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-glow-red'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Torus Pipeline
        </button>
        <button
          onClick={() => handleModeSwitch('grid')}
          className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
            currentMode === 'grid'
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-glow-red'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Agent Grid
        </button>
        <button
          onClick={triggerPulse}
          title="Trigger Energy Burst"
          className="px-2.5 py-1 text-xs font-mono rounded-full bg-red-950/40 hover:bg-red-900/60 text-red-300 transition-all border border-red-800/40 active:scale-95"
        >
          ⚡ Pulse
        </button>
      </div>

      {/* Subtle Telemetry Hint */}
      <div
        className={`absolute top-4 right-4 z-20 text-[11px] font-mono text-red-400/90 bg-[#0c0c10]/80 border border-red-500/20 px-3 py-1.5 rounded-lg backdrop-blur-md transition-opacity duration-300 pointer-events-none hidden md:block ${
          isHovered ? 'opacity-100' : 'opacity-40'
        }`}
      >
        <span>WebGL • 1,800 Synapses • Crimson Gravity</span>
      </div>
    </div>
  );
};
