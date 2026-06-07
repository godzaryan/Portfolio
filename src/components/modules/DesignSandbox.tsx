"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export function DesignSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState({ blur: 0, sepia: 0, hue: 0 });

  // Simulate a WebGL / complex canvas renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Clear
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Apply filters based on state
      ctx.filter = `blur(${params.blur}px) sepia(${params.sepia}%) hue-rotate(${params.hue}deg)`;

      // Draw futuristic geometric shapes
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(time * 0.1);

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const radius = 50 + i * 20 + Math.sin(time + i) * 10;
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(time * 10 + i * 40) % 360}, 100%, 50%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
      
      // Wireframe mesh
      ctx.filter = "none";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [params]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border border-emerald-500/20 bg-emerald-950/10 rounded-sm">
      <div className="flex-1 relative">
        <div className="absolute top-2 left-2 text-[10px] font-mono text-emerald-500 z-10 bg-obsidian px-1 border border-emerald-500/30">
          RENDER_TARGET_01
        </div>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
          className="w-full h-full object-cover border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        />
        <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none" />
      </div>
      
      <div className="w-full md:w-64 flex flex-col gap-4 font-mono text-xs text-emerald-500">
        <div className="text-emerald-400 mb-2 border-b border-emerald-500/30 pb-2">SHADER CONTROLS</div>
        
        <div className="flex flex-col gap-1">
          <label className="flex justify-between">
            <span>DEPTH_BLUR</span>
            <span>{params.blur}px</span>
          </label>
          <input 
            type="range" 
            min="0" max="10" 
            value={params.blur}
            onChange={(e) => setParams(p => ({...p, blur: Number(e.target.value)}))}
            className="w-full accent-neon-accent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex justify-between">
            <span>CINEMATIC_SEPIA</span>
            <span>{params.sepia}%</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" 
            value={params.sepia}
            onChange={(e) => setParams(p => ({...p, sepia: Number(e.target.value)}))}
            className="w-full accent-neon-accent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="flex justify-between">
            <span>HUE_SHIFT</span>
            <span>{params.hue}°</span>
          </label>
          <input 
            type="range" 
            min="0" max="360" 
            value={params.hue}
            onChange={(e) => setParams(p => ({...p, hue: Number(e.target.value)}))}
            className="w-full accent-neon-accent"
          />
        </div>
      </div>
    </div>
  );
}
