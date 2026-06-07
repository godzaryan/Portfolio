"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CryptoHandshake } from "./CryptoHandshake";
import { GeoTracker } from "./GeoTracker";
import { AuthOverlay } from "./AuthOverlay";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"crypto" | "geo" | "auth" | "done">("crypto");

  const handleCryptoComplete = () => setStage("geo");
  const handleGeoComplete = () => setStage("auth");
  const handleAuthComplete = () => {
    setStage("done");
    setTimeout(onComplete, 500); // Allow fade out
  };

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian text-emerald-500 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Cybernetic Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="scanline-overlay" />
          
          <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center justify-center h-full">
            <AnimatePresence mode="wait">
              {stage === "crypto" && (
                <motion.div key="crypto" exit={{ opacity: 0, y: -20 }}>
                  <CryptoHandshake onComplete={handleCryptoComplete} />
                </motion.div>
              )}
              {stage === "geo" && (
                <motion.div key="geo" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
                  <GeoTracker onComplete={handleGeoComplete} />
                </motion.div>
              )}
              {stage === "auth" && (
                <motion.div key="auth">
                  <AuthOverlay onComplete={handleAuthComplete} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
