"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

// Types
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function GoalsAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am your Goals Floors Virtual Consultant. How can I help you with our premium architectural collections today?" }
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

    try {
      // Create a temporary assistant message for the streaming response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Call your Next.js API route (which will proxy to Hugging Face)
      // Note: We will create this API route in the next step
      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI consultant.");

      // Handling the Server-Sent Events (SSE) Stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let aiResponse = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.replace("data: ", ""));
                if (data.content) {
                  aiResponse += data.content;
                  // Update the last message (assistant) with the new chunk
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = aiResponse;
                    return updated;
                  });
                }
              } catch (e) {
                console.error("Error parsing stream chunk", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "I apologize, but I am currently experiencing technical difficulties. Please try again later.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:right-[88px] z-[999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="absolute bottom-12 md:bottom-24 right-0 w-[calc(100vw-48px)] md:w-[480px] h-[600px] md:h-[780px] max-h-[85vh] z-20 flex flex-col"
          >
            {/* Morphing Background */}
            <motion.div
              layoutId="ai-widget"
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Content Container (Fixed Size/Coordinate System) */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden rounded-[2rem] h-full">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-slate-900 to-slate-950 p-4 border-b border-white/10 flex items-center justify-between shadow-md relative overflow-hidden">
               {/* Premium Glow effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-amber-600/20 border border-amber-500/30 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">Goals Consultant</h3>
                  <p className="text-amber-500/80 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Assistant
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area - Scroll Container */}
            <div 
              className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 scrollbar-hide overscroll-contain"
              data-lenis-prevent="true"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-amber-500" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] p-3 text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-amber-600 text-white rounded-2xl rounded-tr-sm shadow-md" 
                        : "bg-slate-800/60 text-slate-200 border border-white/5 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {/* Basic Markdown rendering for bold and line breaks */}
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line.split('**').map((text, j) => j % 2 === 1 ? <strong key={j}>{text}</strong> : text)}
                        <br />
                      </span>
                    ))}
                    {isLoading && idx === messages.length - 1 && msg.content === "" && (
                      <span className="flex gap-1 items-center h-2.5">
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      </span>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-4 bg-slate-900 border-t border-white/10">
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
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="relative flex items-center justify-center group">
            <motion.button
              key="fab"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 text-white rounded-full flex items-center justify-center relative z-20"
            >
              {/* Morphing Background */}
              <motion.div
                layoutId="ai-widget"
                className="absolute inset-0 bg-amber-600 rounded-full shadow-[0_10px_30px_rgba(217,119,6,0.4)]"
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              />
              
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full z-0" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative z-10"
              >
                <MessageSquare className="w-6 h-6" />
              </motion.div>
            </motion.button>

            {/* === FIXED PULSE: Outside button to avoid overflow:hidden clipping === */}
            <motion.div
              animate={{ 
                scale: [1, 2.2],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 2.2,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="absolute inset-0 bg-amber-600 rounded-full z-10"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}