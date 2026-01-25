'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if window width is less than 768px (Mobile/Tablet)
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        // Only show if they haven't dismissed it in this session
        if (!sessionStorage.getItem('mobile-warning-dismissed')) {
          setShowWarning(true);
        }
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    setShowWarning(false);
    sessionStorage.setItem('mobile-warning-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
        >
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
            <div className="mb-4 text-4xl">🖥️</div>
            <h3 className="text-xl font-bold text-white mb-2">Desktop Experience Recommended</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              This portfolio features immersive interactions and 3D effects designed for larger screens. 
              <br/><br/>
              You can continue on mobile, but some visual magic might be missing!
            </p>
            <button
              onClick={handleDismiss}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}