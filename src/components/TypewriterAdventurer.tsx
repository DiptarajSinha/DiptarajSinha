'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCompass } from 'react-icons/fa'; // Ensure you have react-icons installed

const TypewriterAdventurer = () => {
  const [text, setText] = useState('Searching...');
  const [isLocked, setIsLocked] = useState(false);
  
  // The journey of identities before finding the true one
  const journey = ["Lost?", "Wanderer", "Explorer", "Seeker", "Adventurer"];

  useEffect(() => {
    let currentIndex = 0;

    const cycleWords = () => {
      // If we haven't reached the end, keep cycling
      if (currentIndex < journey.length - 1) {
        setText(journey[currentIndex]);
        currentIndex++;
        // Speed of cycling (faster feels more frantic/searching)
        setTimeout(cycleWords, 300); 
      } else {
        // We reached "Adventurer"
        setText(journey[currentIndex]);
        setIsLocked(true);
        
        // Reset after a long pause to loop the effect
        setTimeout(() => {
          setIsLocked(false);
          currentIndex = 0;
          setText('Searching...');
          cycleWords();
        }, 4000);
      }
    };

    // Start the cycle
    cycleWords();

    return () => {}; // Cleanup not strictly necessary for this simple recursive timeout
  }, []);

  return (
    <div className="inline-flex items-baseline gap-2 align-baseline">
      {/* The Spinning Compass */}
      <motion.div
        animate={{
          rotate: isLocked ? 0 : [0, 90, -45, 180, -90, 360],
          scale: isLocked ? 1.2 : 1,
          color: isLocked ? '#EAB308' : '#9CA3AF'
        }}
        transition={{
          rotate: { 
            duration: isLocked ? 0.5 : 2, 
            ease: isLocked ? "backOut" : "linear", 
            repeat: isLocked ? 0 : Infinity 
          },
          scale: { duration: 0.3 }
        }}
        // CHANGED: Reduced icon size on mobile (text-lg vs text-2xl)
        className="text-lg md:text-2xl relative top-[3px]"
      >
        <FaCompass />
      </motion.div>

      {/* The Changing Text */}
      <div className="relative overflow-hidden h-[32px] md:h-[40px] flex items-center">
        <AnimatePresence mode='wait'>
          <motion.span
            key={text}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            // CHANGED: Reduced font size (text-lg on mobile) so it doesn't wrap
            className={`font-adventurer text-lg md:text-3xl font-bold tracking-wide ${
              isLocked 
                ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' 
                : 'text-gray-400'
            }`}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TypewriterAdventurer;