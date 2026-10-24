import React from 'react';
import { ArrowUpRight, Code2, Cpu, Plus } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { AgentPipelineSimulator } from './interactive/AgentPipelineSimulator';

export const About: React.FC = () => (
  <section id="about" className="section section-tinted">
    <div className="page-width">
      <div data-reveal className="section-heading"><p className="eyebrow">02 / A LITTLE ABOUT ME</p><h2>The person<br /><span>behind the projects.</span></h2></div>
      <div data-reveal className="about-grid">
        <div className="about-story"><p className="about-lead">I like figuring things out.<br />Then making them useful.</p><p>{PORTFOLIO_DATA.about.whoIAm}</p><a href="#contact" className="text-link">Let’s build something together <ArrowUpRight size={17} /></a></div>
        <div className="surface-card about-practice"><span className="card-icon"><Cpu size={22} /></span><h3>From model to real-world product.</h3><p>{PORTFOLIO_DATA.about.whatIDo}</p><div className="flex items-center gap-2 mt-6 text-accent text-xs"><Code2 size={16} /><span>Research-minded. Product-focused.</span></div></div>
      </div>
      <div data-reveal className="highlights-grid">{PORTFOLIO_DATA.about.highlights.map((item) => <div key={item.label}><p className="eyebrow">{item.label}</p><p className="highlight-value">{item.value}</p><p className="text-xs text-muted">{item.detail}</p></div>)}</div>
      <details data-reveal className="pipeline-disclosure"><summary><div><span className="eyebrow">A LOOK UNDER THE HOOD</span><h3>See how an agent pipeline works</h3></div><Plus className="disclosure-icon" size={23} /></summary><div className="pt-6"><AgentPipelineSimulator /></div></details>
    </div>
  </section>
);
