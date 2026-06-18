"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TerminalLayout } from "@/lib/ai/schema";
import { SocketMap } from "@/components/modules/SocketMap";
import { CodeCompiler } from "@/components/modules/CodeCompiler";
import { DesignSandbox } from "@/components/modules/DesignSandbox";
import { ProjectShowcase } from "@/components/modules/ProjectShowcase";
import { cn } from "@/lib/utils";

interface DynamicRendererProps {
  layoutData: TerminalLayout | null;
  isLoading: boolean;
}

export function DynamicRenderer({ layoutData, isLoading }: DynamicRendererProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-emerald-500/50">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-neon-accent rounded-full animate-pulse" />
          AWAITING_SYS_RESPONSE...
        </motion.div>
      </div>
    );
  }

  if (!layoutData) {
    return (
      <div className="flex-1 overflow-hidden w-full h-full">
        <ProjectShowcase />
      </div>
    );
  }

  const { layout, theme, animationCurve, components, message } = layoutData;

  const getAnimationProps = (): any => {
    switch (animationCurve) {
      case "snappy": return { type: "spring", stiffness: 400, damping: 25 };
      case "bounce": return { type: "spring", stiffness: 300, damping: 10 };
      case "glitch": return { type: "tween", duration: 0.2, ease: "anticipate" };
      case "smooth":
      default: return { type: "spring", stiffness: 200, damping: 20 };
    }
  };

  const layoutClass = cn("w-full h-full p-2 flex", {
    "flex-col gap-4": layout === "default" || layout === "list",
    "grid grid-cols-1 md:grid-cols-2 gap-4": layout === "split",
    "grid grid-cols-1 md:grid-cols-3 gap-4 grid-rows-[auto_1fr]": layout === "bento",
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Terminal Message Header */}
      <motion.div 
        className="mb-4 font-mono text-sm border-l-2 border-emerald-500 pl-3 py-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span className="text-emerald-500/50 mr-2">[SYS]:</span>
        <span className="text-emerald-50">{message}</span>
      </motion.div>

      {/* Dynamic Grid / Layout Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(layoutData)} // Force re-render on data change for animations
            className={layoutClass}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={getAnimationProps()}
          >
            {components.map((comp, idx) => {
              const bentoClass = layout === "bento" && idx === 0 ? "col-span-1 md:col-span-3 lg:col-span-2 row-span-2" : "";
              
              return (
                <motion.div
                  key={idx}
                  className={cn("bg-emerald-950/20 border border-emerald-500/20 rounded-sm p-4 overflow-hidden relative group", bentoClass)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, ...getAnimationProps() }}
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {comp.type === "text" && (
                    <div className="font-mono text-sm text-emerald-100/80 whitespace-pre-wrap">
                      {comp.content || JSON.stringify(comp.props, null, 2)}
                    </div>
                  )}

                  {comp.type === "project_card" && (
                    <div className="flex flex-col h-full font-sans">
                      <h3 className="text-emerald-400 font-mono text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-accent rounded-none" />
                        {comp.props?.title || "UNKNOWN_PROJECT"}
                      </h3>
                      <p className="text-emerald-100/70 text-sm mb-4 flex-1">
                        {comp.props?.description || "No data available."}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {comp.props?.tech?.map((t: string) => (
                          <span key={t} className="text-[10px] font-mono px-2 py-1 bg-obsidian border border-emerald-500/30 text-emerald-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.type === "socket_map" && <SocketMap />}
                  {comp.type === "code_compiler" && <CodeCompiler />}
                  {comp.type === "design_sandbox" && <DesignSandbox />}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
