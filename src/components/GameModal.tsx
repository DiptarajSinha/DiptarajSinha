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
          className={`relative w-full max-w-md overflow-hidden flex flex-col aspect-[3/4] sm:aspect-square ${
            isStalker 
            ? "bg-black border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.4)] font-stalker" 
            : "bg-zinc-900 border border-yellow-500 rounded-2xl font-adventurer"
          }`}
        >
          {/* 1 & 2. Full Background Image + No Sidebar Fix */}
          <div className="absolute inset-0 z-0">
            {game.image && (
              <Image 
                src={game.image} 
                alt={game.title} 
                fill 
                className={`object-cover ${isStalker ? 'grayscale opacity-40 brightness-50' : 'opacity-20'}`} 
              />
            )}
            {/* Hacking Overlay / Scanlines */}
            {isStalker && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
            )}
            <div className={`absolute inset-0 bg-gradient-to-b ${isStalker ? 'from-red-900/20 via-black/80 to-black' : 'from-transparent to-zinc-900'}`} />
          </div>

          {/* HUD Status Bar (Engaging Add-on) */}
          {isStalker && (
             <div className="relative z-10 px-4 pt-4 flex justify-between items-center text-[8px] tracking-[0.3em] text-red-500/60 uppercase">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    Live_Feed: Secure
                </div>
                <div>CPU_LOAD: 42%</div>
             </div>
          )}

          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 z-30 p-2 text-red-500 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-end p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-red-500/80">
                <FaTerminal /> SIM_DRILL::{game.id.toUpperCase()}
              </div>

              <h2 className={`text-3xl sm:text-4xl font-bold uppercase tracking-tighter ${isStalker ? 'text-red-600 italic' : 'text-yellow-500'}`}>
                {game.title}
              </h2>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-[90%] font-light">
                {game.description}
              </p>

              <div className="pt-4">
                {isStalker ? (
                  <div className="space-y-4">
                    {stalkerStatus === 'locked' && (
                      <div className="border border-red-900/50 bg-black/60 backdrop-blur-md p-6 text-center">
                        <FaSkull className="mx-auto text-red-600 mb-2 animate-bounce" size={24} />
                        <p className="text-[9px] text-red-500 uppercase tracking-widest mb-4">Cognitive Handshake Required</p>
                        <button 
                          onClick={handleBypass}
                          className="w-full py-3 bg-red-600 text-white font-bold uppercase text-xs hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                          Bypass Protocols
                        </button>
                      </div>
                    )}

                    {stalkerStatus === 'bypassing' && (
                      <div className="py-8 text-center bg-black/80 border border-red-900/50">
                        <div className="flex justify-center gap-1 mb-3">
                           {[1,2,3].map(i => <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-1 h-1 bg-red-600" />)}
                        </div>
                        <p className="text-yellow-500 text-[10px] font-mono animate-pulse">{glitchText}</p>
                      </div>
                    )}

                    {stalkerStatus === 'ready' && (
                      <motion.a
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        href={game.link}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white font-black uppercase text-sm hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(255,0,0,0.5)]"
                      >
                        <FaPlay size={12} /> Execute simulation
                      </motion.a>
                    )}
                  </div>
                ) : (
                  <a href={game.link} className="w-full py-4 flex items-center justify-center gap-2 bg-yellow-600 text-black rounded-lg font-bold text-sm transition-all shadow-lg shadow-yellow-500/20">
                    <FaPlay size={14} /> Start Expedition
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}