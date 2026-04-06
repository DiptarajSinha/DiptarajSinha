'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameItem } from '@/data/gamesData';
import { FaTimes, FaPlay, FaTerminal, FaSkull, FaMicrochip } from 'react-icons/fa';
import Image from 'next/image';

interface GameModalProps {
  game: GameItem | null;
  isOpen: boolean;
  onClose: () => void;
  theme: 'Adventurer' | 'Stalker';
}

export default function GameModal({ game, isOpen, onClose, theme }: GameModalProps) {
  const [stalkerStatus, setStalkerStatus] = useState<'locked' | 'bypassing' | 'ready'>('locked');
  const [glitchText, setGlitchText] = useState("");
  
  const isStalker = theme === 'Stalker';

  useEffect(() => {
    if (isOpen) {
      setStalkerStatus('locked');
      setGlitchText("");
    }
  }, [isOpen]);

  const handleBypass = () => {
    setStalkerStatus('bypassing');
    const messages = ["ANALYZING...", "OVERRIDING...", "INJECTING...", "BREACHED"];
    let i = 0;
    const interval = setInterval(() => {
      setGlitchText(messages[i]);
      i++;
      if (i >= messages.length) {
        clearInterval(interval);
        setStalkerStatus('ready');
      }
    }, 600);
  };

  if (!isOpen || !game) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-5xl overflow-hidden flex flex-col md:flex-row ${
            isStalker 
            ? "bg-black border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)] font-stalker" 
            : "bg-zinc-900 border border-yellow-500 rounded-2xl font-adventurer"
          }`}
        >
          {/* Left side: Image (Dictates height) */}
          {game.image && (
            <div className={`w-full md:w-[60%] relative bg-black aspect-[3/2] flex items-center justify-center ${isStalker ? 'border-b md:border-b-0 md:border-r border-red-900/50' : ''}`}>
              <Image 
                src={game.image} 
                alt={game.title} 
                fill 
                className="object-contain" 
                priority
              />
              {/* Scanlines / Overlay for Stalker theme */}
              {isStalker && (
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-30" />
              )}
            </div>
          )}

          {/* Right side: Content (Matches image height) */}
          <div className="w-full md:w-[40%] flex flex-col relative max-h-[500px] md:max-h-none overflow-y-auto no-scrollbar">
            {/* Background for content if no left image or on mobile */}
            {!game.image && (
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className={`absolute inset-0 bg-gradient-to-b ${isStalker ? 'from-red-900/20 via-black/80 to-black' : 'from-transparent to-zinc-900'}`} />
                </div>
            )}

            {/* HUD Status Bar (Stalker only) */}
            {isStalker && (
               <div className="relative z-10 px-6 pt-6 flex justify-between items-center text-[10px] tracking-[0.3em] text-red-500/60 uppercase">
                  <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                      Live_Feed: Secure
                  </div>
                  <div>CPU_LOAD: 42%</div>
               </div>
            )}

            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 z-30 p-2 text-red-500 hover:text-white transition-colors bg-black/20 rounded-full backdrop-blur-sm"
            >
              <FaTimes size={20} />
            </button>

            {/* Content Container */}
            <div className="relative z-10 flex-1 flex flex-col justify-center p-6 sm:p-10">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 text-[10px] sm:text-[12px] font-mono text-red-500/80">
                  <FaTerminal /> SIM_DRILL::{game.id.toUpperCase()}
                </div>

                <h2 className={`text-3xl sm:text-5xl font-bold uppercase tracking-tighter leading-none ${isStalker ? 'text-red-600 italic' : 'text-yellow-500'}`}>
                  {game.title}
                </h2>

                <p className="text-gray-300 text-xs sm:text-lg leading-relaxed font-light">
                  {game.description}
                </p>

                <div className="pt-4 sm:pt-6">
                  {isStalker ? (
                    <div className="space-y-4">
                      {stalkerStatus === 'locked' && (
                        <div className="border border-red-900/50 bg-black/60 backdrop-blur-md p-6 sm:p-8 text-center">
                          <FaSkull className="mx-auto text-red-600 mb-4 animate-bounce" size={24} />
                          <p className="text-[10px] text-red-500 uppercase tracking-[0.2em] mb-4 sm:mb-6">Cognitive Handshake Required</p>
                          <button 
                            onClick={handleBypass}
                            className="w-full py-3 sm:py-4 bg-red-600 text-white font-bold uppercase text-xs sm:text-sm hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                          >
                            Bypass Protocols
                          </button>
                        </div>
                      )}

                      {stalkerStatus === 'bypassing' && (
                        <div className="py-8 sm:py-10 text-center bg-black/80 border border-red-900/50">
                          <div className="flex justify-center gap-1 mb-4">
                             {[1,2,3,4].map(i => <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-1.5 h-1.5 bg-red-600" />)}
                          </div>
                          <p className="text-yellow-500 text-[10px] sm:text-[12px] font-mono animate-pulse tracking-widest">{glitchText}</p>
                        </div>
                      )}

                      {stalkerStatus === 'ready' && (
                        <motion.a
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          href={game.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 w-full py-4 sm:py-5 bg-red-600 text-white font-black uppercase text-sm sm:text-base hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(255,0,0,0.5)]"
                        >
                          <FaPlay size={14} /> Execute simulation
                        </motion.a>
                      )}
                    </div>
                  ) : (
                    <a 
                      href={game.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 sm:py-5 flex items-center justify-center gap-3 bg-yellow-600 text-black rounded-xl font-bold text-sm sm:text-base transition-all hover:bg-yellow-500 shadow-xl shadow-yellow-900/20"
                    >
                      <FaPlay size={16} /> Start Expedition
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}