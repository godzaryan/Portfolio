"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import Image from "next/image";

export function LeftPanel() {
  const { about, socials } = portfolioData;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-72 h-full gap-4 relative z-10"
    >
      {/* Avatar Box */}
      <div className="relative w-full aspect-square border border-emerald-500/30 bg-emerald-950/20 p-2 overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50" />
        
        <div className="relative w-full h-full border border-emerald-500/20 overflow-hidden group-hover:border-emerald-500/50 transition-colors duration-500">
          {/* Real Avatar Image (Fades IN on hover) */}
          <Image
            src="/real_avatar_v2.jpg"
            alt="Real Avatar"
            fill
            className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 absolute inset-0 z-0"
          />
          {/* Matrix Avatar Image (Fades OUT on hover) */}
          <Image
            src="/matrix_avatar_v2.png"
            alt="Matrix Avatar"
            fill
            className="object-cover opacity-80 group-hover:opacity-0 group-hover:scale-105 transition-all duration-700 filter contrast-125 saturate-150 absolute inset-0 z-10 mix-blend-screen"
          />
          {/* Scanline overlay over image */}
          <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none z-20" />
        </div>
      </div>

      {/* Identity Box */}
      <div className="flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg group hover:border-emerald-500/60 transition-colors">
        <div className="text-emerald-500/50 text-xs font-mono mb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          ID_CARD // USER
        </div>
        <h1 className="text-xl font-bold tracking-widest text-emerald-400 mb-1 uppercase">
          {about.name}
        </h1>
        <div className="text-sm text-emerald-500/80 font-mono mb-2">
          &gt; {about.role}
        </div>
        <div className="text-xs text-emerald-500/50 font-mono flex items-center gap-2">
          <span className="opacity-50">LOC:</span> {about.location}
        </div>
      </div>

      {/* Bio Box */}
      <div className="flex-1 flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg relative overflow-hidden group hover:border-emerald-500/60 transition-colors">
        <div className="text-emerald-500/50 text-xs font-mono mb-2">
          [ SYSTEM_OBJECTIVE ]
        </div>
        <p className="text-sm font-mono text-emerald-500/70 leading-relaxed">
          {about.bio}
        </p>
        
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <a href={socials.github} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer">
            <span className="opacity-50">[{">"}]</span> GITHUB_UPLINK
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer">
            <span className="opacity-50">[{">"}]</span> LINKEDIN_NODE
          </a>
          <a href={`mailto:${socials.email}`} className="text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer">
            <span className="opacity-50">[{">"}]</span> SECURE_COMMS
          </a>
        </div>
      </div>
    </motion.div>
  );
}
