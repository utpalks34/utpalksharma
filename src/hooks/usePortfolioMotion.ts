import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

export function usePortfolioMotion() {
  const motionRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const motionEnabled = !paused && !reducedMotion;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = motionRef.current;
    if (!root || !motionEnabled) return;

    const reveals = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('motion-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    reveals.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add('motion-pending');
        observer.observe(element);
      }
    });

    const interactions = new Map<HTMLElement, () => void>();
    const press = (event: MouseEvent) => {
      const control = event.target instanceof Element ? event.target.closest<HTMLElement>('button, a, summary') : null;
      if (!control || control.matches(':disabled, [aria-disabled="true"]')) return;
      interactions.get(control)?.();
      const rect = control.getBoundingClientRect();
      const size = Math.hypot(rect.width, rect.height) * 2;
      const splash = document.createElement('span');
      splash.className = 'liquid-splash';
      splash.setAttribute('aria-hidden', 'true');
      const drop = document.createElement('span');
      drop.className = 'liquid-drop';
      Object.assign(drop.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${event.detail ? event.clientX - rect.left : rect.width / 2}px`,
        top: `${event.detail ? event.clientY - rect.top : rect.height / 2}px`,
      });
      splash.append(drop);
      control.append(splash);
      const wave = drop.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: .24, borderRadius: '42% 58% 65% 35%' },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0, borderRadius: '50%' },
      ], { duration: 700, easing: 'cubic-bezier(.16, 1, .3, 1)' });
      const spring = control.animate([
        { scale: '1' }, { scale: '.96 1.025', offset: .2 },
        { scale: '1.012 .992', offset: .6 }, { scale: '1' },
      ], { duration: 480, easing: 'ease-out' });
      const cleanup = () => { wave.cancel(); spring.cancel(); splash.remove(); interactions.delete(control); };
      interactions.set(control, cleanup);
      wave.onfinish = cleanup;
    };
    // Capture also covers controls whose action closes a menu or changes its contents.
    root.addEventListener('click', press, true);

    let active: HTMLElement | null = null;
    let bounds: DOMRect | null = null;
    let pointerFrame = 0;
    const reset = () => {
      cancelAnimationFrame(pointerFrame);
      active?.style.removeProperty('--tilt-x');
      active?.style.removeProperty('--tilt-y');
      active?.removeAttribute('data-tilting');
      active = null;
      bounds = null;
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-depth]') : null;
      if (target !== active) {
        reset();
        active = target;
        bounds = target?.getBoundingClientRect() ?? null;
      }
      if (!active || !bounds || !bounds.width || !bounds.height) return;
      const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
      const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        active?.style.setProperty('--tilt-x', `${-y * 4}deg`);
        active?.style.setProperty('--tilt-y', `${x * 4}deg`);
        active?.setAttribute('data-tilting', 'true');
      });
    };
    const revealFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) event.target.closest('.motion-pending')?.classList.remove('motion-pending');
      reset();
    };
    root.addEventListener('pointermove', pointer, { passive: true });
    root.addEventListener('pointerleave', reset);
    root.addEventListener('focusin', revealFocus);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);

    const lenis = new Lenis({ duration: 1, smoothWheel: true });
    let frame = 0;
    const animate = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(animate);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      root.dataset.visible = String(!document.hidden);
      if (!document.hidden) frame = requestAnimationFrame(animate);
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    const hero = root.querySelector('.memoji-stage');
    const heroVisibility = new IntersectionObserver(([entry]) => {
      hero?.setAttribute('data-in-view', String(entry.isIntersecting));
    });
    if (hero) heroVisibility.observe(hero);

    return () => {
      reset();
      observer.disconnect();
      heroVisibility.disconnect();
      reveals.forEach((element) => element.classList.remove('motion-pending'));
      root.removeEventListener('pointermove', pointer);
      root.removeEventListener('pointerleave', reset);
      root.removeEventListener('focusin', revealFocus);
      root.removeEventListener('click', press, true);
      interactions.forEach((cleanup) => cleanup());
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      document.removeEventListener('visibilitychange', visibility);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [motionEnabled]);

  return { motionRef, motionEnabled, reducedMotion, toggleMotion: () => setPaused((value) => !value) };
}
