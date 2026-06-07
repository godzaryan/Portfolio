"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const chars = "!<>-_\\/[]{}—=+*^?#________";
const targetText = "[ SYS.LOG ] © 2026 AKASH KUMAR // ALL RIGHTS RESERVED.";

export function CyberFooter() {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scramble = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayText((prev) =>
          targetText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return targetText[index];
              }
              // Preserve spaces
              if (letter === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= targetText.length) {
          clearInterval(interval);
        }
        
        iteration += 1 / 2; // Decrypt speed
      }, 30);
    };

    // Start loop
    const loop = () => {
      scramble();
      // Schedule next scramble randomly between 8 to 12 seconds
      timeoutId = setTimeout(loop, Math.random() * 4000 + 8000);
    };

    // Initial delay before first scramble
    timeoutId = setTimeout(loop, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="absolute bottom-4 left-0 w-full flex justify-center items-center z-50 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-[10px] sm:text-xs font-mono text-emerald-500/40 tracking-[0.2em] flex items-center gap-4"
      >
        <span className="w-4 sm:w-12 h-[1px] bg-emerald-500/20" />
        <span className="bg-emerald-950/40 px-4 py-1 border border-emerald-500/20 backdrop-blur-sm rounded-sm">
          {displayText}
        </span>
        <span className="w-4 sm:w-12 h-[1px] bg-emerald-500/20" />
      </motion.div>
    </div>
  );
}
