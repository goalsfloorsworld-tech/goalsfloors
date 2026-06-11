"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Bot, User, RefreshCw, Send, CheckCircle2, ChevronDown, ChevronRight, MessageSquare, ExternalLink, Sparkles, X, ArrowLeft } from "lucide-react";
import knowledgeBase from "../../goalsfloors-ai/KNOWLEDGE_BASE.json";
import VisualQuizFunnel from "./VisualQuizFunnel";
import LeadGenBox from "./LeadGenBox";
import LeadCaptureForm from "./LeadCaptureForm";
import { processSSEStream } from "../lib/chatUtils";

// Types
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  leadGenResult?: { productName: string; price: number; reason: string };
}

const tooltipHooks = [
  "Confused? Try our 1-Min Quiz! 🎯",
  "Unlock 30% VIP Discount! 🎁",
  "Ask me about flooring prices! 💰",
  "Need design ideas for your space? 🏢"
];

export default function GoalsAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHookIndex, setCurrentHookIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am your Goals Floors Virtual Consultant. How can I help you with our premium architectural collections today?\n\n[ACTION:TRIGGER_QUIZ]" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Proactive Tooltip Loop
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }

    // Initial delay before showing first hook
    const initialTimeout = setTimeout(() => {
      setShowTooltip(true);
      // Hide after 2 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    }, 2000);

    // Total cycle: 7 seconds (5 sec hidden + 2 sec visible)
    const interval = setInterval(() => {
      setCurrentHookIndex((prev) => (prev + 1) % tooltipHooks.length);
      setShowTooltip(true);

      // Stay on screen for 3 seconds, then fade out
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }, 9000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isOpen]);

  // Lock body scroll when widget is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Hide WhatsApp button
      const whatsappBtn = document.querySelector('.whatsapp-float-container') as HTMLElement;
      if (whatsappBtn) whatsappBtn.style.display = 'none';
    } else {
      document.body.style.overflow = "unset";
      // Show WhatsApp button
      const whatsappBtn = document.querySelector('.whatsapp-float-container') as HTMLElement;
      if (whatsappBtn) whatsappBtn.style.display = 'block';
    }
    return () => {
      document.body.style.overflow = "unset";
      const whatsappBtn = document.querySelector('.whatsapp-float-container') as HTMLElement;
      if (whatsappBtn) whatsappBtn.style.display = 'block';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Temporary assistant placeholder
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const apiPayload = newMessages.map(({ role, content }) => ({ role, content }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiPayload }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      await processSSEStream(
        response,
        (content) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content };
            return updated;
          });
        },
        (error) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: error };
            return updated;
          });
        }
      );

    } catch (error) {
      console.error("[GoalsAI] Chat Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "🔌 Connection failed. Please check your internet and try again.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (path: string[], result: any) => {
    setIsQuizMode(false);
    setIsLoading(true);

    // Add empty assistant placeholder WITHOUT leadGenResult
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const hiddenSystemMessage: Message = {
      role: "user",
      content: `[ACTION:QUIZ_COMPLETE] ${JSON.stringify({ path, productName: result.productName })}`
    };

    // We send the hidden message but do not display it in the UI
    const apiMessages = [...messages, hiddenSystemMessage].map(({ role, content }) => ({ role, content }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const finalContent = await processSSEStream(
        response,
        (content) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content };
            return updated;
          });
        },
        (error) => {
          throw new Error(error);
        }
      );

      if (!finalContent) throw new Error("Empty response");

      // Attach leadGenResult strictly AFTER the stream completes
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], leadGenResult: result };
        return updated;
      });

    } catch (error) {
      console.error("[GoalsAI] Quiz Handoff API Error. Using Fallback.", error);

      const matchedFallback = knowledgeBase.products.find(p =>
        p.name.toLowerCase().includes(result.productName.toLowerCase()) ||
        result.productName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
      );
      const fallbackUrl = matchedFallback?.url || "/products";
      const fallbackPrice = matchedFallback?.price_range || "Contact us";

      // Fallback
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: `* **Perfect Match:** [View ${result.productName}](${fallbackUrl}) - Price: ${fallbackPrice}\n* **Why it fits:** It perfectly suits your needs and budget.\n* **Key Spec:** High durability and premium finish.\n* **Alternative:** Explore our full catalog.`,
          leadGenResult: result
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-[88px] z-[999] font-sans goals-ai-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
            className="absolute bottom-14 md:bottom-16 right-[-8px] md:right-0 w-[calc(100vw-16px)] md:w-[480px] h-[calc(100vh-150px)] md:h-[780px] max-h-[calc(100vh-150px)] md:max-h-[80vh] z-20 flex flex-col"
          >
            <div
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
            />

            <div className="relative z-10 flex-1 flex flex-col overflow-hidden rounded-[2rem] h-full">
              {/* Header */}
              <div className="shrink-0 bg-gradient-to-r from-slate-900 to-slate-950 p-3 md:p-4 border-b border-white/10 flex items-center justify-between shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 border border-amber-500/30 rounded-full flex items-center justify-center overflow-hidden shrink-0 relative">
                    <Image src="/images/goals-ai.jpg" alt="Goals Consultant" fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">Goals Consultant</h3>
                    <p className="text-amber-500/80 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Assistant
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isQuizMode && (
                    <button
                      onClick={() => setIsQuizMode(false)}
                      className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-full transition-colors relative z-10"
                      title="Back to Chat"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  {isOfferFormOpen && (
                    <button
                      onClick={() => setIsOfferFormOpen(false)}
                      className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-full transition-colors relative z-10"
                      title="Back to Chat"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* View Rendering Logic */}
              {isOfferFormOpen ? (
                <div className="flex-1 overflow-hidden bg-slate-950 rounded-b-[2rem]">
                  <LeadCaptureForm
                    productName={messages.find(m => m.leadGenResult)?.leadGenResult?.productName || "Goals Floors Product"}
                    onClose={() => setIsOfferFormOpen(false)}
                  />
                </div>
              ) : !isQuizMode ? (
                <>
                  <div
                    className="flex-1 overflow-y-auto min-h-0 p-3 md:p-6 space-y-4 md:space-y-6 scrollbar-hide overscroll-contain"
                    data-lenis-prevent="true"
                  >
                    {messages.map((msg, idx) => {
                      const lastLeadGenIndex = messages.reduce((lastIdx, m, i) => m.leadGenResult ? i : lastIdx, -1);
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} gap-1`}
                        >
                          {/* Icon above bubble */}
                          <div className="flex items-center gap-2 px-1">
                            {msg.role === "assistant" ? (
                              <>
                                <div className="w-5 h-5 rounded-full border border-amber-500/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                                  <Image src="/images/goals-ai.jpg" alt="Goals Consultant" fill sizes="20px" className="object-cover" />
                                </div>
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Consultant</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tight text-right">You</span>
                                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                  <User className="w-3 h-3 text-slate-400" />
                                </div>
                              </>
                            )}
                          </div>

                          <div
                            className={`max-w-[92%] md:max-w-[85%] p-2.5 md:p-3 text-sm leading-relaxed ${msg.role === "user"
                                ? "bg-amber-600 text-white rounded-2xl rounded-tr-sm shadow-md"
                                : "bg-slate-800/60 text-slate-200 border border-white/5 rounded-2xl rounded-tl-sm"
                              }`}
                          >
                            {/* Parse Inline Quiz Trigger and Markdown */}
                            {(() => {
                              const cleanContent = msg.content;
                              const parts = (isLoading && idx === messages.length - 1) ? [cleanContent] : cleanContent.split('[ACTION:TRIGGER_QUIZ]');
                              return parts.map((part, pIdx, pArr) => (
                                <div key={pIdx}>
                                  {part.split('\n').map((line, i) => (
                                    <div key={i} className="mb-1 last:mb-0">
                                      {line.split(/(\*\*.*?\*\*|\[.*?\]\s*\(.*?\))/g).map((chunk, j) => {
                                        if (chunk.startsWith('**') && chunk.endsWith('**')) {
                                          return <strong key={j} className="text-white font-bold">{chunk.slice(2, -2)}</strong>;
                                        }
                                        const linkMatch = chunk.match(/\[(.*?)\]\s*\((.*?)\)/);
                                        if (linkMatch) {
                                          const [_, text, url] = linkMatch;
                                          return (
                                            <Link
                                              key={j}
                                              href={url}
                                              className="inline-flex items-center gap-0.5 text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 decoration-amber-500/50 hover:decoration-amber-400 transition-all mx-1"
                                            >
                                              {text}
                                              <ExternalLink className="w-3 h-3" />
                                            </Link>
                                          );
                                        }
                                        return <span key={j}>{chunk}</span>;
                                      })}
                                    </div>
                                  ))}

                                  {pIdx < pArr.length - 1 && (
                                    <div className={`my-3 p-3 bg-slate-800/80 border border-amber-500/30 rounded-xl text-center shadow-sm ${idx !== messages.length - 1 ? 'opacity-50 grayscale pointer-events-none transition-all duration-500' : ''}`}>
                                      <button onClick={() => setIsQuizMode(true)} className="w-full bg-amber-500 text-slate-900 text-sm font-bold py-2 rounded-md hover:bg-amber-400">
                                        🎯 Take Product Match Quiz
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ));
                            })()}

                            {isLoading && idx === messages.length - 1 && msg.content === "" && (
                              <span className="flex gap-1 items-center h-2.5">
                                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              </span>
                            )}
                          </div>

                          {/* Lead Gen Box Integration */}
                          {msg.leadGenResult && !isLoading && (
                            <div className="ml-8 mt-1 w-full flex">
                              <LeadGenBox onClick={() => setIsOfferFormOpen(true)} isLatestBanner={idx === lastLeadGenIndex} />
                            </div>
                          )}
                        </div>
                      )
                    })}


                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="shrink-0 p-3 md:p-4 bg-slate-900 border-t border-white/10">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about flooring, panels, or quotes..."
                        disabled={isLoading}
                        className="w-full bg-slate-800/50 text-white text-sm border border-slate-700 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-500 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide overscroll-contain bg-slate-950 p-4" data-lenis-prevent="true">
                  <VisualQuizFunnel onQuizComplete={handleQuizComplete} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <div className="relative flex items-center justify-center group">

            {/* Proactive Tooltip Loop */}
            <div
              className={`absolute right-16 bottom-2 bg-slate-800 text-slate-200 text-xs font-medium py-2 px-3 rounded-xl border border-amber-500/30 shadow-2xl whitespace-nowrap transition-all duration-500 ${showTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
                }`}
            >
              {tooltipHooks[currentHookIndex]}
              {/* Inner Triangle (Background) */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[6px] border-l-slate-800 border-b-[6px] border-b-transparent z-10"></div>
              {/* Outer Triangle (Border) */}
              <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-l-[7px] border-l-amber-500/30 border-b-[7px] border-b-transparent"></div>
            </div>

            <motion.button
              key="fab"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full flex items-center justify-center relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-slate-900"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative z-30 w-full h-full rounded-full overflow-hidden"
              >
                <Image src="/images/goals-ai.jpg" alt="Goals Consultant" fill sizes="56px" className="object-cover scale-125" />
              </motion.div>
            </motion.button>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}