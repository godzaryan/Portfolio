"use client";

import { useState } from "react";
import { BootSequence } from "@/components/boot/BootSequence";
import { TerminalContainer } from "@/components/terminal/TerminalContainer";
import { TerminalPrompt } from "@/components/terminal/TerminalPrompt";
import { DynamicRenderer } from "@/components/terminal/DynamicRenderer";
import { TerminalLayout } from "@/lib/ai/schema";
import { MouseTrailer } from "@/components/effects/MouseTrailer";
import { LeftPanel } from "@/components/layout/LeftPanel";
import { RightPanel } from "@/components/layout/RightPanel";
import { CyberFooter } from "@/components/effects/CyberFooter";
import { GlobalGlitch } from "@/components/effects/GlobalGlitch";
import { SearchProvider } from "@/components/context/SearchContext";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [layoutData, setLayoutData] = useState<TerminalLayout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCommand = async (prompt: string) => {
    const cmd = prompt.trim().toLowerCase();
    if (cmd === "clear" || cmd === "home" || cmd === "exit" || cmd === "reset") {
      setLayoutData(null);
      return;
    }

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
        theme: "crimson",
        animationCurve: "glitch",
        message: "CRITICAL ERROR: AI Uplink failed. Connection refused or timed out.",
        components: [
          { type: "text", content: "ERROR 503 / 500: SERVICE UNAVAILABLE\n\nDIAGNOSTICS:\n1. If you just deployed to Vercel, verify that your Environment Variables (GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY) are configured in the Vercel Project Settings.\n2. Vercel deployments do not automatically inherit your local .env files.\n3. Re-deploy the project after adding the keys." }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-obsidian text-foreground p-4 flex flex-col items-center justify-center relative overflow-hidden cursor-crosshair">
      {/* Global Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="scanline-overlay" />
      
      <MouseTrailer />

      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      
      {bootComplete && (
        <SearchProvider>
          <div className="flex w-full h-[85vh] gap-6 z-10 relative px-4 lg:px-8">
            <LeftPanel />
            <div className="flex-1 min-w-0 h-full">
              <TerminalContainer className="!h-full !max-w-none">
                <DynamicRenderer layoutData={layoutData} isLoading={isLoading} />
                <TerminalPrompt onSend={handleCommand} isLoading={isLoading} />
              </TerminalContainer>
            </div>
            <RightPanel />
          </div>
        </SearchProvider>
      )}

      {bootComplete && (
        <>
          <CyberFooter />
          <GlobalGlitch />
        </>
      )}
    </main>
  );
}
