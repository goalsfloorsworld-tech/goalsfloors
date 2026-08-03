"use client";

import { useEffect, useRef } from "react";

export default function AutoDownloader({ url }: { url: string }) {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    let downloadUrl = url;

    // If the URL is already pointing to our API, just append the action=download parameter
    if (url.includes("/api/pdf")) {
      downloadUrl = url + (url.includes("?") ? "&" : "?") + "action=download";
    }
    // If it's a Backblaze B2 URL, use our API route which returns a presigned URL with attachment header
    else if (url.includes("backblazeb2.com")) {
      const filename = url.split("/").pop()?.split("?")[0];
      if (filename) {
        // Decode first in case the URL from DB already has %20, then encode it properly for the query param
        downloadUrl = `/api/pdf?file=${encodeURIComponent(decodeURIComponent(filename))}&action=download`;
      }
    }
    // If it's Cloudinary, we can natively force download by appending fl_attachment
    else if (url.includes("cloudinary.com") && !url.includes("fl_attachment")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      }
    }

    // Use window.location.href to trigger the download natively.
    // The API route returns Content-Disposition: attachment so the browser will just prompt download and STAY on the page!
    window.location.href = downloadUrl;

  }, [url]);

  return null;
}
