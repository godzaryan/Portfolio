"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import Image from "next/image";

export function LeftPanel() {
  const { about, socials } = portfolioData;
  const [hoveredPanel, setHoveredPanel] = useState<'identity' | 'bio' | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-72 h-full gap-4 relative z-10"
    >
      {/* Avatar Box */}
      <motion.div layout className="relative w-full aspect-square flex-shrink-0 border border-emerald-500/30 bg-emerald-950/20 p-2 overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50" />
        
        <div className="relative w-full h-full border border-emerald-500/20 overflow-hidden group-hover:border-emerald-500/50 transition-colors duration-500">
          <Image
            src="/real_avatar_v2.jpg"
            alt="Real Avatar"
            fill
            className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 absolute inset-0 z-0"
          />
          <Image
            src="/matrix_avatar_v2.png"
            alt="Matrix Avatar"
            fill
            className="object-cover opacity-80 group-hover:opacity-0 group-hover:scale-105 transition-all duration-700 filter contrast-125 saturate-150 absolute inset-0 z-10 mix-blend-screen"
          />
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none z-20" />
        </div>
      </motion.div>

      {/* Identity Box */}
      <motion.div
        layout
        onMouseEnter={() => setHoveredPanel('identity')}
        onMouseLeave={() => setHoveredPanel(null)}
        animate={{
          flex: hoveredPanel === 'identity' ? 1 : hoveredPanel === null ? 0 : 0,
          minHeight: hoveredPanel === 'bio' ? '54px' : hoveredPanel === null ? '120px' : 'auto',
          opacity: hoveredPanel === 'bio' ? 0.6 : 1,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg overflow-hidden cursor-default hover:border-emerald-500/60 transition-colors"
      >
        <motion.div layout="position" className="text-emerald-500/50 text-xs font-mono mb-2 flex items-center gap-2 flex-shrink-0">
          <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          ID_CARD // USER
        </motion.div>

        <AnimatePresence>
          {hoveredPanel !== 'bio' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-shrink-0"
            >
              <h1 className="text-xl font-bold tracking-widest text-emerald-400 mb-1 uppercase whitespace-nowrap">
                {about.name}
              </h1>
              <div className="text-sm text-emerald-500/80 font-mono mb-2 whitespace-nowrap">
                &gt; {about.role}
              </div>
              <div className="text-xs text-emerald-500/50 font-mono flex items-center gap-2">
                <span className="opacity-50">LOC:</span> {about.location}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hoveredPanel === 'identity' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 pt-4 border-t border-emerald-500/20 text-xs font-mono text-emerald-500/70 flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <span className="opacity-50">STATUS:</span>
                <span className="text-emerald-400">{about.status.replace(/_/g, " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">CLEARANCE:</span>
                <span>LEVEL 5</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">ENCRYPTION:</span>
                <span>RSA-4096</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">UPTIME:</span>
                <span>99.9%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bio Box */}
      <motion.div
        layout
        onMouseEnter={() => setHoveredPanel('bio')}
        onMouseLeave={() => setHoveredPanel(null)}
        animate={{
          flex: hoveredPanel === 'bio' ? 1 : hoveredPanel === null ? 1 : 0,
          minHeight: hoveredPanel === 'identity' ? '54px' : 'auto',
          opacity: hoveredPanel === 'identity' ? 0.6 : 1,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg relative overflow-hidden cursor-default hover:border-emerald-500/60 transition-colors"
      >
        <motion.div layout="position" className="text-emerald-500/50 text-xs font-mono mb-2 flex-shrink-0">
          [ SYSTEM_OBJECTIVE ]
        </motion.div>

        <AnimatePresence>
          {hoveredPanel !== 'identity' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-mono text-emerald-500/70 leading-relaxed"
            >
              {about.bio}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hoveredPanel === 'bio' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 pt-4 border-t border-emerald-500/20 text-xs font-mono text-emerald-500/70"
            >
              <div className="mb-2 text-emerald-500/40 animate-pulse">DECRYPTING_MODULES...</div>
              <p>Specializing in full-stack architecture, distributed systems, and real-time socket communication.</p>
              
              <div className="mt-4 flex flex-col gap-2 border-t border-emerald-500/10 pt-4">
                 <span className="opacity-50">KEY_METRICS:</span>
                 <div className="flex justify-between"><span>PROJECTS_SHIPPED</span><span>42</span></div>
                 <div className="flex justify-between"><span>COFFEE_CONSUMED</span><span>ERR_OVERFLOW</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {hoveredPanel !== 'identity' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-auto pt-4 flex flex-col gap-2"
            >
              <a href={socials.github} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
                <span className="opacity-50">[{">"}]</span> GITHUB_UPLINK
              </a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
                <span className="opacity-50">[{">"}]</span> LINKEDIN_NODE
              </a>
              <a href={`mailto:${socials.email}`} className="text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
                <span className="opacity-50">[{">"}]</span> SECURE_COMMS
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
