"use client";

import React, { useMemo, useState, useEffect, useRef, useId } from "react";
import { PromoTemplateProps } from "./index";
import { formatUtcToIst } from "@/lib/promo/date";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(startAtStr?: string | null, endAtStr?: string | null): TimeLeft {
  if (!endAtStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const endTime = new Date(endAtStr).getTime();
  const startTime = startAtStr ? new Date(startAtStr).getTime() : null;
  const now = Date.now();

  let diff: number;
  if (startTime && !isNaN(startTime)) {
    if (now < startTime) {
      diff = Math.max(0, endTime - startTime);
    } else {
      diff = Math.max(0, endTime - now);
    }
  } else {
    diff = Math.max(0, endTime - now);
  }

  if (isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function CustomCodeBanner(props: PromoTemplateProps) {
  const rawId = useId();
  const bannerId = useMemo(() => `promo-banner-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [rawId]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const customHtml = String(props.custom_html || "").trim();
  const customCss = String(props.custom_css || "").trim();
  const containerClass = String(props.container_class || "w-full max-w-5xl mx-auto my-2");

  const [iframeHeight, setIframeHeight] = useState<number>(360);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(props.startAt, props.endAt)
  );

  // Update timer every second if an end date is set
  useEffect(() => {
    if (!props.endAt) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(props.startAt, props.endAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [props.startAt, props.endAt]);

  const padZero = (n: number) => String(n).padStart(2, "0");

  // Send live countdown ticks to the iframe via postMessage without reloading iframe
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "promo-timer-tick",
          bannerId,
          days: padZero(timeLeft.days),
          hours: padZero(timeLeft.hours),
          minutes: padZero(timeLeft.minutes),
          seconds: padZero(timeLeft.seconds),
        },
        "*"
      );
    } catch {
      // Ignore cross-origin issues if any
    }
  }, [timeLeft, bannerId]);

  // Listen for resize messages from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "promo-iframe-resize" &&
        event.data.bannerId === bannerId &&
        typeof event.data.height === "number" &&
        event.data.height > 20
      ) {
        setIframeHeight(Math.ceil(event.data.height));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [bannerId]);

  // Strip script tags to prevent unintended JS execution and replace dynamic tokens
  const renderedHtml = useMemo(() => {
    if (!customHtml) return "";

    let clean = customHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    clean = clean.replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");
    clean = clean.replace(/href\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'href="#"');

    // Dynamic Token Replacements wrapped with data-token attributes for live ticking without re-rendering iframe
    clean = clean.replace(
      /\{\{DAYS\}\}/g,
      `<span class="promo-token-days" data-token="days">${padZero(timeLeft.days)}</span>`
    );
    clean = clean.replace(
      /\{\{HOURS\}\}/g,
      `<span class="promo-token-hours" data-token="hours">${padZero(timeLeft.hours)}</span>`
    );
    clean = clean.replace(
      /\{\{MINUTES\}\}/g,
      `<span class="promo-token-minutes" data-token="minutes">${padZero(timeLeft.minutes)}</span>`
    );
    clean = clean.replace(
      /\{\{SECONDS\}\}/g,
      `<span class="promo-token-seconds" data-token="seconds">${padZero(timeLeft.seconds)}</span>`
    );

    clean = clean.replace(/\{\{START_DATE\}\}/g, props.startAt ? formatUtcToIst(props.startAt) : "Today");
    clean = clean.replace(/\{\{END_DATE\}\}/g, props.endAt ? formatUtcToIst(props.endAt) : "Limited Time");

    clean = clean.replace(/\{\{WHATSAPP_LINK\}\}/g, "https://wa.me/917217644573");
    clean = clean.replace(/\{\{WHATSAPP_NUMBER\}\}/g, "+91 72176 44573");
    clean = clean.replace(/\{\{SAMPLE_KIT_LINK\}\}/g, "/sample-kit");
    clean = clean.replace(/\{\{CONTACT_LINK\}\}/g, "/contact");
    clean = clean.replace(/\{\{PRODUCTS_LINK\}\}/g, "/products");
    clean = clean.replace(/\{\{COUPON_CODE\}\}/g, String(props.coupon_code || ""));

    return clean;
  }, [customHtml, timeLeft, props.startAt, props.endAt, props.coupon_code]);

  // Construct complete isolated HTML document for the iframe
  const iframeSrcDoc = useMemo(() => {
    if (!renderedHtml) return "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base target="_top">
  <!-- Tailwind CSS Play CDN for 100% full runtime support of arbitrary classes like bg-[#171916], aspect-[5/4], etc. -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    *, ::before, ::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      overflow-x: hidden;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    img { max-width: 100%; height: auto; display: block; }
    ${customCss}
  </style>
</head>
<body>
  ${renderedHtml}
  <script>
    (function() {
      var bannerId = "${bannerId}";
      function notifyHeight() {
        var h = Math.max(
          document.body.scrollHeight || 0,
          document.body.offsetHeight || 0,
          document.documentElement.scrollHeight || 0
        );
        if (h > 0) {
          window.parent.postMessage({ type: 'promo-iframe-resize', bannerId: bannerId, height: h }, '*');
        }
      }

      window.addEventListener('load', notifyHeight);
      window.addEventListener('resize', notifyHeight);
      if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(notifyHeight).observe(document.body);
      }
      setTimeout(notifyHeight, 50);
      setTimeout(notifyHeight, 250);
      setTimeout(notifyHeight, 800);
      setTimeout(notifyHeight, 2000);

      window.addEventListener('message', function(e) {
        if (!e.data || e.data.type !== 'promo-timer-tick' || e.data.bannerId !== bannerId) return;
        var update = function(cls, val) {
          var els = document.querySelectorAll(cls);
          for (var i = 0; i < els.length; i++) els[i].textContent = val;
        };
        if (e.data.days !== undefined) update('.promo-token-days, [data-token="days"]', e.data.days);
        if (e.data.hours !== undefined) update('.promo-token-hours, [data-token="hours"]', e.data.hours);
        if (e.data.minutes !== undefined) update('.promo-token-minutes, [data-token="minutes"]', e.data.minutes);
        if (e.data.seconds !== undefined) update('.promo-token-seconds, [data-token="seconds"]', e.data.seconds);
      });
    })();
  </script>
</body>
</html>`;
  }, [renderedHtml, customCss, bannerId]);

  if (!customHtml) {
    return (
      <div className="w-full my-4 p-8 rounded-2xl border-2 border-dashed border-amber-300/60 dark:border-slate-700 bg-amber-50/20 dark:bg-slate-900/30 text-center flex flex-col items-center justify-center gap-2">
        <span className="text-2xl">✨</span>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Paste your custom HTML code in the box to see live preview
        </p>
        <p className="text-[10px] text-gray-400">
          Supports full Tailwind CSS (all arbitrary values, colors &amp; gradients), HTML5 &amp; countdown tokens
        </p>
      </div>
    );
  }

  return (
    <div className={`promo-custom-banner w-full overflow-hidden ${containerClass}`}>
      <iframe
        ref={iframeRef}
        srcDoc={iframeSrcDoc}
        title="Custom Promo Banner"
        className="w-full border-0 block overflow-hidden transition-[height] duration-200"
        style={{
          height: `${iframeHeight}px`,
          minHeight: "100px",
          backgroundColor: "transparent",
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        scrolling="no"
      />
    </div>
  );
}
