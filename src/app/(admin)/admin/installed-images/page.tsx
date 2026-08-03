'use client';

import { useState, useEffect } from 'react';
import { addInstalledImage, getInstalledImages, deleteInstalledImage } from '@/actions/installed-images';
import { addAbImage, getAbImages, deleteAbImage } from '@/actions/ab-images';
import { uploadImageToCloudinary, checkCloudinaryFileExists } from '@/actions/cloudinary';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2, Loader2, SplitSquareHorizontal, UploadCloud, AlertTriangle, RefreshCw } from 'lucide-react';
import { getCurrentUserProfile } from '@/actions/admin-core';
import { adminCache } from '@/lib/admin-cache';

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

type UnifiedImage = {
  id: string;
  type: 'standard' | 'ab';
  page_slug: string;
  created_at: string;
  image_url?: string;
  alt_text?: string;
  aspect_ratio?: string;
  before_url?: string;
  before_alt?: string;
  after_url?: string;
  after_alt?: string;
  primary_thumbnail?: string;
  placement?: string;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function InstalledImagesAdmin() {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [role, setRole] = useState<string | null>(null);
  
  // Placement State
  const [placement, setPlacement] = useState<'gallery' | 'top_section'>('gallery');
  const [demoteId, setDemoteId] = useState<string>('');
  const [existingTopImages, setExistingTopImages] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  
  // Add Form State
  const [imageType, setImageType] = useState<'standard' | 'ab'>('standard');
  const [pageSlug, setPageSlug] = useState('');
  
  // Standard Image State
  const [standardFile, setStandardFile] = useState<File | null>(null);
  const [standardUrlInput, setStandardUrlInput] = useState('');
  const [standardPreviewUrl, setStandardPreviewUrl] = useState('');
  const [standardError, setStandardError] = useState('');
  const [altText, setAltText] = useState('');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [previewStyle, setPreviewStyle] = useState('aspect-square');
  
  // A/B Image State
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [beforeUrlInput, setBeforeUrlInput] = useState('');
  const [beforePreviewUrl, setBeforePreviewUrl] = useState('');
  const [beforeAlt, setBeforeAlt] = useState('');
  const [beforeRatio, setBeforeRatio] = useState<number | null>(null);
  const [beforeError, setBeforeError] = useState('');
  
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [afterUrlInput, setAfterUrlInput] = useState('');
  const [afterPreviewUrl, setAfterPreviewUrl] = useState('');
  const [afterAlt, setAfterAlt] = useState('');
  const [afterRatio, setAfterRatio] = useState<number | null>(null);
  const [afterError, setAfterError] = useState('');
  
  const [primaryThumbnail, setPrimaryThumbnail] = useState<'before' | 'after'>('after');
  
  const [loading, setLoading] = useState(false);
  const [ratioMismatchWarning, setRatioMismatchWarning] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Manage State
  const [images, setImages] = useState<UnifiedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters & Pagination
  const [filterType, setFilterType] = useState<'all' | 'standard' | 'ab'>('all');
  const [filterSlug, setFilterSlug] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    setVisibleCount(20);
  }, [filterType, filterSlug, activeTab]);

  useEffect(() => {
    getCurrentUserProfile().then(res => {
      if (res.success && res.profile) {
        setRole(res.profile.role);
      }
    });
  }, []);

  useEffect(() => {
    if (imageType === 'ab' && placement === 'top_section' && pageSlug) {
      setLoadingExisting(true);
      getAbImages().then(res => {
        if (res.success && res.data) {
          const topImages = res.data.filter((img: any) => img.page_slug === pageSlug && img.placement === 'top_section');
          setExistingTopImages(topImages);
          if (topImages.length > 0 && !demoteId) {
             setDemoteId(topImages[0].id);
          }
        }
        setLoadingExisting(false);
      });
    } else {
      setExistingTopImages([]);
      setDemoteId('');
    }
  }, [imageType, placement, pageSlug]);

  const fetchImages = async (forceRefresh = false) => {
    if (!forceRefresh && adminCache.installedImages) {
      setImages(adminCache.installedImages);
      return;
    }
    setLoadingImages(true);
    const [stdRes, abRes] = await Promise.all([
      getInstalledImages(),
      getAbImages()
    ]);

    const unified: UnifiedImage[] = [];

    if (stdRes.success && stdRes.data) {
      stdRes.data.forEach((img: any) => {
        unified.push({
          id: img.id,
          type: 'standard',
          page_slug: img.page_slug,
          created_at: img.created_at,
          image_url: img.image_url,
          alt_text: img.alt_text,
          aspect_ratio: img.aspect_ratio,
        });
      });
    }

    if (abRes.success && abRes.data) {
      abRes.data.forEach((img: any) => {
        unified.push({
          id: img.id,
          type: 'ab',
          page_slug: img.page_slug,
          created_at: img.created_at,
          before_url: img.before_url,
          before_alt: img.before_alt,
          after_url: img.after_url,
          after_alt: img.after_alt,
          primary_thumbnail: img.primary_thumbnail,
          placement: img.placement,
        });
      });
    }

    unified.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setImages(unified);
    adminCache.installedImages = unified;
    setLoadingImages(false);
  };

  const handleRefresh = async () => {
    setLoadingImages(true);
    await fetchImages(true);
    toast.success("Images refreshed");
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchImages();
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (standardPreviewUrl && standardPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(standardPreviewUrl);
      if (beforePreviewUrl && beforePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(beforePreviewUrl);
      if (afterPreviewUrl && afterPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(afterPreviewUrl);
    };
  }, []);

  useEffect(() => {
    if (beforeRatio !== null && afterRatio !== null) {
      const diff = Math.abs(beforeRatio - afterRatio);
      setRatioMismatchWarning(diff > 0.05);
    } else {
      setRatioMismatchWarning(false);
    }
  }, [beforeRatio, afterRatio]);

  const loadImgFromUrl = (url: string, type: 'standard' | 'before' | 'after') => {
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      if (type === 'standard') {
        let ratio = 'square';
        let style = 'aspect-square';
        if (w > h * 1.5) { ratio = 'wide'; style = 'aspect-video'; }
        else if (w > h * 1.2) { ratio = 'landscape'; style = 'aspect-[4/3]'; }
        else if (h > w * 1.2) { ratio = 'portrait'; style = 'aspect-[3/4]'; }
        setAspectRatio(ratio);
        setPreviewStyle(style);
        setStandardPreviewUrl(url);
      } else if (type === 'before') {
        setBeforeRatio(w / h);
        setBeforePreviewUrl(url);
      } else {
        setAfterRatio(w / h);
        setAfterPreviewUrl(url);
      }
    };
    img.src = url;
  };

  const handleStandardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStandardError('');
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      setStandardError('File exceeds 2MB limit. Please select a smaller image.');
      e.target.value = '';
      return;
    }
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      setStandardError('Only JPG, PNG, and WebP images are allowed.');
      e.target.value = '';
      return;
    }
    
    if (standardPreviewUrl && standardPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(standardPreviewUrl);
    
    const objUrl = URL.createObjectURL(file);
    setStandardFile(file);
    setStandardUrlInput('');
    setStandardPreviewUrl(objUrl);
    
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      let ratio = 'square';
      let style = 'aspect-square';
      if (w > h * 1.5) { ratio = 'wide'; style = 'aspect-video'; }
      else if (w > h * 1.2) { ratio = 'landscape'; style = 'aspect-[4/3]'; }
      else if (h > w * 1.2) { ratio = 'portrait'; style = 'aspect-[3/4]'; }
      setAspectRatio(ratio);
      setPreviewStyle(style);
    };
    img.src = objUrl;
  };

  const handleAbFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    if (type === 'before') setBeforeError('');
    else setAfterError('');
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE) {
      if (type === 'before') setBeforeError('File exceeds 2MB limit. Please select a smaller image.');
      else setAfterError('File exceeds 2MB limit. Please select a smaller image.');
      e.target.value = '';
      return;
    }
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      if (type === 'before') setBeforeError('Only JPG, PNG, and WebP images are allowed.');
      else setAfterError('Only JPG, PNG, and WebP images are allowed.');
      e.target.value = '';
      return;
    }
    
    const objUrl = URL.createObjectURL(file);
    
    if (type === 'before') {
      if (beforePreviewUrl && beforePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(beforePreviewUrl);
      setBeforeFile(file);
      setBeforeUrlInput('');
      setBeforePreviewUrl(objUrl);
    } else {
      if (afterPreviewUrl && afterPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(afterPreviewUrl);
      setAfterFile(file);
      setAfterUrlInput('');
      setAfterPreviewUrl(objUrl);
    }
    
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const ratio = w / h;
      if (type === 'before') setBeforeRatio(ratio);
      else setAfterRatio(ratio);
    };
    img.src = objUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    if (!pageSlug) return toast.error('Page Slug is required');

    setLoading(true);

    if (imageType === 'standard') {
      let finalUrl = standardUrlInput;

      if (standardFile) {
        const formData = new FormData();
        formData.append('file', standardFile);
        const uploadRes = await uploadImageToCloudinary(formData, pageSlug);
        if (!uploadRes.success || !uploadRes.secure_url) {
          setUploadError(uploadRes.error || 'Cloudinary upload failed');
          setLoading(false);
          return;
        }
        finalUrl = uploadRes.secure_url;
      }

      if (!finalUrl || !altText) {
        toast.error('File/URL and Alt Text are required');
        setLoading(false);
        return;
      }

      const res = await addInstalledImage({
        page_slug: pageSlug,
        image_url: finalUrl,
        alt_text: altText,
        aspect_ratio: aspectRatio,
      });

      if (res.success) {
        toast.success('Image added successfully!');
        setStandardFile(null);
        setStandardUrlInput('');
        setStandardPreviewUrl('');
        setAltText('');
        setAspectRatio('');
        const input = document.getElementById('standard-file') as HTMLInputElement;
        if (input) input.value = '';
        fetchImages(true);
      } else {
        toast.error(res.error || 'Failed to add image.');
      }
    } else {
      if (beforeFile && afterFile && beforeFile.name === afterFile.name && beforeFile.size === afterFile.size) {
        setUploadError('Before and After images cannot be the exact same file. Please select two different images.');
        setLoading(false);
        return;
      }

      if (beforeUrlInput && afterUrlInput && beforeUrlInput === afterUrlInput) {
        setUploadError('Before and After image URLs cannot be the exact same. Please provide two different URLs.');
        setLoading(false);
        return;
      }

      let finalBeforeUrl = beforeUrlInput;
      let finalAfterUrl = afterUrlInput;

      // Pre-flight check both filenames simultaneously to prevent partial success
      if (beforeFile || afterFile) {
        const checks = [];
        if (beforeFile) checks.push(checkCloudinaryFileExists(beforeFile.name, pageSlug).then(res => ({ type: 'Before', name: beforeFile.name, exists: res.exists })));
        if (afterFile) checks.push(checkCloudinaryFileExists(afterFile.name, pageSlug).then(res => ({ type: 'After', name: afterFile.name, exists: res.exists })));
        
        const checkResults = await Promise.all(checks);
        const existingFiles = checkResults.filter(r => r.exists);
        
        if (existingFiles.length > 0) {
          const errorMsgs = existingFiles.map(r => `An image named "${r.name}" already exists in this folder. Please rename your ${r.type} file.`).join(' | ');
          setUploadError(errorMsgs);
          setLoading(false);
          return;
        }
      }

      const uploads = [];
      if (beforeFile) {
        const beforeFormData = new FormData();
        beforeFormData.append('file', beforeFile);
        uploads.push(uploadImageToCloudinary(beforeFormData, pageSlug).then(res => ({ type: 'before', res })));
      }
      if (afterFile) {
        const afterFormData = new FormData();
        afterFormData.append('file', afterFile);
        uploads.push(uploadImageToCloudinary(afterFormData, pageSlug).then(res => ({ type: 'after', res })));
      }

      if (uploads.length > 0) {
        const results = await Promise.all(uploads);
        for (const item of results) {
          if (!item.res.success || !item.res.secure_url) {
            setUploadError(`Failed for ${item.type} image: ${item.res.error || 'Unknown error'}`);
            setLoading(false);
            return;
          }
          if (item.type === 'before') finalBeforeUrl = item.res.secure_url;
          if (item.type === 'after') finalAfterUrl = item.res.secure_url;
        }
      }

      if (!finalBeforeUrl || !finalAfterUrl || !beforeAlt || !afterAlt) {
        toast.error('Both Before and After inputs & alts are required');
        setLoading(false);
        return;
      }
      if (ratioMismatchWarning) {
        toast.error('Cannot upload: Aspect ratio mismatch');
        setLoading(false);
        return;
      }

      const res = await addAbImage({
        page_slug: pageSlug,
        before_url: finalBeforeUrl,
        before_alt: beforeAlt,
        after_url: finalAfterUrl,
        after_alt: afterAlt,
        primary_thumbnail: primaryThumbnail,
        placement: placement,
        demote_id: placement === 'top_section' && existingTopImages.length >= 2 ? demoteId : undefined,
      });

      if (res.success) {
        toast.success('A/B image pair added successfully!');
        setBeforeFile(null);
        setBeforeUrlInput('');
        setBeforePreviewUrl('');
        setBeforeAlt('');
        setAfterFile(null);
        setAfterUrlInput('');
        setAfterPreviewUrl('');
        setAfterAlt('');
        setBeforeRatio(null);
        setAfterRatio(null);
        const bInput = document.getElementById('before-file') as HTMLInputElement;
        if (bInput) bInput.value = '';
        const aInput = document.getElementById('after-file') as HTMLInputElement;
        if (aInput) aInput.value = '';
        fetchImages(true);
      } else {
        toast.error(res.error || 'Failed to add A/B image.');
      }
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string, slug: string, type: 'standard' | 'ab') => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    setDeletingId(id);
    let res;
    if (type === 'standard') {
      res = await deleteInstalledImage(id, slug);
    } else {
      res = await deleteAbImage(id, slug);
    }

    if (res.success) {
      toast.success('Image deleted successfully!');
      const newImages = images.filter(img => img.id !== id);
      setImages(newImages);
      adminCache.installedImages = newImages;
    } else {
      toast.error(res.error || 'Failed to delete image');
    }
    setDeletingId(null);
  };

  const filteredImages = images.filter(img => {
    if (filterType !== 'all' && img.type !== filterType) return false;
    if (filterSlug !== 'all' && img.page_slug !== filterSlug) return false;
    return true;
  });

  const uniqueSlugs = Array.from(new Set(images.map(img => img.page_slug)));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Installed Images</h1>
          <button onClick={handleRefresh} className="p-2 ml-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors shadow-sm" title="Refresh Data">
            <RefreshCw size={20} />
          </button>
        </div>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setImageType('standard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  imageType === 'standard'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Standard Installed Image
              </button>
              <button
                type="button"
                onClick={() => setImageType('ab')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  imageType === 'ab'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Before & After (A/B) Image
              </button>
            </div>

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

            {imageType === 'standard' ? (
              <>
                <div className={standardUrlInput ? "opacity-50 transition-opacity focus-within:opacity-100" : "transition-opacity"}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image File (JPG, PNG, WebP &lt; 2MB)</label>
                  <input 
                    id="standard-file"
                    type="file" 
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleStandardFileChange}
                    className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-white cursor-pointer"
                  />
                  {standardError && <p className="text-red-500 text-sm mt-1">{standardError}</p>}
                </div>
                  
                  <div className="flex items-center gap-4 my-3">
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">OR</span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                  </div>

                <div className={standardFile ? "opacity-50 transition-opacity focus-within:opacity-100" : "transition-opacity"}>
                  <input 
                    type="url"
                    value={standardUrlInput}
                    onChange={(e) => {
                      setStandardUrlInput(e.target.value);
                      if (e.target.value) {
                        setStandardFile(null);
                        const fileInput = document.getElementById('standard-file') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }
                    }}
                    onBlur={() => loadImgFromUrl(standardUrlInput, 'standard')}
                    className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                    placeholder="Paste Image URL directly..."
                  />
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

                {standardPreviewUrl && (
                  <div className="mt-4 p-4 border rounded-md dark:border-gray-800 flex flex-col items-center">
                    <span className="mb-3 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-full tracking-wider">
                      {aspectRatio}
                    </span>
                    <div className={`relative w-48 bg-gray-100 dark:bg-slate-800 rounded-md overflow-hidden ${previewStyle}`}>
                      <img src={standardPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 border rounded-lg border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
                
                {ratioMismatchWarning && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm font-medium border border-red-200 dark:border-red-800/50">
                    <AlertTriangle size={18} />
                    Warning: Make sure both images have the exact same ratio/shape/size, otherwise the Before/After slider will distort.
                  </div>
                )}
                
                <div className="pt-2 pb-4 border-b border-amber-200/50 dark:border-amber-800/50">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Where should this image go?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                      <input 
                        type="radio" 
                        name="placement" 
                        value="gallery" 
                        checked={placement === 'gallery'} 
                        onChange={() => setPlacement('gallery')}
                        className="accent-amber-600"
                      />
                      Add to Gallery (Bottom)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                      <input 
                        type="radio" 
                        name="placement" 
                        value="top_section" 
                        checked={placement === 'top_section'} 
                        onChange={() => setPlacement('top_section')}
                        className="accent-amber-600"
                      />
                      Set in Top A/B Section (Max 2)
                    </label>
                  </div>
                </div>

                {placement === 'top_section' && loadingExisting && (
                  <div className="text-sm text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin" size={14}/> Checking top section capacity...</div>
                )}

                {placement === 'top_section' && !loadingExisting && existingTopImages.length >= 2 && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg">
                    <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2 mb-2">
                      <AlertTriangle size={16}/> Top Section is Full (2/2)
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">
                      To add this new image to the Top Section, you must choose one of the existing images to move to the Gallery.
                    </p>
                    <div className="space-y-3">
                      {existingTopImages.map((img: any) => (
                        <label key={img.id} className="flex gap-3 items-start p-3 bg-white dark:bg-slate-800 rounded border border-orange-100 dark:border-orange-900/50 cursor-pointer hover:border-orange-300 transition-colors">
                          <input 
                            type="radio" 
                            name="demoteId"
                            value={img.id}
                            checked={demoteId === img.id}
                            onChange={() => setDemoteId(img.id)}
                            className="mt-1 accent-orange-600"
                          />
                          <div className="flex gap-2 h-16">
                            <img src={img.before_url} alt="Before" className="h-full w-auto object-cover rounded" />
                            <img src={img.after_url} alt="After" className="h-full w-auto object-cover rounded" />
                          </div>
                          <div className="text-xs text-gray-500">
                            Move this pair to gallery
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Before Image */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Before Image</h3>
                    <div className={beforeUrlInput ? "opacity-50 transition-opacity focus-within:opacity-100" : "transition-opacity"}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before File</label>
                      <input 
                        id="before-file"
                        type="file" 
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => handleAbFileChange(e, 'before')}
                        className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 dark:file:bg-slate-700 dark:file:text-white cursor-pointer"
                      />
                      {beforeError && <p className="text-red-500 text-sm mt-1">{beforeError}</p>}
                    </div>
                      
                      <div className="flex items-center gap-4 my-3">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">OR</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                      </div>

                    <div className={beforeFile ? "opacity-50 transition-opacity focus-within:opacity-100" : "transition-opacity"}>
                      <input 
                        type="url"
                        value={beforeUrlInput}
                        onChange={(e) => {
                          setBeforeUrlInput(e.target.value);
                          if (e.target.value) {
                            setBeforeFile(null);
                            const fileInput = document.getElementById('before-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }
                        }}
                        onBlur={() => loadImgFromUrl(beforeUrlInput, 'before')}
                        className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                        placeholder="Paste Image URL directly..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Before Alt Text</label>
                      <input 
                        type="text" 
                        value={beforeAlt}
                        onChange={(e) => setBeforeAlt(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                        placeholder="Old damaged wall..."
                        required
                      />
                    </div>
                    {beforePreviewUrl && (
                      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                        <img src={beforePreviewUrl} alt="Before preview" className="w-full h-full object-cover" />
                        {beforeRatio !== null && (
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">Ratio: {beforeRatio.toFixed(3)}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* After Image */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">After Image</h3>
                    <div className={afterUrlInput ? "opacity-50 transition-opacity focus-within:opacity-100" : "transition-opacity"}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After File</label>
                      <input 
                        id="after-file"
                        type="file" 
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => handleAbFileChange(e, 'after')}
                        className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 dark:file:bg-slate-700 dark:file:text-white cursor-pointer"
                      />
                      {afterError && <p className="text-red-500 text-sm mt-1">{afterError}</p>}
                    </div>
                      
                      <div className="flex items-center gap-4 my-3">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">OR</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                      </div>

                    <div className={afterFile ? "opacity-50 transition-opacity focus-within:opacity-100" : "transition-opacity"}>
                      <input 
                        type="url"
                        value={afterUrlInput}
                        onChange={(e) => {
                          setAfterUrlInput(e.target.value);
                          if (e.target.value) {
                            setAfterFile(null);
                            const fileInput = document.getElementById('after-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }
                        }}
                        onBlur={() => loadImgFromUrl(afterUrlInput, 'after')}
                        className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                        placeholder="Paste Image URL directly..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">After Alt Text</label>
                      <input 
                        type="text" 
                        value={afterAlt}
                        onChange={(e) => setAfterAlt(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
                        placeholder="New WPC panels installed..."
                        required
                      />
                    </div>
                    {afterPreviewUrl && (
                      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                        <img src={afterPreviewUrl} alt="After preview" className="w-full h-full object-cover" />
                        {afterRatio !== null && (
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">Ratio: {afterRatio.toFixed(3)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Primary Option in Grid (Gallery Thumbnail)</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                      <input 
                        type="radio" 
                        name="primary_thumbnail" 
                        value="before" 
                        checked={primaryThumbnail === 'before'} 
                        onChange={() => setPrimaryThumbnail('before')}
                        className="accent-amber-600"
                      />
                      Show Before Image
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                      <input 
                        type="radio" 
                        name="primary_thumbnail" 
                        value="after" 
                        checked={primaryThumbnail === 'after'} 
                        onChange={() => setPrimaryThumbnail('after')}
                        className="accent-amber-600"
                      />
                      Show After Image
                    </label>
                  </div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-500/50 rounded-md text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3">
                <AlertTriangle size={18} className="shrink-0" />
                <p>{uploadError}</p>
              </div>
            )}

            <button 
              onClick={(e) => {
                if (role === 'team') {
                  e.preventDefault();
                  toast.error("You have read-only access. You cannot edit, upload, or delete content.", { duration: 4000 });
                  return;
                }
              }}
              type="submit" 
              disabled={loading || ratioMismatchWarning}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-amber-600 text-white py-3 rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Uploading...</>
              ) : (
                <><UploadCloud size={20} /> {imageType === 'standard' ? 'Upload & Add Image' : 'Upload & Add A/B Pair'}</>
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filter by Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full sm:max-w-xs px-3 py-2 text-sm border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
              >
                <option value="all">All Images</option>
                <option value="standard">Standard Images Only</option>
                <option value="ab">Before/After Images Only</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filter by Product</label>
              <select 
                value={filterSlug}
                onChange={(e) => setFilterSlug(e.target.value)}
                className="w-full sm:max-w-xs px-3 py-2 text-sm border rounded-md dark:bg-slate-800 dark:border-gray-700 text-slate-900 dark:text-white"
              >
                <option value="all">All Products</option>
                {uniqueSlugs.map(slug => (
                  <option key={slug} value={slug}>
                    {VALID_SLUGS.find(s => s.value === slug)?.label || slug}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingImages ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center p-12 text-slate-500">
              No images found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredImages.slice(0, visibleCount).map(img => (
                <div key={img.id} className="border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-800/50">
                  {img.type === 'standard' ? (
                    <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900">
                      <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded backdrop-blur">
                        {img.aspect_ratio}
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-900 flex">
                      <div className="w-1/2 h-full border-r border-white/20 relative">
                        <img src={img.before_url} alt={img.before_alt} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 text-[8px] uppercase bg-black/60 text-white px-1 rounded">Before</span>
                      </div>
                      <div className="w-1/2 h-full relative">
                        <img src={img.after_url} alt={img.after_alt} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 text-[8px] uppercase bg-black/60 text-white px-1 rounded">After</span>
                      </div>
                      <div className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                        <SplitSquareHorizontal size={12} />
                        A/B PAIR
                      </div>
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur border border-white/10">
                          P: {img.primary_thumbnail?.toUpperCase()}
                        </div>
                        {(img.placement || 'gallery') && (
                          <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur border border-white/10 ${img.placement === 'top_section' ? 'bg-amber-600/90 text-white' : 'bg-slate-600/90 text-white'}`}>
                            {img.placement === 'top_section' ? 'TOP SECTION' : 'GALLERY'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1 line-clamp-1">
                      {VALID_SLUGS.find(s => s.value === img.page_slug)?.label || img.page_slug}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 flex-1 mb-3" title={img.type === 'standard' ? img.alt_text : `Before: ${img.before_alt}\nAfter: ${img.after_alt}`}>
                      {img.type === 'standard' ? (img.alt_text || 'No alt text') : `B: ${img.before_alt} | A: ${img.after_alt}`}
                    </p>
                    <button
                      onClick={(e) => {
                        if (role === 'team') {
                          e.preventDefault();
                          toast.error("You have read-only access. You cannot edit, upload, or delete content.", { duration: 4000 });
                          return;
                        }
                        handleDelete(img.id, img.page_slug, img.type);
                      }}
                      disabled={deletingId === img.id}
                      className="flex items-center justify-center gap-2 w-full py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-900/50 transition-colors disabled:opacity-50 mt-auto"
                    >
                      {deletingId === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingImages && visibleCount < filteredImages.length && (
            <div className="flex justify-center mt-8 pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-md transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
