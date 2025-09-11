"use client";

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  phrases: string[];
  className?: string;
}

export function TypingEffect({ phrases, className }: TypingEffectProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = 300;
    const deletingSpeed = 150;
    const delay = 2000;

    const handleTyping = () => {
      if (isDeleting) {
        if (text.length > 0) {
          setText((prev) => prev.substring(0, prev.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      } else {
        if (text.length < currentPhrase.length) {
          setText((prev) => currentPhrase.substring(0, prev.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases]);

  return (
    <p className={className}>
      {text}
      <span className="animate-ping">|</span>
    </p>
  );
}
