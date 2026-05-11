"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ViewerDetail {
  label: string;
  value: string;
}

interface ViewerContext {
  title: string;
  category: string;
  priceRange: string;
  variants?: any[];
  description?: string;
  details?: ViewerDetail[];
  showDetails?: boolean;
}

interface FullscreenImageViewerProps {
  imageUrl: string;
  allImages: { url: string; alt: string }[];
  context: ViewerContext;
  onClose: () => void;
  onNavigate: (url: string) => void;
}

export default function FullscreenImageViewer({
  imageUrl,
  allImages,
  context,
  onClose,
  onNavigate
}: FullscreenImageViewerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Prevent background page scroll and mark fullscreen mode for global UI toggles.
  useEffect(() => {
    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousLeft = document.body.style.left;
    const previousRight = document.body.style.right;
    const previousWidth = document.body.style.width;
    const previousTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";
    document.body.classList.add("fullscreen-viewer-open");

    const preventBackgroundScroll = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-fullscreen-scroll='allow']")) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    window.addEventListener("touchmove", preventBackgroundScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventBackgroundScroll);
      window.removeEventListener("touchmove", preventBackgroundScroll);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.left = previousLeft;
      document.body.style.right = previousRight;
      document.body.style.width = previousWidth;
      document.body.style.touchAction = previousTouchAction;
      document.body.classList.remove("fullscreen-viewer-open");
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Filter unique images to avoid duplicates
  const uniqueImages = Array.from(
    new Map((allImages || []).map(img => [img.url, img])).values()
  );

  const currentImageIndex = uniqueImages.findIndex(img => img.url === imageUrl);

  const goToPrevious = () => {
    if (uniqueImages.length <= 1) return;
    const newIndex = currentImageIndex === 0 ? uniqueImages.length - 1 : currentImageIndex - 1;
    onNavigate(uniqueImages[newIndex].url);
  };

  const goToNext = () => {
    if (uniqueImages.length <= 1) return;
    const newIndex = currentImageIndex === uniqueImages.length - 1 ? 0 : currentImageIndex + 1;
    onNavigate(uniqueImages[newIndex].url);
  };

  // Keyboard navigation and Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        // Simple focus trap: prevent background tabbing
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentImageIndex, uniqueImages.length]);

  // Touch/Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe left -> next image
    if (diff > 50) goToNext();
    // Swipe right -> previous image
    else if (diff < -50) goToPrevious();

    setTouchStart(null);
  };

  const getCurrentImage = () => {
    if (currentImageIndex >= 0 && currentImageIndex < uniqueImages.length) {
      return uniqueImages[currentImageIndex];
    }
    return { url: imageUrl, alt: "Product image" };
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/98 flex items-center justify-center p-4 md:p-0 transition-all animate-in fade-in duration-300 overflow-hidden"
      onClick={() => onClose()}
      data-lenis-prevent="true"
    >
      {/* Desktop: Two-column layout (image + info) */}
        {/** Hide details panel when context.showDetails === false (simple viewer) */}
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center">
        {/* Main Image Area */}
          <div
            className={"w-full " + (context.showDetails === false ? "md:w-full" : "md:w-2/3") + " h-full flex items-center justify-center relative md:p-10 p-4 group"}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image */}
          <div className="relative w-full h-full max-h-[90vh] md:max-h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={imageUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={imageUrl}
                  alt={getCurrentImage()?.alt || "Product image"}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - Desktop visible on hover, Mobile always visible */}
          {uniqueImages.length > 1 && (
            <>
              {/* Desktop Navigation - hidden on mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 items-center justify-center flex-shrink-0"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Mobile: Left button - always visible */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Desktop: Right button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 items-center justify-center flex-shrink-0"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Mobile: Right button - always visible */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Mobile: Image counter and swipe hint */}
          <div className="absolute bottom-4 left-4 right-4 md:hidden flex flex-col gap-2 z-20">
            <div className="flex items-center justify-between bg-black/50 backdrop-blur-md rounded-full px-4 py-2">
              <span className="text-white text-sm font-semibold">
                {currentImageIndex + 1} / {uniqueImages.length}
              </span>
              <span className="text-white/60 text-xs">← Swipe →</span>
            </div>
          </div>
        </div>

        {/* Desktop: Info Panel */}
          {/* Desktop: Info Panel (optional) */}
          {context.showDetails !== false && (
            <div className="hidden md:flex md:w-1/3 h-full flex-col bg-gradient-to-b from-white/5 to-black/20 backdrop-blur-md border-l border-white/10 p-8 overflow-y-auto" data-fullscreen-scroll="allow" data-lenis-prevent="true">
              <div className="space-y-8">
            {/* Image Counter */}
            <div>
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-2">Image</p>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-white">
                  {currentImageIndex + 1}
                </div>
                <div className="text-white/60 font-medium text-sm">
                  of {uniqueImages.length}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Product Title */}
            <div>
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-2">Product</p>
              <p className="text-white text-lg font-semibold leading-tight">{context.title}</p>
            </div>

            {/* Image Alt Text / Description */}
            {(context.description || getCurrentImage()?.alt) && (
              <>
                <div className="h-px bg-white/10" />
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-2">Description</p>
                  <p className="text-white/80 text-sm leading-relaxed">{context.description || getCurrentImage().alt}</p>
                </div>
              </>
            )}

            {/* Product Specs Summary */}
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-4">Quick Details</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Category</span>
                  <span className="text-white font-medium capitalize">{context.category.replace(/-/g, " ")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Price Range</span>
                  <span className="text-white font-medium">{context.priceRange}</span>
                </div>
                {uniqueImages.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Variants</span>
                    <span className="text-white font-medium">{uniqueImages.length} options</span>
                  </div>
                )}
              </div>
            </div>

            {context.details && context.details.length > 0 && (
              <>
                <div className="h-px bg-white/10" />
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-4">Card Details</p>
                  <div className="space-y-3 text-sm">
                    {context.details.map((detail) => (
                      <div key={detail.label} className="flex justify-between items-start gap-4">
                        <span className="text-white/60">{detail.label}</span>
                        <span className="text-white font-medium text-right">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Navigation Instructions */}
            <div className="h-px bg-white/10" />
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-bold mb-3">Navigation</p>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">←/→</span>
                  <span>Arrow keys to navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">ESC</span>
                  <span>Close viewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Image Counter - Desktop top-left */}
      <div className="hidden md:block absolute top-6 left-6 text-white/70 text-sm font-medium z-30">
        {currentImageIndex + 1} / {uniqueImages.length}
      </div>

      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-[130] transform hover:scale-110 active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image viewer"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
