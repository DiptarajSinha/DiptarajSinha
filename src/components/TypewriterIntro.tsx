'use client';
import { useState, useEffect } from 'react';

type TypewriterIntroProps = {
  className?: string;
};

export default function TypewriterIntro({ className }: TypewriterIntroProps) {
  const words = ["EXPLORER", "CODER", "DEVELOPER", "CREATOR"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState(words[0]);
  
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ -_";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const targetWord = words[currentWordIndex];
    let ticks = 0;

    const animate = () => {
      setDisplayWord(prev => 
        targetWord.split('').map((letter, i) => {
          // 1. If this letter is already correct, lock it in
          if (prev[i] === letter) return letter;
          
          // 2. FASTER STAGGER: Removed the division.
          // Before: (i > ticks / 2) -> Lagged at the end.
          // Now: (i > ticks) -> The wave sweeps across instantly.
          if (i > ticks) return prev[i] || " "; 
          
          const currentIndex = letters.indexOf(prev[i]) || 0;
          const targetIndex = letters.indexOf(letter);
          
          // 3. FASTER CYCLING: Calculate distance and jump!
          // Instead of A->B->C (slow), we jump 2-3 letters at a time.
          let distance = targetIndex - currentIndex;
          if (distance < 0) distance += letters.length;
          
          // If we are close (within 3 steps), just snap to the target letter
          if (distance <= 3) return letter;
          
          // Otherwise, jump forward by 3 letters per frame (Fast blur effect)
          return letters[(currentIndex + 3) % letters.length];
        }).join('')
      );

      ticks++;

      // Stop condition: Word matches
      if (displayWord === targetWord) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentWordIndex(prev => (prev + 1) % words.length);
        }, 2000); // Wait 2s before next word
      }
    };

    // Keep speed at 20ms for smooth animation
    interval = setInterval(animate, 20);
    return () => clearInterval(interval);
  }, [currentWordIndex, displayWord, words, letters]);

  return (
    <div className={`${className} inline-block bg-black px-2 rounded`}>
      <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest text-yellow-500">
        {displayWord}
      </span>
    </div>
  );
}