"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CODE_LINES = [
  "import { allocateMemory } from '@system/kernel';",
  "import { decryptPayload } from '@crypto/aes-256';",
  "",
  "async function init() {",
  "  console.log('Allocating memory blocks...');",
  "  const ptr = allocateMemory(1024 * 64);",
  "  ",
  "  console.log('Decrypting core logic...');",
  "  const data = await decryptPayload(ptr, '0x8A7B6C5D4E3F2A1');",
  "  ",
  "  if (data.isValid) {",
  "    console.log('System online.');",
  "    return data.mount();",
  "  }",
  "  throw new Error('CRITICAL: Decryption failed.');",
  "}",
  "",
  "init().catch(console.error);"
];

export function CodeCompiler() {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < CODE_LINES.length) {
        setLines(prev => [...prev, CODE_LINES[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-obsidian-light border border-emerald-500/20 rounded-sm font-mono text-xs overflow-hidden shadow-inner">
      <div className="flex px-3 py-1 bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-500/50 justify-between">
        <span>sys_init.rs</span>
        <span>[COMPILING]</span>
      </div>
      <div className="p-4 flex flex-col gap-1 h-64 overflow-y-auto">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex"
          >
            <span className="text-emerald-500/30 w-6 shrink-0 select-none">{i + 1}</span>
            <span className="text-emerald-400 whitespace-pre">{line}</span>
          </motion.div>
        ))}
        {lines.length < CODE_LINES.length && (
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-6 w-2 h-3 bg-emerald-500 mt-1"
          />
        )}
      </div>
    </div>
  );
}
