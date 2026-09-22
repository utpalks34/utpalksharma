import React from 'react';
import { Send } from 'lucide-react';
import { DecryptedText } from './ui/DecryptedText';
import { TerminalContact } from './interactive/TerminalContact';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 font-mono text-xs mb-3">
            <Send className="w-3.5 h-3.5" />
            <span>05 // INITIATE TRANSMISSION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <span className="text-slate-500 font-normal">Let's get </span>
            <DecryptedText text="in touch" speed={50} />
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 font-mono">
            By email or on my socials.
          </p>
        </div>

        {/* Contact Form & CLI Terminal */}
        <TerminalContact />
      </div>
    </section>
  );
};
