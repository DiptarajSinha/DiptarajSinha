'use client';

import { useEffect, useState } from 'react';

const fullName = "DIPTARAJ SINHA's Portfolio";

interface NetflixIntroProps {
  onComplete?: () => void;
}

export default function NetflixIntro({ onComplete }: NetflixIntroProps) {
  const [typedText, setTypedText] = useState('');

  // Typing animation logic
  useEffect(() => {
    if (typedText.length < fullName.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullName.slice(0, typedText.length + 1));
      }, 80); // Slightly faster typing (80ms) feels smoother on mobile
      return () => clearTimeout(timeout);
    } else {
      // When animation is done, wait 1s then signal completion
      const timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, onComplete]);

  return (
    // Added 'px-4' for horizontal padding on mobile
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50 px-4">
      
      {/* Static Heading */}
      {/* Responsive Sizes: text-2xl (mobile) -> text-4xl (tablet) -> text-6xl (desktop) */}
      <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white tracking-wider mb-2 sm:mb-4 text-center">
        Welcome to
      </h2>

      {/* Animated Name */}
      {/* Responsive Sizes matching above, text-red-600, text-center for wrapping */}
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-widest text-red-600 text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
        {typedText}
      </h1>
    </div>
  );
}