"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import WhatsAppFloat from "@/components/whatsapp-float";

const GoalsAIWidget = dynamic(() => import("@/components/GoalsAIWidget"), { ssr: false });

export default function FloatingWidgets() {
  const [showWidgets, setShowWidgets] = useState(false);

  useEffect(() => {
    // Delay loading heavy widgets until after main content has hydrated
    const timer = setTimeout(() => {
      setShowWidgets(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <WhatsAppFloat />
      {showWidgets && <GoalsAIWidget />}
    </>
  );
}