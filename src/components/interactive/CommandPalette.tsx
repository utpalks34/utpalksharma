import React, { useState, useEffect } from 'react';
import { Search, Terminal, FileText, Send, Sparkles, Volume2, Moon, Sun, Github, Linkedin, ExternalLink, ArrowRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggleTheme,
  isDark,
  onToggleSound,
  soundEnabled,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = (id: string) => {
    onClose();
    sound.playWhoosh();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands: CommandItem[] = [
    {
      id: 'about',
      title: 'About Utpal Kant Sharma',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-red-400" />,
      action: () => scrollTo('about'),
    },
    {
      id: 'skills',
      title: 'Skills & Tech Stack',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-rose-400" />,
      action: () => scrollTo('skills'),
    },
    {
      id: 'experience',
      title: 'Experience & Amtron Internship',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-red-400" />,
      action: () => scrollTo('experience'),
    },
    {
      id: 'projects',
      title: 'Projects (SEVA, B2B, TraceGate)',
      category: 'Navigation',
      icon: <ExternalLink className="w-4 h-4 text-rose-400" />,
      action: () => scrollTo('projects'),
    },
    {
      id: 'contact',
      title: 'Get in Touch / Terminal',
      category: 'Navigation',
      icon: <Send className="w-4 h-4 text-red-400" />,
      action: () => scrollTo('contact'),
    },
    {
      id: 'download-cv',
      title: 'Download Resume / CV (PDF)',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-red-400" />,
      action: () => {
        onClose();
        sound.playChime();
        const a = document.createElement('a');
        a.href = PORTFOLIO_DATA.personal.cvPath;
        a.download = 'Utpal_Kant_Sharma_Resume.pdf';
        a.click();
      },
    },
    {
      id: 'theme',
      title: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      category: 'Preferences',
      icon: isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />,
      action: () => {
        onToggleTheme();
      },
    },
    {
      id: 'sound',
      title: soundEnabled ? 'Mute Sound FX' : 'Enable Sci-Fi Audio FX',
      category: 'Preferences',
      icon: <Volume2 className="w-4 h-4 text-red-400" />,
      action: () => {
        onToggleSound();
      },
    },
    {
      id: 'github',
      title: 'Open GitHub Profile',
      category: 'Socials',
      icon: <Github className="w-4 h-4 text-slate-400" />,
      action: () => {
        window.open(PORTFOLIO_DATA.personal.socials.github, '_blank');
      },
    },
    {
      id: 'linkedin',
      title: 'Open LinkedIn Profile',
      category: 'Socials',
      icon: <Linkedin className="w-4 h-4 text-red-400" />,
      action: () => {
        window.open(PORTFOLIO_DATA.personal.socials.linkedin, '_blank');
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playWhoosh();
        if (isOpen) onClose();
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sound.playClick();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sound.playClick();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/85 backdrop-blur-md transition-all">
      <div
        className="w-full max-w-xl rounded-2xl border border-red-500/40 bg-[#0c0c10] text-white shadow-glow-red overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#121216]/60">
          <Search className="w-5 h-5 text-red-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section (e.g. projects, cv, theme)..."
            className="flex-1 bg-transparent text-sm font-mono text-white focus:outline-none placeholder-slate-500"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-sm font-mono text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    sound.playClick();
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs md:text-sm font-mono transition-all ${
                    isSelected
                      ? 'bg-red-950/60 text-red-300 border border-red-500/50 shadow-glow-red'
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1 rounded-lg bg-white/5 border border-white/10">
                      {cmd.icon}
                    </span>
                    <span>{cmd.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 px-2 py-0.5 rounded bg-white/5">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#08080a] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="text-red-400/80">Utpal Kant Sharma Portfolio HUD</span>
        </div>
      </div>

      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};
