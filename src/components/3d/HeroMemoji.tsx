import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { ArrowUpRight, Code2 } from 'lucide-react';

export default function HeroMemoji() {
  return (
    <div className="memoji-stage" data-depth>
      <div className="memoji-heading"><span><span className="status-dot" /> A FACE TO THE NAME</span><span className="memoji-edition">GUWAHATI, IN</span></div>
      <div className="memoji-scene">
        <div className="memoji-orbit memoji-orbit-outer" aria-hidden="true" />
        <span className="memoji-monogram" aria-hidden="true">u.</span>
        <div className="memoji-portrait">
          <img src="/images/hero-memoji.png" alt="Illustrated 3D avatar with swept dark hair, a neatly trimmed beard, and a charcoal crewneck" width={1280} height={1280} fetchPriority="high" draggable={false} />
        </div>
        <span className="memoji-note memoji-note-code"><Code2 size={17} /><span>built with<br /><strong>curiosity.</strong></span></span>
        <div className="memoji-ground" aria-hidden="true" />
      </div>
      <div className="memoji-footnote"><div><span>AI & BACKEND ENGINEER</span><p>Always curious.<br /><strong>Usually building.</strong></p></div><a className="memoji-hello" href={`mailto:${PORTFOLIO_DATA.personal.email}`} aria-label="Say hello to Utpal"><ArrowUpRight size={22} /></a></div>
    </div>
  );
}
