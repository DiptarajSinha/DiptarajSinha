'use client';
import { useState, useEffect } from 'react';

const TypewriterStalker = () => {
  const [text, setText] = useState('ENCRYPTED'); 
  const targetText = 'STALKER';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    let iterations = 0;
    let interval: NodeJS.Timeout;
    let resetTimeout: NodeJS.Timeout;

    const startAnimation = () => {
      interval = setInterval(() => {
        setText(prev => 
          targetText
            .split('')
            .map((letter, index) => {
              // If we have passed this index, return the real letter
              if (index < iterations) {
                return targetText[index];
              }
              // Otherwise, return a random "glitch" character
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        // Stop when all letters are revealed
        if (iterations >= targetText.length) {
          clearInterval(interval);
          
          // Wait 3 seconds, then restart the loop
          resetTimeout = setTimeout(() => {
            iterations = 0;
            startAnimation();
          }, 3000);
        }
        
        // CONTROLS THE REVEAL SPEED
        // 1/10 means it takes 10 "ticks" (10 * 40ms = 400ms) to reveal ONE letter.
        iterations += 1 / 10; 
        
      }, 40); // Scramble speed (fast flicker)
    };

    startAnimation();

    return () => {
      clearInterval(interval);
      clearTimeout(resetTimeout);
    };
  }, []);

  return (
    <span className="text-red-500 font-stalker tracking-[0.2em] font-bold uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
      {text}
    </span>
  );
};

export default TypewriterStalker;