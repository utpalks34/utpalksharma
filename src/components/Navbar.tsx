import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Command, Menu, Moon, Pause, Play, Sun, X } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCommand: () => void;
  motionEnabled: boolean;
  reducedMotion: boolean;
  onToggleMotion: () => void;
}

const links = ['Projects', 'About', 'Skills', 'Experience', 'Contact'];

export const Navbar: React.FC<NavbarProps> = ({ isDark, onToggleTheme, onOpenCommand, motionEnabled, reducedMotion, onToggleMotion }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [previewSection, setPreviewSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const update = () => {
      const link = nav.querySelector<HTMLElement>(`[href="#${previewSection || activeSection}"]`);
      indicator.style.opacity = link ? '1' : '0';
      if (!link) return;
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeSection, previewSection]);

  useEffect(() => {
    const update = () => {
      const active = ['home', ...links.map((link) => link.toLowerCase())].reverse().find((id) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= 180;
      });
      setActiveSection(active || 'home');
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 1100px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="page-width navbar-bar">
        <a href="#home" aria-label="Utpal Kant Sharma, home" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">u<span>.</span></span>
          <span className="hidden sm:block">Utpal Sharma<span className="brand-caption">AI & Backend Engineer</span></span>
        </a>
        <nav ref={navRef} aria-label="Main navigation" className="navbar-links" onPointerLeave={() => setPreviewSection(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPreviewSection(null); }}>
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} onPointerEnter={() => setPreviewSection(link.toLowerCase())} onFocus={() => setPreviewSection(link.toLowerCase())} className={`nav-link ${activeSection === link.toLowerCase() ? 'is-active' : ''}`} aria-current={activeSection === link.toLowerCase() ? 'location' : undefined}>{link}</a>
          ))}
        </nav>
        <div className="navbar-actions">
          <button className="icon-button motion-toggle" aria-label={reducedMotion ? 'Motion disabled by system preference' : motionEnabled ? 'Pause site animations' : 'Play site animations'} title={reducedMotion ? 'Reduced motion is enabled on your device' : motionEnabled ? 'Pause site animations' : 'Play site animations'} disabled={reducedMotion} onClick={onToggleMotion}>{motionEnabled ? <Pause size={16} /> : <Play size={16} />}</button>
          <button className="icon-button utility-control" aria-label="Open command palette" title="Commands (⌘K / Ctrl+K)" onClick={onOpenCommand}><Command size={17} /></button>
          <button className="icon-button" aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={onToggleTheme}>{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <a href="#contact" className="button button-small button-primary desktop-contact">Let’s talk <ArrowUpRight size={15} /></a>
          <button ref={menuButtonRef} className="icon-button menu-control" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="page-width mobile-navigation">
          <p className="mobile-menu-caption">A little look around</p>
          {links.map((link, index) => <a key={link} href={`#${link.toLowerCase()}`} aria-current={activeSection === link.toLowerCase() ? 'location' : undefined} onClick={() => setMenuOpen(false)}><span><small>0{index + 1}</small>{link}</span><ArrowUpRight size={18} /></a>)}
          <button onClick={() => { setMenuOpen(false); onOpenCommand(); }}>Quick commands <Command size={16} /></button>
        </nav>
      )}
    </header>
  );
};
