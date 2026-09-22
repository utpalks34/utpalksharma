import React from 'react';
import { Github, Cpu, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { DecryptedText } from './ui/DecryptedText';
import { HoloCard } from './ui/HoloCard';
import { sound } from '../utils/audio';

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-xs mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>04 // SYSTEM DEPLOYMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-slate-500 font-normal">My </span>
            <DecryptedText text="projects" speed={50} />
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-mono">
            AI systems, backend platforms, experiments.
          </p>
        </div>

        {/* Project Showcase List */}
        <div className="space-y-16">
          {PORTFOLIO_DATA.projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={project.id} className="relative group">
                <HoloCard glowColor={`${project.accentColor}30`}>
                  <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Project Copy Details */}
                    <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="flex items-center gap-3">
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shadow-lg"
                          style={{
                            backgroundColor: project.accentColor,
                            boxShadow: `0 0 20px ${project.accentColor}80`
                          }}
                        >
                          {project.iconLetter}
                        </span>
                        <div>
                          <h3 className="text-2xl font-bold font-mono text-white tracking-tight">
                            {project.title}
                          </h3>
                          <p className="text-xs font-mono font-semibold" style={{ color: project.accentColor }}>
                            {project.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.chips.map((chip) => (
                          <span
                            key={chip}
                            className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-[#08080a] text-slate-300 border border-white/10 hover:border-red-500/30 transition-colors"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      {/* Engineering Metrics */}
                      {project.metrics && (
                        <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-[#08080a] border border-white/5 text-xs font-mono">
                          {project.metrics.map((m, i) => (
                            <div key={i}>
                              <p className="text-[10px] text-slate-500">{m.label}</p>
                              <p className="font-bold text-white text-xs sm:text-sm truncate">{m.value}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="pt-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-white/10 hover:bg-red-950/40 text-white border border-white/15 transition-all group-hover:border-red-500/50 hover:text-red-300"
                        >
                          <Github className="w-4 h-4" />
                          <span>View on GitHub</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
                        </a>
                      </div>
                    </div>

                    {/* Project Image Preview with 3D Zoom */}
                    <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#08080a] group-hover:border-red-500/50 transition-all">
                        {/* Browser Chrome Header */}
                        <div className="px-4 py-2.5 bg-[#121216] border-b border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">
                            uks://projects/{project.id}
                          </span>
                          <div className="w-6" />
                        </div>

                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a]/70 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
