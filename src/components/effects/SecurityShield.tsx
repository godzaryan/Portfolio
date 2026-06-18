"use client";

import { useEffect } from "react";

export function SecurityShield() {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Keyboard Shortcuts for DevTools & Zoom
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      const isF12 = e.key === "F12";
      const isCtrlShiftI = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i";
      const isCtrlShiftJ = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j";
      const isCtrlShiftC = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c";
      const isCtrlU = e.ctrlKey && e.key.toLowerCase() === "u";

      if (isF12 || isCtrlShiftI || isCtrlShiftJ || isCtrlU || isCtrlShiftC) {
        e.preventDefault();
        // Clear everything and go to blank page to clear logs
        document.body.innerHTML = "";
        window.location.replace("about:blank");
      }

      // Prevent Keyboard Zoom (Ctrl + '+', '-', '=')
      if (e.ctrlKey && (e.key === "=" || e.key === "-" || e.key === "+")) {
        e.preventDefault();
      }
    };

    // Prevent Trackpad/Mouse Wheel Zoom (Ctrl + Scroll)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // 3. Disable Text Selection via CSS dynamically on body
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // 4. Anti-Debugger Trap (Detects if DevTools is opened via other means)
    const detectDevTools = () => {
      const start = performance.now();
      debugger; // If devtools is open, this pauses execution
      const end = performance.now();
      if (end - start > 100) {
        // DevTools is open
        document.body.innerHTML = "";
        window.location.replace("about:blank");
      }
    };
    
    // 5. Dimension mismatch detection (catches docked devtools immediately on load)
    const checkDimensions = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        document.body.innerHTML = "";
        window.location.replace("about:blank");
      }
    };

    // Run checks periodically
    const interval = setInterval(() => {
      detectDevTools();
      checkDimensions();
    }, 1000);

    // Check immediately on load
    checkDimensions();

    // Attach listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", checkDimensions);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", checkDimensions);
      clearInterval(interval);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);

  return null;
}
