"use client";

import { motion } from "framer-motion";
import { Instagram, Play } from "lucide-react";

interface LiveProjectShowcaseProps {
  videoUrl: string;
  instagramUrl?: string;
}

export default function LiveProjectShowcase({ videoUrl, instagramUrl = "https://www.instagram.com/goalsfloors/" }: LiveProjectShowcaseProps) {
  return (
    <section className="bg-slate-950 py-20 md:py-32 overflow-hidden relative border-y border-slate-900 transition-colors duration-300">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Column: Text & CTA */}
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 text-amber-500 font-semibold mb-6 px-3 py-1 bg-amber-500/10 rounded-full text-xs uppercase tracking-widest">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Live Project Feed
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              See Our Work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                in Real Action
              </span>
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto md:mx-0">
              Watch live site installations and front elevation projects straight from our Instagram highlights. See why top architects and luxury homeowners trust Goals Floors.
            </p>
            
            <motion.a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <Instagram className="w-6 h-6 relative z-10 group-hover:text-white transition-colors duration-300" />
              <span className="text-base relative z-10 group-hover:text-white transition-colors duration-300">
                Watch on Instagram
              </span>
            </motion.a>
          </motion.div>

          {/* Right Column: iPhone Mockup */}
          <div className="w-full md:w-1/2 flex justify-center items-center py-10 md:py-0">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotateZ: [0, 1, 0, -1, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5, 
                  ease: "easeInOut" 
                }}
                className="relative z-10"
              >
                {/* iPhone Case - Adjusted Size for Desktop Fit */}
                <div className="relative w-[240px] md:w-[280px] aspect-[9/19.5] rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[10px] border-slate-800 bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                  
                  {/* Notch / Dynamic Island */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-30 flex items-center justify-center">
                    <div className="w-10 h-1 bg-slate-900 rounded-full opacity-50" />
                  </div>

                  {/* Media Content */}
                  <div className="absolute inset-0 bg-slate-900">
                    <video 
                      key={videoUrl}
                      src={videoUrl}
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Media Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-300" />
                    
                    {/* Floating Icons */}
                    <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between pointer-events-none">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border border-white bg-slate-800" />
                        <div className="w-6 h-6 rounded-full border border-white bg-amber-600" />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[8px] text-white font-medium">
                        <Play className="w-2 h-2 fill-white" />
                        Live Feed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reflection Detail */}
                <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] border border-white/10 pointer-events-none z-20" />
              </motion.div>

              {/* Decorative Background Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-600/5 blur-[80px] rounded-full z-0" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
