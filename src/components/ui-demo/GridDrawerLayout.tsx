"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { dummyProfiles, ProfileVariant } from '@/data/ui-demo-data';

export default function GridDrawerLayout() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans p-4 md:p-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-2">Category: Decorative Profiles</h2>
          <p className="text-gray-500">Premium architectural elements for walls and ceilings.</p>
        </div>

        {/* Grid Layout taking inspiration from Image 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {dummyProfiles.map((profile) => (
            <div key={profile.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden group">
              <div className="relative aspect-square bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={profile.images[0]}
                  alt={profile.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-sm">
                   <span className="text-[10px] text-white font-semibold tracking-wider uppercase">{profile.id.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{profile.name}</h3>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 border-dotted">
                    <span className="text-gray-500">Length</span>
                    <span className="font-semibold">{profile.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 border-dotted">
                    <span className="text-gray-500">Width</span>
                    <span className="font-semibold">{profile.width}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 border-dotted">
                    <span className="text-gray-500">Thickness</span>
                    <span className="font-semibold">{profile.thickness}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{profile.price.split(' ')[0]} <span className="text-xs font-normal text-gray-500">per pc</span></div>
                  <div className="text-xs text-gray-400 mt-1"><span className="line-through">{profile.mrp}</span> <span className="text-green-600 font-semibold">{profile.discount}</span></div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProfile(profile);
                    setActiveImageIndex(0);
                  }}
                  className="w-full bg-gray-900 hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold text-sm uppercase tracking-widest py-4 rounded-sm transition-colors mt-auto"
                >
                  View Full Specs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Drawer overlay */}
      <AnimatePresence>
        {selectedProfile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfile(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[600px] h-[100dvh] bg-white dark:bg-slate-900 z-50 shadow-2xl border-l border-gray-200 dark:border-gray-800 overflow-y-auto overscroll-contain"
              data-lenis-prevent="true"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProfile(null)}
                className="fixed top-4 right-4 z-[60] p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Carousel */}
              <div className="relative h-56 md:h-72 w-full bg-gray-100 dark:bg-slate-800 group flex-shrink-0">
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={activeImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={selectedProfile.images[activeImageIndex]}
                        alt={selectedProfile.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Left/Right Navigation Arrows */}
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? selectedProfile.images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === selectedProfile.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                    {selectedProfile.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === activeImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Specs Content */}
                <div className="p-6 md:p-10">
                  <div className="border-b border-gray-200 dark:border-gray-800 pb-6 mb-6 relative">
                     <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                      {selectedProfile.name}
                     </h1>
                     <p className="text-sm font-medium text-amber-600 tracking-widest uppercase">Specification Sheet</p>
                     
                     <div className="absolute top-0 right-0 text-gray-100 dark:text-slate-800 font-black text-8xl -z-10 tracking-tighter opacity-50 select-none">
                       {selectedProfile.id.split('-')[0].toUpperCase()}
                     </div>
                  </div>

                  <div className="grid grid-cols-[1fr_2fr] gap-y-4 mb-8">
                    <SpecRow label="Material" value={selectedProfile.material} />
                    <SpecRow label="Size" value={`${selectedProfile.length} x ${selectedProfile.width}`} />
                    <SpecRow label="Thickness" value={selectedProfile.thickness} />
                    <SpecRow label="Packing" value={selectedProfile.packing} />
                    <SpecRow label="Packing Type" value={selectedProfile.packingType} />
                    <SpecRow label="Weight" value={selectedProfile.weight} />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Application</h4>
                    <p className="text-gray-900 dark:text-gray-200 font-medium">{selectedProfile.application}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-sm border border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Retail Price</h4>
                    <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                      {selectedProfile.price}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">Taxes, Freight & Installation Extra</p>
                  </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <>
    <div className="text-sm font-semibold text-gray-500 py-1">{label}</div>
    <div className="text-sm font-medium text-gray-900 dark:text-white py-1">: : <span className="ml-2">{value}</span></div>
  </>
);
