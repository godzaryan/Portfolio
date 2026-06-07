"use client";

import { useState, useEffect } from "react";

export function GlobalGlitch() {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerGlitch = () => {
      setIsGlitching(true);
      document.body.classList.add("global-glitch-active");

      setTimeout(() => {
        setIsGlitching(false);
        document.body.classList.remove("global-glitch-active");
      }, Math.random() * 200 + 150); // Glitch duration: 150ms - 350ms

      // Schedule next glitch between 30s and 60s
      timeoutId = setTimeout(triggerGlitch, Math.random() * 30000 + 30000);
    };

    // Initial scheduling after boot
    timeoutId = setTimeout(triggerGlitch, Math.random() * 30000 + 30000);

    return () => {
      clearTimeout(timeoutId);
      document.body.classList.remove("global-glitch-active");
    };
  }, []);

  if (!isGlitching) return null;

  return (
    <>
      {/* Heavy TV Static Overlay */}
      <div 
        className="fixed inset-0 z-[9999] pointer-events-none opacity-30 mix-blend-difference"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Horizontal RGB split tearing lines */}
      <div className="fixed inset-0 z-[9998] pointer-events-none flex flex-col justify-between opacity-50 mix-blend-overlay">
        <div className="w-[150vw] h-12 bg-emerald-500 translate-x-12" />
        <div className="w-[150vw] h-20 bg-rose-600 -translate-x-20 mt-32" />
        <div className="w-[150vw] h-6 bg-blue-500 translate-x-8 mb-40" />
      </div>
      
      {/* V-SYNC Tracking Roll Bar */}
      <div 
        className="fixed inset-0 z-[9997] pointer-events-none mix-blend-difference opacity-70"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2) 10%, rgba(0,0,0,0.8) 50%, rgba(255,255,255,0.2) 90%, transparent)',
          animation: 'tracking-roll 0.15s linear infinite'
        }}
      />
    </>
  );
}
