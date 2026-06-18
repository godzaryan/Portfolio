"use client";

import { motion } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import { useEffect, useState } from "react";
import { GithubActivity } from "@/components/modules/GithubActivity";

export function RightPanel() {
  const { skills: initialSkills } = portfolioData;
  const [skills, setSkills] = useState(initialSkills);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const CACHE_KEY = "github_languages_godzaryan";
        const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours
        
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TIME) {
            setSkills(prev => ({ ...prev, languages: data }));
            setLoading(false);
            return;
          }
        }

        const res = await fetch("https://api.github.com/users/godzaryan/repos?per_page=100");
        if (!res.ok) throw new Error("Failed to fetch repos for languages");
        
        const repos = await res.json();
        const langCounts: Record<string, number> = {};
        
        repos.forEach((repo: any) => {
          if (repo.language && !repo.fork) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });

        const sortedLanguages = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([lang]) => lang);

        if (sortedLanguages.length > 0) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: sortedLanguages,
            timestamp: Date.now()
          }));
          setSkills(prev => ({ ...prev, languages: sortedLanguages }));
        }
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      className="hidden lg:flex flex-col w-72 h-full gap-2 relative z-10"
    >
      <GithubActivity />

      {/* Skills Matrix Box */}
      <div className="flex-1 flex flex-col border border-emerald-500/30 bg-glass p-2 lg:p-3 terminal-border shadow-lg relative overflow-hidden group hover:border-emerald-500/60 transition-colors">
        <div className="flex items-center justify-between text-emerald-500/50 text-xs font-mono mb-1">
          <span>[ CAPABILITY_MATRIX ]</span>
          {loading && (
            <div className="w-2 h-2 bg-emerald-500/80 animate-pulse rounded-sm" />
          )}
        </div>
        
        <div className="flex flex-col gap-1.5 overflow-hidden">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-1">
              <span className="text-xs font-bold text-emerald-400/80 uppercase font-mono tracking-wider flex items-center gap-2">
                &gt; {category}
                {category === "languages" && !loading && (
                  <span className="text-[8px] text-emerald-500/40 font-normal tracking-normal border border-emerald-500/20 px-1 rounded-sm">LIVE</span>
                )}
              </span>
              <div className="flex flex-wrap gap-1">
                {items.map((skill) => (
                  <span 
                    key={skill} 
                    className="text-[10px] font-mono border border-emerald-500/20 bg-emerald-950/30 px-1 py-[2px] text-emerald-500/70 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors cursor-default"
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
