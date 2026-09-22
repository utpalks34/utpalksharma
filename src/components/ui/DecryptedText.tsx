import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  trigger?: boolean;
  /**
   * When provided, drives a two-way encrypt/decrypt animation:
   * true -> scrambles progressively into plain text (decrypt)
   * false -> plain text progressively scrambles into glyphs (encrypt)
   * Re-fires every time the value flips, so it can be wired to scroll
   * visibility (e.g. via useInView) for a repeatable effect.
   */
  inView?: boolean;
  sequential?: boolean;
  glyphs?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const DEFAULT_GLYPHS = '0123456789ABCDEF$#@%&><~*+_';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  className = '',
  speed = 35,
  trigger = true,
  inView,
  sequential = true,
  glyphs = DEFAULT_GLYPHS,
  as: Component = 'span',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(text);
      return;
    }

    // Two-way scroll-driven mode
    if (inView !== undefined) {
      let isMounted = true;
      let iteration = 0;
      const maxIterations = text.length;

      const interval = setInterval(() => {
        if (!isMounted) return;

        if (inView) {
          // Decrypt: glyphs progressively resolve into real characters
          setDisplayText(
            text
              .split('')
              .map((char, index) => {
                if (char === ' ') return ' ';
                const resolved = sequential
                  ? index < iteration
                  : Math.random() < iteration / (maxIterations * 1.5);
                if (resolved) return char;
                return glyphs[Math.floor(Math.random() * glyphs.length)];
              })
              .join('')
          );
        } else {
          // Encrypt: real characters progressively scramble into glyphs
          setDisplayText(
            text
              .split('')
              .map((char, index) => {
                if (char === ' ') return ' ';
                const scrambled = sequential
                  ? index >= text.length - iteration
                  : Math.random() < iteration / (maxIterations * 1.5);
                if (scrambled) return glyphs[Math.floor(Math.random() * glyphs.length)];
                return char;
              })
              .join('')
          );
        }

        iteration += 1;

        if (iteration > maxIterations + 4) {
          clearInterval(interval);
          if (isMounted) {
            if (inView) {
              setDisplayText(text);
              setIsRevealed(true);
            } else {
              setIsRevealed(false);
            }
          }
        }
      }, speed);

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }

    // Legacy one-shot decrypt-on-mount mode
    let isMounted = true;
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      if (!isMounted) return;

      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (sequential) {
              if (index < iteration) {
                return text[index];
              }
            } else {
              if (Math.random() < iteration / (maxIterations * 1.5)) {
                return text[index];
              }
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('');
      });

      iteration += 1;

      if (iteration > maxIterations + 4) {
        clearInterval(interval);
        if (isMounted) {
          setDisplayText(text);
          setIsRevealed(true);
        }
      }
    }, speed);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [text, trigger, inView, speed, sequential, glyphs]);

  return (
    <Component
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={`${className} transition-opacity duration-300 ${isRevealed ? 'opacity-100' : 'opacity-90'}`}
      data-original={text}
    >
      {displayText}
    </Component>
  );
};
