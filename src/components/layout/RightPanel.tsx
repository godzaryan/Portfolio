"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import { useEffect, useState } from "react";
import { GithubActivity } from "@/components/modules/GithubActivity";

export function RightPanel() {
  const { skills } = portfolioData;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-72 h-full gap-4 relative z-10"
    >
      <GithubActivity />

      {/* Skills Matrix Box */}
      <div className="flex-1 flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg relative overflow-hidden group hover:border-emerald-500/60 transition-colors">
        <div className="text-emerald-500/50 text-xs font-mono mb-4">
          [ CAPABILITY_MATRIX ]
        </div>
        
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-1">
              <span className="text-xs font-bold text-emerald-400/80 uppercase font-mono tracking-wider">
                &gt; {category}
              </span>
              <div className="flex flex-wrap gap-1">
                {items.map((skill) => (
                  <span 
                    key={skill} 
                    className="text-[10px] font-mono border border-emerald-500/20 bg-emerald-950/30 px-1.5 py-0.5 text-emerald-500/70 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
