'use client';
import { useState, useEffect, useRef } from 'react';

interface TypingTerminalProps {
  onComplete?: () => void;
}

const TypingTerminal = ({ onComplete }: TypingTerminalProps) => {
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // LOG CONFIGURATION
  const logs = [
    { text: "[SYSTEM INITIALIZED]", color: "text-red-300" },
    { text: "Tracing IP address... COMPLETE", color: "text-gray-300", highlight: "COMPLETE", highlightColor: "text-yellow-400" },
    { text: "Location: [CLASSIFIED]", color: "text-gray-300", highlight: "[CLASSIFIED]", highlightColor: "text-red-500" },
    { text: "Matching biometric data... PROCESSING", color: "text-gray-300", highlight: "PROCESSING", highlightColor: "text-yellow-400" },
    { text: "Target identified: VISITOR_ID_7439", color: "text-gray-300", highlight: "VISITOR_ID_7439", highlightColor: "text-green-400" },
    { text: "Behavioral pattern: CURIOUS_EXPLORER", color: "text-gray-300", highlight: "CURIOUS_EXPLORER", highlightColor: "text-blue-400" },
    { text: "Threat assessment: MINIMAL", color: "text-gray-300", highlight: "MINIMAL", highlightColor: "text-green-400" },
    { text: "Access granted: WELCOME_TO_THE_SHADOWS", color: "text-gray-300", highlight: "WELCOME_TO_THE_SHADOWS", highlightColor: "text-green-400" },
  ];

  useEffect(() => {
    // Stop if we've finished all lines
    if (currentLineIndex >= logs.length) {
      if (onComplete) {
        const timeout = setTimeout(onComplete, 1500); // Wait 1.5s before giving access
        return () => clearTimeout(timeout);
      }
      return;
    }

    const targetLine = logs[currentLineIndex].text;

    // Typing Logic
    if (currentText.length < targetLine.length) {
      // Type next character
      const timeout = setTimeout(() => {
        setCurrentText(targetLine.slice(0, currentText.length + 1));
      }, 50); // CHANGED: Increased from 20ms to 50ms (Slower typing)
      return () => clearTimeout(timeout);
    } else {
      // Line Finished: Pause then move to next
      const timeout = setTimeout(() => {
        setCompletedLines((prev) => [...prev, currentLineIndex]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentText('');
      }, 500); // CHANGED: Increased pause between lines for better readability
      return () => clearTimeout(timeout);
    }
  }, [currentText, currentLineIndex, logs, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentText, completedLines]);

  // Helper to render a finished line with colors
  const renderLine = (index: number) => {
    const log = logs[index];
    const parts = log.text.split(log.highlight || '___');
    return (
      <div key={index} className="text-xs sm:text-base leading-tight tracking-wide font-mono mb-1">
        <span className={log.color}>{parts[0]}</span>
        {log.highlight && (
          <span className={`${log.highlightColor} font-bold glow-text`}>
            {log.highlight}
          </span>
        )}
        {parts[1]}
      </div>
    );
  };

  return (
    <div 
      ref={scrollRef}
      className="bg-black/95 p-4 rounded-lg w-full max-w-3xl border border-red-900/50 shadow-[0_0_40px_rgba(220,38,38,0.2)] font-stalker overflow-hidden min-h-[300px] flex flex-col justify-end"
    >
      <div className="flex flex-col w-full h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-900/30 shrink-0">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-500 font-bold text-xs sm:text-sm tracking-[0.2em]">SURVEILLANCE ACTIVE</span>
        </div>

        {/* 1. Render Completed Lines (Colored) */}
        {completedLines.map((idx) => renderLine(idx))}

        {/* 2. Render Current Typing Line (White/Gray while typing) */}
        {currentLineIndex < logs.length && (
          <div className="text-xs sm:text-base leading-tight tracking-wide font-mono text-gray-100 break-words">
            {currentText}
            {/* Blinking Block Cursor */}
            <span className="inline-block w-2 h-4 bg-red-500 align-middle ml-1 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTerminal;