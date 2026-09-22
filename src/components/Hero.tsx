import React from 'react';
import { Download, ArrowUpRight, Sparkles, Terminal, MapPin, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { NeuralCore } from './3d/NeuralCore';
import { DecryptedText } from './ui/DecryptedText';
import { sound } from '../utils/audio';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden">
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
                <DecryptedText
                  text={PORTFOLIO_DATA.personal.name}
                  speed={40}
                  className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent"
                />
              </h1>
            </div>

            {/* Hero Lead Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl">
              {PORTFOLIO_DATA.personal.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={PORTFOLIO_DATA.personal.cvPath}
                download="Utpal_Kant_Sharma_Resume.pdf"
                onClick={() => sound.playChime()}
                className="group flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-glow-red transition-all active:scale-95"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download my CV</span>
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  sound.playClick();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-medium text-slate-300 hover:text-white bg-[#121216]/80 hover:bg-white/10 border border-white/10 hover:border-red-500/40 transition-all active:scale-95"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
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

          {/* Right Column: 3D Three.js Neural Core with SVG Memoji Overlay */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* 3D WebGL Neural Core */}
            <div className="w-full relative">
              <NeuralCore />

              {/* Floating Holographic Badge 1 */}
              <div className="absolute top-4 left-0 p-3 rounded-xl bg-[#121216]/90 border border-red-500/30 backdrop-blur-xl shadow-glow-red hidden sm:flex items-center gap-2.5 animate-float-slow">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-400">Specialization</p>
                  <p className="text-xs font-mono font-bold text-white">LangGraph Pipelines</p>
                </div>
              </div>

              {/* Floating Holographic Badge 2 */}
              <div
                className="absolute bottom-16 right-0 p-3 rounded-xl bg-[#121216]/90 border border-red-600/30 backdrop-blur-xl shadow-glow-red hidden sm:flex items-center gap-2.5 animate-float-slow"
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

              {/* Animated SVG Memoji Portrait Container */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-56 md:h-56 pointer-events-none opacity-85 hover:opacity-100 transition-opacity">
                <svg
                  viewBox="0 0 400 400"
                  role="img"
                  aria-label="Illustrated memoji portrait of Utpal Kant Sharma"
                  className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                >
                  <defs>
                    <radialGradient id="hero-mj-skin" cx="36%" cy="24%" r="78%">
                      <stop offset="0" stopColor="#FBD9C0" />
                      <stop offset=".58" stopColor="#F0BE9B" />
                      <stop offset="1" stopColor="#D89B72" />
                    </radialGradient>
                    <linearGradient id="hero-mj-hair" x1=".2" y1="0" x2=".8" y2="1">
                      <stop offset="0" stopColor="#6A7789" />
                      <stop offset=".5" stopColor="#4B5766" />
                      <stop offset="1" stopColor="#333C48" />
                    </linearGradient>
                    <linearGradient id="hero-mj-shirt" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#b91c1c" />
                      <stop offset="1" stopColor="#7f1d1d" />
                    </linearGradient>
                    <radialGradient id="hero-mj-lens" cx="32%" cy="26%" r="80%">
                      <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
                      <stop offset="1" stopColor="#FFFFFF" stopOpacity=".06" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="200" cy="376" rx="118" ry="20" fill="#111113" opacity=".12" />
                  <g className="animate-float-slow" style={{ transformOrigin: '200px 330px' }}>
                    <path d="M200 296c62 0 110 38 118 96H82c8-58 56-96 118-96Z" fill="url(#hero-mj-shirt)" />
                    <path d="M200 296c12 0 24 1 35 4l-35 44-35-44c11-3 23-4 35-4Z" fill="#F7F7F8" opacity=".95" />
                    <rect x="176" y="240" width="48" height="66" rx="24" fill="#D2946A" />
                    <ellipse cx="128" cy="200" rx="14" ry="19" fill="#EDBA95" />
                    <ellipse cx="272" cy="200" rx="14" ry="19" fill="#EDBA95" />
                    <path d="M200 96c42 0 70 30 70 82 0 62-31 106-70 106s-70-44-70-106c0-52 28-82 70-82Z" fill="url(#hero-mj-skin)" />
                    <path d="M130 170c-6 68 20 130 70 146 50-16 76-78 70-146-6 48-26 74-70 74s-64-26-70-74Z" fill="#39424E" />
                    <path d="M172 236c10-7 46-7 56 0-10 12-46 12-56 0Z" fill="#39424E" />
                    <path d="M184 250h32c-3 9-9 13-16 13s-13-4-16-13Z" fill="#7C4A45" />
                    <path d="M130 172c-4-58 26-90 70-90s74 32 70 90c-8-32-18-50-36-58-20 14-58 16-82 2-12 10-18 28-22 56Z" fill="url(#hero-mj-hair)" />
                    <ellipse cx="200" cy="60" rx="26" ry="22" fill="url(#hero-mj-hair)" />
                    <path d="M200 208v16c0 5-5 8-11 8" fill="none" stroke="#C3835A" strokeWidth="5.5" strokeLinecap="round" />
                    <rect x="150" y="162" width="36" height="7" rx="3.5" fill="#2F3846" />
                    <rect x="214" y="162" width="36" height="7" rx="3.5" fill="#2F3846" />
                    <circle cx="168" cy="192" r="30" fill="url(#hero-mj-lens)" />
                    <circle cx="232" cy="192" r="30" fill="url(#hero-mj-lens)" />
                    <g fill="none" stroke="#2B3340" strokeWidth="6" strokeLinecap="round">
                      <circle cx="168" cy="192" r="30" />
                      <circle cx="232" cy="192" r="30" />
                      <path d="M198 190h4" />
                      <path d="M138 186c-8-3-13-3-18 1" />
                      <path d="M262 186c8-3 13-3 18 1" />
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
