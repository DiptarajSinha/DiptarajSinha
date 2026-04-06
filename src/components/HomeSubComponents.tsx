'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useImagePreloader } from '@/hooks/useImagePreloader';

// --- Types ---
import { AdventurerItem } from '@/data/adventurerData';
import { StalkerItem } from '@/data/stalkerData';
import AnimatedSection from './AnimatedSection';

// --- Helper Components ---

export const SkillCard = ({ name, icon, bg }: { name: string, icon: React.ReactNode, bg: string }) => (
  <div className={`group relative min-w-[144px] w-36 h-36 rounded-xl flex flex-col items-center justify-center gap-2 p-4 bg-zinc-900 border border-zinc-800 overflow-hidden transition-all hover:border-red-500/50`}>
      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${bg} transition-all opacity-0 group-hover:opacity-100`}></div>
      <div className="relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <p className="relative z-10 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">{name}</p>
  </div>
);

// --- ADVENTURER COMPONENTS ---

// --- Card Component for better local state management ---
const AdventurerCard = ({ item, index, onItemClick, hideCardImage }: { item: any, index: number, onItemClick: (item: any) => void, hideCardImage?: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.25, zIndex: 40 }}
      onClick={() => onItemClick(item)}
      className={`min-w-[200px] h-[120px] rounded-lg overflow-hidden relative border-4 border-white/10 bg-clip-padding hover:border-white hover:drop-shadow-[0_0_25px_#ffffffaa] transition-transform duration-300 cursor-pointer bg-zinc-900 flex-shrink-0`}
    >
      {item.backgroundImage && !hideCardImage && (
        <>
          {!isLoaded && <div className="absolute inset-0 skeleton-shimmer z-[1]" />}
          <Image
            src={item.backgroundImage}
            alt={item.title}
            fill
            className={`object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority={index < 4}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      )}
      
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center z-10">
        <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
        
        {item.status && (
          <div 
            className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
              item.status === 'completed' ? 'bg-green-500' :
              item.status === 'in-progress' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
            title={item.status === 'in-progress' ? 'In Progress' : 
                   item.status === 'completed' ? 'Completed' : 'Concept'}
          />
        )}
      </div>
    </motion.div>
  );
};

export const AdventurerCarousel: React.FC<any> = ({ id, title, description, items, onItemClick, hideCardImage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <AnimatedSection>
      <div id={id} className="py-12 scroll-mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">{title}</h2>
        <p className="text-gray-400 mb-8">{description}</p>
        
        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="relative z-0 flex space-x-6 overflow-x-scroll no-scrollbar px-12 py-4"
          >
            {items.map((item: any, index: number) => (
              <AdventurerCard 
                key={item.id} 
                item={item} 
                index={index} 
                onItemClick={onItemClick} 
                hideCardImage={hideCardImage} 
              />
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-50 bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

export const AdventurerModal: React.FC<any> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-zinc-900 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-zinc-700 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* Left side: Image */}
            {(item.backgroundImage || item.image) && (
              <div className="w-full lg:w-1/2 bg-zinc-950 flex items-center justify-center p-4 min-h-[300px] lg:min-h-0">
                <div className="relative w-full h-full min-h-[300px] lg:min-h-[400px]">
                  <Image
                    src={item.backgroundImage || item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Right side: Content */}
            <div className={`p-8 ${ (item.backgroundImage || item.image) ? 'lg:w-1/2' : 'w-full' }`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">{item.title.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.technologies.map((tech: string) => (
                        <span key={tech} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {(item.status === 'completed' || item.status === 'in-progress') && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : 'bg-yellow-600 text-white'
                      }`}
                    >
                      {item.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.details || item.detailedDescription || item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {(item.certificateUrl || item.link) && (
                    <a
                      href={item.certificateUrl || item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex-1 text-center sm:flex-none"
                    >
                      {item.certificateUrl ? 'View Certificate' : 'Visit Site'}
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex-1 text-center sm:flex-none"
                    >
                      Live Demo
                    </a>
                  )}
                  {(item.githubUrl || item.sourceLink) && (
                    <a
                      href={item.githubUrl || item.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors flex-1 text-center sm:flex-none"
                    >
                      Source Code
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
};

// --- STALKER COMPONENTS ---

export const TypingTerminal: React.FC<any> = ({ onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const terminalLines = useMemo(() => [
    "[SYSTEM INITIALIZED]",
    `[${getCurrentTime()}] Tracing IP address... COMPLETE`,
    `[${getCurrentTime()}] Location: [CLASSIFIED]`,
    `[${getCurrentTime()}] Matching biometric data... PROCESSING`,
    `[${getCurrentTime()}] Target identified: VISITOR_ID_7439`,
    `[${getCurrentTime()}] Behavioral pattern: CURIOUS_EXPLORER`,
    `[${getCurrentTime()}] Threat assessment: MINIMAL`,
    `[${getCurrentTime()}] Access granted: WELCOME_TO_THE_SHADOWS`
  ], []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLineIndex >= terminalLines.length) {
      setTimeout(() => onComplete?.(), 1000);
      return;
    }

    const currentLine = terminalLines[currentLineIndex];
    
    if (currentCharIndex <= currentLine.length) {
      const timer = setTimeout(() => {
        if (currentCharIndex === currentLine.length) {
          setDisplayedLines(prev => [...prev, currentLine]);
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        } else {
          setCurrentCharIndex(prev => prev + 1);
        }
      }, Math.random() * 50 + 20); // Faster typing speed

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, onComplete, terminalLines]);

  const getCurrentLine = () => {
    if (currentLineIndex >= terminalLines.length) return "";
    return terminalLines[currentLineIndex].substring(0, currentCharIndex);
  };

  const getLineColor = (line: string) => {
    if (line.includes('COMPLETE')) return 'text-yellow-400';
    if (line.includes('[CLASSIFIED]')) return 'text-red-400';
    if (line.includes('VISITOR_ID')) return 'text-green-400';
    if (line.includes('CURIOUS_EXPLORER')) return 'text-blue-400';
    if (line.includes('MINIMAL')) return 'text-green-400';
    if (line.includes('WELCOME_TO_THE_SHADOWS')) return 'text-green-400';
    if (line.includes('PROCESSING')) return 'text-yellow-400';
    if (line.includes('[SYSTEM INITIALIZED]')) return 'text-red-300';
    return 'text-green-400';
  };

  return (
    <div className="bg-gradient-to-r from-red-900/20 to-black p-8 rounded-lg max-h-80 overflow-y-auto text-left font-stalker text-lg md:text-xl border-2 border-red-800/50 shadow-[0_0_30px_rgba(255,0,0,0.3)] tracking-wide">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-red-400 font-bold tracking-widest">SURVEILLANCE ACTIVE</span>
      </div>
      
      {displayedLines.map((line, index) => (
        <p key={index} className={`${getLineColor(line)} leading-relaxed`}>
          {line}
        </p>
      ))}
      
      {currentLineIndex < terminalLines.length && (
        <p className={`${getLineColor(getCurrentLine())} leading-relaxed`}>
          {getCurrentLine()}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-white`}>_</span>
        </p>
      )}
      
      {currentLineIndex >= terminalLines.length && (
        <p className="text-gray-500 mt-4">👁️ We see everything...</p>
      )}
    </div>
  );
};

const StalkerCard = ({ item, index, onItemClick, hoverEffect, getHoverEffectClasses }: { item: any, index: number, onItemClick: (item: any) => void, hoverEffect: string, getHoverEffectClasses: (effect: string) => string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 40 }}
      onClick={() => onItemClick(item)}
      className={`min-w-[240px] max-w-[240px] h-[240px] rounded-lg overflow-hidden relative border-2 border-red-800/50 transition-all duration-300 cursor-pointer bg-zinc-900 flex-shrink-0 ${getHoverEffectClasses(hoverEffect)}`}
    >
      {item.backgroundImage && (
        <>
          {!isLoaded && <div className="absolute inset-0 skeleton-shimmer z-[1]" />}
          <Image
            src={item.backgroundImage}
            alt={item.title}
            fill
            className={`object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority={index < 4}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      )}
      
      <div className="absolute inset-0 bg-black/80 flex flex-col justify-between p-6 z-10">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded text-sm font-stalker border ${
            item.accessLevel === 'top-secret' ? 'bg-red-900/50 text-red-200 border-red-500' :
            item.accessLevel === 'restricted' ? 'bg-yellow-900/50 text-yellow-200 border-yellow-500' :
            'bg-green-900/50 text-green-200 border-green-500'
          }`}>
            {item.accessLevel?.toUpperCase() || 'PUBLIC'}
          </span>
          {item.threatLevel && (
            <div className={`w-3 h-3 rounded-full ${
              item.threatLevel === 'critical' ? 'bg-red-500 animate-pulse' :
              item.threatLevel === 'high' ? 'bg-orange-500' :
              item.threatLevel === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-center text-center">
          <h3 className="text-white text-2xl font-semibold mb-3 font-stalker tracking-wide leading-tight">{item.title}</h3>
          <p className="text-gray-300 text-lg leading-relaxed font-stalker">{item.description}</p>
        </div>
        
        <div className="flex justify-between items-end text-sm text-gray-500 font-stalker mt-3">
          <span>{item.status?.toUpperCase()}</span>
          <span>{item.lastAccessed}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const StalkerCarousel: React.FC<any> = ({ id, title, description, items, onItemClick, hoverEffect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -320 : 320; 
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const getHoverEffectClasses = (effect: string) => {
    switch (effect) {
      case 'glitch':
        return 'hover:animate-pulse hover:shadow-[0_0_30px_#ff0000aa] hover:border-red-500';
      case 'hack':
        return 'hover:shadow-[0_0_30px_#00ff00aa] hover:border-green-400 hover:bg-green-900/20';
      case 'shadow':
        return 'hover:shadow-[0_0_40px_#000000ff] hover:border-gray-600 hover:bg-black';
      case 'decrypt':
        return 'hover:shadow-[0_0_30px_#ffff00aa] hover:border-yellow-400 hover:bg-yellow-900/10';
      case 'corrupt':
        return 'hover:shadow-[0_0_30px_#ff00ffaa] hover:border-purple-500 hover:bg-purple-900/20';
      case 'phantom':
        return 'hover:shadow-[0_0_50px_#ffffff22] hover:border-white hover:opacity-80';
      default:
        return 'hover:border-red-500';
    }
  };

  return (
    <AnimatedSection>
      <div id={id} className="py-12 scroll-mt-24">
        <h2 className="text-4xl font-bold mb-6 text-left text-red-500 font-stalker tracking-wider">{title}</h2>
        <p className="text-gray-400 mb-8 italic font-stalker text-xl">{description}</p>
        
        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-red-900 hover:bg-red-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-red-700"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="relative z-0 flex space-x-6 overflow-x-scroll no-scrollbar px-12 py-4"
          >
            {items.map((item: any, index: number) => (
              <StalkerCard 
                key={item.id} 
                item={item} 
                index={index} 
                onItemClick={onItemClick} 
                hoverEffect={hoverEffect} 
                getHoverEffectClasses={getHoverEffectClasses} 
              />
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-50 bg-red-900 hover:bg-red-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-red-700"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

export const StalkerModal: React.FC<any> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
          className="bg-zinc-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-red-800 relative font-stalker"
          style={{ boxShadow: '0 0 50px rgba(255, 0, 0, 0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-400 hover:text-red-300 z-10 bg-black/50 rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-black rounded-xl flex items-center justify-center border border-red-700">
                <span className="text-3xl font-bold text-red-300">{item.title.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-red-300 tracking-wide">{item.title}</h2>
                  {item.threatLevel && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.threatLevel === 'critical' ? 'bg-red-900 text-red-200 animate-pulse' :
                      item.threatLevel === 'high' ? 'bg-orange-900 text-orange-200' :
                      item.threatLevel === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      THREAT: {item.threatLevel.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.technologies.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 bg-gray-800 text-gray-300 text-lg rounded border border-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 text-lg">
                  <span className={`px-2 py-1 rounded ${
                    item.accessLevel === 'top-secret' ? 'bg-red-900 text-red-200' :
                    item.accessLevel === 'restricted' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    ACCESS: {item.accessLevel?.toUpperCase() || 'PUBLIC'}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">
                    STATUS: {item.status?.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded bg-gray-800 text-gray-300">
                    LAST ACCESS: {item.lastAccessed}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-red-400 mb-3 border-b border-red-900/50 pb-2">CLASSIFIED DETAILS</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{item.detailedDescription}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => alert('🚫 ACCESS DENIED - INSUFFICIENT CLEARANCE LEVEL')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xl transition-colors tracking-wide"
                >
                  ACCESS DENIED
                </button>
                <button 
                  onClick={() => alert('📝 CLEARANCE REQUEST SUBMITTED - AWAIT AUTHORIZATION')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-xl transition-colors tracking-wide"
                >
                  REQUEST CLEARANCE
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ProfileSelector = ({ onSelect }: { onSelect: (role: string) => void }) => {
  const profiles = [
    { name: 'Recruiter', img: '/avatars/recruiter.jpg', fontClass: 'font-recruiter' },
    { name: 'Adventurer', img: '/avatars/adventurer.jpg', fontClass: 'font-adventurer' },
    { name: 'Stalker', img: '/avatars/stalker.jpg', fontClass: 'font-stalker' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#141414] text-white animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-medium mb-12 tracking-tight text-center">Who&#39;s watching?</h1>
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 px-4">
        {profiles.map((profile) => (
          <div 
            key={profile.name} 
            className="group flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => onSelect(profile.name)}
          >
            <div className="w-32 h-32 md:w-44 md:h-44 relative rounded-md overflow-hidden border-2 border-transparent group-hover:border-white group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 ease-in-out">
               <Image 
                 src={profile.img} 
                 alt={profile.name}
                 fill
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            <span className={`text-gray-400 text-lg md:text-2xl group-hover:text-white transition-colors duration-300 ${profile.fontClass}`}>
              {profile.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};