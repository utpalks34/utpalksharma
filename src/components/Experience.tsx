import React from 'react';
import { Briefcase, Calendar, Copy } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { DecryptedText } from './ui/DecryptedText';
import { HoloCard } from './ui/HoloCard';
import { sound } from '../utils/audio';

export const Experience: React.FC = () => {
  const [copiedId, setCopiedId] = React.useState(false);

  const handleCopy = (id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Internship':
        return 'bg-red-500/15 text-red-300 border-red-500/40';
      case 'Education':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'Certification':
        return 'bg-red-700/20 text-red-200 border-red-600/40';
      default:
        return 'bg-white/10 text-white';
    }
  };

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-xs mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>03 // TRAJECTORY & CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-slate-500 font-normal">My </span>
            <DecryptedText text="experience" speed={50} />
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-mono">
            Work, education and certifications.
          </p>
        </div>

        {/* Laser Crimson Timeline Track */}
        <div className="relative border-l-2 border-red-600/40 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {PORTFOLIO_DATA.experience.map((item) => (
            <div key={item.id} className="relative group">
              {/* Pulsing Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-5 h-5 rounded-full bg-[#08080a] border-2 border-red-500 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-glow-red">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_rgba(239,68,68,1)]" />
              </div>

              {/* Card */}
              <HoloCard glowColor="rgba(239, 68, 68, 0.2)">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-mono font-medium rounded-full border ${getTypeBadgeClass(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.when}
                      </span>
                    </div>

                    {item.credentialId && (
                      <button
                        onClick={() => handleCopy(item.credentialId!)}
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>ID: {item.credentialId}</span>
                        {copiedId && <span className="text-red-400 font-bold">✓ Copied</span>}
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold font-mono text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-red-400 font-mono">
                      {item.org}
                    </p>
                  </div>

                  {/* Bullet points for Amtron */}
                  {item.bullets && (
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
                      {item.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-red-500 mt-1">›</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Narrative text for Education/Certification */}
                  {item.text && (
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
                      {item.text}
                    </p>
                  )}

                  {/* Metric Chips */}
                  {item.metrics && (
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                      {item.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-[#08080a] border border-white/5 text-xs font-mono"
                        >
                          <span className="text-slate-400 mr-1.5">{metric.label}:</span>
                          <span className="text-white font-bold">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </HoloCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
