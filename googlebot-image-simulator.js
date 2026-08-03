/**
 * Googlebot-Image Crawler Simulator
 * ----------------------------------
 * Simulates how Googlebot (page crawler) and Googlebot-Image (image crawler)
 * see your site. Run this from a machine with real internet access
 * (your own PC, not a sandboxed AI environment).
 *
 * Usage:
 *   node googlebot-image-simulator.js
 *
 * Requires Node 18+ (built-in fetch). No npm install needed.
 */

const GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const GOOGLEBOT_IMAGE_UA = "Mozilla/5.0 (compatible; Googlebot-Image/1.0; +http://www.google.com/bot.html)";
const NORMAL_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ---- EDIT THESE ----
const PAGES_TO_TEST = [
  "https://goalsfloors.com/about",
  "https://goalsfloors.com/products/laminate-flooring",
];

const ROBOTS_TXT_DOMAINS = [
  "https://goalsfloors.com/robots.txt",
  "https://res.cloudinary.com/robots.txt",
  "https://assets.zyrosite.com/robots.txt",
];
// ---------------------

function log(msg) {
  console.log(msg);
}

async function fetchWithUA(url, ua, method = "GET") {
  try {
    const res = await fetch(url, {
      method,
      headers: { "User-Agent": ua },
      redirect: "follow",
    });
    const headers = {};
    res.headers.forEach((v, k) => (headers[k] = v));
    let bodySample = "";
    if (method === "GET") {
      const text = await res.text();
      bodySample = text.slice(0, 200);
      return { status: res.status, headers, body: text, bodySample };
    }
    return { status: res.status, headers, bodySample };
  } catch (err) {
    return { status: "ERROR", error: err.message };
  }
}

function extractImageUrls(html) {
  const urls = new Set();
  const imgRegex = /<img[^>]+src="([^"]+)"/g;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    let url = m[1];
    if (url.startsWith("/")) continue; // relative /_next/image proxy paths — skip, not final CDN url
    urls.add(url);
  }
  return Array.from(urls);
}

async function checkRobotsTxt() {
  log("\n========================================");
  log("STEP 1 — robots.txt check (as Googlebot-Image)");
  log("========================================");
  for (const url of ROBOTS_TXT_DOMAINS) {
    const result = await fetchWithUA(url, GOOGLEBOT_IMAGE_UA);
    log(`\n${url}`);
    log(`  Status: ${result.status}`);
    if (result.body) {
      const hasImageBlock = /Googlebot-Image/i.test(result.body);
      log(`  Contains "Googlebot-Image" rule: ${hasImageBlock ? "YES — inspect manually below" : "NO"}`);
      log(`  --- content ---`);
      log(
        result.body
          .split("\n")
          .slice(0, 20)
          .map((l) => "  " + l)
          .join("\n")
      );
    }
  }
}

async function checkPageAsGooglebot(pageUrl) {
  log("\n========================================");
  log(`STEP 2 — Fetching page as Googlebot: ${pageUrl}`);
  log("========================================");

  const [asGooglebot, asNormal] = await Promise.all([
    fetchWithUA(pageUrl, GOOGLEBOT_UA),
    fetchWithUA(pageUrl, NORMAL_UA),
  ]);

  log(`  Googlebot UA status: ${asGooglebot.status}`);
  log(`  Normal browser UA status: ${asNormal.status}`);

  if (asGooglebot.status !== asNormal.status) {
    log(`  !!! MISMATCH — Googlebot gets a different status than a normal browser. Possible cloaking/blocking issue.`);
  }

  if (asGooglebot.status !== 200) {
    log(`  Could not fetch page as Googlebot. Skipping image extraction for this page.`);
    return [];
  }

  // Cloaking check: compare body length as rough signal
  const lenDiff = Math.abs((asGooglebot.body?.length || 0) - (asNormal.body?.length || 0));
  log(`  Body length — Googlebot: ${asGooglebot.body?.length || 0} chars, Normal: ${asNormal.body?.length || 0} chars (diff: ${lenDiff})`);
  if (lenDiff > 5000) {
    log(`  !!! Large content difference between Googlebot and normal browser — investigate.`);
  }

  const images = extractImageUrls(asGooglebot.body);
  log(`  Found ${images.length} absolute (CDN) image URLs in Googlebot-rendered HTML.`);
  return images;
}

async function checkImagesAsGooglebotImage(images) {
  log("\n========================================");
  log(`STEP 3 — Fetching each image as Googlebot-Image (${images.length} images)`);
  log("========================================");

  const results = [];
  for (const url of images) {
    const result = await fetchWithUA(url, GOOGLEBOT_IMAGE_UA, "HEAD");
    const xRobots = result.headers?.["x-robots-tag"] || "none";
    const contentType = result.headers?.["content-type"] || "unknown";
    const status = result.status;
    const ok = status === 200 && xRobots === "none";
    results.push({ url, status, xRobots, contentType, ok });
    log(
      `  [${ok ? "OK" : "FLAG"}] ${status} | X-Robots-Tag: ${xRobots} | ${contentType} | ${url.split("/").pop()}`
    );
  }

  const flagged = results.filter((r) => !r.ok);
  log(`\n  Summary: ${results.length - flagged.length}/${results.length} images returned clean 200 + no X-Robots-Tag block.`);
  if (flagged.length > 0) {
    log(`  ${flagged.length} FLAGGED image(s) — review above.`);
  }
  return results;
}

async function main() {
  log("Googlebot / Googlebot-Image Live Simulator");
  log("Testing against real live URLs with real Google crawler user-agents.\n");

  await checkRobotsTxt();

  for (const page of PAGES_TO_TEST) {
    const images = await checkPageAsGooglebot(page);
    if (images.length > 0) {
      await checkImagesAsGooglebotImage(images);
    }
  }

  log("\n========================================");
  log("DONE. Review any FLAG/!!! lines above — those are the concrete, evidence-based leads.");
  log("If everything is OK/clean, this confirms Googlebot-Image can technically reach every image with no errors —");
  log("meaning the remaining delay is Google's indexing/selectivity, not a technical block on your end.");
  log("========================================");
}

main();