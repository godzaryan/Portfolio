"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/components/context/SearchContext";

interface TerminalPromptProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function TerminalPrompt({ onSend, isLoading }: TerminalPromptProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setQuery } = useSearch();

  // Auto-focus logic
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend(input.trim());
        setInput("");
        setQuery("");
      }
    }
  };

  return (
    <div className="relative mt-4 flex items-center border border-emerald-500/30 bg-obsidian-light p-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
      <div className="text-emerald-500 font-mono mr-3 flex items-center shrink-0">
        <span className="text-emerald-500/50 mr-2">root@devil:~#</span>
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setQuery(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={cn(
          "flex-1 bg-transparent border-none outline-none text-emerald-50 font-mono placeholder-emerald-500/30",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        placeholder="Enter command or natural language request (e.g. 'Show projects in bento layout')..."
        autoComplete="off"
        spellCheck="false"
      />
      
      <button
        onClick={() => {
          if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput("");
            setQuery("");
          }
        }}
        disabled={isLoading || !input.trim()}
        className="ml-2 p-2 text-emerald-500 hover:bg-emerald-500/20 rounded-sm transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>

      {/* Cybernetic accent line */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-emerald-500 to-transparent w-1/3" />
    </div>
  );
}
