"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export function AuthOverlay({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center border border-emerald-500/30 bg-obsidian/80 p-8 backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse-slow" />
      
      <div className="w-16 h-16 border-2 border-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        <div className="w-12 h-12 border-t-2 border-neon-accent rounded-full animate-spin" />
      </div>
      
      <div className="text-emerald-400 font-mono text-xl tracking-widest mb-2">GUEST PROFILE SCAN</div>
      <div className="text-emerald-500/60 font-mono text-sm">VERIFYING PROTOCOLS...</div>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, ease: "linear" }}
        className="h-1 bg-neon-accent mt-6 shadow-[0_0_10px_#34D399]"
      />
      <div className="w-full flex justify-between mt-2 text-[10px] text-emerald-500/50 font-mono">
        <span>0x000</span>
        <span>0xFFFF</span>
      </div>
    </motion.div>
  );
}
