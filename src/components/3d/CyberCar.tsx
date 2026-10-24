import React, { useEffect, useRef, useState } from 'react';
import { Zap, Eye, Gauge, Compass, Activity } from 'lucide-react';
import { sound } from '../../utils/audio';
import './CyberCar.css';

export const CyberCar: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [driveMode, setDriveMode] = useState<'cruise' | 'boost'>('cruise');
  const [lightsOn, setLightsOn] = useState(true);
  const [speedMph, setSpeedMph] = useState(140);

  useEffect(() => {
    const target = driveMode === 'boost' ? 336 : 140;
    const interval = window.setInterval(() => {
      setSpeedMph((current) => {
        const remaining = target - current;
        if (Math.abs(remaining) <= 1) {
          window.clearInterval(interval);
          return target;
        }
        return current + Math.sign(remaining) * Math.ceil(Math.abs(remaining) * 0.16);
      });
    }, 60);
    return () => window.clearInterval(interval);
  }, [driveMode]);

  const resetPerspective = () => {
    stageRef.current?.style.setProperty('--car-x', '0px');
    stageRef.current?.style.setProperty('--car-y', '0px');
  };

  return (
    <div
      ref={stageRef}
      className="hero-car relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none"
      data-drive-mode={driveMode}
      data-lights={lightsOn ? 'on' : 'off'}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--car-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`);
        event.currentTarget.style.setProperty('--car-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 6}px`);
      }}
      onPointerLeave={resetPerspective}
    >
      <div className="hero-car__visual absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hero-car__ground" />
        <div className="hero-car__accent" />
        <div className="hero-car__photo-position">
          <div className="hero-car__motion">
            <img
              src="./images/hero-graphite-coupe.png"
              alt=""
              width={1536}
              height={1024}
              decoding="async"
              fetchPriority="high"
              draggable={false}
              className="hero-car__photo"
            />
          </div>
        </div>
      </div>

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

      <div className="absolute top-3 left-3 sm:left-6 z-20 hidden sm:flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0c0c10]/80 border border-white/10 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-mono text-slate-300">
            CHASSIS: <span className="text-white font-bold">CYBER-GT APEX</span>
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-full bg-[#101014]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button
          type="button"
          aria-pressed={driveMode === 'boost'}
          onClick={() => {
            setDriveMode((current) => current === 'cruise' ? 'boost' : 'cruise');
            if (driveMode === 'cruise') sound.playWhoosh();
            else sound.playClick();
          }}
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

        <button
          type="button"
          aria-label="Toggle car accent lighting"
          aria-pressed={lightsOn}
          onClick={() => {
            setLightsOn((current) => !current);
            sound.playClick();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all active:scale-95 ${
            lightsOn
              ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-glow-red'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
          }`}
          title="Toggle Car Accent Lighting"
        >
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">LIGHTS</span>
          <span className={`w-1.5 h-1.5 rounded-full ${
            lightsOn ? 'bg-red-500 animate-ping shadow-[0_0_6px_rgba(239,68,68,1)]' : 'bg-slate-600'
          }`} />
        </button>

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono text-slate-400">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span>AERO: 0.21 Cd</span>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono text-slate-400 opacity-60 whitespace-nowrap">
        Move pointer to explore
      </div>
    </div>
  );
};
