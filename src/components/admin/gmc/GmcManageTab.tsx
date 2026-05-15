"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Trash2,
  Edit,
  ExternalLink,
  AlertCircle,
  X,
  RefreshCw,
  LayoutList,
  Save,
  Image as ImageIcon,
  Tag,
  IndianRupee,
  Link as LinkIcon,
  Info,
} from "lucide-react";
import { 
  getAdminPublishedProducts, 
  deleteGmcProduct, 
  updateGmcProduct 
} from "@/actions/gmc-manage";
import toast from "react-hot-toast";

export default function GmcManageTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load products on mount
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminPublishedProducts();
      if (res.success && res.products) setProducts(res.products);
      else toast.error(res.error || "Failed to load products");
    } catch (e: any) {
      toast.error(e.message || "Error loading products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filteredProducts = products.filter(p => 
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.offerId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product from Google Merchant Center?")) return;
    setIsDeleting(true);
    try {
      const res = await deleteGmcProduct(productId);
      if (res.success) {
        toast.success("Product deleted from GMC");
        setSelectedProduct(null);
        await loadProducts();
      } else {
        toast.error(res.error || "Delete failed");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Prepare data (omitting statusInfo which is added by our action)
      const { statusInfo, ...cleanData } = selectedProduct;
      const res = await updateGmcProduct(cleanData);
      if (res.success) {
        toast.success("Product updated successfully! 🚀");
        setSelectedProduct(null);
        await loadProducts();
      } else {
        toast.error(res.error || "Update failed");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      {/* ── Header & Search ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <LayoutList size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">Manage Admin Products</h3>
              <p className="text-xs text-slate-500">Edit or delete products published via this panel.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-64 transition-all"
              />
            </div>
            <button 
              onClick={loadProducts} 
              disabled={isLoading}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="mt-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
              <p className="text-sm font-medium text-slate-500">Loading admin products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Info size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No products found matching your search.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredProducts.map((p) => {
                  const statusInfo = p.statusInfo;
                  const isApproved = statusInfo?.destinationStatuses?.some((ds: any) => ds.status?.toLowerCase() === "approved");
                  const hasIssues = statusInfo?.itemLevelIssues?.length > 0;
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {p.imageLink ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.imageLink} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><ImageIcon size={18}/></div>
                          )}
                          <div className="max-w-[200px]">
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{p.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-[11px] text-slate-500">{p.offerId}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isApproved 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                            : hasIssues
                            ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
                            : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                        }`}>
                          {isApproved ? "Approved" : hasIssues ? "Has Issues" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-black text-slate-900 dark:text-white">
                        {p.price?.currency} {p.price?.value}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => setSelectedProduct(p)}
                          className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg text-indigo-500 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Product Control Modal ── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col scale-in duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Edit size={18} />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Edit Product Details</h3>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Error Banner */}
              {selectedProduct.statusInfo?.itemLevelIssues?.length > 0 && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900 rounded-2xl">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest mb-2">
                    <AlertCircle size={14} /> Critical Issues found by Google
                  </div>
                  <ul className="space-y-1">
                    {selectedProduct.statusInfo.itemLevelIssues.map((issue: any, i: number) => (
                      <li key={i} className="text-xs text-rose-500/90 leading-relaxed">• {issue.description}: {issue.detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form Grid */}
              <form id="edit-form" onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Tag size={10}/> SKU (Cannot Change)
                    </label>
                    <input disabled value={selectedProduct.offerId} className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-60 font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <IndianRupee size={10}/> Price
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={selectedProduct.price?.value || ""} 
                      onChange={(e) => setSelectedProduct({...selectedProduct, price: {...selectedProduct.price, value: e.target.value}})}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                  <input 
                    type="text" 
                    value={selectedProduct.title || ""} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    rows={4}
                    value={selectedProduct.description || ""} 
                    onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all resize-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <LinkIcon size={10}/> Landing Page
                    </label>
                    <input 
                      type="url" 
                      value={selectedProduct.link || ""} 
                      onChange={(e) => setSelectedProduct({...selectedProduct, link: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <ImageIcon size={10}/> Image Link
                    </label>
                    <input 
                      type="url" 
                      value={selectedProduct.imageLink || ""} 
                      onChange={(e) => setSelectedProduct({...selectedProduct, imageLink: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all" 
                    />
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <button 
                  onClick={() => handleDelete(selectedProduct.id)}
                  disabled={isDeleting}
                  className="px-5 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete Product
                </button>
                <div className="flex items-center gap-3">
                   <button 
                    form="edit-form"
                    type="submit"
                    disabled={isUpdating}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Update Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
