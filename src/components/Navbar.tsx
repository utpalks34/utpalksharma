import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sun, Moon, Command, Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';

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
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((y / total) * 100);
      }

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080a]/90 backdrop-blur-xl border-b border-white/10 shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        {/* Top Crimson Laser Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 transition-all duration-100 ease-out shadow-[0_0_12px_rgba(239,68,68,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo with Crimson Glow */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="group font-mono text-base md:text-lg font-bold text-white tracking-widest flex items-center gap-2"
          >
            <span className="text-red-500 group-hover:text-rose-400 transition-colors">[uks]</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#121216]/80 border border-white/10 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-1.5 text-xs font-mono font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-glow-red'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenCommand();
              }}
              title="Open Command Palette (Ctrl+K / ⌘K)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121216]/80 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-red-400 text-xs font-mono transition-all"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">⌘K</span>
            </button>

            {/* Audio Toggle Button */}
            <button
              onClick={() => {
                onToggleSound();
              }}
              title={soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-glow-red'
                  : 'bg-[#121216]/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleTheme();
              }}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-xl bg-[#121216]/80 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-red-400 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Social Icons (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/10">
              <a
                href={PORTFOLIO_DATA.personal.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_DATA.personal.socials.email}
                title="Direct Email"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-xl bg-[#121216]/80 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 pt-20 px-6 bg-[#08080a]/95 backdrop-blur-2xl md:hidden animate-in fade-in duration-200">
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
