import React from 'react';
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, MapPin, Terminal, Play, Loader2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import './3d/HeroMemoji.css';

import { PortfolioAgent, PORTFOLIO_STEPS } from './interactive/PortfolioAgent';

import HeroMemoji from './3d/HeroMemoji';

interface HeroProps {
  onOpenTerminal: () => void;
  agentStep: number;
  onRunAgent: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, agentStep, onRunAgent }) => {
  const complete = agentStep === PORTFOLIO_STEPS.length;
  const running = agentStep >= 0 && !complete;
  return (
    <section id="home" className="hero-section">
      <div className="page-width">
        <div className="hero-topline"><span>UTPAL KANT SHARMA / PERSONAL PORTFOLIO</span><span className="flex items-center gap-2"><MapPin size={12} /> GUWAHATI, INDIA</span></div>
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="availability"><span /> Available for roles & contracts</span>
            <p className="hero-intro">Hello, I’m Utpal. <span className="intro-line" /></p>
            <h1>I make AI work<br />in the <span>real world.</span></h1>
            <p className="hero-description">From an agent’s first decision to the API behind it, I build the pieces that turn an interesting idea into something you can actually use.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#projects" className="button button-primary">See what I’ve built <ArrowUpRight size={18} /></a>
              <a href={PORTFOLIO_DATA.personal.cvPath} download="Utpal_Kant_Sharma_Resume.pdf" className="button button-secondary"><Download size={16} /> Download CV</a>
            </div>
            <details className="hero-demo">
              <summary>Curious how an agent thinks? <span>Try a little demo <ArrowUpRight size={13} /></span></summary>
              <PortfolioAgent step={agentStep} />
              <button onClick={onRunAgent} disabled={running || complete} aria-controls="agent-progress" className="text-link agent-run">
                {running ? <Loader2 size={15} className="agent-spinner" /> : <Play size={15} />}
                {complete ? 'Walkthrough complete' : running ? 'Walking through the steps…' : 'Run the agent'}
              </button>
            </details>
            <div className="hero-socials">
              <a href={PORTFOLIO_DATA.personal.socials.github} target="_blank" rel="noopener noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={12} /></a>
              <a href={PORTFOLIO_DATA.personal.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={12} /></a>
              <span className="social-divider" />
              <button onClick={onOpenTerminal}><Terminal size={15} /> Ask my terminal</button>
            </div>
          </div>
          <HeroMemoji />
        </div>
        <div className="hero-bottom">
          <a href="#projects" className="scroll-link"><span className="scroll-icon"><ArrowDown size={17} /></span>A few things I’ve been working on</a>
          <div className="hero-expertise"><span>AGENTIC AI</span><span>BACKEND SYSTEMS</span><span>RETRIEVAL & RAG</span></div>
        </div>
      </div>
    </section>
  );
};
