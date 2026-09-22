import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, Mail, MapPin, Phone, Github, Linkedin, CheckCircle2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/audio';

export const TerminalContact: React.FC = () => {
  // Form State
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'success' | 'error'>('idle');

  // Interactive CLI State
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode }>>([
    {
      cmd: 'init session',
      output: 'Terminal connected to uks@guwahati-cluster. Type "help" for available commands.',
    },
  ]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formValues.name.trim()) errs.name = 'Please enter your name.';
    if (!formValues.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formValues.subject.trim()) errs.subject = 'Please enter a subject.';
    if (!formValues.message.trim()) errs.message = 'Please enter a message.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    if (!validate()) {
      setStatusType('error');
      setStatusMsg('Please correct the highlighted fields.');
      return;
    }

    setIsSending(true);
    setStatusType('idle');
    setStatusMsg('Dispatching encrypted message…');

    setTimeout(() => {
      setIsSending(false);
      setStatusType('success');
      setStatusMsg("Message dispatched! I'll reply within 48 hours.");
      sound.playChime();

      // Trigger Crimson Red & Silver Confetti Celebration
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.7 },
        colors: ['#ff1e42', '#dc2626', '#b91c1c', '#ffffff', '#e11d48'],
      });

      // Clear fields
      setFormValues({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase();
    if (!cmd) return;

    sound.playKey();
    let res: string | React.ReactNode = '';

    switch (cmd) {
      case 'help':
        res = 'Available commands: about, skills, projects, cv, contact, clear, ping, matrix';
        break;
      case 'about':
        res = `${PORTFOLIO_DATA.personal.name} — ${PORTFOLIO_DATA.personal.role}. Final-year B.Tech CSE at Kaziranga Univ (CGPA 8.08).`;
        break;
      case 'skills':
        res = PORTFOLIO_DATA.skills.map((s) => `${s.name} [${s.level}%]`).join(' | ');
        break;
      case 'projects':
        res = PORTFOLIO_DATA.projects.map((p) => `• ${p.title}: ${p.subtitle}`).join('\n');
        break;
      case 'cv':
        res = 'Downloading Utpal_Kant_Sharma_Resume.pdf...';
        {
          const a = document.createElement('a');
          a.href = PORTFOLIO_DATA.personal.cvPath;
          a.download = 'Utpal_Kant_Sharma_Resume.pdf';
          a.click();
        }
        break;
      case 'contact':
        res = `Email: ${PORTFOLIO_DATA.personal.email} | Phone: ${PORTFOLIO_DATA.personal.phone} | Location: ${PORTFOLIO_DATA.personal.location}`;
        break;
      case 'ping':
        res = 'PONG: latency 9ms to Guwahati Cluster [26.1445° N, 91.7362° E]';
        break;
      case 'clear':
        setCliHistory([]);
        setCliInput('');
        return;
      case 'matrix':
        res = 'Wake up, Neo... The Matrix has you. Follow the white rabbit.';
        break;
      default:
        res = `Command not recognized: "${cmd}". Type "help" for command directory.`;
    }

    setCliHistory((prev) => [...prev, { cmd: cliInput, output: res }]);
    setCliInput('');
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Direct Coordinates & Developer CLI Shell */}
      <div className="lg:col-span-5 space-y-6">
        {/* Contact Info Card */}
        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#101014]/90 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
            <h3 className="text-xl font-bold font-mono text-white">Direct Coordinates</h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Always open to discussing agentic AI architectures, backend systems engineering, or full-time opportunities.
          </p>

          <div className="space-y-4 text-xs md:text-sm font-mono text-slate-300">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#08080a] border border-white/5 hover:border-red-500/40 transition-all">
              <Mail className="w-4 h-4 text-red-400 shrink-0" />
              <a href={PORTFOLIO_DATA.personal.socials.email} className="truncate hover:text-red-400">
                {PORTFOLIO_DATA.personal.email}
              </a>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#08080a] border border-white/5 hover:border-red-500/40 transition-all">
              <Phone className="w-4 h-4 text-red-400 shrink-0" />
              <span>{PORTFOLIO_DATA.personal.phone}</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#08080a] border border-white/5 hover:border-red-500/40 transition-all">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{PORTFOLIO_DATA.personal.location} ({PORTFOLIO_DATA.personal.coordinates})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <a
              href={PORTFOLIO_DATA.personal.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/40 text-xs font-mono transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={PORTFOLIO_DATA.personal.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Developer CLI Terminal Box in Matte Black & Crimson */}
        <div className="rounded-2xl border border-red-500/40 bg-[#060608] p-4 font-mono text-xs shadow-2xl overflow-hidden shadow-glow-red">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span className="text-[11px] text-slate-300 ml-1">uks-terminal // root</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold">TYPE "help"</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 mb-3 pr-1 text-slate-300">
            {cliHistory.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="text-red-400 flex items-center gap-1.5">
                  <span className="text-slate-500">uks@core:~$</span> {item.cmd}
                </div>
                <div className="text-slate-300 pl-4 whitespace-pre-wrap">{item.output}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-red-500">›</span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="type help, cv, projects..."
              className="flex-1 bg-transparent text-white focus:outline-none text-xs placeholder-slate-600"
            />
          </form>
        </div>
      </div>

      {/* Right Column: Next-Gen Contact Form in Matte Black */}
      <div className="lg:col-span-7">
        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#101014]/90 backdrop-blur-xl shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <span className="text-xs font-mono text-slate-400 ml-2">Encrypted Message Pipeline</span>
            </div>
            <span className="text-xs font-mono text-red-400/80">TLS SECURE</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="f-email" className="block text-xs font-mono text-slate-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="f-email"
                  type="email"
                  value={formValues.email}
                  onChange={(e) => {
                    setFormValues({ ...formValues, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#08080a] border text-xs md:text-sm font-mono text-white placeholder-slate-500 transition-all focus:outline-none ${
                    errors.email
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-white/10 focus:border-red-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-mono text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="f-name" className="block text-xs font-mono text-slate-300 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="f-name"
                  type="text"
                  value={formValues.name}
                  onChange={(e) => {
                    setFormValues({ ...formValues, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Alex Turing"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#08080a] border text-xs md:text-sm font-mono text-white placeholder-slate-500 transition-all focus:outline-none ${
                    errors.name
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-white/10 focus:border-red-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] font-mono text-red-400">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="f-subject" className="block text-xs font-mono text-slate-300 mb-1.5">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="f-subject"
                type="text"
                maxLength={80}
                value={formValues.subject}
                onChange={(e) => {
                  setFormValues({ ...formValues, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
                placeholder="What is this regarding? (Project, Collaboration, Role)"
                className={`w-full px-4 py-2.5 rounded-xl bg-[#08080a] border text-xs md:text-sm font-mono text-white placeholder-slate-500 transition-all focus:outline-none ${
                  errors.subject
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-white/10 focus:border-red-500'
                }`}
              />
              {errors.subject && (
                <p className="mt-1 text-[11px] font-mono text-red-400">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="f-message" className="block text-xs font-mono text-slate-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {formValues.message.length} / 1200
                </span>
              </div>
              <textarea
                id="f-message"
                rows={5}
                maxLength={1200}
                value={formValues.message}
                onChange={(e) => {
                  setFormValues({ ...formValues, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                placeholder="Enter your message or project requirements..."
                className={`w-full px-4 py-2.5 rounded-xl bg-[#08080a] border text-xs md:text-sm font-mono text-white placeholder-slate-500 transition-all focus:outline-none resize-none ${
                  errors.message
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-white/10 focus:border-red-500'
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-[11px] font-mono text-red-400">{errors.message}</p>
              )}
            </div>

            {/* Actions & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-glow-red transition-all active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSending ? 'Transmitting…' : 'Send Message'}
              </button>

              {statusMsg && (
                <div
                  className={`text-xs font-mono flex items-center gap-1.5 ${
                    statusType === 'success'
                      ? 'text-emerald-400'
                      : statusType === 'error'
                      ? 'text-red-400'
                      : 'text-red-300'
                  }`}
                >
                  {statusType === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                  <span>{statusMsg}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
