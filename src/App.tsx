import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/interactive/CommandPalette';
import { TerminalBot } from './components/interactive/TerminalBot';
import { sound } from './utils/audio';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);

  // Initialize Theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('uks-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      setIsDark(initialDark);
      if (initialDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('uks-theme', next ? 'dark' : 'light');
      } catch {}
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const toggleSound = () => {
    const nextState = sound.toggle();
    setSoundEnabled(nextState);
  };

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  // Smooth Interactive Ambient Cursor Aurora (Crimson Red on Matte Black)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 selection:bg-red-600 selection:text-white cyber-grid relative overflow-x-hidden">
      {/* Ambient Crimson Aurora Following Cursor */}
      {cursorVisible && (
        <div
          className="fixed pointer-events-none rounded-full blur-[100px] opacity-30 -z-10 transition-transform duration-75 ease-out will-change-transform"
          style={{
            width: 400,
            height: 400,
            left: cursorPos.x - 200,
            top: cursorPos.y - 200,
            background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(185,28,28,0.2) 50%, transparent 70%)',
          }}
        />
      )}

      {/* Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenCommand={() => setIsCommandOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content Sections */}
      <main id="content" className="relative z-10">
        <Hero onOpenTerminal={() => setIsTerminalOpen(true)} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        onToggleSound={toggleSound}
        soundEnabled={soundEnabled}
      />

      {/* Floating Terminal Assistant */}
      <TerminalBot isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
};

export default App;
