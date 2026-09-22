import React, { useState } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { DecryptedText } from './ui/DecryptedText';
import { HoloCard } from './ui/HoloCard';
import { sound } from '../utils/audio';

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI & Agentic', 'Backend & DB', 'DevOps & Tooling'];

  const filteredSkills = selectedCategory === 'All'
    ? PORTFOLIO_DATA.skills
    : PORTFOLIO_DATA.skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 // CAPABILITIES MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              <span className="text-slate-500 font-normal">My </span>
              <DecryptedText text="skills" speed={50} />
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400 font-mono">
              Languages, frameworks, tooling.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#121216]/80 border border-white/10 backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-glow-red'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Animated Progress Bars */}
          <div className="lg:col-span-8 space-y-4">
            <HoloCard glowColor="rgba(239, 68, 68, 0.25)">
              <div className="p-6 md:p-8 space-y-6">
                {filteredSkills.map((skill, idx) => (
                  <div key={skill.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500">0{idx + 1}</span>
                        <span className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-red-400 transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-red-400 font-semibold">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="h-2.5 w-full bg-[#08080a] rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out relative group-hover:brightness-125"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: skill.color || '#ef4444',
                          boxShadow: `0 0 14px ${skill.color || '#ef4444'}90`,
                        }}
                      >
                        {/* Shimmer light bar */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </HoloCard>
          </div>

          {/* Right Column: Side Card & Additional Tooling */}
          <div className="lg:col-span-4 space-y-6">
            <HoloCard glowColor="rgba(244, 63, 94, 0.25)">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3 text-red-400">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Architecture</span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white mb-2 leading-snug">
                  Agentic AI &amp; backend
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                  {PORTFOLIO_DATA.additionalSkills.list}
                </p>

                <div className="pt-4 border-t border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-3">
                    Ecosystem &amp; Tooling Chips
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PORTFOLIO_DATA.additionalSkills.badges.map((badge) => (
                      <span
                        key={badge}
                        onMouseEnter={() => sound.playClick()}
                        className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-[#08080a] hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/40 transition-all cursor-default"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </HoloCard>
          </div>
        </div>
      </div>
    </section>
  );
};
