"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle2 } from "lucide-react";

export default function DealerWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    gstNumber: "",
    businessType: "",
    turnover: "",
    message: "",
    businessCardBase64: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Document exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, businessCardBase64: reader.result as string }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.company || !formData.email || formData.phone.length < 10 || !formData.city || !formData.state) {
        setError("Please fill all required fields to continue.");
        return;
      }
    } else if (step === 2) {
      if (!formData.businessType || !formData.turnover) {
        setError("Please select your Expertise and Revenue to continue.");
        return;
      }
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessCardBase64) {
        setError("Please upload your Visiting Card to finish.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    
    try {
        const response = await fetch("/api/dealer-inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                interest: "Dealer Application",
                zip: "000000",
                dob: "N/A"
            }),
        });

        const result = await response.json();
        if (result.success) {
            setIsSubmitted(true);
        } else {
            throw new Error(result.error || "Submission failed.");
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-14 px-6 text-center text-slate-900 dark:text-white transition-colors duration-500 bg-[#E0E5EC] dark:bg-[#1A1F2A]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-[#E0E5EC] dark:bg-[#1A1F2A] shadow-[9px_9px_16px_rgb(163,177,198,0.6),_-9px_-9px_16px_rgba(255,255,255,0.5)] dark:shadow-[9px_9px_16px_rgb(15,18,25,0.8),_-9px_-9px_16px_rgba(40,48,65,0.5)]">
                <CheckCircle2 className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Application Received!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                Thank you for your interest in partnering with Goals Floors. Our team will review your credentials and contact you immediately.
            </p>
            <button onClick={() => window.location.href = '/products'} className="px-8 py-4 bg-[#E0E5EC] dark:bg-[#1A1F2A] text-amber-600 dark:text-amber-500 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-[6px_6px_12px_rgb(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] dark:shadow-[6px_6px_12px_rgb(15,18,25,0.8),_-6px_-6px_12px_rgba(40,48,65,0.5)] active:shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:active:shadow-[inset_4px_4px_8px_rgb(15,18,25,0.8),_inset_-4px_-4px_8px_rgba(40,48,65,0.5)]">
                Explore Products
            </button>
        </motion.div>
      </div>
    );
  }

  // Real 3D Input (Debossed / Carved In)
  const inputClasses = "w-full bg-[#E0E5EC] dark:bg-[#1A1F2A] rounded-2xl px-6 py-5 text-base focus:outline-none transition-all shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),_inset_-6px_-6px_10px_rgba(255,255,255,0.5)] dark:shadow-[inset_6px_6px_10px_rgb(15,18,25,0.8),_inset_-6px_-6px_10px_rgba(40,48,65,0.5)] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border-none focus:ring-1 focus:ring-amber-500/50";
  
  // Real 3D Button (Embossed / Popped Out)
  const getButtonClass = (isActive: boolean) => {
    if (isActive) {
      return "py-5 px-4 rounded-2xl text-sm md:text-base font-bold transition-all text-amber-600 dark:text-amber-500 bg-[#E0E5EC] dark:bg-[#1A1F2A] shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),_inset_-6px_-6px_10px_rgba(255,255,255,0.5)] dark:shadow-[inset_6px_6px_10px_rgb(15,18,25,0.8),_inset_-6px_-6px_10px_rgba(40,48,65,0.5)] scale-[0.98]";
    }
    return "py-5 px-4 rounded-2xl text-sm md:text-base font-bold transition-all text-slate-600 dark:text-slate-400 bg-[#E0E5EC] dark:bg-[#1A1F2A] shadow-[6px_6px_12px_rgb(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] dark:shadow-[6px_6px_12px_rgb(15,18,25,0.8),_-6px_-6px_12px_rgba(40,48,65,0.5)] hover:text-amber-500 active:shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:active:shadow-[inset_4px_4px_8px_rgb(15,18,25,0.8),_inset_-4px_-4px_8px_rgba(40,48,65,0.5)]";
  };

  const actionButtonClasses = "py-4 md:py-5 px-4 md:px-8 rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-3 transition-all bg-[#E0E5EC] dark:bg-[#1A1F2A] text-amber-600 dark:text-amber-500 shadow-[8px_8px_16px_rgb(163,177,198,0.6),_-8px_-8px_16px_rgba(255,255,255,0.6)] dark:shadow-[8px_8px_16px_rgb(15,18,25,0.8),_-8px_-8px_16px_rgba(40,48,65,0.4)] active:shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:active:shadow-[inset_4px_4px_8px_rgb(15,18,25,0.8),_inset_-4px_-4px_8px_rgba(40,48,65,0.5)] active:scale-[0.98] hover:text-amber-500 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className="w-full bg-[#E0E5EC] dark:bg-[#1A1F2A] text-slate-900 dark:text-white py-6 md:py-24 px-6 md:px-16 transition-colors duration-500 selection:bg-amber-500 selection:text-white font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ready to Grow Your Business? <br />
              <span className="font-playfair italic font-normal text-amber-500 drop-shadow-md">Start Your Inquiry Today!</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Complete the form below to initiate your partnership with Goals Floors.
            </p>
        </div>

        {/* 3D Neumorphic Form Container */}
        <div className="bg-[#E0E5EC] dark:bg-[#1A1F2A] p-8 md:p-14 rounded-[3rem] shadow-[16px_16px_32px_rgb(163,177,198,0.6),_-16px_-16px_32px_rgba(255,255,255,0.5)] dark:shadow-[16px_16px_32px_rgb(15,18,25,0.8),_-16px_-16px_32px_rgba(40,48,65,0.5)] relative overflow-hidden">
            
            {/* Step Indicators */}
            <div className="flex justify-center items-center mb-12">
                {[1, 2, 3].map((num, idx) => (
                    <div key={num} className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${step === num ? 'text-amber-500 shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:shadow-[inset_4px_4px_8px_rgb(15,18,25,0.8),_inset_-4px_-4px_8px_rgba(40,48,65,0.5)]' : step > num ? 'text-emerald-500 shadow-[6px_6px_12px_rgb(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] dark:shadow-[6px_6px_12px_rgb(15,18,25,0.8),_-6px_-6px_12px_rgba(40,48,65,0.5)]' : 'text-slate-400 dark:text-slate-600 shadow-[6px_6px_12px_rgb(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] dark:shadow-[6px_6px_12px_rgb(15,18,25,0.8),_-6px_-6px_12px_rgba(40,48,65,0.5)]'}`}>
                            {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
                        </div>
                        {idx < 2 && (
                            <div className="w-12 md:w-20 mx-4 h-1 rounded-full relative overflow-hidden shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_4px_rgb(15,18,25,0.8),_inset_-2px_-2px_4px_rgba(40,48,65,0.5)]">
                                <div className={`absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500 ${step > num ? 'w-full' : 'w-0'}`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-10 bg-[#E0E5EC] dark:bg-[#1A1F2A] text-red-500 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-[inset_4px_4px_8px_rgb(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:shadow-[inset_4px_4px_8px_rgb(15,18,25,0.8),_inset_-4px_-4px_8px_rgba(40,48,65,0.5)] border border-red-500/20">
                    <X className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()} className="relative">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">Full Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClasses} placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">Business Name *</label>
                                <input type="text" name="company" value={formData.company} onChange={handleInputChange} className={inputClasses} placeholder="Doe Interiors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses} placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">Phone Number *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClasses} placeholder="9876543210" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">City *</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputClasses} placeholder="New Delhi" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">State *</label>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputClasses} placeholder="Delhi" />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 gap-12">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">GST Number (Optional)</label>
                                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className={inputClasses} placeholder="22AAAAA0000A1Z5" />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 pl-2">Type of Expertise *</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: "Retailer", value: "Retailer" },
                                        { label: "Wholesaler", value: "Wholesaler" },
                                        { label: "Contractor", value: "Contractor" },
                                        { label: "Designer", value: "Designer" }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, businessType: opt.value }))}
                                            className={getButtonClass(formData.businessType === opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 pl-2">Estimated Annual Revenue *</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { label: "Upto ₹10L", value: "10L" },
                                        { label: "₹10L - ₹50L", value: "50L" },
                                        { label: "₹50L - ₹1Cr", value: "1Cr" },
                                        { label: "Above ₹1Cr", value: ">1Cr" }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, turnover: opt.value }))}
                                            className={getButtonClass(formData.turnover === opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-12">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">Additional Details (Optional)</label>
                                <textarea 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleInputChange}
                                    placeholder="Tell us about your requirements or projects..." 
                                    className={`${inputClasses} h-40 resize-none`}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 pl-2">Visiting Card Upload *</label>
                                {!formData.businessCardBase64 ? (
                                    <div className="w-full">
                                        <input id="card-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        <label htmlFor="card-upload" className="block w-full rounded-[2rem] p-12 cursor-pointer text-center bg-[#E0E5EC] dark:bg-[#1A1F2A] shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),_inset_-6px_-6px_10px_rgba(255,255,255,0.5)] dark:shadow-[inset_6px_6px_10px_rgb(15,18,25,0.8),_inset_-6px_-6px_10px_rgba(40,48,65,0.5)] group transition-all">
                                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#E0E5EC] dark:bg-[#1A1F2A] shadow-[6px_6px_12px_rgb(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] dark:shadow-[6px_6px_12px_rgb(15,18,25,0.8),_-6px_-6px_12px_rgba(40,48,65,0.5)] group-hover:text-amber-500 group-hover:scale-105 transition-all">
                                               <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-amber-500 transition-colors" />
                                            </div>
                                            <span className="text-lg font-bold text-slate-700 dark:text-slate-300 block mb-2">Click to Upload Visiting Card</span>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-500">JPG or PNG (Max 5MB)</span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative w-full md:w-1/2 aspect-video rounded-3xl overflow-hidden group shadow-[6px_6px_16px_rgb(163,177,198,0.8),_-6px_-6px_16px_rgba(255,255,255,0.6)] dark:shadow-[6px_6px_16px_rgb(15,18,25,1),_-6px_-6px_16px_rgba(40,48,65,0.4)] border-4 border-[#E0E5EC] dark:border-[#1A1F2A]">
                                        <Image src={formData.businessCardBase64} alt="Preview" fill unoptimized className="object-cover" />
                                        <div className="absolute inset-0 bg-[#E0E5EC]/80 dark:bg-[#1A1F2A]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                            <button type="button" onClick={() => setFormData(p => ({ ...p, businessCardBase64: "" }))} className="px-6 py-4 bg-[#E0E5EC] dark:bg-[#1A1F2A] text-red-500 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 shadow-[4px_4px_8px_rgb(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)] dark:shadow-[4px_4px_8px_rgb(15,18,25,0.8),_-4px_-4px_8px_rgba(40,48,65,0.5)] active:shadow-[inset_2px_2px_4px_rgb(163,177,198,0.6),_inset_-2px_-2px_4px_rgba(255,255,255,0.5)] dark:active:shadow-[inset_2px_2px_4px_rgb(15,18,25,0.8),_inset_-2px_-2px_4px_rgba(40,48,65,0.5)]">
                                                <X className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pt-10 md:pt-12 flex flex-col-reverse md:flex-row gap-5 md:gap-6">
                    {step > 1 && (
                        <button type="button" onClick={prevStep} className={`${actionButtonClasses} w-full md:w-48`}>
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                    )}
                    
                    {step < 3 ? (
                        <button type="button" onClick={nextStep} className={`${actionButtonClasses} w-full flex-1`}>
                            Continue <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button type="submit" disabled={isSubmitting} className={`${actionButtonClasses} w-full flex-1`}>
                            {isSubmitting ? 'Submitting...' : 'Submit Application'} <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
                
            </form>
        </div>
      </div>
    </div>
  );
}
