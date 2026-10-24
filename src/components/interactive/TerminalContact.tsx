import React, { useState } from 'react';
import { Send, Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react';
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
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'idle' | 'error'>('idle');

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

    const body = `${formValues.message}\n\nFrom: ${formValues.name} <${formValues.email}>`;
    window.location.href = `mailto:${PORTFOLIO_DATA.personal.email}?subject=${encodeURIComponent(formValues.subject)}&body=${encodeURIComponent(body)}`;
    setStatusType('idle');
    setStatusMsg('Continue in your email app to send your message.');
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
        res = `${PORTFOLIO_DATA.personal.name} — ${PORTFOLIO_DATA.personal.role}. B.Tech CSE graduate from Kaziranga Univ (CGPA 8.08).`;
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
    <div className="contact-layout w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Let’s connect. & Developer CLI Shell */}
      <div data-reveal className="lg:col-span-5 space-y-6">
        {/* Contact Info Card */}
        <div className="p-6 md:p-8 rounded-2xl border border-line bg-surface/90 backdrop-blur-xl ">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-accent animate-pulse " />
            <h3 className="text-xl font-semibold font-sans text-ink">Let’s connect.</h3>
          </div>

          <p className="text-sm text-muted leading-relaxed mb-6">
            Always open to discussing agentic AI architectures, backend systems engineering, or full-time opportunities.
          </p>

          <div className="space-y-4 text-xs md:text-sm font-mono text-muted">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-line hover:border-accent/40 transition-all">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <a href={PORTFOLIO_DATA.personal.socials.email} className="truncate hover:text-accent">
                {PORTFOLIO_DATA.personal.email}
              </a>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-line hover:border-accent/40 transition-all">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span>{PORTFOLIO_DATA.personal.phone}</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-line hover:border-accent/40 transition-all">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span>{PORTFOLIO_DATA.personal.location} </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-line">
            <a
              href={PORTFOLIO_DATA.personal.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-raised hover:bg-accent-soft text-muted hover:text-accent border border-line hover:border-accent/40 text-xs font-mono transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href={PORTFOLIO_DATA.personal.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-raised hover:bg-raised text-muted hover:text-ink border border-line text-xs font-mono transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>


        <div className="rounded-2xl border border-accent/40 bg-surface p-4 font-mono text-xs  overflow-hidden ">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-line text-muted">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent " />
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="w-2.5 h-2.5 rounded-full bg-subtle" />
              <span className="text-[11px] text-muted ml-1">a terminal for the curious</span>
            </div>
            <span className="text-[10px] text-accent font-bold">TYPE "help"</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 mb-3 pr-1 text-muted">
            {cliHistory.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="text-accent flex items-center gap-1.5">
                  <span className="text-subtle">uks@core:~$</span> {item.cmd}
                </div>
                <div className="text-muted pl-4 whitespace-pre-wrap">{item.output}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-2 border-t border-line">
            <span className="text-accent">›</span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="type help, cv, projects..."
              aria-label="Terminal command" className="flex-1 bg-transparent text-ink focus:outline-none text-xs placeholder-subtle"
            />
          </form>
        </div>
      </div>


      <div data-reveal className="lg:col-span-7">
        <div className="p-6 md:p-8 rounded-2xl border border-line bg-surface/90 backdrop-blur-xl  relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-line">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <h3 className="text-lg text-ink">Leave a little hello.</h3>
            </div>
            <span className="text-[8px] font-mono text-accent/80">EMAIL DRAFT</span>
          </div>

          <p className="text-xs text-muted leading-relaxed mb-6">Tell me what you have in mind. This opens a draft in your email app, ready for you to send.</p>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="f-email" className="block text-xs font-mono text-muted mb-1.5">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  id="f-email"
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  type="email"
                  value={formValues.email}
                  onChange={(e) => {
                    setFormValues({ ...formValues, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-xs md:text-sm font-mono text-ink placeholder-subtle transition-all focus:outline-none ${
                    errors.email
                      ? 'border-danger focus:ring-1 focus:ring-danger'
                      : 'border-line focus:border-accent'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-[11px] font-mono text-danger">{errors.email}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="f-name" className="block text-xs font-mono text-muted mb-1.5">
                  Your Name <span className="text-accent">*</span>
                </label>
                <input
                  id="f-name"
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  type="text"
                  value={formValues.name}
                  onChange={(e) => {
                    setFormValues({ ...formValues, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Alex Turing"
                  className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-xs md:text-sm font-mono text-ink placeholder-subtle transition-all focus:outline-none ${
                    errors.name
                      ? 'border-danger focus:ring-1 focus:ring-danger'
                      : 'border-line focus:border-accent'
                  }`}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-[11px] font-mono text-danger">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="f-subject" className="block text-xs font-mono text-muted mb-1.5">
                Subject <span className="text-accent">*</span>
              </label>
              <input
                id="f-subject"
                required
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                type="text"
                maxLength={80}
                value={formValues.subject}
                onChange={(e) => {
                  setFormValues({ ...formValues, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
                placeholder="What is this regarding? (Project, Collaboration, Role)"
                className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-xs md:text-sm font-mono text-ink placeholder-subtle transition-all focus:outline-none ${
                  errors.subject
                    ? 'border-danger focus:ring-1 focus:ring-danger'
                    : 'border-line focus:border-accent'
                }`}
              />
              {errors.subject && (
                <p id="subject-error" className="mt-1 text-[11px] font-mono text-danger">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="f-message" className="block text-xs font-mono text-muted">
                  Message <span className="text-accent">*</span>
                </label>
                <span className="text-[11px] font-mono text-subtle">
                  {formValues.message.length} / 1200
                </span>
              </div>
              <textarea
                id="f-message"
                required
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                rows={5}
                maxLength={1200}
                value={formValues.message}
                onChange={(e) => {
                  setFormValues({ ...formValues, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                placeholder="Enter your message or project requirements..."
                className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-xs md:text-sm font-mono text-ink placeholder-subtle transition-all focus:outline-none resize-none ${
                  errors.message
                    ? 'border-danger focus:ring-1 focus:ring-danger'
                    : 'border-line focus:border-accent'
                }`}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-[11px] font-mono text-danger">{errors.message}</p>
              )}
            </div>

            {/* Actions & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className="contact-submit flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs md:text-sm font-bold bg-accent text-accent-contrast  transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Open email draft
              </button>

              {statusMsg && (
                <div
                  role="status"
                  className={`text-xs font-mono flex items-center gap-1.5 ${
                    statusType === 'error'
                      ? 'text-danger'
                      : 'text-muted'
                  }`}
                >
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
