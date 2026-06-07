"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TerminalContainerProps {
  children: ReactNode;
  className?: string;
}

export function TerminalContainer({ children, className }: TerminalContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className={cn(
        "relative w-full max-w-5xl mx-auto h-[85vh] flex flex-col",
        "bg-glass terminal-border shadow-2xl overflow-hidden rounded-sm",
        className
      )}
    >
      {/* Decorative Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-500/20 bg-emerald-950/30">
        <div className="flex items-center gap-2 text-emerald-500/50 text-xs font-mono tracking-widest">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          NEXUS_OS // PORTFOLIO_SYS // V2.0.4
        </div>
        <div className="flex gap-2 opacity-50">
          <div className="w-3 h-3 border border-emerald-500 rounded-sm" />
          <div className="w-3 h-3 border border-emerald-500 rounded-sm" />
          <div className="w-3 h-3 border border-emerald-500 rounded-sm bg-emerald-500/20" />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative p-4">
        {children}
      </div>
    </motion.div>
  );
}
