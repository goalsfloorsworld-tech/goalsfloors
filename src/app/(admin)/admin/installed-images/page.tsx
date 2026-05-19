'use client';

import { useState, useEffect } from 'react';
import { addInstalledImage, getInstalledImages, deleteInstalledImage } from '@/actions/installed-images';
import toast from 'react-hot-toast';
import { optimizeCloudinaryUrl } from '@/lib/utils';
import { Trash2, Loader2 } from 'lucide-react';

const VALID_SLUGS = [
  { label: 'Artificial Grass', value: 'artificial-grass' },
  { label: 'Cobra PU Stone', value: 'cobra-pu-stone' },
  { label: 'Herringbone Laminate Flooring', value: 'herringbone-laminate-flooring' },
  { label: 'Hybrid Laminate Flooring', value: 'hybrid-laminate-flooring' },
  { label: 'Laminate Flooring', value: 'laminate-flooring' },
  { label: 'SPC Flooring', value: 'spc-flooring' },
  { label: 'Tokyo Charcoal Moulding', value: 'tokyo-charcoal-moulding' },
  { label: 'Upfit Panels', value: 'upfit-panels' },
  { label: 'Wall Panels', value: 'wall-panels' },
  { label: 'WPC Baffle Ceiling', value: 'wpc-baffle-ceiling' },
  { label: 'WPC Decking', value: 'wpc-decking' },
  { label: 'WPC Exterior Louvers', value: 'wpc-exterior-louvers' },
  { label: 'WPC Timber Tubes', value: 'wpc-timber-tubes' },
];

export default function InstalledImagesAdmin() {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  
  // Add Form State
  const [pageSlug, setPageSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [loading, setLoading] = useState(false);
  const [previewStyle, setPreviewStyle] = useState('aspect-square');

  // Manage State
  const [images, setImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoadingImages(true);
    const res = await getInstalledImages();
    if (res.success) {
      setImages(res.data);
    } else {
      toast.error(res.error || 'Failed to fetch images');
    }
    setLoadingImages(false);
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchImages();
    }
  }, [activeTab]);

  const detectAspectRatio = (url: string) => {
    if (!url) return;
    
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      let ratio = 'square';
      let style = 'aspect-square';

      if (w > h * 1.5) {
        ratio = 'wide';
        style = 'aspect-video';
      } else if (w > h * 1.2) {
        ratio = 'landscape';
        style = 'aspect-[4/3]';
      } else if (h > w * 1.2) {
        ratio = 'portrait';
        style = 'aspect-[3/4]';
      }

      setAspectRatio(ratio);
      setPreviewStyle(style);
      toast.success(`Detected Aspect Ratio: ${ratio}`);
    };
    img.onerror = () => {
      toast.error('Failed to load image for aspect ratio detection.');
    };
    img.src = url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageSlug || !imageUrl) return toast.error('Fill required fields');

    setLoading(true);
    const res = await addInstalledImage({
      page_slug: pageSlug,
      image_url: imageUrl,
      alt_text: altText,
      aspect_ratio: aspectRatio,
    });

    if (res.success) {
      toast.success('Installed image added successfully!');
      setImageUrl('');
      setAltText('');
    } else {
      toast.error(res.error || 'Failed to add image. Make sure you have admin rights.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setDeletingId(id);
    const res = await deleteInstalledImage(id, slug);
    if (res.success) {
      toast.success('Image deleted successfully!');
      setImages(images.filter(img => img.id !== id));
    } else {
      toast.error(res.error || 'Failed to delete image');
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Installed Images</h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'add'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Add Image
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Manage Images
          </button>
        </div>
      </div>

      {activeTab === 'add' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Slug</label>
              <select 
                value={pageSlug}
                onChange={(e) => setPageSlug(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                required
              >
                <option value="">Select a Page...</option>
                {VALID_SLUGS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
              <input 
                type="url" 
                value={imageUrl}
                onChange={(e) => setImageUrl(optimizeCloudinaryUrl(e.target.value))}
                onBlur={() => detectAspectRatio(imageUrl)}
                className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                placeholder="https://..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Paste URL and click outside to auto-detect aspect ratio.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alt Text</label>
              <input 
                type="text" 
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                placeholder="Real project installation of..."
                required
              />
            </div>

            {imageUrl && (
              <div className="mt-4 p-4 border rounded-md dark:border-gray-800 flex flex-col items-center">
                <span className="mb-3 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-full tracking-wider">
                  {aspectRatio}
                </span>
                <div className={`relative w-48 bg-gray-100 dark:bg-slate-800 rounded-md overflow-hidden ${previewStyle}`}>
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-amber-600 text-white py-3 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Installed Image'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          {loadingImages ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-12 text-slate-500">
              No installed images found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map(img => (
                <div key={img.id} className="border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-800/50">
                  <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900">
                    <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded backdrop-blur">
                      {img.aspect_ratio}
                    </span>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                      {VALID_SLUGS.find(s => s.value === img.page_slug)?.label || img.page_slug}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 flex-1 mb-3" title={img.alt_text}>
                      {img.alt_text || 'No alt text'}
                    </p>
                    <button
                      onClick={() => handleDelete(img.id, img.page_slug)}
                      disabled={deletingId === img.id}
                      className="flex items-center justify-center gap-2 w-full py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-900/50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
