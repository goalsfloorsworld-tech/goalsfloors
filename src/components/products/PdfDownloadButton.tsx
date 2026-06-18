import { Download } from "lucide-react";

interface PdfDownloadButtonProps {
  download?: {
    name: string;
    url: string;
  };
}

export default function PdfDownloadButton({ download }: PdfDownloadButtonProps) {
  if (!download?.url) return null;

  return (
    <a
      href={download.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-gradient-mixed-8 hover:opacity-90 text-white font-bold text-center uppercase tracking-widest py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm"
    >
      <Download className="w-5 h-5" />
      {download.name || "Download Catalog PDF"}
    </a>
  );
}
