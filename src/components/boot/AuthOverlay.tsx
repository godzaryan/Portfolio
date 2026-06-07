"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Fingerprint } from "lucide-react";

export function AuthOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence timing
    const t1 = setTimeout(() => setStep(1), 800); // Start hash matching
    const t2 = setTimeout(() => setStep(2), 1600); // Authorized
    const t3 = setTimeout(onComplete, 2400); // Complete

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.4, type: "spring" }}
      className="flex gap-6 items-center border border-emerald-500/40 bg-obsidian/90 p-6 backdrop-blur-xl relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)] rounded-sm w-[450px]"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />

      {/* Left: Biometric Scanner */}
      <div className="relative w-24 h-24 flex-shrink-0 border-[2px] border-emerald-500/30 rounded-full flex items-center justify-center bg-emerald-950/20 overflow-hidden">
        {/* Rotating Outer Ring */}
        <motion.div 
          className="absolute inset-0 border border-dashed border-emerald-500/50 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        <Fingerprint 
          size={48} 
          className={`transition-colors duration-300 ${step >= 2 ? "text-neon-accent drop-shadow-[0_0_8px_#34D399]" : "text-emerald-500/50"}`} 
        />

        {/* Laser Scanner */}
        {step < 2 && (
          <motion.div 
            className="absolute left-0 right-0 h-[2px] bg-neon-accent shadow-[0_0_10px_#34D399]"
            animate={{ top: ["-10%", "110%", "-10%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Flash on success */}
        {step === 2 && (
          <motion.div 
            className="absolute inset-0 bg-neon-accent mix-blend-overlay"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
      
      {/* Right: Data Readout */}
      <div className="flex flex-col flex-1 h-24 justify-center font-mono relative z-10">
        <div className="text-xs text-emerald-500/60 mb-2 border-b border-emerald-500/20 pb-1">
          BIOMETRIC_AUTH_SYS_v2
        </div>

        <div className="text-sm tracking-wider mb-1 text-emerald-400">
          {step === 0 && <span className="animate-pulse">AWAITING INPUT...</span>}
          {step === 1 && <span className="text-emerald-300">ANALYZING HASH...</span>}
          {step === 2 && <span className="text-neon-accent glow-text font-bold">ACCESS GRANTED</span>}
        </div>

        <div className="text-[10px] text-emerald-500/50 flex flex-col gap-0.5">
          <div className="flex justify-between">
            <span>ID_TARGET:</span>
            <span className="text-emerald-400">GUEST_USER</span>
          </div>
          <div className="flex justify-between">
            <span>CLEARANCE:</span>
            {step < 2 ? (
              <span className="text-emerald-500/50">PENDING</span>
            ) : (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="text-neon-accent"
              >
                LEVEL_0
              </motion.span>
            )}
          </div>
          <div className="flex justify-between">
            <span>MATCH_CONFIDENCE:</span>
            {step === 0 ? (
              <span>--%</span>
            ) : step === 1 ? (
              <span className="animate-pulse text-emerald-400">CALCULATING</span>
            ) : (
              <span className="text-neon-accent">99.9%</span>
            )}
          </div>
        </div>
      </div>

      {/* Success Corner Brackets */}
      <motion.div 
        className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-accent"
        animate={{ opacity: step === 2 ? 1 : 0.2 }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-accent"
        animate={{ opacity: step === 2 ? 1 : 0.2 }}
      />
    </motion.div>
  );
}
