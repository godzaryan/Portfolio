"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import { useEffect, useState } from "react";

export function RightPanel() {
  const { skills, about } = portfolioData;
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memUsage, setMemUsage] = useState(45);

  // Simulate system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 10);
      setMemUsage(Math.floor(Math.random() * 10) + 40);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-72 h-full gap-4 relative z-10"
    >
      {/* System Status Box */}
      <div className="flex flex-col border border-emerald-500/30 bg-glass p-4 terminal-border shadow-lg group hover:border-emerald-500/60 transition-colors">
        <div className="text-emerald-500/50 text-xs font-mono mb-3 flex items-center justify-between">
          <span>[ SYS_MONITOR ]</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-emerald-500/80 animate-pulse rounded-sm" />
            <div className="w-2 h-2 bg-emerald-500/50 rounded-sm" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 font-mono text-xs text-emerald-500/70">
          <div className="flex justify-between items-center">
            <span>CPU_LOAD</span>
            <span>{cpuUsage}%</span>
          </div>
          <div className="w-full h-1 bg-emerald-950/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500/80" 
              animate={{ width: `${cpuUsage}%` }} 
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span>MEM_ALLOC</span>
            <span>{memUsage}%</span>
          </div>
          <div className="w-full h-1 bg-emerald-950/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500/80" 
              animate={{ width: `${memUsage}%` }} 
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>

          <div className="mt-4 pt-2 border-t border-emerald-500/20 flex justify-between items-center">
            <span>STATUS</span>
            <span className="text-emerald-400">{about.status.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

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
