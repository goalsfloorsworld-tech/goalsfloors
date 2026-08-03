"use client";

import React, { useState, useEffect } from "react";
import { setMasterFinancePin, checkMasterFinancePinExists } from "@/actions/admin-security";
import { KeyRound, CheckCircle2, AlertCircle, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SecurityClient({ adminEmail }: { adminEmail: string }) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  
  const [hasExistingPin, setHasExistingPin] = useState<boolean | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Check if a PIN already exists when the component mounts
  useEffect(() => {
    async function checkPin() {
      const res = await checkMasterFinancePinExists();
      if (res.success && res.exists !== undefined) {
        setHasExistingPin(res.exists);
      }
    }
    checkPin();
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    
    if (!pin || pin.length < 4) {
      setStatus({ type: 'error', message: "PIN must be at least 4 characters long." });
      return;
    }
    
    if (pin !== confirmPin) {
      setStatus({ type: 'error', message: "PINs do not match. Please try again." });
      return;
    }

    if (hasExistingPin) {
      // If a PIN already exists, show the warning modal
      setShowConfirmModal(true);
    } else {
      // Otherwise, save immediately
      executeSavePin();
    }
  };

  const executeSavePin = async () => {
    setIsLoading(true);
    setStatus(null);
    setShowConfirmModal(false);

    const res = await setMasterFinancePin(pin, adminEmail);

    if (res.success) {
      setStatus({ type: 'success', message: "Master PIN has been saved securely." });
      setPin("");
      setConfirmPin("");
      setHasExistingPin(true);
    } else {
      setStatus({ type: 'error', message: res.error || "Failed to update PIN." });
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none p-8">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Finance Portal Master Access</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">Update the Universal PIN used by admins to unlock the finance dashboard.</p>
          </div>
        </div>

        <form onSubmit={handlePreSubmit} className="space-y-6 max-w-sm mx-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                New Master PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Confirm Master PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Use a strong numeric or alphanumeric sequence.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || pin.length < 4 || confirmPin.length < 4}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>{hasExistingPin ? "Update Master PIN" : "Save Master PIN"}</>
            )}
          </button>

          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-xl flex items-start gap-3 border ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                )}
                <p className="text-sm font-medium leading-tight">{status.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Confirmation Modal overlay */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Change Existing Master PIN?</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    A Master PIN is already set. If you proceed, the old PIN will be immediately invalidated and no administrator will be able to access the Finance Portal using it. Accountants with personal PINs will not be affected.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={executeSavePin}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-lg shadow-amber-600/20"
                    >
                      Confirm Change
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
