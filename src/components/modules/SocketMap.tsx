"use client";

import { motion } from "framer-motion";

export function SocketMap() {
  const nodes = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10,
    active: Math.random() > 0.5,
  }));

  return (
    <div className="relative w-full h-64 border border-emerald-500/30 bg-obsidian-light p-4 overflow-hidden rounded-sm">
      <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-500/70">
        NETWORK_TOPOLOGY // WSS://REALTIME-CLUSTER
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => (
          nodes.slice(i + 1).map((target, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke={node.active && target.active ? "#34D399" : "rgba(16, 185, 129, 0.2)"}
              strokeWidth={node.active && target.active ? 1 : 0.5}
              strokeDasharray={node.active && target.active ? "none" : "4 4"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))
        ))}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-3 h-3 rounded-full border border-emerald-400 bg-obsidian flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ top: `${node.y}%`, left: `${node.x}%`, x: "-50%", y: "-50%" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: node.id * 0.1 }}
        >
          {node.active && (
            <motion.div 
              className="w-1.5 h-1.5 bg-neon-accent rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
      ))}

      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neon-accent flex gap-4">
        <span>NODES: {nodes.length}</span>
        <span>ACTIVE: {nodes.filter(n => n.active).length}</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  );
}
