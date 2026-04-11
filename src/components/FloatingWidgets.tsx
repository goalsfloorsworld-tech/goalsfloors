"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WhatsAppFloat = dynamic(() => import("@/components/whatsapp-float"), {
  ssr: false,
});

const GoalsAIWidget = dynamic(() => import("@/components/GoalsAIWidget"), {
  ssr: false,
});

export default function FloatingWidgets() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const enableWidgets = () => setShouldLoad(true);

    const timeoutId = window.setTimeout(enableWidgets, 2500);

    window.addEventListener("pointerdown", enableWidgets, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", enableWidgets, { once: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", enableWidgets);
      window.removeEventListener("keydown", enableWidgets);
    };
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      <WhatsAppFloat />
      <GoalsAIWidget />
    </>
  );
}