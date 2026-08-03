"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, Plus, Trash2, Link as LinkIcon, Info, RefreshCw, 
  UploadCloud, AlertCircle, LayoutGrid, Edit, X
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAdminCatalogs, addAdminCatalog, deleteAdminCatalog, updateAdminCatalog, getB2PresignedUploadUrl, CatalogData } from "@/actions/admin-catalogs";
import { getCurrentUserProfile } from "@/actions/admin-core";
import { uploadDynamicProductImages, checkCloudinaryDuplicate } from "@/actions/cloudinary-actions";
import { adminCache } from "@/lib/admin-cache";
import Image from "next/image";

export default function CatalogsManager() {
  const [catalogs, setCatalogs] = useState<CatalogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [catalogToDelete, setCatalogToDelete] = useState<CatalogData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [editingCatalog, setEditingCatalog] = useState<CatalogData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    seoKeywords: "",
    image: ""
  });
  
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [imageOption, setImageOption] = useState<'url' | 'upload'>('upload');
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'manage' | 'upload'>('manage');
  const [role, setRole] = useState<string>('user');

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    seoKeywords: ""
  });

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    
    // Fetch Role
    const profileRes = await getCurrentUserProfile();
    if (profileRes.success && profileRes.profile) {
      setRole(profileRes.profile.role);
    }

    // Fetch Catalogs
    if (!forceRefresh && adminCache.catalogs) {
      setCatalogs(adminCache.catalogs);
      setLoading(false);
      return;
    }
    
    const res = await getAdminCatalogs();
    if (res.success && res.data) {
      setCatalogs(res.data);
      adminCache.catalogs = res.data;
    } else {
      toast.error(res.error || "Failed to load catalogs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        e.target.value = "";
        return;
      }
      setPdfFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 1. Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must not exceed 2MB.");
        e.target.value = "";
        setImageFile(null);
        return;
      }

      // 2. Check aspect ratio (4:3)
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const targetRatio = 4 / 3;
        const actualRatio = img.width / img.height;
        
        // Allow a small 5% margin of error for slight pixel rounding differences
        if (Math.abs(targetRatio - actualRatio) > 0.05) {
          toast.error(`Image shape must be 4:3 ratio (Current is ${img.width}x${img.height}). Please resize.`);
          e.target.value = "";
          setImageFile(null);
        } else {
          setImageFile(file);
          toast.success("Image selected successfully.");
        }
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'team') {
      toast.error("You have read-only access. You cannot upload catalogs.", { icon: '🔒' });
      return;
    }

    if (!form.name || !form.slug || !form.metaTitle || !form.metaDescription || !pdfFile || !imageFile) {
      toast.error("Please fill all required fields, upload a PDF, and upload a thumbnail image.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Pre-check Cloudinary duplicate
      const imgCheckName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.')).replace(/[^a-zA-Z0-9-_]/g, '_') || `image_${Date.now()}`;
      const cloudinaryCheck = await checkCloudinaryDuplicate(imgCheckName, 'goals-catalogs');
      if (cloudinaryCheck.exists) {
        throw new Error(`Yeh images ke naam pehle se hi hain Cloudinary par: ${imgCheckName}. Kripya name change karein.`);
      }

      // 2. Pre-check Backblaze B2 duplicate AND get Presigned URL
      const filename = `Goals Floors ${form.name.replace(/ /g, '%20')}.pdf`;
      const presignedRes = await getB2PresignedUploadUrl(filename, pdfFile.type);
      
      if (!presignedRes.success || !presignedRes.uploadUrl || !presignedRes.publicUrl) {
        throw new Error(presignedRes.error || "Failed to get PDF upload URL");
      }

      // Both checks passed! Now we can safely upload.

      // 3. Upload Image to Cloudinary
      const base64Image = await convertFileToBase64(imageFile);
      const imgRes = await uploadDynamicProductImages([{ base64: base64Image, name: imgCheckName }], 'goals-catalogs');
      
      if (!imgRes.success || !imgRes.data || imgRes.data.length === 0 || !imgRes.data[0]) {
        throw new Error(imgRes.error || "Failed to upload thumbnail image to Cloudinary.");
      }
      const uploadedImageUrl = imgRes.data[0];

      // 4. Upload PDF to Backblaze B2 with Progress
      const uploadWithProgress = (url: string, file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", url, true);
          xhr.setRequestHeader("Content-Type", file.type);
          
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(percent);
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else reject(new Error("Failed to upload PDF directly to storage. (CORS error?)"));
          };
          
          xhr.onerror = () => reject(new Error("Network error occurred while uploading."));
          
          xhr.send(file);
        });
      };

      setUploadProgress(1); // Show progress bar
      await uploadWithProgress(presignedRes.uploadUrl, pdfFile);

      // 5. Add to DB
      const dbRes = await addAdminCatalog({
        name: form.name,
        slug: form.slug,
        url: presignedRes.publicUrl,
        image: uploadedImageUrl,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        seoKeywords: form.seoKeywords || form.name.toLowerCase(),
      });

      if (dbRes.success) {
        toast.success("Catalog added successfully!");
        setForm({ name: "", slug: "", metaTitle: "", metaDescription: "", seoKeywords: "" });
        setPdfFile(null);
        setImageFile(null);
        
        const pdfInput = document.getElementById("pdf-file") as HTMLInputElement;
        if (pdfInput) pdfInput.value = "";
        
        const imgInput = document.getElementById("image-file") as HTMLInputElement;
        if (imgInput) imgInput.value = "";

        fetchData(true);
        setActiveTab('manage'); 
      } else {
        throw new Error(dbRes.error || "Failed to save catalog to database");
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (role === 'team') {
      toast.error("You have read-only access. You cannot delete catalogs.", { icon: '🔒' });
      return;
    }
    
    setDeletingId(id);
    const res = await deleteAdminCatalog(id);
    if (res.success) {
      toast.success("Catalog and PDF deleted permanently");
      const newCats = catalogs.filter(c => c.id !== id);
      setCatalogs(newCats);
      adminCache.catalogs = newCats;
      setEditingCatalog(null);
      setCatalogToDelete(null);
    } else {
      toast.error(res.error || "Failed to delete");
    }
    setDeletingId(null);
  };

  const openEditModal = (catalog: CatalogData) => {
    if (role === 'team') {
      toast.error("You have read-only access. You cannot edit catalogs.", { icon: '🔒' });
      return;
    }
    setEditingCatalog(catalog);
    setEditForm({
      name: catalog.name,
      slug: catalog.slug,
      metaTitle: catalog.metaTitle || (catalog as any).meta_title || "",
      metaDescription: catalog.metaDescription || (catalog as any).meta_description || "",
      seoKeywords: catalog.seoKeywords || (catalog as any).seo_keywords || "",
      image: catalog.image || ""
    });
    setEditImageFile(null);
    setEditImageUrl("");
    setEditImagePreview(null);
  };

  const optimizeCloudinaryUrl = (url: string) => {
    if (!url.includes("cloudinary.com")) return url;
    if (url.includes("f_auto") && url.includes("q_auto")) return url;
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
    return url;
  };

  const handleEditImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { 
        toast.error("Image size must not exceed 2MB."); 
        e.target.value = "";
        return; 
      }
      
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const targetRatio = 4 / 3;
        const actualRatio = img.width / img.height;
        if (Math.abs(targetRatio - actualRatio) > 0.05) {
          toast.error(`Image shape must be 4:3 ratio (Current is ${img.width}x${img.height}). Please resize.`);
          setEditImageFile(null);
          setEditImagePreview(null);
        } else {
          setEditImageFile(file);
          setEditImagePreview(objectUrl);
        }
      };
      img.src = objectUrl;
    }
  };

  const handleEditImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setEditImageUrl(url);
    if (!url) {
      setEditImagePreview(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      const targetRatio = 4 / 3;
      const actualRatio = img.width / img.height;
      if (Math.abs(targetRatio - actualRatio) > 0.05) {
        toast.error(`URL image is not 4:3 ratio (Current is ${img.width}x${img.height}).`);
        setEditImagePreview(null);
      } else {
        setEditImagePreview(url);
      }
    };
    img.onerror = () => {
      setEditImagePreview(null);
    };
    img.src = url;
  };

  const saveImagePopup = () => {
    if (!editImagePreview) {
      toast.error("Please provide a valid 4:3 image first.");
      return;
    }
    if (imageOption === 'url') {
      const optUrl = optimizeCloudinaryUrl(editImageUrl);
      setEditForm(prev => ({ ...prev, image: optUrl }));
      setEditImageFile(null);
    } else {
      setEditForm(prev => ({ ...prev, image: editImagePreview }));
    }
    setShowImagePopup(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalog) return;
    
    if (role === 'team') {
      toast.error("You have read-only access. You cannot edit catalogs.", { icon: '🔒' });
      return;
    }

    setIsUpdating(true);
    let finalImageUrl = editForm.image;

    if (editImageFile) {
      const base64Image = await convertFileToBase64(editImageFile);
      const imgUploadName = editImageFile.name.substring(0, editImageFile.name.lastIndexOf('.')).replace(/[^a-zA-Z0-9-_]/g, '_') || `image_${Date.now()}`;
      const imgRes = await uploadDynamicProductImages([{ base64: base64Image, name: imgUploadName }], 'goals-catalogs');
      if (imgRes.success && imgRes.data && imgRes.data[0]) {
        finalImageUrl = imgRes.data[0];
      } else {
        toast.error(imgRes.error || "Failed to upload new thumbnail");
        setIsUpdating(false);
        return;
      }
    }

    const payloadToSave = { ...editForm, image: finalImageUrl };
    const res = await updateAdminCatalog(editingCatalog.id, payloadToSave);
    if (res.success) {
      toast.success("Catalog updated!");
      setEditingCatalog(null);
      fetchData(true);
    } else {
      toast.error(res.error || "Failed to update catalog");
    }
    setIsUpdating(false);
  };

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto pb-20">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-xl shadow-lg shadow-rose-500/25">
              <FileText className="text-white w-6 h-6" />
            </div>
            Catalog PDF Manager
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Upload and manage PDFs for the public Catalogs page.</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl text-sm transition-all"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'manage'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <LayoutGrid size={18} /> Manage Catalogs
          </button>
          
          <button
            onClick={() => {
              if (role === 'team') {
                toast.error("You have read-only access. You cannot upload catalogs.", { icon: '🔒' });
              } else {
                setActiveTab('upload');
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <UploadCloud size={18} /> Upload New
          </button>
        </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : activeTab === 'upload' && role !== 'team' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-5xl mx-auto shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <UploadCloud className="text-blue-500 w-6 h-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Catalog</h3>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: General & Files */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catalog Name *</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Upfit Panels Catalog"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL Slug *</label>
                <input
                  required
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  placeholder="e.g. upfit-panels"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thumbnail Image * (4:3 ratio, max 2MB)</label>
                <input
                  required
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm text-slate-500 border border-slate-200 dark:border-slate-800 p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PDF File *</label>
                <input
                  required
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 text-sm text-slate-500 border border-slate-200 dark:border-slate-800 p-2 rounded-xl"
                />
              </div>
            </div>

            {/* Right Column: SEO Metadata */}
            <div className="space-y-5 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <Info size={14} /> Required SEO Fields
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Title *</label>
                <input
                  required
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Description *</label>
                <textarea
                  required
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SEO Keywords (Optional)</label>
                <input
                  name="seoKeywords"
                  value={form.seoKeywords}
                  onChange={handleInputChange}
                  placeholder="e.g. wpc panels, exterior ceilings"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="pt-4">
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4 bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between text-xs font-bold text-blue-600 mb-2">
                      <span>Uploading PDF...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || uploadProgress > 0}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      {uploadProgress > 0 ? "Uploading to Storage..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <UploadCloud size={20} />
                      Save Catalog
                    </>
                  )}
                </button>
              </div>
            </div>
            
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {catalogs.map((catalog) => (
            <div key={catalog.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group">
              
              <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {catalog.image ? (
                  <Image src={catalog.image} alt={catalog.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FileText size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-5">
                  <h3 className="text-white font-black text-lg leading-tight drop-shadow-md">{catalog.name}</h3>
                  <p className="text-white/80 font-mono text-xs mt-1 drop-shadow-md">{catalog.slug}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={`/catalogs/${catalog.slug}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
                >
                  <LinkIcon size={14} /> View PDF
                </a>
                
                <button
                  onClick={() => openEditModal(catalog)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit Catalog"
                >
                  <Edit size={16} />
                </button>
              </div>

            </div>
          ))}
          {catalogs.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No catalogs found. {role !== 'team' && "Upload one to get started!"}</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Edit className="text-blue-500" />
                Edit Catalog
              </h3>
              <button 
                onClick={() => setEditingCatalog(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catalog Name *</label>
                  <input
                    required
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {editingCatalog.name !== editForm.name && (
                    <p className="text-[10px] text-slate-400 mt-1 italic">Original: {editingCatalog.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL Slug *</label>
                  <input
                    required
                    name="slug"
                    value={editForm.slug}
                    onChange={handleEditChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {editingCatalog.slug !== editForm.slug && (
                    <p className="text-[10px] text-slate-400 mt-1 italic">Original: {editingCatalog.slug}</p>
                  )}
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="w-24 h-18 relative rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 aspect-[4/3]">
                    <Image src={editForm.image || editingCatalog.image} fill className="object-cover" alt="Thumbnail" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Thumbnail Image</h4>
                    <p className="text-xs text-slate-500 mb-2">4:3 ratio required for optimal display.</p>
                    <button type="button" onClick={() => setShowImagePopup(true)} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-bold rounded-lg text-xs transition-colors">
                      Change Image
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Title *</label>
                <input
                  required
                  name="metaTitle"
                  value={editForm.metaTitle}
                  onChange={handleEditChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {editingCatalog.metaTitle !== editForm.metaTitle && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">Original: {editingCatalog.metaTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meta Description *</label>
                <textarea
                  required
                  name="metaDescription"
                  value={editForm.metaDescription}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
                {editingCatalog.metaDescription !== editForm.metaDescription && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">Original: {editingCatalog.metaDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">SEO Keywords</label>
                <input
                  name="seoKeywords"
                  value={editForm.seoKeywords}
                  onChange={handleEditChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {editingCatalog.seoKeywords !== editForm.seoKeywords && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">Original: {editingCatalog.seoKeywords}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCatalogToDelete(editingCatalog)}
                  disabled={deletingId === editingCatalog.id}
                  className="w-full sm:w-auto px-6 py-3 text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deletingId === editingCatalog.id ? <RefreshCw className="animate-spin w-4 h-4" /> : <Trash2 size={18} />}
                  Delete Catalog
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditingCatalog(null)}
                    className="flex-1 sm:flex-none px-6 py-3 text-slate-600 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? <RefreshCw className="animate-spin w-5 h-5" /> : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Image Sub-Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Update Thumbnail Image</h3>
            
            <div className="flex items-center gap-2 mb-6 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl w-fit">
              <button type="button" onClick={() => setImageOption('upload')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${imageOption === 'upload' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upload File</button>
              <button type="button" onClick={() => setImageOption('url')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${imageOption === 'url' ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Cloudinary URL</button>
            </div>

            {imageOption === 'upload' ? (
              <div className="space-y-4">
                 <input type="file" accept="image/*" onChange={handleEditImageFileChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm text-slate-500 border border-slate-200 dark:border-slate-800 p-2 rounded-xl" />
                 {editImagePreview && (
                   <div className="mt-4 relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                     <Image src={editImagePreview} fill className="object-cover" alt="Preview" />
                   </div>
                 )}
              </div>
            ) : (
              <div className="space-y-4">
                 <input type="text" placeholder="https://res.cloudinary.com/..." value={editImageUrl} onChange={handleEditImageUrlChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                 {editImagePreview && (
                   <div className="mt-4 relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                     <Image src={editImagePreview} fill className="object-cover" alt="Preview" />
                   </div>
                 )}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => { setShowImagePopup(false); setEditImageFile(null); setEditImageUrl(""); setEditImagePreview(null); }} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
              <button type="button" onClick={saveImagePopup} className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">Apply Image</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {catalogToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl border border-rose-100 dark:border-rose-900/30 p-6 text-center">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Delete Permanently?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <strong>{catalogToDelete.name}</strong>? This will permanently remove it from the database and delete its PDF file from Backblaze storage. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setCatalogToDelete(null)}
                disabled={deletingId === catalogToDelete.id}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => handleDelete(catalogToDelete.id)}
                disabled={deletingId === catalogToDelete.id}
                className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deletingId === catalogToDelete.id ? <RefreshCw className="animate-spin w-4 h-4" /> : <Trash2 size={18} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
