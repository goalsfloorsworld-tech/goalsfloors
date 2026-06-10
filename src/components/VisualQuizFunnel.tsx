"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, ChevronRight, Gift } from "lucide-react";

// --- STATE MACHINE DATA ---
type ResultData = { productName: string; price: number; reason: string; };
type Option = { id: string; label: string; nextNodeId: string | null; resultData?: ResultData };
type Node = { id: string; question: string; options: Option[] };

const funnelData: Record<string, Node> = {
  root: {
    id: "root",
    question: "What are you looking to upgrade?",
    options: [
      { id: "opt_wall", label: "Wall Design", nextNodeId: "wall_look" },
      { id: "opt_floor", label: "Flooring", nextNodeId: "floor_priority" },
      { id: "opt_out", label: "Outdoor Area", nextNodeId: "outdoor_need" },
      { id: "opt_ceil", label: "Ceiling Design", nextNodeId: "ceil_priority" }
    ]
  },
  // --- WALL PATH ---
  wall_look: {
    id: "wall_look",
    question: "Which look do you prefer?",
    options: [
      { id: "wl_modern", label: "Modern & Clean", nextNodeId: "wall_install" },
      { id: "wl_moulding", label: "Elegant Moulding", nextNodeId: "wall_install" },
      { id: "wl_stone", label: "Luxury Stone", nextNodeId: null, resultData: { productName: "Cobra PU Stone", price: 1490, reason: "The absolute pinnacle of luxury wall design." } },
      { id: "wl_premium", label: "Premium Deco", nextNodeId: null, resultData: { productName: "Upfit Panels", price: 1200, reason: "Exquisite architectural texture and premium finish." } }
    ]
  },
  wall_install: {
    id: "wall_install",
    question: "Where will it be installed?",
    options: [
      { id: "wi_living", label: "Living / Bed", nextNodeId: "wall_budget" },
      { id: "wi_bathroom", label: "Wet Area", nextNodeId: "wall_budget" },
      { id: "wi_commercial", label: "Commercial", nextNodeId: "wall_budget" }
    ]
  },
  wall_budget: {
    id: "wall_budget",
    question: "What is your budget?",
    options: [
      { id: "wb_budget", label: "Budget", nextNodeId: null, resultData: { productName: "Primo Fluted Panels", price: 499, reason: "Great aesthetics at an affordable price point." } },
      { id: "wb_mid", label: "Mid-Range", nextNodeId: null, resultData: { productName: "Elite Fluted Panels", price: 599, reason: "Perfect balance of quality, texture, and value." } },
      { id: "wb_premium", label: "Premium", nextNodeId: null, resultData: { productName: "Metallic Fluted Series", price: 650, reason: "High-end metallic finishes for a statement look." } }
    ]
  },
  // --- FLOOR PATH ---
  floor_priority: {
    id: "floor_priority",
    question: "What matters most?",
    options: [
      { id: "fp_water", label: "Waterproof (SPC)", nextNodeId: "floor_install" },
      { id: "fp_wood", label: "Natural Wood", nextNodeId: "floor_install" },
      { id: "fp_pattern", label: "Herringbone", nextNodeId: "floor_install" },
      { id: "fp_hybrid", label: "Max Durability", nextNodeId: "floor_install" }
    ]
  },
  floor_install: {
    id: "floor_install",
    question: "Installation Area?",
    options: [
      { id: "fi_residential", label: "Residential", nextNodeId: "floor_budget" },
      { id: "fi_commercial", label: "Commercial", nextNodeId: "floor_budget" }
    ]
  },
  floor_budget: {
    id: "floor_budget",
    question: "What is your budget?",
    options: [
      { id: "fb_budget", label: "Budget", nextNodeId: null, resultData: { productName: "Classic Laminate Series", price: 90, reason: "Unbeatable value for natural wood aesthetics." } },
      { id: "fb_mid", label: "Mid-Range", nextNodeId: null, resultData: { productName: "SPC Flooring", price: 180, reason: "100% waterproof performance for everyday life." } },
      { id: "fb_premium", label: "Premium", nextNodeId: null, resultData: { productName: "Herringbone Series", price: 189, reason: "The ultimate luxury architectural flooring." } }
    ]
  },
  // --- OUTDOOR PATH ---
  outdoor_need: {
    id: "outdoor_need",
    question: "What do you need?",
    options: [
      { id: "on_louvers", label: "Privacy / Facade", nextNodeId: null, resultData: { productName: "Exterior WPC Louvers", price: 349, reason: "Weather-resistant architectural exterior styling." } },
      { id: "on_decking", label: "Outdoor Flooring", nextNodeId: null, resultData: { productName: "WPC Decking CEO Series", price: 379, reason: "Heavy-duty, weather-proof outdoor flooring." } },
      { id: "on_grass", label: "Green Landscape", nextNodeId: null, resultData: { productName: "Premium Artificial Grass", price: 45, reason: "Evergreen, zero-maintenance landscaping." } }
    ]
  },
  // --- CEILING PATH ---
  ceil_priority: {
    id: "ceil_priority",
    question: "What's your priority?",
    options: [
      { id: "cp_baffle", label: "Acoustic / Open", nextNodeId: null, resultData: { productName: "Cobra WPC Baffle Ceiling", price: 890, reason: "Modern open-plenum ceiling design." } },
      { id: "cp_timber", label: "Premium Wood", nextNodeId: null, resultData: { productName: "Cobra WPC Timber Tubes", price: 1390, reason: "Solid, luxurious architectural ceiling elements." } }
    ]
  }
};

type HistoryEntry = {
  nodeId: string;
  selectedOptionId: string | null;
  resultData?: ResultData;
};

// --- DYNAMIC DARK-MODE COLORS ---
const premiumColors = [
  { base: 'border-blue-500/50 text-blue-400 hover:bg-blue-500/10', activeBg: 'bg-blue-500 text-white border-blue-500', hex: '#3b82f6' },
  { base: 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10', activeBg: 'bg-emerald-500 text-white border-emerald-500', hex: '#10b981' },
  { base: 'border-violet-500/50 text-violet-400 hover:bg-violet-500/10', activeBg: 'bg-violet-500 text-white border-violet-500', hex: '#8b5cf6' },
  { base: 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10', activeBg: 'bg-amber-500 text-white border-amber-500', hex: '#f59e0b' },
  { base: 'border-rose-500/50 text-rose-400 hover:bg-rose-500/10', activeBg: 'bg-rose-500 text-white border-rose-500', hex: '#f43f5e' }
];

export default function VisualQuizFunnel({ onQuizComplete }: { onQuizComplete?: (path: string[], result: ResultData) => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>([{ nodeId: "root", selectedOptionId: null }]);
  const [isClaimed, setIsClaimed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history]);

  const handleSelect = (nodeId: string, option: Option) => {
    const currentIndex = history.findIndex(h => h.nodeId === nodeId);
    if (currentIndex !== history.length - 1) return;

    const newHistory = [...history];
    newHistory[currentIndex] = { ...newHistory[currentIndex], selectedOptionId: option.id };

    if (option.nextNodeId) {
      newHistory.push({ nodeId: option.nextNodeId, selectedOptionId: null });
      setHistory(newHistory);
    } else if (option.resultData) {
      newHistory[currentIndex].resultData = option.resultData;
      setHistory(newHistory);
      
      // Calculate the human-readable path
      if (onQuizComplete) {
        const path = newHistory.map(step => {
          const node = funnelData[step.nodeId];
          const selectedOpt = node.options.find(o => o.id === step.selectedOptionId);
          return selectedOpt ? selectedOpt.label : "";
        }).filter(Boolean);
        
        // Use setTimeout to allow the UI to animate the final selection before unmounting
        setTimeout(() => {
          onQuizComplete(path, option.resultData!);
        }, 600);
      }
    }
  };

  const handleReset = () => {
    setHistory([{ nodeId: "root", selectedOptionId: null }]);
    setIsClaimed(false);
  };

  const getCenters = (count: number) => {
    if (count === 1) return [200];
    if (count === 2) return [100, 300];
    if (count === 3) return [66.6, 200, 333.3];
    if (count === 4) return [50, 150, 250, 350];
    return [200];
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[400px] mx-auto bg-transparent font-sans pb-8" ref={containerRef}>
      
      {history.map((step, index) => {
        const node = funnelData[step.nodeId];
        const isLastStep = index === history.length - 1;
        const hasResult = !!step.resultData;
        const centers = getCenters(node.options.length);

        return (
          <div key={step.nodeId} className="w-full flex flex-col items-center relative animate-in fade-in slide-in-from-top-2 duration-500 fill-mode-both">
            
            {/* Branching Lines from previous selected pill to THIS row's options */}
            {index > 0 && (
              <svg viewBox="0 0 400 50" className="absolute top-0 left-0 w-full h-[50px] z-[0] overflow-visible" preserveAspectRatio="none">
                {step.selectedOptionId ? (
                   // If an option in THIS row is selected, the curved lines collapse into a single straight vertical line
                   <path 
                     d="M 200 0 L 200 50" 
                     fill="none" 
                     stroke={premiumColors[node.options.findIndex(o => o.id === step.selectedOptionId) % premiumColors.length].hex} 
                     strokeWidth="2.5" 
                     className="transition-all duration-500" 
                   />
                ) : (
                   // Otherwise, draw curved branching lines to all options in this row
                   centers.map((cx, i) => (
                     <path 
                       key={i}
                       d={`M 200 0 C 200 25, ${cx} 25, ${cx} 50`} 
                       fill="none" 
                       stroke={premiumColors[i % premiumColors.length].hex} 
                       strokeWidth="2.5"
                       className="animate-in fade-in duration-700"
                     />
                   ))
                )}
              </svg>
            )}

            {/* Question Text Overlay */}
            <div className={`${index > 0 ? 'h-[50px]' : 'mb-3 mt-2'} w-full flex items-center justify-center pointer-events-none relative z-10`}>
              <p className="text-[12px] font-medium text-white text-center px-3 py-1 bg-slate-950/10 rounded-lg shadow-sm border border-white/10 backdrop-blur-sm">
                {node.question}
              </p>
            </div>

            {/* Options Row (Perfectly Centered & Scaled to Fit 1 Line) */}
            <div className="flex flex-row flex-nowrap justify-center w-full px-0 z-10 relative">
              {node.options.map((opt, i) => {
                const isSelected = step.selectedOptionId === opt.id;
                const isFaded = step.selectedOptionId && !isSelected;
                const color = premiumColors[i % premiumColors.length];

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(node.id, opt)}
                    disabled={!isLastStep}
                    className={`
                      rounded-full text-[10.5px] sm:text-[11.5px] font-semibold transition-all duration-500 text-center outline-none whitespace-nowrap flex items-center justify-center border leading-tight
                      ${isFaded 
                        ? 'w-0 h-0 opacity-0 overflow-hidden border-0 px-0 py-0 mx-0 my-0 scale-50 pointer-events-none flex-none' 
                        : 'px-1.5 py-1.5 min-h-[36px] opacity-100 scale-100 flex-1 mx-1 my-1'
                      }
                      ${isSelected 
                        ? `max-w-[180px] ${color.activeBg} shadow-lg` 
                        : `max-w-none bg-slate-950/80 backdrop-blur-sm ${color.base}`
                      }
                    `}
                    style={isSelected ? { boxShadow: `0 4px 20px -2px ${color.hex}40` } : {}}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>


          </div>
        );
      })}
    </div>
  );
}
