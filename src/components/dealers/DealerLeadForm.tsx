"use client";

import { useState } from 'react';
import { Loader2, CheckCircle2, Send, Phone, User, MessageSquare } from 'lucide-react';

interface DealerLeadFormProps {
  dealerId: string;
  dealerSlug: string;
  businessName: string;
}

export default function DealerLeadForm({ dealerId, dealerSlug, businessName }: DealerLeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/dealers/${dealerSlug}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealer_id: dealerId,
          ...formData
        })
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', message: '' });
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-[2rem] p-8 md:p-12 text-center animate-in zoom-in-95 duration-500 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Thank you!</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          Your enquiry has been sent to <strong>{businessName}</strong>. They will contact you shortly to provide a free quote.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 text-emerald-600 dark:text-emerald-500 font-bold text-sm uppercase tracking-widest hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
      
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Get a Free Quote</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fill out the form below to contact {businessName} directly.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/20 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Your Name *</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              required
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Phone Number *</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              required
              type="tel"
              name="phone"
              maxLength={10}
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Message (Optional)</label>
          <div className="relative">
            <div className="absolute left-4 top-4 text-slate-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell them about your project requirements..."
              value={formData.message}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-medium resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 bg-slate-900 dark:bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  );
}
