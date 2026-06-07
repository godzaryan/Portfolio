"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CryptoHandshake } from "./CryptoHandshake";
import { GeoTracker } from "./GeoTracker";
import { AuthOverlay } from "./AuthOverlay";

function BackgroundDataStream() {
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    // Generate roughly 20 columns based on window width
    setColumns(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] z-0 flex justify-between">
      {columns.map((i) => (
        <motion.div
          key={i}
          className="w-4 font-mono text-[10px] text-emerald-500 leading-tight whitespace-pre break-all flex flex-col"
          initial={{ y: -1000 }}
          animate={{ y: 1000 }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * -20,
          }}
        >
          {Array.from({ length: 100 }).map(() => 
            "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
          ).join("\n")}
        </motion.div>
      ))}
    </div>
  );
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"crypto" | "geo" | "auth" | "done">("crypto");

  const handleCryptoComplete = () => setStage("geo");
  const handleGeoComplete = () => setStage("auth");
  const handleAuthComplete = () => {
    setStage("done");
    setTimeout(onComplete, 800); // Allow fade out
  };

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian text-emerald-500 overflow-hidden perspective-[1000px]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Static Noise Texture */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-50" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

          {/* CRT Vignette */}
          <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />

          {/* 3D Perspective Grid Floor */}
          <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[60vh] bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" style={{ transform: "perspective(500px) rotateX(75deg) translateY(100px) translateZ(-200px)" }} />
          
          {/* 3D Perspective Grid Ceiling */}
          <div className="absolute top-0 left-[-50%] right-[-50%] h-[60vh] bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" style={{ transform: "perspective(500px) rotateX(-75deg) translateY(-100px) translateZ(-200px)" }} />

          {/* Falling Hex Streams */}
          <BackgroundDataStream />

          {/* Default flat cybernetic grid fallback just in case */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
          
          {/* Scanline Overlay */}
          <div className="scanline-overlay z-40 opacity-50" />
          
          <div className="relative z-20 w-full max-w-2xl px-6 flex flex-col items-center justify-center h-full drop-shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <AnimatePresence mode="wait">
              {stage === "crypto" && (
                <motion.div key="crypto" exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}>
                  <CryptoHandshake onComplete={handleCryptoComplete} />
                </motion.div>
              )}
              {stage === "geo" && (
                <motion.div key="geo" initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.1, filter: "blur(5px)" }}>
                  <GeoTracker onComplete={handleGeoComplete} />
                </motion.div>
              )}
              {stage === "auth" && (
                <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
