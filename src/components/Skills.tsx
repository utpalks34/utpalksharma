import React, { useState } from 'react';
import { ArrowUpRight, BrainCircuit, Cloud, Database } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const groups = [
  { name: 'AI & Agentic', title: 'Agents & retrieval.', description: 'Agents, language models, and retrieval that work together.', icon: BrainCircuit },
  { name: 'Backend & DB', title: 'APIs & data.', description: 'Reliable APIs and data layers built for real applications.', icon: Database },
  { name: 'DevOps & Tooling', title: 'From local to live.', description: 'The tools that take an idea from local to live.', icon: Cloud },
];

export const Skills: React.FC = () => {
  const [selected, setSelected] = useState('All');
  return (
    <section id="skills" className="section">
      <div className="page-width">
        <div data-reveal className="section-heading heading-row"><div><p className="eyebrow">03 / MY TOOLKIT</p><h2>What I reach for<br /><span>when I’m building.</span></h2></div><p className="section-description">A focused stack for building intelligent products, from the first prompt to the final deployment.</p></div>
        <div className="skill-filters" aria-label="Filter skills">{['All', ...groups.map((group) => group.name)].map((category) => <button key={category} onClick={() => setSelected(category)} aria-pressed={selected === category} className={selected === category ? 'is-active' : ''}>{category === 'All' ? 'All capabilities' : category}</button>)}</div>
        <div data-reveal className="skills-grid">{groups.filter((group) => selected === 'All' || selected === group.name).map((group) => <div className="surface-card skill-card" key={group.name}><div className="flex justify-between items-center"><span className="card-icon"><group.icon size={22} /></span><span className="text-xs font-mono text-subtle">0{groups.indexOf(group) + 1}</span></div><p className="eyebrow mt-8">{group.name}</p><h3>{group.title}</h3><p className="text-sm text-muted leading-relaxed mt-3">{group.description}</p><div className="skill-list">{PORTFOLIO_DATA.skills.filter((skill) => skill.category === group.name).map((skill) => <div key={skill.name}><span>{skill.name}</span><ArrowUpRight size={14} /></div>)}</div></div>)}</div>
        <div data-reveal className="toolbox"><p className="eyebrow">ALSO IN THE TOOLBOX</p><div className="flex flex-wrap gap-2">{PORTFOLIO_DATA.additionalSkills.badges.map((badge) => <span className="tech-tag" key={badge}>{badge}</span>)}</div></div>
      </div>
    </section>
  );
};
