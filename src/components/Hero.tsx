import React, { useState } from 'react';
import { Download, ArrowUpRight, Sparkles, Terminal, MapPin, ShieldCheck, Lock } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { CyberCar } from './3d/CyberCar';
import { EncryptedText } from './ui/EncryptedText';
import { sound } from '../utils/audio';
import { useInView } from '../hooks/useInView';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const [hoverCV, setHoverCV] = useState(false);
  const [hoverContact, setHoverContact] = useState(false);
  const [hoverTerminal, setHoverTerminal] = useState(false);
  const { ref: sectionRef } = useInView<HTMLElement>({ threshold: 0.35 });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Background Matte Crimson Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-rose-950/20 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Kinetic Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121216]/90 border border-red-500/40 backdrop-blur-md shadow-glow-red">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,1)]" />
              <span className="text-[11px] font-mono font-medium text-red-400 tracking-wider">
                {PORTFOLIO_DATA.personal.status}
              </span>
            </div>

            {/* Kinetic Decrypted Title */}
            <div>
              <p className="text-sm font-mono text-red-500 font-semibold mb-1 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>DECRYPTED AGENT ENGINEER IDENTITY</span>
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                <span className="text-slate-400 font-normal">I'm </span>
                <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                  {PORTFOLIO_DATA.personal.name}
                </span>
              </h1>
            </div>

            {/* Hero Lead Paragraph */}
            <p className="block text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl">
              {PORTFOLIO_DATA.personal.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={PORTFOLIO_DATA.personal.cvPath}
                download="Utpal_Kant_Sharma_Resume.pdf"
                onClick={() => sound.playChime()}
                onMouseEnter={() => setHoverCV(true)}
                onMouseLeave={() => setHoverCV(false)}
                className="group relative flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-glow-red transition-all active:scale-95 overflow-hidden isolate"
              >
                {/* Encryption scan sweep */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none mix-blend-overlay transition-opacity duration-200 ${hoverCV ? 'opacity-100 animate-scan-sweep' : 'opacity-0'}`}
                />
                {/* Corner brackets - decrypt HUD */}
                <span aria-hidden="true" className={`absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-white/70 transition-opacity duration-200 ${hoverCV ? 'opacity-100' : 'opacity-0'}`} />
                <span aria-hidden="true" className={`absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-white/70 transition-opacity duration-200 ${hoverCV ? 'opacity-100' : 'opacity-0'}`} />

                {hoverCV ? (
                  <Lock className="w-4 h-4 animate-encrypt-flicker" />
                ) : (
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                )}
                <EncryptedText text="Download my CV" active={hoverCV} />
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={() => setHoverContact(true)}
                onMouseLeave={() => setHoverContact(false)}
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-medium text-slate-300 hover:text-white bg-[#121216]/80 hover:bg-white/10 border border-white/10 hover:border-red-500/40 transition-all active:scale-95 overflow-hidden isolate"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-red-400/30 to-transparent -skew-x-12 pointer-events-none mix-blend-screen transition-opacity duration-200 ${hoverContact ? 'opacity-100 animate-scan-sweep' : 'opacity-0'}`}
                />
                <EncryptedText text="Get in touch" active={hoverContact} />
                <ArrowUpRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={() => {
                  sound.playWhoosh();
                  onOpenTerminal();
                }}
                onMouseEnter={() => setHoverTerminal(true)}
                onMouseLeave={() => setHoverTerminal(false)}
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-medium text-red-400 hover:text-white bg-[#121216]/80 hover:bg-red-950/40 border border-dashed border-red-500/40 hover:border-red-500/70 transition-all active:scale-95 overflow-hidden isolate"
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-red-400/30 to-transparent -skew-x-12 pointer-events-none mix-blend-screen transition-opacity duration-200 ${hoverTerminal ? 'opacity-100 animate-scan-sweep' : 'opacity-0'}`}
                />
                <span aria-hidden="true" className={`absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-red-400/70 transition-opacity duration-200 ${hoverTerminal ? 'opacity-100' : 'opacity-0'}`} />
                <span aria-hidden="true" className={`absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-red-400/70 transition-opacity duration-200 ${hoverTerminal ? 'opacity-100' : 'opacity-0'}`} />

                <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <EncryptedText text="Open Terminal" active={hoverTerminal} />
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,1)]" />
              </button>
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {PORTFOLIO_DATA.personal.location}
              </span>
              <span>•</span>
              <span>{PORTFOLIO_DATA.personal.phone}</span>
              <span>•</span>
              <a
                href={PORTFOLIO_DATA.personal.socials.email}
                className="text-red-400 hover:text-red-300 hover:underline"
              >
                {PORTFOLIO_DATA.personal.email}
              </a>
            </div>
          </div>

          {/* Right Column: 3D Procedural Cybercar Interactive Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full relative">
              <CyberCar />

              {/* Floating Holographic Badge 1 */}
              <div className="absolute top-2 -left-2 p-3 rounded-xl bg-[#121216]/90 border border-red-500/30 backdrop-blur-xl shadow-glow-red hidden sm:flex items-center gap-2.5 animate-float-slow z-20 pointer-events-none">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400">Specialization</p>
                  <p className="text-xs font-mono font-bold text-white">Multi-Agent Systems</p>
                </div>
              </div>

              {/* Floating Holographic Badge 2 */}
              <div
                className="absolute bottom-20 -right-2 p-3 rounded-xl bg-[#121216]/90 border border-red-600/30 backdrop-blur-xl shadow-glow-red hidden sm:flex items-center gap-2.5 animate-float-slow z-20 pointer-events-none"
                style={{ animationDelay: '2.5s' }}
              >
                <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400">IBM Credential</p>
                  <p className="text-xs font-mono font-bold text-white">YB15NDMCH302</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
