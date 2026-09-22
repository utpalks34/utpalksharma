import React, { useState } from 'react';
import { ArrowUp, Shield, FileText, X } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; text: string } | null>(null);

  const scrollToTop = () => {
    sound.playWhoosh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTerms = () => {
    sound.playClick();
    setModalContent({
      title: 'Terms & Conditions',
      text: PORTFOLIO_DATA.legal.terms,
    });
  };

  const openPrivacy = () => {
    sound.playClick();
    setModalContent({
      title: 'Privacy Policy',
      text: PORTFOLIO_DATA.legal.privacy,
    });
  };

  return (
    <>
      <footer className="py-12 border-t border-white/10 bg-[#060608] text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">[uks]</span>
            <span>© 2026 Utpal Kant Sharma. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={openTerms}
              className="hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms</span>
            </button>

            <button
              onClick={openPrivacy}
              className="hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy</span>
            </button>

            <button
              onClick={scrollToTop}
              title="Return to top"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-[#0c0c10] text-white p-6 shadow-glow-red relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="text-lg font-bold font-mono text-white">{modalContent.title}</h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-sans text-slate-300 leading-relaxed">
              {modalContent.text}
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-glow-red"
              >
                Close
              </button>
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setModalContent(null)} />
        </div>
      )}
    </>
  );
};
