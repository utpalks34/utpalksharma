import React, { useEffect, useRef, useState } from 'react';
import { Terminal, X, Minus, Github, Linkedin } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/audio';

interface TerminalBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryLine {
  type: 'user' | 'bot' | 'system';
  text: string | React.ReactNode;
}

const BOOT_LINES: HistoryLine[] = [
  { type: 'system', text: 'Booting uks-portfolio-shell v2.1 ...' },
  { type: 'system', text: 'Connected to uks@guwahati-cluster. Session encrypted.' },
  {
    type: 'bot',
    text: `Hey, I'm ${PORTFOLIO_DATA.personal.name}'s terminal assistant. Ask me about skills, projects, experience or contact — or type "help".`,
  },
];

type Rule = {
  keywords: string[];
  respond: (opts: { openDownload: () => void; scrollTo: (id: string) => void; close: () => void }) => string | React.ReactNode;
};

const RULES: Rule[] = [
  {
    keywords: ['help', '?'],
    respond: () =>
      'Available: about, skills, projects, experience, contact, cv, github, linkedin, location, hire, ping, matrix, clear, exit',
  },
  {
    keywords: ['about', 'who are you', 'who is', 'intro'],
    respond: () =>
      `${PORTFOLIO_DATA.personal.name} — ${PORTFOLIO_DATA.personal.role}. ${PORTFOLIO_DATA.about.whoIAm}`,
  },
  {
    keywords: ['skill', 'stack', 'tech'],
    respond: () => PORTFOLIO_DATA.skills.map((s) => `${s.name} [${s.level}%]`).join('\n'),
  },
  {
    keywords: ['project', 'work on', 'built', 'portfolio'],
    respond: () =>
      PORTFOLIO_DATA.projects.map((p) => `• ${p.title} — ${p.subtitle}`).join('\n'),
  },
  {
    keywords: ['experience', 'internship', 'education', 'college', 'university', 'degree'],
    respond: () =>
      PORTFOLIO_DATA.experience.map((e) => `${e.when} · ${e.title} — ${e.org}`).join('\n'),
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'mail'],
    respond: ({ scrollTo }) => {
      scrollTo('contact');
      return `Email: ${PORTFOLIO_DATA.personal.email} | Phone: ${PORTFOLIO_DATA.personal.phone} | Location: ${PORTFOLIO_DATA.personal.location}`;
    },
  },
  {
    keywords: ['cv', 'resume', 'download'],
    respond: ({ openDownload }) => {
      openDownload();
      return 'Downloading Utpal_Kant_Sharma_Resume.pdf ...';
    },
  },
  {
    keywords: ['github'],
    respond: () => {
      window.open(PORTFOLIO_DATA.personal.socials.github, '_blank');
      return `Opening GitHub: ${PORTFOLIO_DATA.personal.socials.github}`;
    },
  },
  {
    keywords: ['linkedin'],
    respond: () => {
      window.open(PORTFOLIO_DATA.personal.socials.linkedin, '_blank');
      return `Opening LinkedIn: ${PORTFOLIO_DATA.personal.socials.linkedin}`;
    },
  },
  {
    keywords: ['location', 'where', 'based'],
    respond: () => `${PORTFOLIO_DATA.personal.location} (${PORTFOLIO_DATA.personal.coordinates})`,
  },
  {
    keywords: ['hire', 'available', 'open to work', 'job', 'role'],
    respond: () => PORTFOLIO_DATA.personal.status,
  },
  {
    keywords: ['ping'],
    respond: () => 'PONG: latency 9ms to Guwahati Cluster [26.1445° N, 91.7362° E]',
  },
  {
    keywords: ['matrix'],
    respond: () => 'Wake up, Neo... The Matrix has you. Follow the white rabbit.',
  },
  {
    keywords: ['sudo'],
    respond: () => "Nice try. This user isn't in the sudoers file — this incident will be reported.",
  },
  {
    keywords: ['thank'],
    respond: () => "You're welcome! Anything else — skills, projects, contact?",
  },
  {
    keywords: ['hi', 'hello', 'hey', 'yo'],
    respond: () => `Hey there! Type "help" to see what I can do.`,
  },
];

export const TerminalBot: React.FC<TerminalBotProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<HistoryLine[]>(BOOT_LINES);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history, isThinking]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const openDownload = () => {
    const a = document.createElement('a');
    a.href = PORTFOLIO_DATA.personal.cvPath;
    a.download = 'Utpal_Kant_Sharma_Resume.pdf';
    a.click();
    sound.playChime();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    sound.playKey();

    const cmd = raw.toLowerCase();
    setHistory((prev) => [...prev, { type: 'user', text: raw }]);
    setInput('');

    if (cmd === 'clear' || cmd === 'cls') {
      setHistory([]);
      return;
    }
    if (cmd === 'exit' || cmd === 'close') {
      onClose();
      return;
    }

    setIsThinking(true);
    setTimeout(() => {
      const rule = RULES.find((r) => r.keywords.some((k) => cmd.includes(k)));
      const output = rule
        ? rule.respond({ openDownload, scrollTo, close: onClose })
        : `Command not recognized: "${raw}". Type "help" for the list of things I know.`;
      setHistory((prev) => [...prev, { type: 'bot', text: output }]);
      setIsThinking(false);
    }, 350 + Math.random() * 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[400px] flex flex-col rounded-2xl border border-red-500/40 bg-[#0a0a0d]/95 backdrop-blur-xl shadow-glow-red overflow-hidden transition-all duration-200 ${
        isMinimized ? 'h-14' : 'h-[75vh] sm:h-[560px] max-h-[85vh]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#121216]/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)] animate-pulse" />
          <Terminal className="w-3.5 h-3.5 text-red-400" />
          <span className="text-xs font-mono font-semibold text-white">guest@uks-portfolio</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMinimized((v) => !v)}
            aria-label={isMinimized ? 'Expand terminal' : 'Minimize terminal'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Body */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-xs font-mono"
          >
            {history.map((line, idx) => {
              if (line.type === 'user') {
                return (
                  <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-red-500 shrink-0">›</span>
                    <span className="whitespace-pre-wrap break-words">{line.text}</span>
                  </div>
                );
              }
              if (line.type === 'system') {
                return (
                  <div key={idx} className="text-slate-500 whitespace-pre-wrap break-words">
                    {line.text}
                  </div>
                );
              }
              return (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-red-400 shrink-0">bot~$</span>
                  <span className="text-slate-200 whitespace-pre-wrap break-words">{line.text}</span>
                </div>
              );
            })}
            {isThinking && (
              <div className="flex items-center gap-1.5 text-red-400">
                <span>bot~$</span>
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce" />
                </span>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 px-4 pb-2 shrink-0">
            <a
              href={PORTFOLIO_DATA.personal.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href={PORTFOLIO_DATA.personal.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <span className="text-[10px] font-mono text-slate-500 ml-auto">ESC to close</span>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-[#08080a] shrink-0"
          >
            <span className="text-red-500 font-mono text-sm">›</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ask about skills, projects, contact..."
              className="flex-1 bg-transparent text-xs md:text-sm font-mono text-white focus:outline-none placeholder-slate-600"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </>
      )}
    </div>
  );
};
