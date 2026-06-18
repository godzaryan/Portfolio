"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/config/portfolio";
import { useSearch } from "@/components/context/SearchContext";

function DesignGallery({ images, title }: { images: string[], title: string }) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    setLoadedCount(0);
    if (!images || images.length === 0) return;

    let mounted = true;
    let count = 0;

    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (mounted) {
          count++;
          setLoadedCount(count);
        }
      };
      img.onerror = () => {
        if (mounted) {
          count++;
          setLoadedCount(count);
        }
      }
    });

    return () => { mounted = false; };
  }, [images]);

  const percentage = images?.length > 0 ? Math.floor((loadedCount / images.length) * 100) : 100;
  const isLoaded = loadedCount === images?.length;

  if (!images || images.length === 0) {
     return (
        <div className="w-full aspect-video border border-emerald-500/30 bg-obsidian relative flex items-center justify-center overflow-hidden mb-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
           <div className="text-emerald-500/30 flex flex-col items-center gap-2">
             <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-2" />
             <div className="text-xs tracking-widest">[ AWAITING_IMAGE_DATA ]</div>
           </div>
           <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-overlay opacity-30" />
        </div>
     );
  }

  return (
    <>
      {!isLoaded ? (
        <div className="w-full aspect-video border border-emerald-500/30 bg-obsidian relative flex flex-col items-center justify-center overflow-hidden mb-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin z-10" />
          <div className="text-xs font-mono tracking-widest text-emerald-400 z-10">
            [ DOWNLOADING_ASSETS: {percentage}% ]
          </div>
          <div className="w-48 h-1.5 bg-emerald-950 rounded-full overflow-hidden z-10 relative">
             <motion.div className="absolute left-0 top-0 bottom-0 bg-emerald-500" animate={{ width: `${percentage}%` }} transition={{ ease: "linear", duration: 0.2 }} />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-overlay opacity-30" />
        </div>
      ) : (
        <div className={`grid gap-2 mb-6 ${images.length === 1 ? 'grid-cols-1' : images.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.map((src, i) => {
             const isSquare = title.toLowerCase().includes("logo");
             return (
               <div 
                 key={i} 
                 onClick={() => setLightboxImage(src)}
                 className={`relative ${isSquare ? 'aspect-square' : 'aspect-video'} border border-emerald-500/30 bg-obsidian cursor-pointer overflow-hidden group shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-400 transition-colors`}
               >
                  <img src={src} alt={`${title} ${i}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
               </div>
             )
          })}
        </div>
      )}

      <AnimatePresence>
         {lightboxImage && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/95 backdrop-blur-sm p-4 lg:p-12"
           >
             <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 lg:top-10 lg:right-10 text-emerald-500 hover:text-emerald-400 font-mono text-xs tracking-widest border border-emerald-500/50 hover:border-emerald-400 px-4 py-2 bg-emerald-950/50 transition-colors z-[110]">
                [ CLOSE_UPLINK ]
             </button>
             <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => {
                 if (e.target === e.currentTarget) setLightboxImage(null);
             }}>
               <img src={lightboxImage} alt="Fullscreen View" className="max-w-full max-h-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]" />
             </div>
           </motion.div>
         )}
      </AnimatePresence>
    </>
  )
}

function ProjectImageLoader({ src, alt }: { src: string, alt: string }) {
  const [progress, setProgress] = useState(0);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setProgress(0);
    setObjectUrl(null);

    const loadImg = async () => {
      try {
        const response = await fetch(src);
        const contentLength = response.headers.get('content-length');
        if (!contentLength) {
          const blob = await response.blob();
          if (mounted) {
            setProgress(100);
            setObjectUrl(URL.createObjectURL(blob));
          }
          return;
        }

        const total = parseInt(contentLength, 10);
        let loaded = 0;
        const reader = response.body?.getReader();
        if (!reader) {
           const blob = await response.blob();
           if (mounted) { setProgress(100); setObjectUrl(URL.createObjectURL(blob)); }
           return;
        }

        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loaded += value.length;
            if (mounted) setProgress(Math.floor((loaded / total) * 100));
          }
        }

        const blob = new Blob(chunks);
        if (mounted) setObjectUrl(URL.createObjectURL(blob));

      } catch (err) {
        if (mounted) {
           setProgress(100);
           setObjectUrl(src); // fallback
        }
      }
    };

    loadImg();
    return () => { mounted = false; };
  }, [src]);

  if (!objectUrl) {
    return (
        <div className="w-full aspect-video border border-emerald-500/30 bg-obsidian relative flex flex-col items-center justify-center overflow-hidden mt-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin z-10" />
          <div className="text-xs font-mono tracking-widest text-emerald-400 z-10">
            [ RECEIVING_TELEMETRY: {progress}% ]
          </div>
          <div className="w-48 h-1.5 bg-emerald-950 rounded-full overflow-hidden z-10 relative">
             <motion.div className="absolute left-0 top-0 bottom-0 bg-emerald-500" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.1 }} />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-overlay opacity-30" />
        </div>
    );
  }

  return (
    <div className="w-full aspect-video border border-emerald-500/30 bg-obsidian relative flex items-center justify-center overflow-hidden group mt-6 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
       <img src={objectUrl} alt={alt} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
       <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-overlay opacity-30" />
    </div>
  );
}

export function ProjectShowcase() {
  const { projects, experience, designs } = portfolioData as any;
  const { query } = useSearch();
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const [activeMode, setActiveMode] = useState<"EXPERIENCE" | "PROJECTS" | "DESIGNS">("EXPERIENCE");
  const [activeIndex, setActiveIndex] = useState(0);

  // Dynamically generate the nodes based on the selected mode
  const nodes = useMemo(() => {
    if (activeMode === "EXPERIENCE") {
      return (experience || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        type: "EXPERIENCE",
        status: e.period, 
        description: e.description,
        tech: e.tech || [],
        role: e.role,
        link: null,
        commitHash: `commit_${Math.random().toString(16).substr(2, 7)}`
      }));
    } else if (activeMode === "PROJECTS") {
      return (projects || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        type: "PROJECT",
        status: p.status, 
        description: p.description,
        tech: p.tech || [],
        role: "Lead Developer",
        link: p.link,
        image: p.image || null,
        commitHash: `commit_${Math.random().toString(16).substr(2, 7)}`
      }));
    } else {
      return (designs || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        type: "DESIGN",
        status: d.status, 
        description: d.description,
        tech: d.tech || [],
        role: "UI/UX Designer",
        images: d.images || [],
        link: d.link,
        commitHash: `commit_${Math.random().toString(16).substr(2, 7)}`
      }));
    }
  }, [activeMode, experience, projects, designs]);

  const activeNode = nodes[activeIndex];

  // Scramble effect for the right pane
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (!activeNode) return;
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*_*+";
    const targetText = activeNode.description;
    
    setDisplayText(targetText.replace(/./g, () => chars[Math.floor(Math.random() * chars.length)]));

    const interval = setInterval(() => {
      setDisplayText(targetText.split("").map((letter: string, index: number) => {
        if(index < iteration) {
          return targetText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if(iteration >= targetText.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 20);
    
    return () => clearInterval(interval);
  }, [activeNode]);

  // Search Engine Navigation Logic
  useEffect(() => {
    if (!query || query.trim().length < 2) return;
    
    const searchLower = query.toLowerCase();
    
    const checkMatch = (item: any) => {
      const matchText = `${item.title} ${item.description} ${item.role} ${(item.tech || []).join(" ")}`.toLowerCase();
      return matchText.includes(searchLower);
    };

    const searchInMode = (mode: string, dataList: any[]) => {
      const idx = dataList.findIndex(checkMatch);
      if (idx !== -1) {
        if (activeMode !== mode) setActiveMode(mode as any);
        if (activeIndex !== idx) setActiveIndex(idx);
        // Scroll into view smoothly
        setTimeout(() => {
          itemRefs.current[`${mode}-${idx}`]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return true;
      }
      return false;
    };

    // Try current mode first
    let currentNodes = activeMode === "EXPERIENCE" ? experience : activeMode === "PROJECTS" ? projects : designs;
    if (searchInMode(activeMode, currentNodes || [])) return;

    // Try other modes
    if (activeMode !== "EXPERIENCE" && searchInMode("EXPERIENCE", experience || [])) return;
    if (activeMode !== "PROJECTS" && searchInMode("PROJECTS", projects || [])) return;
    if (activeMode !== "DESIGNS" && searchInMode("DESIGNS", designs || [])) return;

  }, [query, experience, projects, designs, activeMode, activeIndex]);

  if (!nodes.length) return null;

  return (
    <div className="w-full h-full flex flex-col p-2 lg:p-4 text-emerald-500 font-mono overflow-hidden">
      
      {/* Mode Switcher / Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4 border-b border-emerald-500/30 pb-4">
        <div className="flex gap-2 lg:gap-4">
          <button 
            onClick={() => { setActiveMode("EXPERIENCE"); setActiveIndex(0); }}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] lg:text-xs border transition-all relative overflow-hidden group ${
              activeMode === "EXPERIENCE" 
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]" 
                : "bg-obsidian border-emerald-500/30 text-emerald-500/50 hover:border-emerald-500 hover:text-emerald-500"
            }`}
          >
            {activeMode === "EXPERIENCE" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />}
            <span className="tracking-widest uppercase">/var/log/experience</span>
          </button>

          <button 
            onClick={() => { setActiveMode("PROJECTS"); setActiveIndex(0); }}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] lg:text-xs border transition-all relative overflow-hidden group ${
              activeMode === "PROJECTS" 
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]" 
                : "bg-obsidian border-emerald-500/30 text-emerald-500/50 hover:border-emerald-500 hover:text-emerald-500"
            }`}
          >
            {activeMode === "PROJECTS" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />}
            <span className="tracking-widest uppercase">~/bin/projects.exe</span>
          </button>

          <button 
            onClick={() => { setActiveMode("DESIGNS"); setActiveIndex(0); }}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] lg:text-xs border transition-all relative overflow-hidden group ${
              activeMode === "DESIGNS" 
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]" 
                : "bg-obsidian border-emerald-500/30 text-emerald-500/50 hover:border-emerald-500 hover:text-emerald-500"
            }`}
          >
            {activeMode === "DESIGNS" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />}
            <span className="tracking-widest uppercase">~/assets/designs.ui</span>
          </button>
        </div>

        <a 
          href="/resume.pdf"
          download
          className="hidden md:flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-obsidian text-xs font-bold tracking-widest transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.9)] border border-emerald-400 animate-pulse-slow"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">DOWNLOAD_RESUME</span>
          <span className="relative z-10 animate-bounce font-black">↓</span>
        </a>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden min-h-0">
        
        {/* Timeline (Left) */}
        <div className="w-full md:w-1/2 flex flex-col overflow-y-auto custom-scrollbar border border-emerald-500/20 bg-emerald-950/10 p-4 relative">
          
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-emerald-500/20 z-0" />
          
          <div className="flex flex-col gap-6 relative z-10">
            {nodes.map((node: any, idx: number) => {
              const isActive = activeIndex === idx;
              const isSearchMatch = query && query.trim().length >= 2 && isActive;

              return (
                <div 
                  key={node.id} 
                  ref={(el) => { itemRefs.current[`${activeMode}-${idx}`] = el; }}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-start gap-4 cursor-pointer group transition-all duration-500 ${isSearchMatch ? "scale-[1.02]" : ""}`}
                >
                  {/* The Node Dot */}
                  <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center -ml-2">
                    <motion.div 
                      layoutId="active-node-dot"
                      className={`relative z-10 w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        isActive 
                          ? isSearchMatch 
                              ? "bg-emerald-300 border-emerald-200 shadow-[0_0_25px_rgba(16,185,129,1)] scale-125" 
                              : "bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                          : "bg-obsidian border-emerald-500/50 group-hover:border-emerald-400"
                      }`}
                    />
                  </div>

                  {/* Node Content */}
                  <div className={`flex-1 flex flex-col border p-2 transition-all duration-500 ${
                    isActive 
                      ? isSearchMatch
                        ? "bg-emerald-500/20 border-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]"
                        : "bg-emerald-500/10 border-emerald-500/30" 
                      : "border-transparent group-hover:bg-emerald-500/5"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] ${isActive ? "text-emerald-300" : "text-emerald-500/50"}`}>
                        {node.commitHash}
                      </span>
                    </div>
                    <div className={`text-sm lg:text-base font-bold uppercase tracking-wider transition-colors duration-500 ${
                      isActive 
                        ? isSearchMatch 
                          ? "text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                          : "text-emerald-400" 
                        : "text-emerald-500/80 group-hover:text-emerald-400"
                    }`}>
                      {node.title}
                    </div>
                    <div className="text-[10px] text-emerald-500/50 mt-1 uppercase">
                      {node.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector (Right) */}
        <div className="w-full md:w-1/2 flex flex-col border border-emerald-500/30 bg-emerald-950/20 p-4 lg:p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-30" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6 flex-shrink-0">
                <div>
                  <div className="text-[10px] opacity-50 mb-1 tracking-widest flex items-center gap-2">
                    NODE_INSPECTOR // {activeNode.type}
                  </div>
                  <h2 className="text-xl lg:text-3xl font-bold tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    {activeNode.title}
                  </h2>
                  {activeNode.role && (
                    <div className="text-xs text-emerald-500/80 mt-1">&gt; {activeNode.role}</div>
                  )}
                </div>
                <div className="px-2 py-1 text-[10px] border border-emerald-400/50 bg-emerald-400/10 text-emerald-400 tracking-wider">
                  {activeNode.status}
                </div>
              </div>

              {/* Data / Details */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2">
                {activeMode === "DESIGNS" ? (
                  <DesignGallery images={(activeNode as any).images} title={activeNode.title} />
                ) : (
                  <>
                    <div className="text-[10px] opacity-50 mb-2 tracking-widest">MEMORY_DUMP:</div>
                    <p className="text-sm lg:text-base leading-relaxed text-emerald-100/90 min-h-[80px]">
                      {displayText}
                    </p>
                    {activeMode === "PROJECTS" && (activeNode as any).image && (
                      <ProjectImageLoader src={(activeNode as any).image} alt={activeNode.title} />
                    )}
                  </>
                )}

                <div className="mt-8">
                  <div className="text-[10px] opacity-50 mb-3 tracking-widest">
                    {activeMode === "EXPERIENCE" ? "CORE_SKILLS:" : activeMode === "DESIGNS" ? "SOFTWARE:" : "TECH_STACK:"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.tech.map((t: string, i: number) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="px-2 py-1 text-xs border border-emerald-500/30 bg-obsidian text-emerald-400/90 cursor-default hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button for Projects */}
              {activeMode === "PROJECTS" && activeNode.link && (
                <div className="mt-4 pt-4 border-t border-emerald-500/20 flex-shrink-0">
                  <a 
                    href={activeNode.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-400 text-sm transition-all group w-fit"
                  >
                    <span className="tracking-widest font-bold">INITIALIZE UPLINK</span>
                    <span className="group-hover:translate-x-1 transition-transform text-emerald-500/50 group-hover:text-emerald-400">[{">"}]</span>
                  </a>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
