"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Download, Maximize2, Minimize2, ExternalLink, MessageCircle, Share2, Check, FileText, Loader2 } from "lucide-react";

interface CatalogViewerClientProps {
  catalog: {
    id: string;
    name: string;
    slug: string;
    url: string;
    image?: string;
  };
  downloadUrl: string;
}

export default function CatalogViewerClient({ catalog, downloadUrl }: CatalogViewerClientProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fit horizontally to eliminate horizontal scroll locks on phone screens
  const iframeSrc = useMemo(() => {
    if (!catalog.url) return "";
    if (catalog.url.includes("#")) return catalog.url;
    return `${catalog.url}#view=FitH`;
  }, [catalog.url]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${catalog.name} | Goals Floors`,
          text: `Check out the official ${catalog.name} catalog from Goals Floors.`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Clipboard error", e);
    }
  };

  const handleDownloadClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 3500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Goals Floors team, I am viewing the "${catalog.name}" catalog. Please share pricing, product availability, or arrange a site measurement in Delhi NCR.`
  );
  const whatsappUrl = `https://wa.me/917217644573?text=${whatsappMessage}`;

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-[2147483647] bg-slate-950 flex flex-col p-1 sm:p-4" : "w-full"}`}>
      {/* Viewer Card */}
      <div className={`flex flex-col bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden ${isFullscreen ? "h-full w-full rounded-none sm:rounded-2xl" : "rounded-2xl sm:rounded-3xl"}`}>
        
        {/* Interactive Viewer Toolbar - Single sleek row on both mobile and desktop */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-3 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
          {/* Left: Indicator & Title */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
              <FileText size={15} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-500">Live Reader</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[120px] xs:max-w-[160px] sm:max-w-md">
                {catalog.name}
              </p>
            </div>
          </div>

          {/* Right: Actions (Clean, compact icon buttons on mobile, full text on sm+) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Share / Copy */}
            <button
              onClick={handleShare}
              title="Share this catalog"
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg sm:rounded-xl transition flex items-center gap-1.5"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span className="hidden md:inline">{copied ? "Copied" : "Share"}</span>
            </button>

            {/* WhatsApp Consultation */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-600 rounded-lg sm:rounded-xl transition flex items-center gap-1.5"
              title="Enquire on WhatsApp"
            >
              <MessageCircle size={14} />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Direct Download Button with Loader - Icon only on mobile, text on sm+ */}
            <a
              href={downloadUrl}
              download
              onClick={handleDownloadClick}
              title={isDownloading ? "Downloading..." : "Download PDF"}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/20 rounded-lg sm:rounded-xl transition flex items-center gap-1.5"
            >
              {isDownloading ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <Download size={14} />
              )}
              <span className="hidden sm:inline">{isDownloading ? "Downloading..." : "Download PDF"}</span>
            </a>

            {/* Open Raw in New Tab */}
            <a
              href={catalog.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open raw PDF in new browser tab"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg sm:rounded-xl transition"
            >
              <ExternalLink size={14} />
            </a>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "View Fullscreen"}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg sm:rounded-xl transition"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* PDF Iframe Container - Touch-optimized for mobile scrolling */}
        <div 
          className={`relative w-full bg-slate-950 flex-grow overflow-auto ${
            isFullscreen ? "h-[calc(100%-48px)] sm:h-[calc(100%-54px)]" : "h-[68vh] sm:h-[75vh] lg:h-[82vh]"
          }`}
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
        >
          {!isIframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 z-10 pointer-events-none">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-medium text-slate-400">Loading catalog brochure...</p>
            </div>
          )}

          <iframe
            src={iframeSrc}
            title={catalog.name}
            className="w-full h-full border-none bg-slate-900 block"
            onLoad={() => setIsIframeLoaded(true)}
            allowFullScreen
            scrolling="auto"
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "auto",
              minHeight: "100%",
            }}
          />
        </div>

        {/* Fallback footer message inside card */}
        <div className="px-3 sm:px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Trouble scrolling on phone? Tap fullscreen ⛶ or</span>
          <a
            href={downloadUrl}
            download
            onClick={handleDownloadClick}
            className="text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            {isDownloading ? (
              <>
                <Loader2 size={11} className="animate-spin text-amber-400" /> Downloading...
              </>
            ) : (
              <>
                Download High-Res PDF <Download size={11} />
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
