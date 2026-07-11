"use client";

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const PRODUCTS_OPTIONS = [
  "SPC Flooring", "Laminate Flooring", "Herringbone Flooring", 
  "Wall Panels", "Upfit Panels", "WPC Exterior Louvers", 
  "WPC Decking", "Artificial Grass", "Baffle Ceiling", 
  "WPC Timber Tubes"
];

export default function DealerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    description: '',
    phone: '',
    whatsapp_number: '',
    city: '',
    area: '',
    pincode: '',
    products: [] as string[]
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/dashboard/dealer');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          business_name: data.business_name || '',
          tagline: data.tagline || '',
          description: data.description || '',
          phone: data.phone || '',
          whatsapp_number: data.whatsapp_number || '',
          city: data.city || '',
          area: data.area || '',
          pincode: data.pincode || '',
          products: Array.isArray(data.products) ? data.products : []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Completion logic
  const checkFields = [
    { key: 'business_name', label: 'Business Name', filled: !!formData.business_name },
    { key: 'tagline', label: 'Tagline', filled: !!formData.tagline },
    { key: 'area', label: 'Area / Locality', filled: !!formData.area },
    { key: 'city', label: 'City', filled: !!formData.city },
    { key: 'phone', label: 'Phone Number', filled: !!formData.phone },
    { key: 'whatsapp_number', label: 'WhatsApp Number', filled: !!formData.whatsapp_number },
    { key: 'description', label: 'Description', filled: !!formData.description },
    { key: 'products', label: 'Products Stocked', filled: formData.products.length > 0 }
  ];

  const filledFieldsCount = checkFields.filter(f => f.filled).length;
  const completionPercentage = Math.round((filledFieldsCount / 8) * 100);
  const missingFields = checkFields.filter(f => !f.filled);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "whatsapp_number" || name === "pincode") {
      const cleaned = value.replace(/\D/g, "");
      const maxLen = name === "pincode" ? 6 : 10;
      setFormData(prev => ({ ...prev, [name]: cleaned.slice(0, maxLen) }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleProduct = (product: string) => {
    setFormData(prev => {
      const exists = prev.products.includes(product);
      if (exists) {
        return { ...prev, products: prev.products.filter(p => p !== product) };
      }
      return { ...prev, products: [...prev.products, product] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    const isComplete = filledFieldsCount === 8;

    try {
      const res = await fetch('/api/dashboard/dealer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          profile_complete: isComplete
        })
      });

      if (res.ok) {
        setMessage({ text: 'Profile saved successfully!', type: 'success' });
        await fetchProfile(); // re-fetch
      } else {
        const errData = await res.json();
        setMessage({ text: errData.error || 'Failed to save profile.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setSaving(false);
      // Auto dismiss message
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">My Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your public dealer page information.</p>
      </div>

      {/* Completion Status */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-2">Profile Completion</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Complete all fields to activate your public dealer page and start receiving leads.
            </p>
          </div>
          <div className="flex items-end gap-3 shrink-0">
            <span className="text-5xl font-black text-amber-500">{completionPercentage}%</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
          <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
        </div>

        {missingFields.length > 0 ? (
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Missing Fields
            </h4>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {missingFields.map(f => (
                <li key={f.key} className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-amber-500"></div> {f.label}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              Your profile is 100% complete and live.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Business Name *</label>
              <input
                required
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                placeholder="Premium flooring solutions in Gurgaon"
                value={formData.tagline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Tell clients about your expertise..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium resize-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
            Contact & Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">WhatsApp Number</label>
              <input
                type="tel"
                name="whatsapp_number"
                maxLength={10}
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Area / Locality</label>
              <input
                type="text"
                name="area"
                placeholder="Sector 47, DLF Phase 1"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                maxLength={6}
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-4">
            Products Stocked
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRODUCTS_OPTIONS.map((product) => {
              const isSelected = formData.products.includes(product);
              return (
                <button
                  key={product}
                  type="button"
                  onClick={() => toggleProduct(product)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold uppercase tracking-tight transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20' 
                      : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-500/50'
                  }`}
                >
                  {product}
                  {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit & Messages */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto h-12 flex items-center">
            {message.text && (
              <p className={`text-xs font-bold px-4 py-2 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                  : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {message.text}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-8 py-4 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
