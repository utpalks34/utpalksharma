import React, { useState } from 'react';
import {
  Sparkles, Zap, Rocket, Code2, Workflow, Brain, Database, Server, Cloud, Pin,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import type { SkillItem } from '../data/portfolioData';
import { DecryptedText } from './ui/DecryptedText';
import { HoloCard } from './ui/HoloCard';
import { sound } from '../utils/audio';

const SKILL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'PYTHON': Code2,
  'LANGCHAIN, LANGGRAPH': Workflow,
  'RAG, LLMs': Brain,
  'DJANGO, DRF': Server,
  'FASTAPI': Zap,
  'SQL, POSTGRESQL, POSTGIS': Database,
  'QDRANT, CHROMA': Database,
  'DOCKER, AWS': Cloud,
};

const LANE_ORDER: { category: SkillItem['category']; y: number }[] = [
  { category: 'AI & Agentic', y: 18 },
  { category: 'Backend & DB', y: 50 },
  { category: 'DevOps & Tooling', y: 82 },
];

const TRIGGER_X = 6;
const TRIGGER_OUT = 10.5;
const OUTPUT_X = 93;
const OUTPUT_IN = 87.5;
const NODE_HALF = 6.5;
const LANE_START = 24;
const LANE_END = 80;

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const midX = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
};

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI & Agentic', 'Backend & DB', 'DevOps & Tooling'];

  const lanes = LANE_ORDER.map((lane) => {
    const skills = PORTFOLIO_DATA.skills.filter((s) => s.category === lane.category);
    const n = skills.length;
    const nodes = skills.map((skill, i) => ({
      skill,
      x: n === 1 ? (LANE_START + LANE_END) / 2 : LANE_START + (i * (LANE_END - LANE_START)) / (n - 1),
      y: lane.y,
    }));
    return {
      ...lane,
      nodes,
      color: skills[0]?.color || '#ef4444',
      dimmed: selectedCategory !== 'All' && selectedCategory !== lane.category,
    };
  });

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
              A workflow of languages, frameworks and tooling.
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
          {/* Left Column: n8n-style Automation Canvas */}
          <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0c0c10]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Editor Chrome / Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0a0a0e]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-[11px] font-mono text-slate-500">skills-workflow.json</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </div>
            </div>

            {/* Canvas */}
            <div className="overflow-x-auto">
              <div
                className="relative min-w-[820px] min-h-[420px] sm:min-h-[460px]"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              >
                {/* Wires */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  {lanes.map((lane) => {
                    const first = lane.nodes[0];
                    const last = lane.nodes[lane.nodes.length - 1];
                    const segments: { id: string; d: string }[] = [
                      {
                        id: `${lane.category}-in`,
                        d: curve(TRIGGER_OUT, 50, first.x - NODE_HALF, lane.y),
                      },
                    ];
                    lane.nodes.forEach((node, i) => {
                      if (i === 0) return;
                      const prev = lane.nodes[i - 1];
                      segments.push({
                        id: `${lane.category}-${i}`,
                        d: curve(prev.x + NODE_HALF, lane.y, node.x - NODE_HALF, lane.y),
                      });
                    });
                    segments.push({
                      id: `${lane.category}-out`,
                      d: curve(last.x + NODE_HALF, lane.y, OUTPUT_IN, 50),
                    });

                    return segments.map((seg) => (
                      <g key={seg.id} style={{ transition: 'opacity 0.5s', opacity: lane.dimmed ? 0.15 : 0.9 }}>
                        <path
                          id={seg.id}
                          d={seg.d}
                          fill="none"
                          stroke={lane.color}
                          strokeWidth={0.35}
                          strokeLinecap="round"
                        />
                        <circle r="0.9" fill={lane.color}>
                          <animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto">
                            <mpath href={`#${seg.id}`} />
                          </animateMotion>
                        </circle>
                      </g>
                    ));
                  })}
                </svg>

                {/* Trigger Node */}
                <div
                  className="absolute z-10"
                  style={{ left: `${TRIGGER_X}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative w-[86px] h-[62px] rounded-l-2xl rounded-r-lg border border-amber-500/50 bg-[#101014] flex flex-col items-center justify-center gap-1 shadow-lg">
                    <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-amber-400 bg-[#0a0a0e]" />
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-[9px] font-mono text-slate-300 tracking-wide">START</span>
                  </div>
                </div>

                {/* Skill Nodes */}
                {lanes.map((lane) =>
                  lane.nodes.map(({ skill, x, y }) => {
                    const Icon = SKILL_ICONS[skill.name] || Code2;
                    const color = skill.color || '#ef4444';
                    return (
                      <div
                        key={skill.name}
                        className="absolute z-10 transition-all duration-500"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          opacity: lane.dimmed ? 0.3 : 1,
                          filter: lane.dimmed ? 'grayscale(0.7)' : 'none',
                        }}
                      >
                        <div
                          className={`relative w-[148px] rounded-xl border bg-[#101014]/95 px-3 py-2.5 shadow-lg transition-all duration-300 ${
                            lane.dimmed ? 'border-white/10' : 'border-white/10 hover:scale-[1.04] hover:border-white/20'
                          }`}
                          style={!lane.dimmed && selectedCategory === lane.category
                            ? { borderColor: `${color}80`, boxShadow: `0 0 24px -8px ${color}90` }
                            : undefined}
                        >
                          <span
                            className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 bg-[#0a0a0e]"
                            style={{ borderColor: color }}
                          />
                          <span
                            className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 bg-[#0a0a0e]"
                            style={{ borderColor: color }}
                          />
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${color}22`, color }}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10.5px] font-mono font-bold text-white leading-tight">
                              {skill.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${skill.level}%`, backgroundColor: color }}
                              />
                            </div>
                            <span className="text-[9px] font-mono shrink-0" style={{ color }}>
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Output Node */}
                <div
                  className="absolute z-10"
                  style={{ left: `${OUTPUT_X}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <div className="relative w-[104px] rounded-xl border border-emerald-500/50 bg-emerald-950/30 px-3 py-3 flex flex-col items-center gap-1 shadow-lg">
                    <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-emerald-400 bg-[#0a0a0e]" />
                    <Rocket className="w-4 h-4 text-emerald-400" />
                    <span className="text-[9.5px] font-mono font-bold text-emerald-300 tracking-wide">SHIPPED</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="lg:hidden text-center text-[10px] font-mono text-slate-500 py-2 border-t border-white/5">
              ← scroll to explore the workflow →
            </p>
          </div>

          {/* Right Column: Sticky Note & Ecosystem Tooling */}
          <div className="lg:col-span-4 space-y-6">
            <HoloCard glowColor="rgba(244, 63, 94, 0.25)">
              <div className="p-6 md:p-8 relative -rotate-1">
                <Pin className="absolute -top-2 left-6 w-5 h-5 text-amber-400 rotate-45 drop-shadow" />
                <div className="flex items-center gap-2 mb-3 text-red-400">
                  <Workflow className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Architecture Note</span>
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
