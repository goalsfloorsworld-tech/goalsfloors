"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getMcpToken, generateNewMcpToken } from "@/actions/mcp-settings";
import { Server, Key, Copy, CheckCircle2, AlertCircle, Loader2, ShieldCheck, RefreshCw, BookOpen, Terminal, Code2, Bot, Sparkles, BrainCircuit, Globe, FileText, Database, Lock, Eye, Network, ChevronRight, LineChart, Search, ShoppingBag } from "lucide-react";

const aiCapsules = [
  {
    id: 0,
    title: "goalsfloors.com (Main Site)",
    icon: <Globe className="w-6 h-6" />,
    color: "blue",
    items: [
      "Read public website pages and static content",
      "Analyze product catalogs and specifications",
      "Review customer lead messages and inquiries",
      "Assist in writing responsive emails and SEO optimizations"
    ]
  },
  {
    id: 1,
    title: "acc.goalsfloors.com (Finance)",
    icon: <FileText className="w-6 h-6" />,
    color: "purple",
    items: [
      "View strictly controlled stock ledger entries",
      "Access delivery challan records and notes",
      "Read basic business party details (GSTIN, Address)",
      "Generate financial reports and analyze outstanding balances"
    ]
  },
  {
    id: 2,
    title: "mcp.goalsfloors.com (Server Engine)",
    icon: <Database className="w-6 h-6" />,
    color: "emerald",
    items: [
      "Acts as a secure, encrypted bridge for all data",
      "Enforces strict Model Context Protocol (MCP) layers",
      "Prevents unauthorized actions or mutations (Read-Only)",
      "Hides all sensitive raw database credentials from AI"
    ]
  },
  {
    id: 3,
    title: "Security Control (Kill-Switch)",
    icon: <Lock className="w-6 h-6" />,
    color: "red",
    items: [
      "Total administrator control over data access",
      "Generating a new key acts as an instant kill-switch",
      "Immediately revokes access for all connected AI agents",
      "Requires manual token update to restore functionality"
    ]
  },
  {
    id: 4,
    title: "Google Analytics 4 (GA4)",
    icon: <LineChart className="w-6 h-6" />,
    color: "orange",
    items: [
      "Track live website traffic and user engagement",
      "Analyze session durations across pages",
      "Monitor specific custom events like 'WhatsApp Button Clicks'"
    ]
  },
  {
    id: 5,
    title: "Google Search Console (GSC)",
    icon: <Search className="w-6 h-6" />,
    color: "indigo",
    items: [
      "Analyze live SEO footprint",
      "Track top-performing search queries (keywords)",
      "Monitor impressions, click-through rates (CTR), and Google search rankings"
    ]
  },
  {
    id: 6,
    title: "Google Merchant Center (GMC)",
    icon: <ShoppingBag className="w-6 h-6" />,
    color: "pink",
    items: [
      "Monitor e-commerce product feeds",
      "Check for approved, disapproved, or error states for the catalog listings"
    ]
  }
];

export default function McpServerPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'token' | 'connect' | 'view' | 'dev'>('token');
  const [selectedAI, setSelectedAI] = useState<'claude' | 'chatgpt' | 'gemini' | 'grok'>('claude');
  const [expandedCapsule, setExpandedCapsule] = useState<number | null>(0);

  useEffect(() => {
    async function loadToken() {
      const res = await getMcpToken();
      if (!res.success) {
        setErrorMsg(res.error || "Access Denied");
      } else {
        setToken(res.token);
      }
      setLoading(false);
    }
    loadToken();
  }, []);

  const handleGenerate = async () => {
    if (!confirm("Are you sure? This will invalidate the existing MCP connection until the agent is updated.")) {
      return;
    }
    
    setGenerating(true);
    setErrorMsg(null);
    const res = await generateNewMcpToken();
    if (res.success && res.token) {
      setToken(res.token);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } else {
      setErrorMsg(res.error || "Failed to generate token.");
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 rounded-3xl flex flex-col items-center text-center shadow-lg">
        <AlertCircle className="w-20 h-20 text-red-500 mb-6 drop-shadow-sm" />
        <h2 className="text-3xl font-black text-red-700 dark:text-red-400 mb-3 tracking-tight">Access Restricted</h2>
        <p className="text-lg text-red-600 dark:text-red-300">{errorMsg}</p>
      </div>
    );
  }

  // Mask the token except for the first 10 and last 4 characters
  const maskedToken = token ? `${token.substring(0, 10)}••••••••••••••••••••••••••••${token.slice(-4)}` : "No token found";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 md:space-y-6 py-4 md:py-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between py-2 md:py-4 w-full">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strictly Administrator Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight leading-tight">
            MCP Server Control
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Manage your Model Context Protocol configuration securely. This token grants the AI agent exclusive, encrypted access to the core platform databases.
          </p>
        </div>
        <div className="hidden md:flex flex-shrink-0 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <Server className="w-10 h-10 text-blue-500 drop-shadow-md" strokeWidth={1.2} />
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-900/5 overflow-hidden">
        
        {/* Tab Navigation */}
        <div className="flex items-center p-2 md:p-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl w-max">
            <button 
              onClick={() => setActiveTab('token')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'token' ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Manage Token
            </button>
            <button 
              onClick={() => setActiveTab('connect')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'connect' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Connect AI
            </button>
            <button 
              onClick={() => setActiveTab('view')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'view' ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              What AI Can View
            </button>
            <button 
              onClick={() => setActiveTab('dev')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${activeTab === 'dev' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Developer API
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 min-h-[300px]">
          {/* TAB 0: Manage Token */}
          {activeTab === 'token' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-lg sm:rounded-xl shadow-sm">
                  <Key className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Active API Token</h2>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="relative group/copy">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover/copy:opacity-40 transition duration-500" />
                  <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-inner gap-3 sm:gap-4">
                    <code className="text-xs sm:text-sm font-mono font-medium text-slate-600 dark:text-slate-300 break-all select-none tracking-wider text-center sm:text-left">
                      {maskedToken}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="flex items-center justify-center sm:ml-auto flex-shrink-0 p-2 sm:p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all shadow-sm active:scale-95"
                      title="Copy full token"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-2 rounded-lg w-full max-w-sm">
                    <p className="text-[11px] sm:text-xs font-medium text-amber-700 dark:text-amber-400 leading-snug">
                      <span className="font-bold">Warning:</span> Generating a new key will instantly invalidate the previous token. The AI agent must be updated immediately.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full md:w-auto relative flex-shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 font-bold text-white transition-all bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/10 dark:shadow-white/10 active:scale-95 text-xs sm:text-sm"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        Generating Key...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                        Generate New Key
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Connect AI */}
          {activeTab === 'connect' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-1 sm:mb-2 tracking-tight">Connect your favorite AI Assistant</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base">Select the AI agent you want to grant access to your Goalsfloors business data.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto">
                <button 
                  onClick={() => setSelectedAI('claude')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border transition-all ${selectedAI === 'claude' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 shadow-sm scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <Image src="/claude-color.svg" width={24} height={24} alt="Claude" className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 drop-shadow-sm" />
                  <span className={`font-bold text-[10px] sm:text-xs md:text-sm text-center ${selectedAI === 'claude' ? 'text-orange-700 dark:text-orange-300' : 'text-slate-600 dark:text-slate-400'}`}>Claude.ai</span>
                </button>
                <button 
                  onClick={() => setSelectedAI('chatgpt')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border transition-all ${selectedAI === 'chatgpt' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <Image src="/openai.svg" width={24} height={24} alt="ChatGPT" className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 drop-shadow-sm dark:invert" />
                  <span className={`font-bold text-[10px] sm:text-xs md:text-sm text-center ${selectedAI === 'chatgpt' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>ChatGPT</span>
                </button>
                <button 
                  onClick={() => setSelectedAI('gemini')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border transition-all ${selectedAI === 'gemini' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <Image src="/gemini-color.svg" width={24} height={24} alt="Gemini" className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 drop-shadow-sm" />
                  <span className={`font-bold text-[10px] sm:text-xs md:text-sm text-center ${selectedAI === 'gemini' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>Gemini</span>
                </button>
                <button 
                  onClick={() => setSelectedAI('grok')}
                  className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border transition-all ${selectedAI === 'grok' ? 'border-zinc-500 bg-zinc-50 dark:bg-zinc-500/10 shadow-sm scale-[1.02]' : 'border-slate-200 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-zinc-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <Image src="/grok.svg" width={24} height={24} alt="Grok" className="w-5 h-5 sm:w-6 sm:h-6 mb-1.5 sm:mb-2 drop-shadow-sm dark:invert" />
                  <span className={`font-bold text-[10px] sm:text-xs md:text-sm text-center ${selectedAI === 'grok' ? 'text-zinc-700 dark:text-zinc-300' : 'text-slate-600 dark:text-slate-400'}`}>Grok</span>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 mt-4 sm:mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent opacity-50" />
                
                {selectedAI === 'claude' && (
                  <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2">
                      <Image src="/claude-color.svg" width={16} height={16} alt="Claude" className="w-4 h-4 sm:w-5 sm:h-5" /> Custom Connector in Claude.ai
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                      1. Go to <strong>Claude.ai</strong>, open a chat, click the <strong>+ icon</strong>.<br/>
                      2. Select <strong>Connectors &gt; Add custom connector</strong>.<br/>
                      3. Fill exactly as below:
                    </p>
                    <div className="space-y-2 bg-white dark:bg-slate-950 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] sm:text-xs shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3">
                        <span className="text-slate-500">Name:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Goalsfloors</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3">
                        <span className="text-slate-500">Remote MCP server URL:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 break-all">
                          https://mcp.goalsfloors.com/mcp?token=<span className="text-emerald-600 dark:text-emerald-400">&lt;Paste Token Here&gt;</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 items-start">
                        <span className="text-slate-500">Advanced settings:</span>
                        <span className="text-orange-600 dark:text-orange-400">Leave "OAuth Client ID" & "Client Secret" blank.</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAI === 'chatgpt' && (
                  <div className="space-y-3 pl-2 sm:pl-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2">
                      <Image src="/openai.svg" width={16} height={16} alt="ChatGPT" className="w-4 h-4 sm:w-5 sm:h-5 dark:invert" /> ChatGPT Integration
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="text-red-600 dark:text-red-400 leading-relaxed text-xs sm:text-sm">
                        <strong>Note:</strong> Custom MCP connections are currently <strong>NOT available in the ChatGPT Free Plan</strong>.<br/><br/>
                        To connect your business data, you must upgrade to a Plus subscription. Once upgraded, you can use the Token and URL provided in the Developer API tab to set up Custom Actions.
                      </p>
                    </div>
                  </div>
                )}

                {selectedAI === 'gemini' && (
                  <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2">
                      <Image src="/gemini-color.svg" width={16} height={16} alt="Gemini" className="w-4 h-4 sm:w-5 sm:h-5" /> Custom Connected App
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                      1. Go to Gemini Settings &gt; <strong>Personalise Intelligence</strong>.<br/>
                      2. Select <strong>Connected Apps &gt; Custom apps for Spark</strong>.<br/>
                      3. Fill exactly as below:
                    </p>
                    <div className="space-y-2 bg-white dark:bg-slate-950 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] sm:text-xs shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3">
                        <span className="text-slate-500">App link:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 break-all">https://mcp.goalsfloors.com/mcp</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3">
                        <span className="text-slate-500">Client ID:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Goalsfloors</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 items-start">
                        <span className="text-slate-500">Client secret:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold break-all">
                          &lt;Paste your Active API Token here&gt;
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAI === 'grok' && (
                  <div className="space-y-3 sm:space-y-4 pl-2 sm:pl-3">
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2">
                      <Image src="/grok.svg" width={16} height={16} alt="Grok" className="w-4 h-4 sm:w-5 sm:h-5 dark:invert" /> Custom Connector in Grok
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
                      1. Go to Grok, on the left sidebar click on <strong>Skills &amp; Connectors</strong>.<br/>
                      2. Select <strong>Connectors &gt; New Connector &gt; Custom</strong>.<br/>
                      3. Fill exactly as below (since Grok doesn&apos;t have a separate Token field yet, we pass it in the URL):
                    </p>
                    <div className="space-y-2 bg-white dark:bg-slate-950 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px] sm:text-xs shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3">
                        <span className="text-slate-500">Name:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Goalsfloors</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3">
                        <span className="text-slate-500">Server URL:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 break-all">
                          https://mcp.goalsfloors.com/mcp?token=<span className="text-emerald-600 dark:text-emerald-400">&lt;Paste Token Here&gt;</span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-amber-100 dark:border-amber-900/30">
                      <p className="text-amber-700 dark:text-amber-400 leading-relaxed text-[11px] sm:text-xs font-medium">
                        <span className="font-bold">Note:</span> If Grok adds a separate field for API Keys/Tokens in the future, you can put the token there instead of the URL and use <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">https://mcp.goalsfloors.com/mcp</code> as the URL.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: What AI Can View */}
          {activeTab === 'view' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
              {aiCapsules.map((capsule) => {
                const isExpanded = expandedCapsule === capsule.id;
                
                const colorMap: Record<string, string> = {
                  blue: "bg-blue-500 text-white shadow-blue-500/20",
                  purple: "bg-purple-500 text-white shadow-purple-500/20",
                  emerald: "bg-emerald-500 text-white shadow-emerald-500/20",
                  red: "bg-red-500 text-white shadow-red-500/20",
                  orange: "bg-orange-500 text-white shadow-orange-500/20",
                  indigo: "bg-indigo-500 text-white shadow-indigo-500/20",
                  pink: "bg-pink-500 text-white shadow-pink-500/20",
                };
                
                const inactiveColorMap: Record<string, string> = {
                  blue: "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30",
                  purple: "text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30",
                  emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30",
                  red: "text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30",
                  orange: "text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30",
                  indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30",
                  pink: "text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/30",
                };

                return (
                  <motion.div
                    key={capsule.id}
                    layout
                    initial={false}
                    onHoverStart={() => setExpandedCapsule(capsule.id)}
                    onClick={() => setExpandedCapsule(capsule.id)}
                    className={`cursor-pointer overflow-hidden border rounded-2xl transition-colors duration-300 ${
                      isExpanded 
                        ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-black/50" 
                        : inactiveColorMap[capsule.color]
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div layout className="flex items-center p-3 sm:p-4 gap-3">
                      <div className={`p-2 rounded-xl flex-shrink-0 transition-all duration-300 shadow-sm ${isExpanded ? colorMap[capsule.color] : "bg-white dark:bg-slate-800 opacity-80"}`}>
                        {React.cloneElement(capsule.icon as React.ReactElement<any>, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                      </div>
                      <h3 className={`font-bold text-sm sm:text-base tracking-tight transition-colors duration-300 ${isExpanded ? "text-slate-900 dark:text-white" : ""}`}>
                        {capsule.title}
                      </h3>
                      <div className={`ml-auto p-1.5 rounded-full transition-transform duration-300 ${isExpanded ? "rotate-90 text-slate-400" : "text-slate-400/50"}`}>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-4" />
                            <ul className="space-y-3">
                              {capsule.items.map((item, idx) => (
                                <motion.li 
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 + (idx * 0.05) }}
                                  className="flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm group"
                                >
                                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-sm transition-all duration-300 group-hover:scale-150 ${colorMap[capsule.color].split(' ')[0]}`} />
                                  <span className="leading-relaxed">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* TAB 3: Developer API */}
          {activeTab === 'dev' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
              {/* Endpoint URL */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Terminal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  1. SSE Endpoint URL
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800">
                  <code className="text-xs sm:text-sm font-mono font-medium text-slate-600 dark:text-slate-300 flex-1 ml-1">
                    https://mcp.goalsfloors.com/mcp
                  </code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('https://mcp.goalsfloors.com/mcp');
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    }}
                    className="flex items-center justify-center text-xs sm:text-sm font-bold px-4 py-2 sm:py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-blue-500 hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-sm active:scale-95"
                  >
                    Copy URL
                  </button>
                </div>
              </div>

              {/* Authentication */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  2. Authentication Header
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  Every request to the MCP server must include the active API token in the HTTP headers. The AI client or fetch request must pass it as a Bearer token: <br/>
                  <code className="inline-block mt-3 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-blue-600 dark:text-blue-400 font-mono text-[11px] sm:text-xs shadow-sm font-semibold">
                    Authorization: Bearer &lt;YOUR_TOKEN&gt;
                  </code>
                </p>
              </div>

              {/* Code Snippet */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Code2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  3. Client Configuration
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">Sample JSON configuration for standard MCP AI Agents (e.g., Claude Desktop):</p>
                <div className="relative group/code">
                  <div className="absolute top-4 right-4 z-10">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`{\n  "mcpServers": {\n    "goalsfloors-erp": {\n      "type": "sse",\n      "url": "https://mcp.goalsfloors.com/mcp",\n      "headers": {\n        "Authorization": "Bearer <YOUR_TOKEN>"\n      }\n    }\n  }\n}`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2000);
                      }}
                      className="p-2 sm:p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 shadow-sm active:scale-95"
                      title="Copy Snippet"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-slate-300 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800 overflow-x-auto text-[10px] sm:text-xs font-mono shadow-inner leading-relaxed font-medium">
{`{
  "mcpServers": {
    "goalsfloors-erp": {
      "type": "sse",
      "url": "https://mcp.goalsfloors.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_TOKEN>"
      }
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      <div 
        className={`fixed bottom-4 left-4 right-4 md:left-auto md:bottom-10 md:right-10 z-50 transition-all duration-500 transform ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-row items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 bg-emerald-500 text-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-500/30 border border-emerald-400">
          <CheckCircle2 className="w-7 h-7" />
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wide">Success!</span>
            <span className="text-sm text-emerald-50 font-medium">New MCP token generated & saved securely.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
