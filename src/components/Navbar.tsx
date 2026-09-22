import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sun, Moon, Command, Menu, X, Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { EncryptedText } from './ui/EncryptedText';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCommand: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  onOpenCommand,
  soundEnabled,
  onToggleSound,
}) => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoverLogo, setHoverLogo] = useState(false);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const navListRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const container = navListRef.current;
      const activeEl = linkRefs.current[activeSection];
      if (container && activeEl) {
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        setIndicator({ left: activeRect.left - containerRect.left, width: activeRect.width });
      } else {
        setIndicator(null);
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  const navItems = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    sound.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 px-4">
        <div className="max-w-4xl mx-auto relative">
          {/* Ambient pulsing glow matching hero theme */}
          <div className="absolute -inset-x-6 -inset-y-4 bg-red-600/10 rounded-full blur-2xl -z-10 animate-pulse-glow pointer-events-none" />

          <div className="relative flex items-center gap-2 p-2 rounded-full bg-[#0d0d10]/70 border border-white/15 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.55)] overflow-hidden isolate">
            {/* Wet-glass top gloss highlight */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none -z-10"
            />
            {/* Wet-glass inner edge specular */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-10px_18px_rgba(0,0,0,0.4)] pointer-events-none -z-10"
            />
            {/* Slow drifting light sheen, like a reflection sliding across wet glass */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-[20deg] animate-glass-sheen pointer-events-none -z-10"
            />

            {/* Logo Badge */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              onMouseEnter={() => setHoverLogo(true)}
              onMouseLeave={() => setHoverLogo(false)}
              className="group relative shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform isolate overflow-hidden"
              title="Home"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-red-500/30 to-transparent -skew-x-12 pointer-events-none transition-opacity duration-200 ${hoverLogo ? 'opacity-100 animate-scan-sweep' : 'opacity-0'}`}
              />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)] animate-pulse" />
              <Terminal className="w-4 h-4 relative z-10" strokeWidth={2.5} />
            </a>

            {/* Desktop Navigation Links */}
            <nav ref={navListRef} className="hidden md:flex items-center gap-1 flex-1 justify-center relative">
              {indicator && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-full rounded-full bg-red-500/10 border border-red-500/40 shadow-glow-red transition-all duration-300 ease-out pointer-events-none overflow-hidden"
                  style={{ left: indicator.left, width: indicator.width }}
                >
                  <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-red-400/40 to-transparent -skew-x-12 animate-scan-sweep" />
                  <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-red-400/70" />
                  <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-red-400/70" />
                </span>
              )}
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    ref={(el) => {
                      linkRefs.current[item.id] = el;
                    }}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`relative z-10 px-4 py-2 text-sm font-mono font-medium rounded-full transition-colors duration-200 ${
                      isActive ? 'text-red-400' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <EncryptedText text={item.label} active={hoveredNav === item.id} />
                  </a>
                );
              })}
            </nav>

            {/* Utility Controls */}
            <div className="hidden md:flex items-center gap-1 pr-1">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCommand();
                }}
                title="Open Command Palette (Ctrl+K / ⌘K)"
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Command className="w-4 h-4" />
              </button>
              <button
                onClick={onToggleSound}
                title={soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
                className={`p-2 rounded-full transition-all ${
                  soundEnabled ? 'text-red-400 hover:bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleTheme();
                }}
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Social Links */}
            <div className="hidden sm:flex shrink-0 items-center gap-2">
              <a
                href={PORTFOLIO_DATA.personal.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:text-red-400 hover:bg-white/10 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden ml-auto p-2.5 rounded-full bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-24 px-6 bg-[#08080a]/95 backdrop-blur-2xl md:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col gap-4 py-8 border-b border-white/10">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-lg font-mono font-medium text-slate-200 hover:text-red-400 py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-500 font-mono">0{navItems.indexOf(item) + 1}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-6 py-8">
            <a
              href={PORTFOLIO_DATA.personal.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 text-slate-300 hover:text-white"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={PORTFOLIO_DATA.personal.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 text-slate-300 hover:text-red-400"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={PORTFOLIO_DATA.personal.socials.email}
              className="p-3 rounded-full bg-white/5 text-slate-300 hover:text-red-400"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
