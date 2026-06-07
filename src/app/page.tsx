"use client";

import { useState } from "react";
import { BootSequence } from "@/components/boot/BootSequence";
import { TerminalContainer } from "@/components/terminal/TerminalContainer";
import { TerminalPrompt } from "@/components/terminal/TerminalPrompt";
import { DynamicRenderer } from "@/components/terminal/DynamicRenderer";
import { TerminalLayout } from "@/lib/ai/schema";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [layoutData, setLayoutData] = useState<TerminalLayout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCommand = async (prompt: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) {
        throw new Error("API Route Failed");
      }
      
      const data = await res.json();
      setLayoutData(data);
    } catch (error) {
      console.error(error);
      // Fallback manual layout on total failure
      setLayoutData({
        layout: "default",
        theme: "obsidian",
        animationCurve: "glitch",
        message: "CRITICAL ERROR: Uplink failed. Displaying cached local data.",
        components: [
          { type: "text", content: "ERROR: 503 SERVICE UNAVAILABLE" }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-obsidian text-foreground p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="scanline-overlay" />
      
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      
      {bootComplete && (
        <TerminalContainer>
          <DynamicRenderer layoutData={layoutData} isLoading={isLoading} />
          <TerminalPrompt onSend={handleCommand} isLoading={isLoading} />
        </TerminalContainer>
      )}
    </main>
  );
}
