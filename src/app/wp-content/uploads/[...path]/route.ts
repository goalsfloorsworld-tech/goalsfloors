import { WP_ORIGIN } from "@/lib/blog-seo-utils";

export const dynamic = "force-dynamic";

async function handleProxy(
  context: { params: Promise<{ path: string[] }> | { path: string[] } },
  isHead = false
) {
  const resolvedParams = await context.params;
  const pathSegments = resolvedParams?.path;

  if (!pathSegments || pathSegments.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const imagePath = pathSegments.join("/");
  const targetUrl = `${WP_ORIGIN}/wp-content/uploads/${imagePath}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: isHead ? "HEAD" : "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!upstreamRes.ok) {
      return new Response("Image Not Found", { status: upstreamRes.status });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    const contentLength = upstreamRes.headers.get("content-length");

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Robots-Tag": "all, index, follow, max-image-preview:large",
      "Access-Control-Allow-Origin": "*",
    };

    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    if (isHead) {
      return new Response(null, {
        status: 200,
        headers: responseHeaders,
      });
    }

    const imageBuffer = await upstreamRes.arrayBuffer();

    return new Response(imageBuffer, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[WP Image Proxy] Error fetching ${targetUrl}:`, error?.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  return handleProxy(context, false);
}

export async function HEAD(
  _request: Request,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  return handleProxy(context, true);
}
