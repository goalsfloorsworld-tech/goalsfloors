"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function CursorFireflies() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add a particle randomly (Firefly effect)
      if (Math.random() > 0.3) {
        const id = Math.random().toString(36).substr(2, 9);
        const offsetX = (Math.random() - 0.5) * 60; // Spread radius
        const offsetY = (Math.random() - 0.5) * 60;
        const newParticle = {
          id,
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
          size: Math.random() * 4 + 3, // size between 3 and 7
        };
        
        setParticles(prev => [...prev.slice(-30), newParticle]);
        
        // Remove after 1.5 second
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== id));
        }, 1500);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;
  
  // Only show in dark mode
  const currentTheme = theme === "system" ? systemTheme : theme;
  if (currentTheme !== "dark") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Fireflies */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0, x: p.x, y: p.y }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5], y: p.y - 40, x: p.x + (Math.random() - 0.5) * 20 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute rounded-full bg-amber-300 shadow-[0_0_12px_3px_rgba(252,211,77,0.8)]"
            style={{
              width: p.size,
              height: p.size,
              left: 0,
              top: 0
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
