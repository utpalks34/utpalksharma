import React from 'react';
import { TerminalContact } from './interactive/TerminalContact';

export const Contact: React.FC = () => (
  <section id="contact" className="section section-tinted">
    <div className="page-width">
      <div data-reveal className="section-heading heading-row"><div><p className="eyebrow">05 / START A CONVERSATION</p><h2>Good things start<br /><span>with a hello.</span></h2></div><p className="section-description">Have an interesting problem, an idea to explore, or a role in mind? I’d love to hear about it.</p></div>
      <TerminalContact />
    </div>
  </section>
);
