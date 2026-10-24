import React, { useState, useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);

  const scrollTo = (id: string) => {
    onClose();
    sound.playWhoosh();
    const element = document.getElementById(id);
    if (element) {
      const motionEnabled = document.querySelector('.site-shell')?.getAttribute('data-motion') === 'on';
      element.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant' });
    }
  };

  const commands: CommandItem[] = [
    {
      id: 'about',
      title: 'About Utpal Kant Sharma',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-accent" />,
      action: () => scrollTo('about'),
    },
    {
      id: 'skills',
      title: 'Skills & Tech Stack',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      action: () => scrollTo('skills'),
    },
    {
      id: 'experience',
      title: 'Experience & Amtron Internship',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-accent" />,
      action: () => scrollTo('experience'),
    },
    {
      id: 'projects',
      title: 'Projects (SEVA, B2B, TraceGate)',
      category: 'Navigation',
      icon: <ExternalLink className="w-4 h-4 text-accent" />,
      action: () => scrollTo('projects'),
    },
    {
      id: 'contact',
      title: 'Get in Touch / Terminal',
      category: 'Navigation',
      icon: <Send className="w-4 h-4 text-accent" />,
      action: () => scrollTo('contact'),
    },
    {
      id: 'download-cv',
      title: 'Download Resume / CV (PDF)',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-accent" />,
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
      icon: isDark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-muted" />,
      action: () => {
        onToggleTheme();
      },
    },
    {
      id: 'sound',
      title: soundEnabled ? 'Mute Sound FX' : 'Enable interaction sounds',
      category: 'Preferences',
      icon: <Volume2 className="w-4 h-4 text-accent" />,
      action: () => {
        onToggleSound();
      },
    },
    {
      id: 'github',
      title: 'Open GitHub Profile',
      category: 'Socials',
      icon: <Github className="w-4 h-4 text-muted" />,
      action: () => {
        window.open(PORTFOLIO_DATA.personal.socials.github, '_blank');
      },
    },
    {
      id: 'linkedin',
      title: 'Open LinkedIn Profile',
      category: 'Socials',
      icon: <Linkedin className="w-4 h-4 text-accent" />,
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
      if (!isOpen) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown' && filteredCommands.length) {
        e.preventDefault();
        sound.playClick();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp' && filteredCommands.length) {
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
    <dialog ref={dialogRef} className="command-dialog" aria-label="Quick commands"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div
        className="w-full max-w-xl rounded-2xl border border-accent/40 bg-surface text-ink  overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-surface/60">
          <Search className="w-5 h-5 text-accent" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section (e.g. projects, cv, theme)..."
            className="flex-1 bg-transparent text-sm font-mono text-ink focus:outline-none placeholder-subtle"
            aria-label="Search commands"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-muted bg-raised border border-line rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-sm font-mono text-subtle">
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
                      ? 'bg-accent-soft text-accent border border-accent/50 '
                      : 'text-muted hover:bg-raised border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1 rounded-lg bg-raised border border-line">
                      {cmd.icon}
                    </span>
                    <span>{cmd.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-subtle px-2 py-0.5 rounded bg-raised">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-surface border-t border-line flex items-center justify-between text-[11px] font-mono text-subtle">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="text-accent/80">Jump to something good.</span>
        </div>
      </div>

    </dialog>
  );
};
