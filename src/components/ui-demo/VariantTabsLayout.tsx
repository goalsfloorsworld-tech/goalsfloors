"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dummyProfiles } from '@/data/ui-demo-data';

export default function VariantTabsLayout() {
  const [activeProfile, setActiveProfile] = useState(dummyProfiles[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-2">Technical Specifications</h2>
          <p className="text-gray-500">Select a size variant to view details</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {dummyProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => {
                setActiveProfile(profile);
                setActiveImageIndex(0);
              }}
              className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest transition-all ${
                activeProfile.id === profile.id
                  ? 'bg-gray-900 text-white dark:bg-amber-500 dark:text-gray-900 shadow-lg scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 dark:bg-slate-900 dark:text-gray-400 dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              {profile.width}
            </button>
          ))}
        </div>

        {/* Massive Spec Sheet */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProfile.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] bg-white dark:bg-slate-900"
            >
              
              {/* Left Details Section resembling Image 2 */}
              <div className="p-6 md:p-10 flex flex-col justify-center relative z-10 overflow-hidden">
                {/* Ghost Watermark */}
                <div className="absolute top-10 left-10 text-gray-50 dark:text-slate-800 font-black text-8xl -z-10 tracking-tighter select-none rotate-90 origin-top-left opacity-60">
                   {activeProfile.name.split(' ')[0]}
                </div>

                <div className="mb-8">
                  <h1 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                    {activeProfile.name}
                  </h1>
                  <div className="h-1 w-20 bg-amber-500 rounded-full mb-3"></div>
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-y-3 mb-8">
                  <SpecRow label="Material" value={activeProfile.material} />
                  <SpecRow label="Size" value={`${activeProfile.length} x ${activeProfile.width}`} />
                  <SpecRow label="Thickness" value={activeProfile.thickness} />
                  <SpecRow label="Area Per Panel" value="N/A" />
                  <SpecRow label="Packing" value={activeProfile.packing} />
                  <SpecRow label="Packing Type" value={activeProfile.packingType} />
                  <SpecRow label="Weight" value={activeProfile.weight} />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Application :</h4>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">{activeProfile.application}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Retail Price :</h4>
                  <div className="flex items-end gap-3 text-teal-600 dark:text-teal-400">
                    <span className="text-5xl font-bold tracking-tighter">{activeProfile.price.split(' ')[0]}</span>
                    <span className="text-sm font-bold uppercase tracking-widest pb-1 mb-1">{activeProfile.price.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-semibold uppercase tracking-wider">Taxes, Freight & Installation Extra</p>
                </div>
              </div>

              {/* Right Image Section */}
              <div className="relative bg-gray-100 dark:bg-slate-800 h-64 md:h-full group">
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
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Navigation Arrows */}
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? activeProfile.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === activeProfile.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Right edge stripe for design flair */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-400 to-amber-600 z-20"></div>

                {/* Image Navigation Dots */}
                <div className="absolute bottom-8 right-8 flex gap-3 z-20 pr-4">
                   {activeProfile.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-3 h-3 rounded-full border border-white transition-all ${
                        i === activeImageIndex ? 'bg-white scale-125' : 'bg-black/20 backdrop-blur-sm'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <>
    <div className="text-sm font-semibold text-gray-500">{label}</div>
    <div className="text-sm font-medium text-gray-900 dark:text-gray-200 flex"><span className="mr-3">: :</span> {value}</div>
  </>
);
