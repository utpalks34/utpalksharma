import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  trigger?: boolean;
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
  }, [text, trigger, speed, sequential, glyphs]);

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
