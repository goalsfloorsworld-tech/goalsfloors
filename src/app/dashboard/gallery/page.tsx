"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

export default function DealerGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/dashboard/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image exceeds 2MB limit.");
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WEBP formats are supported.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaption('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary configuration is missing.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', uploadPreset);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryRes.ok) {
        const errorText = await cloudinaryRes.text();
        throw new Error(`Failed to upload image to Cloudinary: ${errorText}`);
      }

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      // 2. Save to our database
      const dbRes = await fetch('/api/dashboard/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption.trim()
        })
      });

      if (!dbRes.ok) {
        const errData = await dbRes.json();
        throw new Error(errData.error || "Failed to save image to gallery.");
      }

      // Success
      await fetchImages();
      cancelUpload();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    setDeleting(id);
    setError(null);

    try {
      const res = await fetch('/api/dashboard/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: id })
      });

      if (res.ok) {
        setImages(images.filter(img => img.id !== id));
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to delete image.");
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const isAtLimit = images.length >= 10;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Project Gallery</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Upload photos of your best installations ({images.length}/10 max).</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border border-red-100 dark:border-red-900/30">
          <X className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Upload Section */}
      {!isAtLimit && !selectedFile && (
        <div className="mb-10">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-[2rem] p-12 text-center hover:border-amber-500 dark:hover:border-amber-500 transition-all group flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Add New Photo</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              JPG, PNG or WEBP. Max 2MB per image.
            </p>
          </button>
        </div>
      )}

      {isAtLimit && !selectedFile && (
        <div className="mb-10 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-6 text-center">
          <ImageIcon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1">Maximum 10 Photos Reached</h3>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
            Please delete an existing photo to upload a new one.
          </p>
        </div>
      )}

      {/* Preview Section */}
      {selectedFile && previewUrl && (
        <div className="mb-10 bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 relative aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-[#050810]">
              <Image src={previewUrl} alt="Preview" fill className="object-contain" />
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">Upload Details</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Caption (Optional)</label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="E.g., Oak flooring installation in living room..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
                  />
                  <div className="text-right text-[10px] font-bold text-slate-400">{caption.length}/100</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={cancelUpload}
                    disabled={uploading}
                    className="flex-1 py-4 px-6 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-[2] py-4 px-6 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-amber-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Uploading...' : 'Confirm Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-6">Your Gallery</h2>
        
        {images.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-slate-900/50 rounded-[2rem] border border-gray-200 dark:border-slate-800">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No photos yet</h3>
            <p className="text-slate-500">Upload your first project photo to show on your public page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm group">
                <div className="relative aspect-square bg-gray-100 dark:bg-[#050810] overflow-hidden">
                  <Image src={img.image_url} alt={img.caption || "Gallery image"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Delete overlay */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(img.id)}
                      disabled={deleting === img.id}
                      className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                      title="Delete photo"
                    >
                      {deleting === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {img.caption && (
                  <div className="p-5 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {img.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
