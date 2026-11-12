"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Search,
  Folder,
  Loader2,
  Check,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import {
  getCloudinaryFolders,
  getCloudinaryAssets,
  CloudinaryAsset,
  CloudinaryFolder,
} from '@/actions/admin/cloudinary-explorer';

// Quick Curated Presets for one-click selection
export const POPULAR_SITE_IMAGES = [
  {
    label: "WPC Fluted Wall Panels",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Wpc_Fluted_Panel_In_Gurgaon.png",
    folder: "wall-panels",
  },
  {
    label: "Light Oak Herringbone Floors",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
    folder: "herringbone",
  },
  {
    label: "SPC Stone Composite Flooring",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774612492/screenshot-2024-11-05-074302-YKb68R7lNDueGKEV.jpg",
    folder: "spc-flooring",
  },
  {
    label: "All-Weather Artificial Grass",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772476444/artificial_grass_supplier_in_india.jpg",
    folder: "artificial-grass",
  },
  {
    label: "Warm Oak Laminate Planks",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
    folder: "laminate-flooring",
  },
  {
    label: "Hydro-Seal Hybrid Flooring",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477090/Ocean_Waterproof_Laminate_FLooring.jpg",
    folder: "hybrid-flooring",
  },
  {
    label: "Outdoor Weatherproof WPC Decking",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478659/premium_wpc_decking_supplier_in_gurgaon.jpg",
    folder: "wpc-decking",
  },
  {
    label: "Cobra PU Stone Colors",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477246/Pu_Stone_Colors.jpg",
    folder: "cobra-pu-stone",
  },
  {
    label: "WPC Exterior Louvers Facade",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775818177/exterior_louvaring.jpg",
    folder: "exterior-louvers",
  },
  {
    label: "Upfit Architectural Wall Panels",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1774525633/goals-floors-upfit-panels-m7Vw49PE2qSaDNaG.jpg",
    folder: "upfit-panels",
  },
  {
    label: "Acoustic Linear Baffle Ceiling",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775466342/screenshot-2024-10-27-180236-1-AQEyyylJkGUBqyED.webp",
    folder: "baffle-ceiling",
  },
  {
    label: "Timber Tubes Walnut Profile",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772478739/Timber_Tube.png",
    folder: "timber-tubes",
  },
];

interface CloudinaryImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  currentValue?: string;
  title?: string;
}

export default function CloudinaryImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  currentValue,
  title = "Select Image from Cloudinary Library",
}: CloudinaryImagePickerModalProps) {
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [assets, setAssets] = useState<CloudinaryAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CloudinaryAsset | null>(null);

  // Load Folders once
  useEffect(() => {
    if (!isOpen) return;

    async function loadFolders() {
      setLoadingFolders(true);
      const res = await getCloudinaryFolders();
      if (res.success && res.folders) {
        setFolders(res.folders);
      }
      setLoadingFolders(false);
    }
    loadFolders();
  }, [isOpen]);

  // Load Assets whenever folder or modal opens
  useEffect(() => {
    if (!isOpen) return;

    async function loadAssets() {
      setLoading(true);
      const res = await getCloudinaryAssets({
        folder: selectedFolder,
        search: searchTerm,
        max_results: 50,
      });
      if (res.success && res.assets) {
        setAssets(res.assets);
      }
      setLoading(false);
    }

    loadAssets();
  }, [isOpen, selectedFolder, searchTerm]);

  // Filtered Assets based on Search
  const displayAssets = useMemo(() => {
    if (!searchTerm.trim()) return assets;
    const q = searchTerm.toLowerCase();
    return assets.filter(
      (a) =>
        a.filename.toLowerCase().includes(q) ||
        a.public_id.toLowerCase().includes(q)
    );
  }, [assets, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-[#E17100] flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Browse Cloudinary media assets, filter by folder, or choose from verified product presets.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-12 gap-3 shrink-0">
          {/* Folder Dropdown */}
          <div className="sm:col-span-7 relative">
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Select Folder ({folders.length - 1} folders)
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                disabled={loadingFolders}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E17100]"
              >
                <option value="">All Cloudinary Folders (Everything)</option>
                {folders.map((f, i) => (
                  <option key={i} value={f.path}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search by filename */}
          <div className="sm:col-span-5 relative">
            <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Search by Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. wall-panel, grass, oak..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E17100]"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area: Image Grid & Preview Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Grid of Cloudinary Images */}
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#E17100]" />
                <span className="text-xs font-medium">Loading Cloudinary assets...</span>
              </div>
            ) : displayAssets.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
                <ImageIcon className="w-10 h-10 stroke-[1.2]" />
                <p className="text-xs font-medium">No images found in this folder.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFolder("");
                    setSearchTerm("");
                  }}
                  className="mt-2 text-xs font-bold text-[#E17100] hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {displayAssets.map((asset) => {
                  const isCurrent = currentValue === asset.secure_url;
                  const isSelected = selectedAsset?.public_id === asset.public_id;

                  return (
                    <div
                      key={asset.public_id}
                      onClick={() => setSelectedAsset(asset)}
                      onDoubleClick={() => {
                        onSelectImage(asset.secure_url);
                        onClose();
                      }}
                      className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all duration-200 bg-gray-50 dark:bg-slate-800 ${
                        isSelected
                          ? "border-[#E17100] ring-2 ring-[#E17100]/30 shadow-md"
                          : isCurrent
                          ? "border-emerald-500 ring-2 ring-emerald-500/20"
                          : "border-gray-200 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-slate-950">
                        <Image
                          src={asset.secure_url}
                          alt={asset.filename}
                          fill
                          sizes="(max-width: 640px) 50vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isCurrent && (
                          <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            Active
                          </span>
                        )}
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 bg-[#E17100] text-white p-1 rounded-full shadow z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}

                        {/* One-click Use Image Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectImage(asset.secure_url);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-md bg-[#E17100] hover:bg-[#c96200] text-white font-bold text-xs shadow-lg flex items-center gap-1 active:scale-95 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Use Image
                          </button>
                        </div>
                      </div>

                      {/* Info snippet */}
                      <div className="p-2">
                        <p
                          className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate"
                          title={asset.filename}
                        >
                          {asset.filename}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                          <span className="uppercase">{asset.format}</span>
                          <span>{asset.width}x{asset.height}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Image Detail / Quick Insert Panel */}
          {selectedAsset && (
            <div className="hidden md:flex w-72 border-l border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-950/60 p-4 flex-col justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Image Preview
                </span>

                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800 my-3 bg-white dark:bg-slate-900 shadow-sm">
                  <Image
                    src={selectedAsset.secure_url}
                    alt={selectedAsset.filename}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Filename</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 break-all">
                      {selectedAsset.filename}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400 text-[11px]">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Dimensions</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedAsset.width} × {selectedAsset.height} px
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block">Size</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.round(selectedAsset.bytes / 1024)} KB
                      </span>
                    </div>
                  </div>

                  {selectedAsset.folder && (
                    <div>
                      <span className="text-gray-400 text-[10px] block">Folder</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300 break-all text-[11px]">
                        {selectedAsset.folder}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectImage(selectedAsset.secure_url);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#E17100] hover:bg-[#c96200] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Select This Image
                </button>

                <a
                  href={selectedAsset.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 text-center text-[11px] font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center gap-1 transition-colors"
                >
                  View Full Size
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-slate-950/50">
          <span className="text-xs text-gray-500">
            {displayAssets.length} image{displayAssets.length !== 1 ? "s" : ""} found
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onSelectImage(selectedAsset.secure_url);
                  onClose();
                }
              }}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-[#E17100] hover:bg-[#c96200] text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              {selectedAsset ? "Use Selected Image" : "Select an Image"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
