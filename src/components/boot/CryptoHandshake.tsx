"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DEPENDENCIES = [
  "MOUNTING PARSERS...",
  "REAL-TIME SOCKET CHANNELS...",
  "ESTABLISHING SECURE UPLINK...",
  "DECRYPTING ASSETS...",
  "LOADING NEURAL NETWORKS..."
];

export function CryptoHandshake({ onComplete }: { onComplete: () => void }) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (textIndex >= DEPENDENCIES.length) {
      setTimeout(onComplete, 500);
      return;
    }
    
    const targetText = DEPENDENCIES[textIndex];
    let iter = 0;
    
    const interval = setInterval(() => {
      setDisplayText(targetText.split("").map((char, index) => {
        if (index < iter) return targetText[index];
        return Math.random().toString(16)[2].toUpperCase();
      }).join(""));
      
      if (iter >= targetText.length) {
        clearInterval(interval);
        setTimeout(() => setTextIndex(prev => prev + 1), 200);
      }
      iter += 1;
    }, 20); // Fast decryption speed
    
    return () => clearInterval(interval);
  }, [textIndex, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="font-mono text-emerald-400 text-sm tracking-widest uppercase flex flex-col items-center justify-center"
    >
      <div className="mb-2 text-xs text-emerald-600/60">CRYPTOGRAPHIC HANDSHAKE INITIATED</div>
      <div className="h-6 overflow-hidden">
        <span className="glow-text">{displayText}</span>
      </div>
    </motion.div>
  );
}
