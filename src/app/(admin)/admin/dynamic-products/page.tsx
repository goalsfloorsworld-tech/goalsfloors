"use client";

import React, { useState, useEffect } from "react";
import { Plus, Package, Trash2, Edit, AlertCircle, Image as ImageIcon, X } from "lucide-react";
import { getCurrentUserProfile } from "@/actions/admin-core";
import { 
  addDynamicProduct, 
  getDynamicProducts, 
  updateDynamicProduct, 
  deleteDynamicProduct 
} from "@/actions/dynamic-products";
import toast from "react-hot-toast";
import { optimizeCloudinaryUrl } from "@/lib/utils";

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

export default function DynamicProductsPage() {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slug, setSlug] = useState("wall-panels");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [unit, setUnit] = useState("panel");
  const [details, setDetails] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([{ url: "", alt: "", name: "", gmc_title: "", gmc_variant_description: "" }]);
  const [pushToGmc, setPushToGmc] = useState(false);
  const [gmcDescription, setGmcDescription] = useState("");

  useEffect(() => {
    const p = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    const m = parseFloat(mrp.replace(/[^0-9.]/g, '')) || 0;
    if (p > 0 && m > 0 && m > p) {
      const discountPercent = Math.round(((m - p) / m) * 100);
      setDiscount(`${discountPercent}% off`);
    } else {
      setDiscount("");
    }
  }, [price, mrp]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const userRes = await getCurrentUserProfile();
      if (userRes.success) {
        setRole(userRes.profile?.role ?? null);
      }
      await fetchProducts();
      setLoading(false);
    }
    loadData();
  }, []);

  const fetchProducts = async () => {
    const res = await getDynamicProducts();
    if (res.success && 'data' in res) {
      setProducts(res.data as any[]);
    }
  };

  const hasAdminAccess = role === "admin" || role === "administrator";

  const handleAddDetail = () => setDetails([...details, { key: "", value: "" }]);
  const handleRemoveDetail = (index: number) => setDetails(details.filter((_, i) => i !== index));
  const handleDetailChange = (index: number, field: 'key' | 'value', val: string) => {
    const newDetails = [...details];
    newDetails[index][field] = val;
    setDetails(newDetails);
  };

  const handleAddImage = () => setImages([...images, { url: "", alt: "", name: "", gmc_title: "", gmc_variant_description: "" }]);
  const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const handleImageChange = (index: number, field: 'url' | 'alt' | 'name' | 'gmc_title' | 'gmc_variant_description', val: string) => {
    const newImages = [...images];
    (newImages[index] as any)[field] = val;
    setImages(newImages);
  };

  const resetForm = () => {
    setEditingId(null);
    setSlug("wall-panels");
    setName("");
    setPrice("");
    setMrp("");
    setDiscount("");
    setUnit("panel");
    setDetails([{ key: "", value: "" }]);
    setImages([{ url: "", alt: "", name: "", gmc_title: "", gmc_variant_description: "" }]);
    setPushToGmc(false);
    setGmcDescription("");
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setSlug(product.page_slug);
    const data = product.product_data;
    setName(data.name || "");
    setPrice(data.price || "");
    setMrp(data.mrp || "");
    setDiscount(data.discount || "");
    setUnit(data.unit || "");
    
    if (data.details) {
      const detailsArray = Object.entries(data.details).map(([key, value]) => ({ key, value: String(value) }));
      setDetails(detailsArray.length ? detailsArray : [{ key: "", value: "" }]);
    } else {
      setDetails([{ key: "", value: "" }]);
    }
    
    if (data.images && Array.isArray(data.images)) {
      setImages(data.images.map((img: any) => typeof img === 'string' ? { url: img, alt: "", name: "", gmc_title: "", gmc_variant_description: "" } : { url: img.url || "", alt: img.alt || "", name: img.name || "", gmc_title: img.gmc_title || "", gmc_variant_description: img.gmc_variant_description || "" }));
    } else {
      setImages([{ url: "", alt: "", name: "", gmc_title: "", gmc_variant_description: "" }]);
    }
    
    setActiveTab('add');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAdminAccess) {
      toast.error("Unauthorized: Only Administrators can modify dynamic products.");
      return;
    }
    
    const p = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    const m = parseFloat(mrp.replace(/[^0-9.]/g, '')) || 0;

    if (p > 0 && m > 0 && p > m) {
      toast.error("Price cannot be greater than MRP!");
      return;
    }

    setIsSubmitting(true);
    
    const priceValue = Math.round(p);
    
    const detailsObj: Record<string, string> = {};
    details.forEach(d => {
      if (d.key.trim() && d.value.trim()) {
        detailsObj[d.key.trim()] = d.value.trim();
      }
    });

    const validImages = images
      .filter(img => img.url.trim() !== "")
      .map(img => ({ 
        url: img.url.trim(), 
        alt: img.alt.trim() || name || "Product Image", 
        name: img.name.trim() || "",
        gmc_title: img.gmc_title?.trim() || "",
        gmc_variant_description: img.gmc_variant_description?.trim() || ""
      }));

    const payload = {
      name,
      price,
      priceValue,
      mrp,
      discount,
      unit,
      currency: "INR",
      availability: "in_stock",
      condition: "new",
      brand: "Goals Floors",
      details: detailsObj,
      images: validImages,
      push_to_gmc: pushToGmc,
      gmc_description: gmcDescription
    };

    let res;
    if (editingId) {
      res = await updateDynamicProduct(editingId, slug, payload);
    } else {
      res = await addDynamicProduct(slug, payload);
    }

    if (res?.success) {
      toast.success(`Product ${editingId ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchProducts();
      setActiveTab('manage');
    } else {
      toast.error(res?.error || "An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!hasAdminAccess) return;
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const res = await deleteDynamicProduct(id);
    if (res.success) {
      toast.success("Product deleted successfully");
      fetchProducts();
    } else {
      toast.error(res.error || "Failed to delete product");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><AlertCircle className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="text-blue-500" />
            Dynamic Products
          </h1>
          <p className="text-slate-500 mt-1">Inject products into existing pages dynamically.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab('add'); resetForm(); }}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'add' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            {editingId ? 'Edit Product' : 'Add Product'}
          </button>
          <button
            onClick={() => { setActiveTab('manage'); resetForm(); }}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'manage' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Manage Products
          </button>
        </div>
      </div>

      {activeTab === 'manage' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <th className="p-4">Product</th>
                  <th className="p-4">Page Slug</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No dynamic products found.</td>
                  </tr>
                ) : (
                  products.map(prod => {
                    const data = prod.product_data || {};
                    const firstImage = Array.isArray(data.images) && data.images.length > 0 
                      ? (typeof data.images[0] === 'string' ? data.images[0] : data.images[0].url)
                      : null;
                      
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                              {firstImage ? (
                                <img src={firstImage} alt={data.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="text-slate-400" size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{data.name}</p>
                              <p className="text-xs text-slate-500">{data.brand || "Brand"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {prod.page_slug}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">{data.price}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 relative group">
                            {!hasAdminAccess && (
                              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-max bg-slate-800 text-white text-xs px-2 py-1 rounded shadow">
                                Admin access required
                              </div>
                            )}
                            <button
                              onClick={() => openEditModal(prod)}
                              disabled={!hasAdminAccess}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              disabled={!hasAdminAccess}
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Product Configuration' : 'JSON Form Builder'}
            </h2>
            {editingId && (
              <button type="button" onClick={() => { resetForm(); setActiveTab('manage'); }} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <X size={16} /> Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Page Slug</label>
              <select 
                value={slug} onChange={(e) => setSlug(e.target.value)} required
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {VALID_SLUGS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="e.g. Premium Fluted Panel"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price (String)</label>
              <input 
                type="text" value={price} onChange={(e) => setPrice(e.target.value)} required
                placeholder="e.g. ₹549"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">MRP (String)</label>
              <input 
                type="text" value={mrp} onChange={(e) => setMrp(e.target.value)} required
                placeholder="e.g. ₹1290"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Discount</label>
              <input 
                type="text" value={discount} onChange={(e) => setDiscount(e.target.value)}
                placeholder="Auto-calculated (e.g. 57% off)"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unit</label>
              <input 
                type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required
                placeholder="e.g. panel or sqft"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Specs Details (Key-Value)</h3>
              <button type="button" onClick={handleAddDetail} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={16} /> Add Detail
              </button>
            </div>
            <div className="space-y-3">
              {details.map((detail, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text" value={detail.key} onChange={(e) => handleDetailChange(index, 'key', e.target.value)}
                    placeholder="Key (e.g. Thickness)"
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text" value={detail.value} onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g. 5 MM)"
                    className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button type="button" onClick={() => handleRemoveDetail(index)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {details.length === 0 && <p className="text-sm text-slate-500">No details added.</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Google Merchant Center (GMC)</h3>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pushGmc" checked={pushToGmc} onChange={e => setPushToGmc(e.target.checked)} className="w-5 h-5" />
              <label htmlFor="pushGmc" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Push variants to Google Merchant Center</label>
            </div>
            {pushToGmc && (
              <textarea 
                value={gmcDescription} onChange={e => setGmcDescription(e.target.value)}
                placeholder="Description for GMC (e.g. Premium Fluted Panels for living rooms...)"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                rows={3}
              />
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Images (Array)</h3>
              <button type="button" onClick={handleAddImage} className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={16} /> Add Image
              </button>
            </div>
            <div className="space-y-4">
              {images.map((img, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                    {img.url ? (
                      <img src={img.url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                    ) : (
                      <ImageIcon className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="url" value={img.url} onChange={(e) => handleImageChange(index, 'url', optimizeCloudinaryUrl(e.target.value))}
                      placeholder="Image URL" required={index === 0}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" value={img.alt} onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        placeholder="SEO Alt Text"
                        className="w-1/2 p-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                      />
                      <input 
                        type="text" value={img.name} onChange={(e) => handleImageChange(index, 'name', e.target.value)}
                        placeholder="Variant Name"
                        className="w-1/2 p-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    {pushToGmc && (
                      <details className="mt-2 border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-800">
                        <summary className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer outline-none hover:text-slate-900 dark:hover:text-white transition-colors">
                          Variant-Specific GMC SEO (Optional)
                        </summary>
                        <div className="flex flex-col gap-2 mt-3">
                          <input 
                            type="text" value={img.gmc_title || ""} onChange={(e) => handleImageChange(index, 'gmc_title', e.target.value)}
                            placeholder="GMC Specific Title (e.g. Premium Fluted Panel - Oak Wood)"
                            className="w-full p-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                          />
                          <input 
                            type="text" value={img.gmc_variant_description || ""} onChange={(e) => handleImageChange(index, 'gmc_variant_description', e.target.value)}
                            placeholder="GMC Specific Description"
                            className="w-full p-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                          />
                        </div>
                      </details>
                    )}
                  </div>
                  <button type="button" onClick={() => handleRemoveImage(index)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-0.5">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {images.length === 0 && <p className="text-sm text-slate-500">No images added.</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !hasAdminAccess}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? <AlertCircle className="animate-spin" size={18} /> : <Package size={18} />}
              {editingId ? 'Update JSON Payload' : 'Save JSON Payload'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
