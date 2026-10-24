"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface CatalogDownloadButtonProps {
  downloadUrl: string;
  label?: string;
  className?: string;
  size?: number;
}

export default function CatalogDownloadButton({
  downloadUrl,
  label = "Download PDF",
  className = "",
  size = 16,
}: CatalogDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 3500);
  };

  return (
    <a
      href={downloadUrl}
      download
      onClick={handleClick}
      className={className}
    >
      {isDownloading ? (
        <Loader2 size={size} className="animate-spin text-white" />
      ) : (
        <Download size={size} />
      )}
      <span>{isDownloading ? "Downloading..." : label}</span>
    </a>
  );
}
