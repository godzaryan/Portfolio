"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface LocationData {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export function GeoTracker({ onComplete }: { onComplete: () => void }) {
  const [locked, setLocked] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const fallbackLocation = {
      lat: 22.5726,
      lng: 88.3639,
      city: "Kolkata",
      country: "India"
    };

    // Fetch actual IP location
    fetch("https://ipapi.co/json/")
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => {
        if (data && data.latitude && data.longitude) {
          setLocation({
            lat: data.latitude,
            lng: data.longitude,
            city: data.city || "UNKNOWN",
            country: data.country_name || "UNKNOWN"
          });
        } else {
          setLocation(fallbackLocation);
        }
      })
      .catch((err) => {
        // Suppress error overlay by using console.warn and setting fallback
        console.warn("[GeoTracker] Uplink to IPAPI failed. Using fallback coordinates.");
        setLocation(fallbackLocation);
      });

    const timer1 = setTimeout(() => {
      setLocked(true);
      // Trigger zoom animation
      setZoom(4);
    }, 1500);

    const timer2 = setTimeout(onComplete, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  // Center the map on the user's location when available
  useEffect(() => {
    if (location) {
      setCenter([location.lng, location.lat]);
    }
  }, [location]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="text-xs font-mono text-emerald-500/70 mb-4 tracking-widest">
        {locked ? "[ TARGET LOCKED : SECURE ]" : "[ SCANNING SECTORS ]"}
      </div>
      
      <div className="relative w-72 h-64 border border-emerald-500/30 bg-emerald-950/20 p-2 overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
        
        {/* Retro Crosshairs Base */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-full h-[1px] bg-emerald-500" />
          <div className="absolute h-full w-[1px] bg-emerald-500" />
          <motion.div 
            className="absolute w-16 h-16 border border-emerald-500 rounded-full"
            animate={{ scale: locked ? 1.5 : [1, 1.2, 1], opacity: locked ? 0 : 1 }}
            transition={{ duration: 2, repeat: locked ? 0 : Infinity }}
          />
        </div>

        {/* Radar Sweep during scanning */}
        {!locked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden mix-blend-screen opacity-60">
            <motion.div
              className="w-[200%] h-[200%] rounded-full"
              style={{ background: "conic-gradient(from 0deg, transparent 75%, rgba(16,185,129,0.8) 100%)" }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          </div>
        )}

        {/* World Map Container */}
        <div className="w-full h-full opacity-70">
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 100 }}
            width={800}
            height={600}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup 
              center={center} 
              zoom={locked ? zoom : 1}
              // Animate the zoom using simple transition string
              className="transition-all duration-1000 ease-in-out"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {location && locked && (
                <Marker coordinates={[location.lng, location.lat]}>
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <motion.circle r={2} fill="#34D399" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
                    <circle r={6} fill="transparent" stroke="#34D399" strokeWidth={1} strokeDasharray="2,2" className="animate-spin-slow" />
                    <circle r={10} fill="transparent" stroke="#10B981" strokeWidth={0.5} opacity={0.5} />
                    <motion.path d="M-12,0 L12,0 M0,-12 L0,12" stroke="#34D399" strokeWidth={0.5} opacity={0.8} />
                  </motion.g>
                </Marker>
              )}
            </ZoomableGroup>
          </ComposableMap>
        </div>
        
        {locked && location && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-2 right-2 text-[10px] font-mono text-neon-accent flex flex-col glow-text bg-obsidian/80 p-1 border border-emerald-500/30"
          >
            <span className="mb-1 border-b border-emerald-500/30 pb-1">UPLINK ESTABLISHED</span>
            <span className="opacity-80">LAT: {location.lat.toFixed(4)}° N</span>
            <span className="opacity-80">LNG: {location.lng.toFixed(4)}° E</span>
            <span className="max-w-[120px] truncate opacity-80">LOC: {location.city}, {location.country}</span>
            <span>SYS: ONLINE</span>
          </motion.div>
        )}
      </div>
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-emerald-500/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-emerald-500/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-emerald-500/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-emerald-500/50" />
    </div>
  );
}
