"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GeoTracker({ onComplete }: { onComplete: () => void }) {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocked(true);
      setTimeout(onComplete, 800);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="text-xs font-mono text-emerald-500/70 mb-4 tracking-widest">
        {locked ? "[ TARGET LOCKED : SECURE ]" : "[ SCANNING SECTORS ]"}
      </div>
      
      <div className="relative w-64 h-64 border border-emerald-500/20 bg-emerald-950/10 p-4">
        {/* Simplified India Outline SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
          <motion.path
            d="M30,10 L45,5 L60,15 L70,30 L85,45 L75,60 L60,85 L50,95 L40,80 L25,60 L15,40 L20,25 Z"
            fill="none"
            stroke="#10B981"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Reticle / Kolkata Coordinate (Roughly East India) */}
        <motion.div
          className="absolute border border-emerald-400 rounded-full flex items-center justify-center pointer-events-none"
          initial={{ top: "10%", left: "10%", width: "100px", height: "100px", opacity: 0 }}
          animate={
            locked 
            ? { top: "45%", left: "65%", width: "24px", height: "24px", opacity: 1 } 
            : { top: "30%", left: "40%", width: "80px", height: "80px", opacity: 0.5 }
          }
          transition={{ duration: 1.2, ease: "circOut" }}
        >
          {locked && (
            <motion.div 
              className="w-1 h-1 bg-neon-accent rounded-full animate-pulse shadow-[0_0_8px_#34D399]" 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </motion.div>
        
        {locked && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-[40%] left-[75%] text-[10px] font-mono text-neon-accent flex flex-col glow-text"
          >
            <span>LAT: 22.5726° N</span>
            <span>LNG: 88.3639° E</span>
            <span>SYS: ONLINE</span>
          </motion.div>
        )}
      </div>
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-emerald-500/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-emerald-500/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-emerald-500/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-emerald-500/50" />
    </div>
  );
}
