import React, { useEffect, useRef, useState } from 'react';

interface EncryptedTextProps {
  text: string;
  active: boolean;
  className?: string;
  speed?: number;
  glyphs?: string;
}

const DEFAULT_GLYPHS = '01<>/\\{}[]#$%&*+~^!?ABCDEF';

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  active,
  className = '',
  speed = 28,
  glyphs = DEFAULT_GLYPHS,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const maxIterations = text.length;

    intervalRef.current = setInterval(() => {
      iteration += 1;
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return char;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join('')
      );

      if (iteration > maxIterations && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, text, speed, glyphs]);

  return (
    <span className={className} data-original={text}>
      {displayText}
    </span>
  );
};
