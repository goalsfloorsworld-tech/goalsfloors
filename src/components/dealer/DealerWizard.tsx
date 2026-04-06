"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, Building2, MapPin, Grid, 
  Target, Layers, ShieldCheck, ArrowRight, ArrowLeft, 
  Upload, X, CheckCircle2, AlertCircle,
  Map, Navigation2, Store, Warehouse, HardHat, Palette, BarChart3, FileText
} from "lucide-react";
import { MotivationPanel, SuccessOverlay, FloatingInput, RadioCard } from "./DealerUI";

export default function DealerWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    businessType: "",
    turnover: "",
    gstNumber: "",
    message: "",
    businessCardBase64: ""
  });

  // --- Step Validation ---
  const isStep1Valid = formData.name && formData.email && formData.phone;
  const isStep2Valid = formData.company && formData.address && formData.city && formData.state && formData.businessType && formData.turnover && formData.gstNumber;
  const isStep3Valid = !!formData.businessCardBase64;

  const nextStep = () => {
    if (currentStep === 1 && !isStep1Valid) {
        setError("Please fill all contact details to proceed.");
        return;
    }
    if (currentStep === 2 && !isStep2Valid) {
        setError("Please complete your business profile to proceed.");
        return;
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid) {
        setError("Please upload your business card for verification.");
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
                zip: formData.zip || "000000",
                dob: "N/A", 
                city: formData.city,
                state: formData.state
            }),
        });

        const result = await response.json();
        if (result.success) {
            setIsSubmitted(true);
        } else {
            throw new Error(result.error || "Submission failed.");
        }
    } catch (err: any) {
        console.error("Submission Error:", err);
        setError(err.message || "Failed to submit application. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col md:flex-row transition-colors duration-500 overflow-hidden relative">
      
      {/* ─── PREMIUM SUCCESS OVERLAY ─── */}
      <AnimatePresence>
          {isSubmitted && <SuccessOverlay />}
      </AnimatePresence>

      {/* --- FORM SECTION (LEFT SIDE) --- */}
      <div className={`w-full md:w-1/2 bg-white dark:bg-slate-900/40 backdrop-blur-3xl relative z-10 transition-all duration-500 overflow-y-auto ${isSubmitted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="p-10 md:p-12 lg:p-20 pb-32 md:pb-20 flex flex-col justify-center min-h-screen">
        
        {/* Mobile Header (Hidden on Laptop/Desktop) */}
        <div className="md:hidden mb-8">
            <span className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase">Step {currentStep} of 3</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2 uppercase tracking-tight">Dealer Partnership</h1>
        </div>

        <div className="max-w-md w-full mx-auto">
          
          {/* Step Indicator (Desktop) */}
          <div className="hidden md:flex gap-2 mb-12">
            {[1, 2, 3].map(step => (
              <div key={step} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${currentStep >= step ? 'bg-amber-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-8"
            >
              {/* Error Banner */}
              {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                  </motion.div>
              )}

              {/* --- ALL FORM FIELDS --- */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <FloatingInput icon={User} label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
                  <FloatingInput icon={Mail} label="Professional Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  <FloatingInput icon={Phone} label="Direct Contact Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingInput icon={Building2} label="Company Name" name="company" value={formData.company} onChange={handleInputChange} />
                      <FloatingInput icon={MapPin} label="Street Address" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <FloatingInput icon={Map} label="City" name="city" value={formData.city} onChange={handleInputChange} />
                      <FloatingInput icon={Navigation2} label="State" name="state" value={formData.state} onChange={handleInputChange} />
                  </div>
                  
                  <FloatingInput icon={FileText} label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} />
                  
                  <div className="pt-4">
                      <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase mb-4 block ml-1">Type of Expertise</label>
                      <div className="grid grid-cols-2 gap-3">
                          <RadioCard icon={Store} label="Retailer" active={formData.businessType === "Retailer"} onClick={() => setFormData(p => ({ ...p, businessType: "Retailer" }))} />
                          <RadioCard icon={Warehouse} label="Wholesaler" active={formData.businessType === "Wholesaler"} onClick={() => setFormData(p => ({ ...p, businessType: "Wholesaler" }))} />
                          <RadioCard icon={HardHat} label="Contractor" active={formData.businessType === "Contractor"} onClick={() => setFormData(p => ({ ...p, businessType: "Contractor" }))} />
                          <RadioCard icon={Palette} label="Designer" active={formData.businessType === "Designer"} onClick={() => setFormData(p => ({ ...p, businessType: "Designer" }))} />
                      </div>
                  </div>

                  <div>
                      <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase mb-4 block ml-1">Business Scale (Annual)</label>
                      <div className="grid grid-cols-2 gap-3">
                          <RadioCard icon={BarChart3} label="Upto ₹10L" active={formData.turnover === "10L"} onClick={() => setFormData(p => ({ ...p, turnover: "10L" }))} />
                          <RadioCard icon={BarChart3} label="Upto ₹50L" active={formData.turnover === "50L"} onClick={() => setFormData(p => ({ ...p, turnover: "50L" }))} />
                          <RadioCard icon={BarChart3} label="Upto ₹1Cr" active={formData.turnover === "1Cr"} onClick={() => setFormData(p => ({ ...p, turnover: "1Cr" }))} />
                          <RadioCard icon={BarChart3} label="Above ₹1Cr" active={formData.turnover === ">1Cr"} onClick={() => setFormData(p => ({ ...p, turnover: ">1Cr" }))} />
                      </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="relative group">
                      <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase mb-4 block ml-1">Verify Professional Status</label>
                      
                      {!formData.businessCardBase64 ? (
                          <label className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/20 group text-center lg:text-left ${
                              formData.businessCardBase64 
                              ? 'border-amber-600' 
                              : 'border-slate-300 dark:border-slate-700 hover:border-amber-600/30'
                          }`}>
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                              <div className="w-16 h-16 mx-auto lg:mx-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
                                  <Upload className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mt-4">Click to Upload Business Card</span>
                              <span className="text-[10px] text-slate-400">JPG or PNG / Max 5MB</span>
                          </label>
                      ) : (
                          <div className="relative rounded-2xl overflow-hidden border border-amber-600 ring-1 ring-amber-600/20 shadow-2xl">
                              <img src={formData.businessCardBase64} alt="Preview" className="w-full h-64 object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <button 
                                      onClick={() => setFormData(p => ({ ...p, businessCardBase64: "" }))}
                                      className="bg-white text-slate-900 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-amber-600 hover:text-white transition-all shadow-xl"
                                  >
                                      <X className="w-4 h-4" /> Change Image
                                  </button>
                              </div>
                              <div className="absolute top-4 right-4 bg-amber-600 text-white p-2 rounded-full shadow-lg">
                                  <CheckCircle2 className="w-4 h-4" />
                              </div>
                          </div>
                      )}
                  </div>
                  
                  <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase mb-2 block ml-1">Additional Project Insight</label>
                      <textarea 
                          name="message" 
                          value={formData.message} 
                          onChange={handleInputChange}
                          placeholder="Tell us about your upcoming architectural projects..." 
                          className={`w-full bg-slate-50 dark:bg-slate-800/30 border rounded-2xl p-6 text-sm focus:outline-none transition-all font-medium text-slate-900 dark:text-white h-32 resize-none ${
                                formData.message 
                                ? 'border-amber-600 ring-1 ring-amber-600/10' 
                                : 'border-slate-200 dark:border-slate-700'
                          }`}
                      />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* --- ACTION BUTTONS --- */}
          <div className="mt-12 flex gap-4">
            {currentStep > 1 && (
              <button 
                onClick={prevStep}
                disabled={isSubmitting}
                className="px-8 py-5 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <button 
              onClick={currentStep === 3 ? handleSubmit : nextStep}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-between px-10 py-5 bg-slate-900 dark:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-50 ${isSubmitting ? 'animate-pulse' : ''}`}
            >
              {currentStep === 3 ? (isSubmitting ? 'Securing Application...' : 'Complete Registration') : 'Continue Partnership'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <p className="mt-8 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-amber-600" /> B2B Partner Verification Required
          </p>
        </div>
        </div>
      </div>

      {/* --- MOTIVATION PANEL (RIGHT SIDE) --- */}
      <div className={`hidden md:block w-1/2 relative bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-white/5 shadow-2xl z-20 transition-all duration-500 ${isSubmitted ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <MotivationPanel currentStep={currentStep} />
        </div>
      </div>

    </div>
  );
}
