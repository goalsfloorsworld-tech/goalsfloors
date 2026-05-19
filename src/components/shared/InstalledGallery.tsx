'use client';

import Image from 'next/image';
import { useState } from 'react';

interface InstalledImage {
  id: string;
  image_url: string;
  alt_text: string;
  aspect_ratio: 'portrait' | 'landscape' | 'square' | 'wide';
}

export default function InstalledGallery({ images }: { images: InstalledImage[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((img) => (
        <div key={img.id} className="break-inside-avoid relative overflow-hidden rounded-lg group">
          <div className={`relative w-full ${
            img.aspect_ratio === 'portrait' ? 'aspect-[3/4]' :
            img.aspect_ratio === 'landscape' ? 'aspect-[4/3]' :
            img.aspect_ratio === 'wide' ? 'aspect-[16/9]' :
            'aspect-square'
          }`}>
            <Image
              src={img.image_url}
              alt={img.alt_text || 'Installed Image'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
