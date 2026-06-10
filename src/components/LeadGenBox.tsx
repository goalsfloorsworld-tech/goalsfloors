"use client";

import { ChevronRight, Gift, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function LeadGenBox({ onClick, isLatestBanner = true }: { onClick?: () => void, isLatestBanner?: boolean }) {
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const checkState = () => {
      const storedStateStr = localStorage.getItem("goalsfloors_offer_state");
      if (storedStateStr) {
        const storedState = JSON.parse(storedStateStr);
        const elapsedSeconds = Math.floor((Date.now() - storedState.startedAt) / 1000);
        
        // If past 3 minutes but within 24 hours, show expired state
        if (elapsedSeconds >= 180 && elapsedSeconds < 24 * 60 * 60) {
          setIsExpired(true);
          setTimeLeft(24 * 60 * 60 - elapsedSeconds);
        } else {
          setIsExpired(false);
        }
      }
    };
    
    checkState();
    const interval = setInterval(checkState, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isExpired) {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    return (
      <button 
        onClick={onClick}
        className={`w-full max-w-[85%] bg-slate-900 border border-slate-700/50 rounded-2xl p-4 mt-2 shadow-lg relative overflow-hidden cursor-pointer hover:border-slate-500 transition-colors group text-left ${!isLatestBanner ? 'opacity-50 grayscale pointer-events-none' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
               <h4 className="text-xs font-bold text-slate-400">VIP Offer Expired</h4>
               <p className="text-[10px] text-slate-500">Next code in {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`w-full max-w-[85%] bg-slate-900 border border-amber-500/30 rounded-2xl p-4 mt-2 shadow-lg relative overflow-hidden cursor-pointer hover:border-amber-500 transition-colors group text-left ${!isLatestBanner ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-bold text-white">Claim Your 30% Off & VIP Consultation</h4>
        </div>
        <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}
