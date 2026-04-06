'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaGithub, FaExternalLinkAlt, FaScroll, FaBinoculars, FaSearchLocation, FaLightbulb } from 'react-icons/fa';
import Image from 'next/image';

export default function AdventurerModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [loadingDiscovery, setLoadingDiscovery] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);

  useEffect(() => {
    if (item) {
      setLoadingDiscovery(true);
      setLoadPercent(0);
      const interval = setInterval(() => {
        setLoadPercent(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setLoadingDiscovery(false), 400); // Small pause for effect
            return 100;
          }
          return prev + 4;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/95 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#1c1917] border border-yellow-900/50 shadow-2xl overflow-hidden rounded-md font-adventurer"
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-40 p-2 text-yellow-700 hover:text-yellow-500 transition-colors">
            <FaTimes size={24} />
          </button>

          <div className="flex flex-col md:flex-row h-full">
            {/* Left: Artifact Visual with Lens Effect (Dictates height) */}
            <div className="w-full md:w-[60%] relative aspect-[3/2] bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-yellow-900/20 overflow-hidden">
              <Image 
                src={item.image || item.backgroundImage || '/images/placeholder.jpg'} 
                alt={item.title} 
                fill 
                className={`object-contain transition-all duration-1000 ${loadingDiscovery ? 'blur-md grayscale scale-110' : 'blur-0 grayscale-0 scale-100'}`}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Telescope/Lens Overlay during loading */}
              {loadingDiscovery && (
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-32 h-32 border-[10px] border-double border-yellow-700/20 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(202,138,4,0.1)]">
                     <div className="w-24 h-24 border-2 border-dashed border-yellow-600/40 rounded-full animate-spin-slow" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Content Section (Matches image height) */}
            <div className="w-full md:w-[40%] p-6 md:p-8 flex flex-col overflow-y-auto no-scrollbar bg-[#1c1917]">
              {loadingDiscovery ? (
                <div className="flex flex-col items-center justify-center h-full py-10 sm:py-20">
                  <FaBinoculars className="text-yellow-700 mb-4 animate-pulse" size={32} />
                  <h3 className="text-yellow-600 font-bold uppercase tracking-[0.3em] text-[10px]">Adjusting Focus...</h3>
                  <div className="w-full bg-stone-900 h-0.5 mt-6 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-yellow-600 h-full" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${loadPercent}%` }} 
                    />
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-700 font-bold">Discovery Log</span>
                    <span className="text-[9px] font-mono text-stone-600">REF: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-200 mb-4 uppercase tracking-tighter italic leading-none">
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-widest border border-stone-800 px-2 py-1">
                      <FaMapMarkerAlt className="text-yellow-800" /> {item.location || "The Wilds"}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-widest border border-stone-800 px-2 py-1">
                      <FaCalendarAlt className="text-yellow-800" /> {item.date || "Unknown"}
                    </div>
                  </div>

                  <p className="text-stone-400 leading-relaxed italic text-sm mb-6 border-l border-yellow-900/50 pl-4 py-1">
                    "{item.description}"
                  </p>

                    {/* ACTION BUTTONS */}
                    <div className="mt-auto space-y-3 pt-4">
                        {item.status === 'in-progress' ? (
                            /* 1. WORK-IN-PROGRESS UI */
                            <div className="space-y-3">
                            <div className="w-full py-4 flex items-center justify-center gap-3 bg-stone-800 text-stone-500 font-bold uppercase text-[10px] tracking-[0.2em] border border-stone-700 cursor-not-allowed opacity-60">
                                <FaSearchLocation className="animate-pulse" size={12}/> 
                                Expedition Suspended
                            </div>
                            <p className="text-[9px] text-center text-yellow-700/50 uppercase tracking-[0.3em] font-mono leading-tight">
                                Artifact is currently being excavated
                            </p>
                            </div>
                        ) : item.status === 'concept' ? (
                            /* 2. CONCEPT UI (NEW) */
                            <div className="space-y-3">
                            <div className="w-full py-4 flex items-center justify-center gap-3 bg-stone-900/50 text-stone-500 font-bold uppercase text-[10px] tracking-[0.2em] border border-yellow-900/20 cursor-not-allowed">
                                <FaLightbulb className="text-yellow-900/50" size={12}/> 
                                Theoretical Blueprint
                            </div>
                            <p className="text-[9px] text-center text-stone-600 uppercase tracking-[0.3em] font-mono leading-tight">
                                Discovery remains in the realm of speculation
                            </p>
                            </div>
                        ) : (
                            /* 3. ACTIVE BUTTONS (COMPLETED) */
                            <>
                            <a 
                                href={item.link || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-3 sm:py-4 flex items-center justify-center gap-3 bg-yellow-800 text-stone-100 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-yellow-700 transition-all shadow-xl shadow-black/50"
                            >
                                Launch Expedition <FaExternalLinkAlt size={10}/>
                            </a>
                            
                            <a 
                                href={item.sourceLink || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-2 sm:py-3 flex items-center justify-center gap-3 border border-yellow-900/40 text-yellow-700 font-bold uppercase text-[9px] tracking-[0.1em] hover:bg-yellow-900/10 transition-all"
                            >
                                Examine Blueprints <FaScroll size={14}/>
                            </a>
                            </>
                        )}
                    </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}