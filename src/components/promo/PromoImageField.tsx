"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  UploadCloud,
  ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  AlertTriangle,
  FolderOpen,
  Search,
  Trash2,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  uploadPromoImage,
  uploadPromoImages,
  getPromoImageLibrary,
  PromoGalleryImage,
} from '@/actions/admin/promo-images';

interface PromoImageFieldProps {
  label: string;
  value: string; // single URL or newline-separated URLs for multiple
  onChange: (url: string) => void;
  required?: boolean;
  multiple?: boolean;
  maxImages?: number; // default 4
  helpText?: string;
}

export default function PromoImageField({
  label,
  value,
  onChange,
  required,
  multiple = false,
  maxImages = 4,
  helpText,
}: PromoImageFieldProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");

  // Parse active URLs
  const activeUrls = useMemo(() => {
    if (!value || typeof value !== "string") return [];
    return value
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));
  }, [value]);

  // Modal Multi-Select State
  const [modalSelectedUrls, setModalSelectedUrls] = useState<string[]>([]);

  // Library State
  const [libraryImages, setLibraryImages] = useState<PromoGalleryImage[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ name: string; sizeKb: string; previewUrl: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom URL State
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Sync state when modal opens
  useEffect(() => {
    if (modalOpen) {
      if (multiple) {
        setModalSelectedUrls([...activeUrls]);
        setCustomUrlInput(activeUrls.join("\n"));
      } else {
        setModalSelectedUrls(activeUrls.slice(0, 1));
        setCustomUrlInput(activeUrls[0] || "");
      }
      setSelectedFiles([]);
      setFilePreviews([]);
      setUploadError(null);

      if (libraryImages.length === 0) {
        loadLibrary();
      }
    }
  }, [modalOpen, activeUrls, multiple, libraryImages.length]);

  const loadLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await getPromoImageLibrary();
      if (res.success && res.images) {
        setLibraryImages(res.images);
      }
    } catch (err: unknown) {
      console.error("Error loading promo image library:", err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  // Handle client-side file selection
  const handleFileSelect = (filesList: FileList | null) => {
    setUploadError(null);
    if (!filesList || filesList.length === 0) {
      setSelectedFiles([]);
      setFilePreviews([]);
      return;
    }

    const files = Array.from(filesList);
    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

    // Check count limit
    const allowedLimit = multiple ? maxImages : 1;
    if (files.length > allowedLimit) {
      setUploadError(`You can select a maximum of ${allowedLimit} image${allowedLimit > 1 ? "s" : ""} at a time.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Check size & mime types on ALL files before accepting
    for (const file of files) {
      if (file.size > MAX_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        setUploadError(`File "${file.name}" exceeds the 2MB size limit (${sizeMb} MB). All uploads cancelled. Please ensure all files are under 2MB.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (!file.type || !file.type.startsWith("image/")) {
        setUploadError(`File "${file.name}" is not a valid image format. All uploads cancelled. Only PNG, JPG, and WEBP images are allowed.`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    // Create instant previews
    const previews = files.map((file) => ({
      name: file.name,
      sizeKb: (file.size / 1024).toFixed(1),
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles(files);
    setFilePreviews(previews);
  };

  // Handle Upload Submission
  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      setUploadError("Please select at least one image file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      if (multiple) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        const res = await uploadPromoImages(formData);

        if (res.success && res.urls && res.urls.length > 0) {
          toast.success(`${res.urls.length} image${res.urls.length > 1 ? "s" : ""} uploaded successfully!`);

          // Combine with existing or set new
          const combined = Array.from(new Set([...modalSelectedUrls, ...res.urls])).slice(0, maxImages);
          onChange(combined.join("\n"));

          // Update local library cache
          const newEntries: PromoGalleryImage[] = (res.uploaded || []).map((u) => ({
            id: `upload-${Date.now()}-${u.filename}`,
            title: u.filename,
            url: u.url,
            category: "Uploaded Promos",
            source: "uploaded",
          }));
          setLibraryImages((prev) => [...newEntries, ...prev]);

          setModalOpen(false);
          setSelectedFiles([]);
          setFilePreviews([]);
        } else {
          setUploadError(res.error || "Failed to upload images. All uploads were cancelled.");
        }
      } else {
        // Single file upload
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);

        const res = await uploadPromoImage(formData);

        if (res.success && res.secure_url) {
          toast.success("Image uploaded successfully!");
          onChange(res.secure_url);

          setLibraryImages((prev) => [
            {
              id: `upload-${Date.now()}`,
              title: res.filename || selectedFiles[0].name,
              url: res.secure_url!,
              category: "Uploaded Promos",
              source: "uploaded",
            },
            ...prev,
          ]);

          setModalOpen(false);
          setSelectedFiles([]);
          setFilePreviews([]);
        } else {
          setUploadError(res.error || "Failed to upload image. Please try again.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading images";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle image selection in Library tab
  const handleLibraryImageClick = (url: string) => {
    if (!multiple) {
      // Single selection: instant apply & close
      onChange(url);
      toast.success("Image selected!");
      setModalOpen(false);
      return;
    }

    // Multiple selection
    if (modalSelectedUrls.includes(url)) {
      setModalSelectedUrls(modalSelectedUrls.filter((u) => u !== url));
    } else {
      if (modalSelectedUrls.length >= maxImages) {
        toast.error(`You can select a maximum of ${maxImages} images.`);
        return;
      }
      setModalSelectedUrls([...modalSelectedUrls, url]);
    }
  };

  // Apply modal multi-selection
  const handleApplyMultiLibrary = () => {
    onChange(modalSelectedUrls.join("\n"));
    toast.success(`${modalSelectedUrls.length} image${modalSelectedUrls.length > 1 ? "s" : ""} applied!`);
    setModalOpen(false);
  };

  // Remove a single image from active multi list
  const handleRemoveSingleFromList = (indexToRemove: number) => {
    const updated = activeUrls.filter((_, idx) => idx !== indexToRemove);
    onChange(updated.join("\n"));
  };

  // Apply Custom URL tab
  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    if (multiple) {
      const parsed = customUrlInput
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));

      if (parsed.length === 0) {
        toast.error("Please enter at least one valid image URL");
        return;
      }

      if (parsed.length > maxImages) {
        toast.error(`A maximum of ${maxImages} images are allowed. Only the first ${maxImages} will be applied.`);
      }

      const trimmed = parsed.slice(0, maxImages);
      onChange(trimmed.join("\n"));
      toast.success(`${trimmed.length} image URLs applied!`);
    } else {
      onChange(customUrlInput.trim());
      toast.success("Image URL applied!");
    }
    setModalOpen(false);
  };

  // Filter library
  const filteredLibrary = libraryImages.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.category && img.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "uploaded" && img.source === "uploaded") ||
      (selectedCategory === "installed" && img.source === "installed") ||
      (selectedCategory === "preset" && img.source === "preset");
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-1.5">
      {/* Top Label & Active Status */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {activeUrls.length > 0 && (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Check className="h-3 w-3 stroke-[3]" />
            {multiple ? `${activeUrls.length} Active (Max ${maxImages})` : "Image Active"}
          </span>
        )}
      </div>

      {helpText && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500">{helpText}</p>
      )}

      {/* Main Preview Container */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 shadow-2xs transition hover:border-gray-300 dark:hover:border-slate-700">
        {multiple ? (
          /* ──────── MULTIPLE IMAGES DISPLAY (MAX 4) ──────── */
          activeUrls.length > 0 ? (
            <div className="space-y-3">
              {/* Grid of Active Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeUrls.map((url, idx) => (
                  <div
                    key={`active-thumb-${idx}-${url}`}
                    className="group relative aspect-4/3 overflow-hidden rounded-lg border border-amber-500/40 bg-slate-950 shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Order Badge */}
                    <div className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-md bg-black/75 text-[10px] font-bold text-white backdrop-blur-xs">
                      #{idx + 1}
                    </div>

                    {/* Individual Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleFromList(idx)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-md bg-rose-600/90 hover:bg-rose-600 text-white shadow-xs transition"
                      title="Remove this image"
                    >
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 font-bold text-amber-700 dark:text-amber-400 transition"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Manage Images ({activeUrls.length}/{maxImages})</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1 rounded-lg text-gray-400 hover:text-rose-600 text-[11px] font-semibold transition"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty Multi State */
            <div
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 hover:border-amber-500 dark:border-slate-700 dark:hover:border-amber-400 bg-gray-50/60 dark:bg-slate-800/40 cursor-pointer transition group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  <Layers className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                    Select or Upload Carousel Images (Up to {maxImages})
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    Browse gallery, upload multiple files (max 2MB each), or paste URLs
                  </span>
                </div>
              </div>

              <span className="rounded-md bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-bold shadow-2xs transition shrink-0">
                Choose Images
              </span>
            </div>
          )
        ) : (
          /* ──────── SINGLE IMAGE DISPLAY ──────── */
          activeUrls.length > 0 ? (
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-21 shrink-0 overflow-hidden rounded-lg border border-amber-500/40 bg-slate-900 shadow-xs aspect-4/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeUrls[0]}
                  alt={label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-mono text-[11px] text-gray-600 dark:text-gray-300 truncate" title={activeUrls[0]}>
                  {activeUrls[0]}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 transition"
                  >
                    <FolderOpen className="h-3 w-3" />
                    <span>Change Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="inline-flex items-center gap-1 rounded-md bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 px-2 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 transition"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Single State */
            <div
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-between p-2 rounded-lg border border-dashed border-gray-300 hover:border-amber-500 dark:border-slate-700 dark:hover:border-amber-400 bg-gray-50/60 dark:bg-slate-800/40 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                    Select or Upload Image
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    Browse gallery, upload file (max 2MB), or paste link
                  </span>
                </div>
              </div>

              <span className="rounded-md bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs transition shrink-0">
                Choose
              </span>
            </div>
          )
        )}
      </div>

      {/* ──────────────── MODAL / DRAWER FOR IMAGE SELECTION & UPLOAD ──────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-gray-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                  {multiple ? <Layers className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {multiple ? `Select Images for ${label}` : `Select Image for ${label}`}
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {multiple
                      ? `Select up to ${maxImages} images • 4:3 aspect ratio fitted edge-to-edge automatically`
                      : "4:3 aspect ratio fitted edge-to-edge automatically"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-slate-700 dark:text-gray-300 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-gray-200 dark:border-slate-800 px-5 pt-2 bg-gray-50/50 dark:bg-slate-900/50 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("library")}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                  activeTab === "library"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Gallery & Presets ({libraryImages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                  activeTab === "upload"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload New (Max 2MB per file)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
                  activeTab === "url"
                    ? "border-amber-500 text-amber-600 dark:text-amber-400"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Custom URL{multiple ? "s" : ""}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* ──────────────── TAB 1: LIBRARY / GALLERY ──────────────── */}
              {activeTab === "library" && (
                <div className="space-y-4">
                  {/* Search & Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search images by title or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-8.5 pr-3 py-1.5 text-xs text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-start sm:self-auto text-xs">
                      {["all", "uploaded", "installed", "preset"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition ${
                            selectedCategory === cat
                              ? "bg-amber-500 text-white shadow-2xs"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-gray-300"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Select Info Counter */}
                  {multiple && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300">
                      <span>
                        Selected: <strong>{modalSelectedUrls.length}</strong> of <strong>{maxImages}</strong> maximum images
                      </span>
                      {modalSelectedUrls.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setModalSelectedUrls([])}
                          className="text-[11px] font-semibold text-rose-600 hover:underline dark:text-rose-400"
                        >
                          Deselect All
                        </button>
                      )}
                    </div>
                  )}

                  {/* Images Grid */}
                  {loadingLibrary ? (
                    <div className="flex h-56 items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                    </div>
                  ) : filteredLibrary.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400">
                      No images found matching your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[46vh] overflow-y-auto pr-1">
                      {filteredLibrary.map((img) => {
                        const isSelected = multiple
                          ? modalSelectedUrls.includes(img.url)
                          : activeUrls[0] === img.url;

                        const selectedIndex = multiple
                          ? modalSelectedUrls.indexOf(img.url) + 1
                          : null;

                        return (
                          <div
                            key={img.id}
                            onClick={() => handleLibraryImageClick(img.url)}
                            className={`group relative overflow-hidden rounded-xl border cursor-pointer transition hover:scale-102 hover:shadow-md ${
                              isSelected
                                ? "border-amber-500 ring-2 ring-amber-500/40 bg-amber-50/20"
                                : "border-gray-200 hover:border-amber-400 dark:border-slate-800 dark:hover:border-amber-500"
                            }`}
                          >
                            {/* 4:3 Aspect Ratio Image Frame */}
                            <div className="aspect-4/3 w-full overflow-hidden bg-slate-900 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                loading="lazy"
                              />

                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-[11px] shadow-xs">
                                  {multiple && selectedIndex ? selectedIndex : <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                              )}

                              {img.category && (
                                <span className="absolute bottom-1 left-1 rounded-sm bg-black/75 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-xs">
                                  {img.category}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <div className="p-1.5 bg-white dark:bg-slate-900">
                              <p className="truncate text-[10px] font-bold text-gray-800 dark:text-gray-200">
                                {img.title}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Multi-Select Apply Button */}
                  {multiple && (
                    <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleApplyMultiLibrary}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95"
                      >
                        <Check className="h-4 w-4" />
                        <span>Apply Selected Images ({modalSelectedUrls.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── TAB 2: UPLOAD (MAX 2MB, DUPLICATE CHECK) ──────────────── */}
              {activeTab === "upload" && (
                <div className="space-y-4 max-w-lg mx-auto py-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-amber-500 dark:border-slate-700 dark:hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer transition bg-gray-50/50 dark:bg-slate-800/30"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple={multiple}
                      accept="image/png,image/jpeg,image/webp,image/jpg"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                    />

                    {filePreviews.length > 0 ? (
                      <div className="space-y-3">
                        <div className={`grid gap-2 mx-auto ${filePreviews.length > 1 ? "grid-cols-2 sm:grid-cols-4 max-w-md" : "grid-cols-1 w-44"}`}>
                          {filePreviews.map((p, idx) => (
                            <div key={`prev-${idx}`} className="relative aspect-4/3 overflow-hidden rounded-xl border border-amber-500/50 shadow-xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.previewUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 inset-x-0 bg-black/75 p-1 text-[8px] text-white truncate text-center backdrop-blur-xs">
                                {p.sizeKb} KB
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {filePreviews.length} file{filePreviews.length > 1 ? "s" : ""} selected
                        </p>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                          Click to choose different file(s)
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {multiple
                              ? `Click to select up to ${maxImages} images from your device`
                              : "Click to select an image from your device"}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                            PNG, JPG, or WEBP • Maximum file size: <strong>2MB per file</strong>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rules reminder (Clean English) */}
                  <div className="rounded-xl bg-amber-50 p-3 border border-amber-200/80 text-[11px] text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Image Upload Rules:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-800 dark:text-amber-300/90 pl-1">
                      <li>Maximum 2MB file size strictly enforced per image.</li>
                      {multiple && <li>Maximum {maxImages} images allowed per batch.</li>}
                      <li>4:3 aspect ratio fitted edge-to-edge automatically.</li>
                      <li>Duplicate filename check: files with identical names will be rejected to prevent overwriting.</li>
                      <li>All-or-nothing validation: if even one file exceeds 2MB or is duplicate, all uploads are safely cancelled.</li>
                    </ul>
                  </div>

                  {uploadError && (
                    <div className="rounded-xl bg-rose-50 p-3 border border-rose-300 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={selectedFiles.length === 0 || isUploading}
                    onClick={handleUploadSubmit}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 py-3 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading & Verifying Images...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4" />
                        <span>
                          {multiple
                            ? `Upload & Apply ${selectedFiles.length > 0 ? `(${selectedFiles.length} Images)` : ""}`
                            : "Upload & Use in Banner"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ──────────────── TAB 3: CUSTOM URL ──────────────── */}
              {activeTab === "url" && (
                <div className="space-y-4 max-w-lg mx-auto py-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                      {multiple ? `Direct Image URLs (Up to ${maxImages}, one per line)` : "Direct Image URL"}
                    </label>

                    {multiple ? (
                      <textarea
                        rows={4}
                        placeholder={"https://images.unsplash.com/photo-1...\nhttps://res.cloudinary.com/..."}
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs text-gray-900 font-mono focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                      />
                    ) : (
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs text-gray-900 focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
                      />
                    )}

                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {multiple
                        ? `Paste 1 to ${maxImages} URLs. Each will automatically fit into the 4:3 template card frame.`
                        : "Paste any valid image URL. It will automatically fit into the 4:3 template card frame."}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!customUrlInput.trim()}
                    onClick={handleApplyCustomUrl}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition active:scale-95 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    <span>Apply Image URL{multiple ? "s" : ""}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
