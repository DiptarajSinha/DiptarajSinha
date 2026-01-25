'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaLock, FaUnlock, FaTerminal, FaClock, FaShieldAlt, FaExclamationTriangle, FaSkull } from 'react-icons/fa';

export default function StalkerModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [status, setStatus] = useState<'locked' | 'requesting' | 'granted' | 'denied'>('locked');
  const [countdown, setCountdown] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [denialText, setDenialText] = useState("");

  // 1. Identify Permanent Blacklist OR Incomplete Projects (No links)
  const isBlacklisted = 
    item?.isRestricted === true || 
    item?.title?.toLowerCase().includes('classified') || 
    item?.title?.toLowerCase().includes('unknown') ||
    item?.sectionId === 'classified' ||
    item?.sectionId === 'unknown-projects' ||
    (!item?.demoLink && !item?.sourceLink); // STRICT ADDITION: Check for missing data

  const denialLines = [
    "ACCESS_VOID: You are just a visitor here.",
    "PERMISSION_DENIED: Mind your own business.",
    "SECURITY_BREACH: Your IP has been logged. Disconnect now.",
    "PROTOCOL_ERROR: Level 9 clearance required.",
    "FATAL_ERROR: Cannot decrypt what does not exist for you.",
    "DATA_CORRUPT: Access link not found in salvaged packets." // THEMATIC ADDITION
  ];

  const getThreatStyle = useCallback(() => {
    const threat = item?.threatLevel?.toLowerCase();
    switch (threat) {
      case 'critical': return { color: 'text-red-600', border: 'border-red-600', speed: 'animate-[pulse_0.8s_ease-in-out_infinite]' };
      case 'high':     return { color: 'text-orange-500', border: 'border-orange-500', speed: 'animate-[pulse_1.2s_ease-in-out_infinite]' };
      case 'medium':   return { color: 'text-yellow-500', border: 'border-yellow-500', speed: 'animate-[pulse_2s_ease-in-out_infinite]' };
      case 'low':      return { color: 'text-green-500', border: 'border-green-500', speed: 'animate-pulse' };
      default:         return { color: 'text-zinc-500', border: 'border-zinc-500', speed: '' };
    }
  }, [item]);

  const getTimers = useCallback(() => {
    if (!item) return { bruteForce: 0, expiry: 0 };
    const threat = item.threatLevel?.toLowerCase();
    switch (threat) {
      case 'critical': return { bruteForce: 20, expiry: 300 };
      case 'high':     return { bruteForce: 12, expiry: 600 };
      case 'medium':   return { bruteForce: 7,  expiry: 1200 };
      case 'low':      return { bruteForce: 3,  expiry: 3600 };
      default:         return { bruteForce: 5,  expiry: 600 };
    }
  }, [item]);

  // Handle Log Generation during requesting state
  useEffect(() => {
    if (status === 'requesting') {
      const commands = [
        "> INITIALIZING_EXPLOIT...", 
        "> BYPASSING_SSL_PINNING...", 
        "> INJECTING_SQL_PAYLOAD...",
        "> ESCALATING_PRIVILEGES...",
        "> DECRYPTING_NODE_DATA...",
        "> ESTABLISHING_TUNNEL..."
      ];

      setLogs([commands[0]]);

      let i = 1; 
      const logInterval = setInterval(() => {
        if (i < commands.length) {
          setLogs(prev => [...prev, commands[i]]);
          i++;
        } else {
          clearInterval(logInterval);
        }
      }, 2500);

      return () => clearInterval(logInterval);
    } else {
      setLogs([]);
    }
  }, [status]);

  useEffect(() => {
    if (!item) return;
    const savedExpiry = localStorage.getItem(`stalker_access_${item.id}`);
    if (savedExpiry && !isBlacklisted) {
      const remaining = Math.floor((parseInt(savedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setStatus('granted');
        setCountdown(remaining);
        return;
      }
    }
    setStatus('locked');
    setCountdown(0);
    setDenialText(""); 
  }, [item, isBlacklisted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'requesting' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } 
    else if (status === 'requesting' && countdown === 0) {
      const { expiry } = getTimers();
      const expiryTimestamp = Date.now() + (expiry * 1000);
      localStorage.setItem(`stalker_access_${item?.id}`, expiryTimestamp.toString());
      setStatus('granted');
      setCountdown(expiry);
    } 
    else if (status === 'granted' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } 
    else if (status === 'granted' && countdown === 0) {
      localStorage.removeItem(`stalker_access_${item?.id}`);
      setStatus('locked');
    }
    return () => clearTimeout(timer);
  }, [status, countdown, getTimers, item?.id]);

  const handleRequest = () => {
    if (isBlacklisted) {
      setStatus('denied');
      const fullMsg = denialLines[Math.floor(Math.random() * denialLines.length)];
      
      let i = 0;
      const interval = setInterval(() => {
        setDenialText(fullMsg.slice(0, i));
        i++;
        if (i > fullMsg.length) clearInterval(interval);
      }, 50); 
      return;
    }

    const { bruteForce } = getTimers();
    setStatus('requesting');
    setCountdown(bruteForce);
  };

  if (!item) return null;
  const threatStyle = getThreatStyle();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4" onClick={onClose}>
      <motion.div 
        key={item.id}
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-zinc-950 border-2 border-red-900 shadow-[0_0_60px_rgba(255,0,0,0.15)] max-w-lg w-full p-6 font-stalker relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(400%); }
          }
        `}} />

        {isBlacklisted && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none text-[10px] flex flex-wrap gap-2 p-2 overflow-hidden select-none">
                {Array(150).fill("UNAUTHORIZED_ACCESS ").map((t, i) => <span key={i}>{t}</span>)}
            </div>
        )}

        <button onClick={onClose} className="absolute top-4 right-4 text-red-500 hover:text-white transition-colors z-10">
          <FaTimes size={20}/>
        </button>
        
        <h2 className="text-2xl text-red-500 mb-2 uppercase tracking-tighter flex items-center gap-2">
            <FaTerminal size={18}/> {item.title}
        </h2>

        <div className={`flex items-center gap-2 mb-4 border-l-2 pl-3 ${threatStyle.border}`}>
            <FaShieldAlt className={threatStyle.speed} size={14}/>
            <span className={`text-xs uppercase tracking-[0.2em] font-bold ${threatStyle.color} ${threatStyle.speed}`}>
                THREAT_LEVEL: {item.threatLevel || 'Standard'}
            </span>
        </div>

        <p className="text-gray-400 mb-6 text-sm italic leading-relaxed border-b border-red-900/30 pb-4">
          {item.description}
        </p>

        {status === 'locked' && (
          <div className="space-y-4">
            <div className="bg-red-950/5 border border-red-900/40 p-6 text-center group relative overflow-hidden">
              <FaLock className="mx-auto text-red-900 group-hover:text-red-500 transition-all duration-500 mb-2" size={40}/>
              <p className="text-red-600/60 text-[10px] font-bold uppercase tracking-[0.4em]">Node_Status: Encrypted</p>
            </div>
            <div className="flex gap-3">
              <button disabled className="flex-1 py-2 bg-zinc-900/50 text-zinc-700 border border-zinc-800 cursor-not-allowed uppercase text-[10px]">Access Denied</button>
              <button onClick={handleRequest} className="flex-1 py-2 bg-red-900 text-white hover:bg-red-600 transition-all uppercase text-[10px] font-bold tracking-widest">Request Clearance</button>
            </div>
          </div>
        )}

        {status === 'denied' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: [-1, 1, -1, 1, 0] 
            }} 
            transition={{ 
              opacity: { duration: 0.8 },
              x: { repeat: 3, duration: 0.1 } 
            }}
            className="space-y-6 text-center py-4"
          >
            <div className="bg-red-600/10 border-2 border-red-600 p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/10 to-transparent h-1 w-full animate-[scan_2s_linear_infinite] pointer-events-none" />
              <FaSkull className="mx-auto text-red-600 mb-4 animate-pulse" size={50}/>
              <h3 className="text-white text-lg font-bold uppercase tracking-[0.2em] mb-2">
                Critical Security Event
              </h3>
              <p className="text-red-500 text-sm font-mono min-h-[40px] leading-relaxed">
                {denialText}
                <span className="inline-block w-2 h-4 bg-red-600 ml-1 animate-pulse align-middle" />
              </p>
            </div>
            <button onClick={onClose} className="w-full py-3 bg-red-600 text-white font-bold uppercase text-xs hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Terminate Connection
            </button>
          </motion.div>
        )}

        {status === 'requesting' && (
          <div className="py-8 text-center space-y-6">
            <div className="flex justify-between text-[10px] text-yellow-500 font-bold uppercase tracking-widest">
                <span>Injecting_Payload...</span>
                <span>{countdown}s</span>
            </div>
            <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                transition={{ duration: getTimers().bruteForce, ease: "linear" }} 
                className="bg-yellow-500 h-full shadow-[0_0_15px_#eab308]" 
              />
            </div>
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-red-500 animate-[pulse_1s_ease-in-out_infinite]">
                    <FaExclamationTriangle size={14}/>
                    <p className="text-xs font-bold uppercase tracking-[0.3em]">Warning: Do not close terminal</p>
                </div>
                <div className="h-10 text-left w-full overflow-hidden">
                    {logs.slice(-2).map((log, i) => (
                        <p key={i} className="text-[9px] text-zinc-600 font-mono">{log}</p>
                    ))}
                </div>
            </div>
          </div>
        )}

        {status === 'granted' && (
          <div className="space-y-4">
            <div className="bg-green-950/10 border border-green-900/50 p-6 text-center relative overflow-hidden">
              <FaUnlock className="mx-auto text-green-500 mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" size={30}/>
              <p className="text-green-500 text-xs font-bold uppercase tracking-[0.3em]">Access Maintained</p>
              <div className="text-green-600/80 text-[10px] mt-3 flex items-center justify-center gap-1 font-mono">
                <FaClock size={10}/> SESSION_TIME_REMAINING: {formatTime(countdown)}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={item.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-green-600 text-black text-center font-bold hover:bg-green-400 transition-all uppercase text-xs shadow-[0_0_20px_rgba(34,197,94,0.3)]">Live Demo</a>
              <a href={item.sourceLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 border border-green-500 text-green-500 text-center font-bold hover:bg-green-500 hover:text-black transition-all uppercase text-xs">Source Code</a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}