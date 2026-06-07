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
    // Fetch actual IP location
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data && data.latitude && data.longitude) {
          setLocation({
            lat: data.latitude,
            lng: data.longitude,
            city: data.city || "UNKNOWN",
            country: data.country_name || "UNKNOWN"
          });
        }
      })
      .catch(console.error);

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
      
      <div className="relative w-72 h-64 border border-emerald-500/20 bg-emerald-950/10 p-2 overflow-hidden">
        {/* World Map Container */}
        <div className="w-full h-full opacity-60">
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
                    <circle r={2} fill="#34D399" />
                    <circle r={8} fill="transparent" stroke="#34D399" strokeWidth={1} strokeDasharray="2,2" className="animate-spin-slow" />
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
            <span>LAT: {location.lat.toFixed(4)}° N</span>
            <span>LNG: {location.lng.toFixed(4)}° E</span>
            <span className="max-w-[120px] truncate">LOC: {location.city}, {location.country}</span>
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
