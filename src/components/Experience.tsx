import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const Experience: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyCredential = async (credential: string) => {
    try {
      await navigator.clipboard.writeText(credential);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopyError(true); }
  };

  return (
    <section id="experience" className="section section-tinted">
      <div className="page-width">
        <div data-reveal className="section-heading heading-row"><div><p className="eyebrow">04 / THE PATH SO FAR</p><h2>Learning by <span>building.</span></h2></div><p className="section-description">The experiences, foundations, and milestones that shape the way I work.</p></div>
        <div className="experience-list">{PORTFOLIO_DATA.experience.map((item) => <article data-reveal className="experience-item" key={item.id}>
          <div><span className="eyebrow">{item.type}</span><p className="experience-date">{item.when}</p></div>
          <div><h3>{item.title}</h3><p className="experience-org">{item.org}</p>{item.bullets && <ul className="experience-copy">{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{item.text && <p className="experience-copy">{item.text}</p>}{item.metrics && <div className="experience-metrics">{item.metrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}</div>}{item.credentialId && <><button className="credential-copy" onClick={() => copyCredential(item.credentialId!)}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Credential copied' : `Copy credential · ${item.credentialId}`}</button>{copyError && <p role="status" className="text-xs text-muted mt-2">Copy this credential: {item.credentialId}</p>}</>}</div>
        </article>)}</div>
      </div>
    </section>
  );
};
