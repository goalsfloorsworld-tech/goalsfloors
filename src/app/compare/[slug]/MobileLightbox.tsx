"use client";

import { useState } from "react";

interface ImageItem {
  id: string;
  src: string;
  alt: string;
}

interface MobileLightboxProps {
  images: ImageItem[];
}

export default function MobileLightbox({ images }: MobileLightboxProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeImage = images.find((img) => img.id === activeId);

  return (
    <>
      {/* Invisible tap triggers - one per image, positioned over each image slot */}
      {images.map((img) => (
        <button
          key={img.id}
          id={`tap-${img.id}`}
          aria-label={`View full image of ${img.alt}`}
          onClick={() => setActiveId(img.id)}
          className="absolute inset-0 w-full h-full bg-transparent z-30 block md:hidden cursor-pointer"
          style={{ border: "none", outline: "none" }}
        />
      ))}

      {/* Fullscreen Lightbox Overlay */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/92 z-[9999] flex items-center justify-center p-4"
          onClick={() => setActiveId(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveId(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/20 text-white text-2xl font-black flex items-center justify-center"
            aria-label="Close image"
          >
            ✕
          </button>

          {/* Full Image */}
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="max-w-full max-h-[90vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
