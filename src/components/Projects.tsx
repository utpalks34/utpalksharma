import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const Projects: React.FC = () => (
  <section id="projects" className="section">
    <div className="page-width">
      <div data-reveal className="section-heading heading-row"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>A few things<br /><span>I’ve put into the world.</span></h2></div><a className="text-link" href={PORTFOLIO_DATA.personal.socials.github} target="_blank" rel="noopener noreferrer">More on GitHub <ArrowUpRight size={17} /></a></div>
      <div className="projects-grid">{PORTFOLIO_DATA.projects.map((project, index) => <article data-reveal className={`project-card ${index === 0 ? 'project-featured' : ''}`} key={project.id}>
        <a className={`project-preview project-preview-${index}`} href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}><div className="project-preview-label"><span>{index === 0 ? 'FEATURED PROJECT' : `PROJECT / 0${index + 1}`}</span><ArrowUpRight size={16} /></div><div className="project-browser"><div className="browser-bar"><span /><span /><span /><p>{project.id.split('-').join(' ')} / preview</p></div><img src={project.image} alt={`${project.title} application preview`} loading="lazy" width={960} height={540} /></div></a>
        <div className="project-body"><p className="eyebrow">{index === 0 ? 'FULL-STACK PLATFORM' : 'AI & SYSTEMS ENGINEERING'}</p><div className="flex justify-between items-start gap-4"><h3>{project.title}</h3><a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link" aria-label={`Source code for ${project.title}`}><ArrowUpRight size={20} /></a></div><p className="project-subtitle">{project.subtitle}</p><p className="project-description">{project.description}</p><div className="flex flex-wrap gap-2 mt-5">{project.chips.map((chip) => <span className="tech-tag" key={chip}>{chip}</span>)}</div>{project.metrics && <div className="project-metrics">{project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}<a className="text-link mt-6" href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={15} /> Explore the project <ArrowUpRight size={14} /></a></div>
      </article>)}</div>
    </div>
  </section>
);
