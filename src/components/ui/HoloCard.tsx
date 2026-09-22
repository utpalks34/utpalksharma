import React, { useRef, useState } from 'react';
import { sound } from '../../utils/audio';

interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderGlow?: boolean;
  onClick?: () => void;
}

export const HoloCard: React.FC<HoloCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(0, 240, 255, 0.25)',
  borderGlow = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, px: 50, py: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    // Subtle 3D tilt: max 6 degrees
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = (0.5 - (y / rect.height)) * 12;

    setCoords({ x: rotateY, y: rotateX, px, py });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playClick();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0, px: 50, py: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
      }}
      className={`relative group ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${coords.y.toFixed(2)}deg) rotateY(${coords.x.toFixed(2)}deg) translateZ(10px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 dark:border-white/5 bg-slate-900/60 dark:bg-[#0c0e17]/80 shadow-xl transition-all"
      >
        {/* Dynamic Cursor Spotlight / Specular Sheen */}
        {isHovered && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at ${coords.px}% ${coords.py}%, ${glowColor}, transparent 70%)`,
            }}
          />
        )}

        {/* Dynamic Border Reflection */}
        {borderGlow && isHovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-100 transition-opacity duration-300"
            style={{
              border: `1px solid ${glowColor}`,
            }}
          />
        )}

        {/* Card Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
