import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 10, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return (
    <div className="flex flex-col gap-3">
      {displayedText.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-lg md:text-xl font-medium text-[#1d1627] leading-relaxed">
            {line.replace(/[*#]/g, '')}
          </p>
        );
      })}
    </div>
  );
}
