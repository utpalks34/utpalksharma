import { Check, Loader2, Terminal } from 'lucide-react';

export const PORTFOLIO_STEPS = [
  { label: 'Profile', message: 'Reading the person behind the code…' },
  { label: 'Skills', message: 'Mapping AI and backend capabilities…' },
  { label: 'Experience', message: 'Collecting experience and milestones…' },
  { label: 'Projects', message: 'Preparing selected projects…' },
  { label: 'Connect', message: 'Putting it all together. Almost ready…' },
];

export function PortfolioAgent({ step }: { step: number }) {
  const complete = step === PORTFOLIO_STEPS.length;

  return (
    <div className="portfolio-agent" id="agent-progress">
      <div className="agent-caption"><span><Terminal size={13} /> PORTFOLIO AGENT</span><span>INTERACTIVE DEMO</span></div>
      <p className="agent-message" role="status" aria-live="polite" aria-atomic="true">
        {step < 0 ? 'A short, scripted walkthrough of a planner’s steps.' : complete ? 'That’s the sequence: profile, skills, experience, projects, and a way to connect.' : PORTFOLIO_STEPS[step].message}
      </p>
      {step >= 0 && <>
        <ol className="agent-steps" aria-label="Portfolio preparation">
          {PORTFOLIO_STEPS.map(({ label }, index) => (
            <li key={label} data-state={step > index ? 'complete' : step === index ? 'active' : 'pending'} aria-current={step === index ? 'step' : undefined}>
              <span className="agent-step-icon" aria-hidden="true">{step > index ? <Check size={12} /> : step === index ? <Loader2 size={12} className="agent-spinner" /> : index + 1}</span>
              {label}<span className="sr-only">: {step > index ? 'complete' : step === index ? 'in progress' : 'pending'}</span>
            </li>
          ))}
        </ol>
        <progress className="agent-progress" max={PORTFOLIO_STEPS.length} value={step} aria-label="Agent steps completed" />
      </>}
    </div>
  );
}
