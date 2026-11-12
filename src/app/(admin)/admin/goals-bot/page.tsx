"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  MessageSquare,
  Copy,
  Check,
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function GoalsBotAdminPage() {
  const [copied, setCopied] = useState(false);
  const botUrl = "https://bot.goalsfloors.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(botUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl -z-10" />

      {/* Main Clean Centerpiece Card */}
      <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-gray-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-emerald-900/5 transition-all">
        {/* Top Accent Gradient Bar - Inside the card, perfectly curved with rounded-3xl */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

        {/* Card Body */}
        <div className="p-8 sm:p-12 text-center flex flex-col items-center relative">
          {/* Bot Logo with Glowing Ring */}
        <div className="relative mb-6 group">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-800 dark:to-slate-900 p-3 border border-emerald-500/25 dark:border-emerald-500/30 shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/bot-logo.png"
              alt="Goals Bot Logo"
              width={120}
              height={120}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>

          {/* Live Active Pulsing Dot */}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white dark:border-slate-900 items-center justify-center text-white text-[11px] font-bold shadow-sm">
              ✓
            </span>
          </span>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>WhatsApp AI Sales &amp; Support</span>
          <span className="text-emerald-300 dark:text-emerald-600">•</span>
          <span className="font-mono text-[11px]">Online 24/7</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Goals Bot
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2.5 max-w-md leading-relaxed">
          Official WhatsApp AI assistant for Goals Floors. Handles customer consultations, catalog inquiries, sample kit dispatch, and instant floor estimates.
        </p>

        {/* ─── MAIN CTA BUTTON (Direct Subdomain Opener) ─── */}
        <div className="w-full mt-8">
          <a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group min-w-[280px]"
          >
            <MessageSquare className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span>Open Goals Bot Portal</span>
            <ExternalLink className="w-4 h-4 ml-0.5 opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Subdomain URL Copy Pill */}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <span className="font-mono text-slate-700 dark:text-slate-300 select-all">
            bot.goalsfloors.com
          </span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition"
            title="Copy bot subdomain URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Highlights Grid */}
        <div className="w-full mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center text-center">
            <Zap className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Instant Replies
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Zero wait response
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center text-center">
            <MessageSquare className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              WhatsApp Cloud
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Official Meta API
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center text-center">
            <ShieldCheck className="w-4 h-4 text-teal-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Dedicated Host
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              bot.goalsfloors.com
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
