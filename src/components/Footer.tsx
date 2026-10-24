import React, { useRef, useState } from 'react';
import { ArrowUp, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const Footer: React.FC = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [legal, setLegal] = useState<'terms' | 'privacy'>('terms');
  const openLegal = (kind: 'terms' | 'privacy') => { setLegal(kind); dialogRef.current?.showModal(); };
  return (
    <footer className="site-footer">
      <div data-reveal className="page-width footer-main"><div className="flex items-center gap-4"><a href="#home" className="brand-mark" aria-label="Back to home">u<span>.</span></a><p className="footer-note"><strong>Thoughtfully built by Utpal Kant Sharma.</strong><br />© {new Date().getFullYear()} · A little curiosity goes a long way.</p></div><div className="footer-links"><button onClick={() => openLegal('terms')}>Terms</button><button onClick={() => openLegal('privacy')}>Privacy</button><a className="flex items-center gap-2" href="#home">Back to top <ArrowUp size={14} /></a></div></div>
      <dialog ref={dialogRef} className="legal-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}><div className="flex justify-between items-center gap-5 mb-5"><h3 className="text-xl">{legal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h3><button aria-label="Close dialog" className="icon-button" onClick={() => dialogRef.current?.close()}><X size={19} /></button></div><p className="text-sm text-muted leading-relaxed">{PORTFOLIO_DATA.legal[legal]}</p></dialog>
    </footer>
  );
};
