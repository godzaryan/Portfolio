"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
          opacity: hoveredPanel === 'bio' ? 0.6 : 1,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg overflow-hidden cursor-default transition-colors hover:border-emerald-500/60"
      >
        <motion.div layout="position" className="text-emerald-500/50 text-xs font-mono flex items-center gap-2 flex-shrink-0 h-4">
          <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          ID_CARD // USER
        </motion.div>

        <motion.div
          animate={{ 
            height: hoveredPanel === 'bio' ? 0 : "auto", 
            opacity: hoveredPanel === 'bio' ? 0 : 1,
            marginTop: hoveredPanel === 'bio' ? 0 : 8
          }}
          className="flex-shrink-0 overflow-hidden"
        >
          <h1 className="text-xl font-bold tracking-widest text-emerald-400 mb-1 uppercase break-words">
            {about.name}
          </h1>
          <div className="text-sm text-emerald-500/80 font-mono mb-2 break-words">
            &gt; {about.role}
          </div>
          <div className="text-xs text-emerald-500/50 font-mono flex items-center gap-2">
            <span className="opacity-50">LOC:</span> {about.location}
          </div>
        </motion.div>

        <motion.div
          animate={{ 
            height: hoveredPanel === 'identity' ? "auto" : 0, 
            opacity: hoveredPanel === 'identity' ? 1 : 0,
            marginTop: hoveredPanel === 'identity' ? 16 : 0,
            paddingTop: hoveredPanel === 'identity' ? 16 : 0,
          }}
          className="border-t border-emerald-500/20 text-xs font-mono text-emerald-500/70 flex flex-col gap-2 overflow-hidden"
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
      </motion.div>

      {/* Bio Box */}
      <motion.div
        layout
        onMouseEnter={() => setHoveredPanel('bio')}
        onMouseLeave={() => setHoveredPanel(null)}
        animate={{
          flex: hoveredPanel === 'bio' ? 1 : hoveredPanel === null ? 1 : 0,
          opacity: hoveredPanel === 'identity' ? 0.6 : 1,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg relative overflow-hidden cursor-default transition-colors hover:border-emerald-500/60"
      >
        <motion.div layout="position" className="text-emerald-500/50 text-xs font-mono flex-shrink-0 h-4">
          [ SYSTEM_OBJECTIVE ]
        </motion.div>

        {/* Basic Bio */}
        <motion.div
          animate={{ 
            height: hoveredPanel === 'identity' ? 0 : "auto", 
            opacity: hoveredPanel === 'identity' ? 0 : 1,
            marginTop: hoveredPanel === 'identity' ? 0 : 8
          }}
          className="overflow-hidden flex-shrink-0"
        >
          <p className="text-sm font-mono text-emerald-500/70 leading-relaxed">
            {about.bio}
          </p>
        </motion.div>

        {/* Expanded Bio Info */}
        <motion.div
          animate={{ 
            height: hoveredPanel === 'bio' ? "auto" : 0, 
            opacity: hoveredPanel === 'bio' ? 1 : 0,
            marginTop: hoveredPanel === 'bio' ? 16 : 0,
            paddingTop: hoveredPanel === 'bio' ? 16 : 0
          }}
          className="border-t border-emerald-500/20 text-xs font-mono text-emerald-500/70 overflow-hidden flex-shrink-0"
        >
          <div className="mb-2 text-emerald-500/40 animate-pulse">DECRYPTING_MODULES...</div>
          <p>Specializing in full-stack architecture, distributed systems, and real-time socket communication.</p>
          
          <div className="mt-4 flex flex-col gap-2 border-t border-emerald-500/10 pt-4">
             <span className="opacity-50">KEY_METRICS:</span>
             <div className="flex justify-between"><span>PROJECTS_SHIPPED</span><span>42</span></div>
             <div className="flex justify-between"><span>COFFEE_CONSUMED</span><span>ERR_OVERFLOW</span></div>
          </div>
        </motion.div>
        
        {/* Socials */}
        <motion.div
          animate={{ 
            height: hoveredPanel === 'identity' ? 0 : "auto", 
            opacity: hoveredPanel === 'identity' ? 0 : 1,
            marginTop: hoveredPanel === 'identity' ? 0 : "auto",
            paddingTop: hoveredPanel === 'identity' ? 0 : 16
          }}
          className="flex flex-col gap-2 overflow-hidden flex-shrink-0"
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
      </motion.div>
    </motion.div>
  );
}
