"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dummyProfiles } from '@/data/ui-demo-data';

export default function MasterDetailLayout() {
  const [activeProfile, setActiveProfile] = useState(dummyProfiles[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-slate-950 font-sans">
      {/* Left Sidebar - 30% */}
      <div className="w-full md:w-[30%] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 md:h-[calc(100vh-70px)] md:sticky md:top-[70px] md:overflow-y-auto flex-shrink-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">Profile Variants</h2>
          <p className="text-sm text-gray-500 mt-1">Select a profile to view specs</p>
        </div>
        
        <div className="flex flex-col">
          {dummyProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => {
                setActiveProfile(profile);
                setActiveImageIndex(0);
              }}
              className={`w-fulltext-left px-6 py-5 border-b border-gray-100 dark:border-gray-800/50 transition-all flex flex-col items-start ${
                activeProfile.id === profile.id
                  ? 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-l-amber-500'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'
              }`}
            >
              <span className={`text-lg font-semibold ${activeProfile.id === profile.id ? 'text-amber-700 dark:text-amber-500' : 'text-gray-700 dark:text-gray-300'}`}>
                {profile.name}
              </span>
              <span className="text-sm text-gray-400 mt-1">{profile.length} • {profile.width}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Main Area - 70% */}
      <div className="w-full md:w-[70%] p-4 md:p-12 pb-24 h-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProfile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto bg-white dark:bg-slate-900 w-full rounded-sm shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Top Carousel Area */}
            <div className="relative w-full h-64 md:h-[400px] bg-gray-100 dark:bg-slate-800 group">
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeProfile.images[activeImageIndex]}
                    alt={activeProfile.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Left/Right Navigation Arrows */}
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? activeProfile.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === activeProfile.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                {activeProfile.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Spec Sheet Area */}
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                    {activeProfile.name}
                  </h1>
                  <p className="text-lg text-gray-500 mt-2 font-medium tracking-wide">Premium Architectural Grade Profile</p>
                </div>
                <div className="mt-6 md:mt-0 text-left md:text-right">
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Retail Price</div>
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                    {activeProfile.price}
                  </div>
                  <div className="text-sm text-gray-400 mt-1 flex gap-2 items-center justify-end">
                    <span className="line-through">{activeProfile.mrp}</span>
                    <span className="text-amber-500 font-semibold">{activeProfile.discount}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-l-4 border-amber-500 pl-3">
                Specification Matrix
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <SpecRow label="Material" value={activeProfile.material} />
                <SpecRow label="Length" value={activeProfile.length} />
                <SpecRow label="Width" value={activeProfile.width} />
                <SpecRow label="Thickness" value={activeProfile.thickness} />
                <SpecRow label="Weight" value={activeProfile.weight} />
                <SpecRow label="Packing" value={activeProfile.packing} />
                <SpecRow label="Packing Type" value={activeProfile.packingType} />
                <SpecRow label="Application" value={activeProfile.application} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-3">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <span className="text-base font-medium text-gray-900 dark:text-gray-200">{value}</span>
  </div>
);
