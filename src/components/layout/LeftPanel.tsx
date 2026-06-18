"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import Image from "next/image";

export function LeftPanel() {
  const { about, socials } = portfolioData;
  const [hoveredPanel, setHoveredPanel] = useState<'identity' | 'bio' | null>(null);
  const [metrics, setMetrics] = useState({ projects: "15+", commits: "1.2K+" });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const CACHE_KEY = "github_metrics_godzaryan";
        const CACHE_TIME = 60 * 60 * 1000; // 1 hour

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TIME) {
            setMetrics(data);
            return;
          }
        }

        const currentYear = new Date().getFullYear();
        const [userRes, commitsRes] = await Promise.all([
          fetch("https://api.github.com/users/godzaryan"),
          fetch(`https://api.github.com/search/commits?q=author:godzaryan+committer-date:>${currentYear}-01-01`)
        ]);

        let projects = "15+";
        let commits = "1.2K+";

        if (userRes.ok) {
          const userData = await userRes.json();
          projects = userData.public_repos.toString();
        }

        if (commitsRes.ok) {
          const commitsData = await commitsRes.json();
          commits = commitsData.total_count.toString();
        }

        const newData = { projects, commits };
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }));
        
        setMetrics(newData);
      } catch (err) {
        console.error("Failed to fetch Github metrics", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-72 h-full gap-2 relative z-10"
    >
      {/* Avatar Box */}
      <motion.div layout className="relative w-full aspect-square flex-shrink-0 border border-emerald-500/30 bg-emerald-950/20 p-2 overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/50" />
        
        <div className="relative w-full h-full border border-emerald-500/20 overflow-hidden group-hover:border-emerald-500/50 transition-colors duration-500">
          <Image
            src="/matrix_avatar_v2.png"
            alt="Matrix Avatar"
            fill
            sizes="250px"
            priority
            className="object-cover opacity-90 group-hover:scale-105 transition-all duration-700 filter contrast-125 saturate-150 absolute inset-0 z-10"
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
          flex: hoveredPanel === 'identity' ? "1 0 auto" : "0 0 auto",
          opacity: hoveredPanel === 'bio' ? 0.6 : 1,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="flex flex-col flex-shrink-0 border border-emerald-500/30 bg-glass p-3 lg:p-4 terminal-border shadow-lg overflow-hidden cursor-default transition-colors hover:border-emerald-500/60"
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
          <div className="text-xs font-mono flex items-center gap-2 mt-2">
            <span className="opacity-50 text-emerald-500/70">STATUS:</span>
            <span className="text-emerald-400">{about.status.replace(/_/g, " ")}</span>
          </div>
        </motion.div>

        {/* Expanded Identity Info */}
        <motion.div
          animate={{ 
            height: hoveredPanel === 'identity' ? "auto" : 0, 
            opacity: hoveredPanel === 'identity' ? 1 : 0,
            marginTop: hoveredPanel === 'identity' ? 16 : 0,
            paddingTop: hoveredPanel === 'identity' ? 16 : 0,
          }}
          className="border-t border-emerald-500/20 text-[10px] lg:text-[11px] font-mono text-emerald-500/70 flex flex-col gap-2 overflow-hidden flex-shrink-0"
        >
          <div className="flex justify-between">
            <span className="opacity-50">EDUCATION:</span>
            <span>B.TECH (4TH YEAR)</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-50">WORKSPACE:</span>
            <span>VS CODE / WINDOWS</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-50">LEARNING:</span>
            <span>PROMPT ENGINEERING</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bio Box */}
      <motion.div
        layout
        onMouseEnter={() => setHoveredPanel('bio')}
        onMouseLeave={() => setHoveredPanel(null)}
        animate={{
          flex: hoveredPanel === 'identity' ? "0 0 auto" : "1 0 auto",
          opacity: hoveredPanel === 'identity' ? 0.6 : 1,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        className="flex flex-col flex-shrink-0 border border-emerald-500/30 bg-glass p-3 lg:p-4 terminal-border shadow-lg relative overflow-hidden cursor-default transition-colors hover:border-emerald-500/60"
      >
        <motion.div layout="position" className="text-emerald-500/50 text-[10px] lg:text-xs font-mono flex-shrink-0 h-4 mb-1 lg:mb-2">
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
          <p className="text-[11px] lg:text-xs font-mono text-emerald-500/70 leading-relaxed">
            {about.bio}
          </p>
        </motion.div>

        {/* Key Metrics (Always Visible) */}
        <div className="mt-4 flex flex-col gap-1 pt-2 border-t border-emerald-500/20 text-[10px] lg:text-[11px] font-mono text-emerald-500/70 flex-shrink-0">
           <span className="opacity-50">KEY_METRICS:</span>
           <div className="flex justify-between"><span>PROJECTS_DEVELOPED</span><span>{metrics.projects}</span></div>
           <div className="flex justify-between"><span>COMMITS_THIS_YEAR</span><span>{metrics.commits}</span></div>
           <div className="flex justify-between"><span>YEARS_WORKED</span><span>5</span></div>
        </div>

        {/* Expanded Bio Info */}
        <motion.div
          animate={{ 
            height: hoveredPanel === 'bio' ? "auto" : 0, 
            opacity: hoveredPanel === 'bio' ? 1 : 0,
            marginTop: hoveredPanel === 'bio' ? 4 : 0,
            paddingTop: hoveredPanel === 'bio' ? 4 : 0
          }}
          className="border-t border-emerald-500/20 text-[10px] lg:text-[11px] font-mono text-emerald-500/70 overflow-hidden flex-shrink-0"
        >
          <div className="mb-1 text-emerald-500/40 animate-pulse">DECRYPTING_MODULES...</div>
          <p className="leading-snug">{(about as any).extendedBio}</p>
        </motion.div>
        
        {/* Socials */}
        <motion.div
          animate={{ 
            height: hoveredPanel === 'bio' ? "auto" : 0, 
            opacity: hoveredPanel === 'bio' ? 1 : 0,
            marginTop: hoveredPanel === 'bio' ? 8 : 0,
            paddingTop: hoveredPanel === 'bio' ? 4 : 0
          }}
          className="flex flex-col gap-1 overflow-hidden flex-shrink-0 mt-auto"
        >
          <a href={socials.github} target="_blank" rel="noreferrer" className="text-[10px] lg:text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
            <span className="opacity-50">[{">"}]</span> GITHUB_UPLINK
          </a>
          {socials.youtube && (
            <a href={socials.youtube} target="_blank" rel="noreferrer" className="text-[10px] lg:text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
              <span className="opacity-50">[{">"}]</span> YT_BROADCAST
            </a>
          )}
          <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-[10px] lg:text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
            <span className="opacity-50">[{">"}]</span> INSTA_FEED
          </a>
          <a href={socials.discord} target="_blank" rel="noreferrer" className="text-[10px] lg:text-xs font-mono text-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-2 cursor-pointer w-fit">
            <span className="opacity-50">[{">"}]</span> DISCORD_NODE
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
