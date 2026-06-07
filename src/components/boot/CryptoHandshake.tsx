"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DEPENDENCIES = [
  "MOUNTING KERNEL PARSERS...",
  "ESTABLISHING WSS:// CHANNELS...",
  "BYPASSING SECURITY FIREWALLS...",
  "DECRYPTING NEURAL ASSETS...",
  "INITIALIZING OS PROTOCOLS..."
];

const HEX_CHARS = "0123456789ABCDEF0101010101+-*/";

function generateMatrix(rows: number, cols: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)])
  );
}

export function CryptoHandshake({ onComplete }: { onComplete: () => void }) {
  const [textIndex, setTextIndex] = useState(0);
  const [matrix, setMatrix] = useState<string[][]>(() => 
    Array.from({ length: 5 }, () => Array(30).fill("0"))
  );
  const [iter, setIter] = useState(0);

  // Initialize random matrix on client mount to avoid SSR hydration mismatch
  useEffect(() => {
    setMatrix(generateMatrix(5, 30));
  }, []);

  // Background randomizer for non-resolved rows
  useEffect(() => {
    const interval = setInterval(() => {
      setMatrix(prev => prev.map((row, rIdx) => 
        rIdx >= textIndex 
          ? row.map(char => Math.random() > 0.8 ? HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)] : char)
          : row
      ));
    }, 50);
    return () => clearInterval(interval);
  }, [textIndex]);

  // Decryption sequencer
  useEffect(() => {
    if (textIndex >= DEPENDENCIES.length) {
      setTimeout(onComplete, 600);
      return;
    }
    
    const targetText = DEPENDENCIES[textIndex].padEnd(30, " ");
    
    const interval = setInterval(() => {
      setIter(prev => {
        const next = prev + 1;
        if (next >= targetText.length) {
          clearInterval(interval);
          setTimeout(() => {
            setTextIndex(i => i + 1);
            setIter(0);
          }, 200); // Pause before next line
        }
        return next;
      });
      
      // Inject correct characters into the matrix
      setMatrix(prev => {
        const newMatrix = [...prev];
        newMatrix[textIndex] = newMatrix[textIndex].map((char, cIdx) => {
          if (cIdx < iter) return targetText[cIdx];
          return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        });
        return newMatrix;
      });

    }, 20); // Extremely fast decoding

    return () => clearInterval(interval);
  }, [textIndex, iter, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      className="relative font-mono flex flex-col items-center justify-center p-8 bg-obsidian-light border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-sm overflow-hidden w-[400px]"
    >
      {/* Background Rotating Geometry */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 border-[1px] border-dashed border-emerald-500 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 border-[2px] border-dotted border-neon-accent rounded-full"
        />
      </div>

      <div className="relative z-10 w-full flex justify-between items-end mb-4 border-b border-emerald-500/30 pb-2">
        <div className="text-xs text-emerald-500/80 tracking-widest font-bold">
          [ AUTH_MATRIX_DECODER ]
        </div>
        <div className="text-[10px] text-emerald-400/50 animate-pulse">
          v9.9.4
        </div>
      </div>

      {/* The Data Matrix */}
      <div className="relative z-10 w-full text-left bg-black/50 p-3 rounded-sm border border-emerald-500/10 h-40 flex flex-col justify-center">
        {matrix.map((row, rIdx) => {
          const isCurrent = rIdx === textIndex;
          const isDone = rIdx < textIndex;

          return (
            <div key={rIdx} className="flex tracking-[0.2em] text-[10px]">
              {row.map((char, cIdx) => {
                const isDecoded = isDone || (isCurrent && cIdx < iter);
                
                return (
                  <span 
                    key={cIdx} 
                    className={cn(
                      "transition-colors duration-75 inline-block w-2 text-center",
                      isDecoded ? "text-neon-accent glow-text font-bold" : "text-emerald-500/30",
                      isCurrent && cIdx === iter && "bg-neon-accent text-obsidian" // The cursor block
                    )}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}

        {/* Scanline overlay for matrix */}
        <motion.div 
          className="absolute left-0 right-0 h-[2px] bg-neon-accent/50 shadow-[0_0_10px_#34D399]"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        />
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 w-full mt-6 flex items-center gap-3">
        <div className="text-[10px] text-emerald-500/50">SYS_MEM</div>
        <div className="flex-1 h-1 bg-emerald-950/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-accent shadow-[0_0_8px_#34D399]"
            initial={{ width: "0%" }}
            animate={{ width: `${(textIndex / DEPENDENCIES.length) * 100}%` }}
            transition={{ type: "spring", damping: 15 }}
          />
        </div>
        <div className="text-[10px] text-emerald-400">
          {Math.floor((textIndex / DEPENDENCIES.length) * 100)}%
        </div>
      </div>
    </motion.div>
  );
}
