import React, { useEffect, useState } from 'react';
import { usePortfolioMotion } from './hooks/usePortfolioMotion';
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
import { PORTFOLIO_STEPS } from './components/interactive/PortfolioAgent';
import { sound } from './utils/audio';
import './motion.css';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());
  const [agentStep, setAgentStep] = useState(-1);
  const agentComplete = agentStep === PORTFOLIO_STEPS.length;
  const { motionRef, motionEnabled, reducedMotion, toggleMotion } = usePortfolioMotion();

  useEffect(() => {
    if (agentStep < 0 || agentComplete) return;
    const timer = window.setTimeout(() => setAgentStep((step) => step + 1), 850);
    return () => window.clearTimeout(timer);
  }, [agentStep, agentComplete]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    try { localStorage.setItem('uks-theme', isDark ? 'dark' : 'light'); } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#24171b' : '#f7f3eb');
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => setIsDark((dark) => !dark);
  const toggleSound = () => setSoundEnabled(sound.toggle());

  return (
    <div ref={motionRef} className="site-shell" data-motion={motionEnabled ? 'on' : 'off'}>
      <a className="skip-link" href="#content">Skip to content</a>
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} onOpenCommand={() => setIsCommandOpen(true)} motionEnabled={motionEnabled} reducedMotion={reducedMotion} onToggleMotion={toggleMotion} />
      <main id="content" tabIndex={-1}>
        <Hero onOpenTerminal={() => setIsTerminalOpen(true)} agentStep={agentStep} onRunAgent={() => setAgentStep((step) => step === -1 ? 0 : step)} />
        <div id="portfolio" tabIndex={-1} aria-label="Portfolio" className="portfolio-content">
          <Projects />
          <About />
          <Skills />
          <Experience />
          <Contact />
        </div>
      </main>
      <Footer />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onToggleTheme={toggleTheme} isDark={isDark} onToggleSound={toggleSound} soundEnabled={soundEnabled} />
      <TerminalBot isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
};

export default App;
