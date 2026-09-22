import React from 'react';
import { User, Cpu } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { DecryptedText } from './ui/DecryptedText';
import { HoloCard } from './ui/HoloCard';
import { AgentPipelineSimulator } from './interactive/AgentPipelineSimulator';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-xs mb-3">
            <User className="w-3.5 h-3.5" />
            <span>01 // PROFILE & ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-slate-500 font-normal">About </span>
            <DecryptedText text="me" speed={50} />
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-mono">
            Who I am and what I do.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Who I am Card */}
          <HoloCard glowColor="rgba(239, 68, 68, 0.25)">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Who I am
                </span>
                <span className="text-[11px] font-mono text-slate-500">B.Tech CSE '26</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                {PORTFOLIO_DATA.about.whoIAm}
              </p>
            </div>
          </HoloCard>

          {/* What I do Card */}
          <HoloCard glowColor="rgba(244, 63, 94, 0.25)">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  What I do
                </span>
                <span className="text-[11px] font-mono text-slate-500">Agentic + Backend</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                {PORTFOLIO_DATA.about.whatIDo}
              </p>
            </div>
          </HoloCard>
        </div>

        {/* Key Highlights Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {PORTFOLIO_DATA.about.highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/10 dark:border-white/5 bg-[#121216]/60 backdrop-blur-md hover:border-red-500/30 transition-all"
            >
              <p className="text-[11px] font-mono text-slate-400 mb-1">{item.label}</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white mb-1">{item.value}</p>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Live LangGraph Interactive Pipeline Simulator */}
        <div className="w-full">
          <AgentPipelineSimulator />
        </div>
      </div>
    </section>
  );
};
