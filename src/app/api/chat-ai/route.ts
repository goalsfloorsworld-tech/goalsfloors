// src/app/api/chat-ai/route.ts
// Proxy route: Frontend → Next.js API → Hugging Face Space → Gemini AI

export const maxDuration = 60; // 60 second timeout for streaming (Vercel)

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // .env.local se Hugging Face Space URL uthaao
    const HUGGING_FACE_URL = process.env.HF_SPACE_URL;

    if (!HUGGING_FACE_URL) {
      console.error("[GoalsAI] HF_SPACE_URL is missing in .env.local");
      return new Response(
        `data: ${JSON.stringify({ error: "⚙️ Server configuration error. Please contact support." })}\n\n`,
        { status: 200, headers: { "Content-Type": "text/event-stream" } }
      );
    }

    // AbortController: 45 second timeout — agar HF Space so gaya ho toh hang na ho
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    let response: Response;
    try {
      response = await fetch(HUGGING_FACE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      const isTimeout = fetchError instanceof Error && fetchError.name === "AbortError";
      const errorMsg = isTimeout
        ? "😴 Our AI server is waking up. Please wait 30 seconds and try again!"
        : "🔌 Could not connect to AI server. Please try again.";
      console.error("[GoalsAI] Fetch error:", fetchError);
      return new Response(
        `data: ${JSON.stringify({ error: errorMsg })}\n\ndata: [DONE]\n\n`,
        { status: 200, headers: { "Content-Type": "text/event-stream" } }
      );
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`[GoalsAI] HF Space error: ${response.status}`, errText);
      const errorMsg =
        response.status === 503
          ? "😴 AI server is starting up. Please try again in a moment!"
          : `❌ AI service error (${response.status}). Please try again.`;
      return new Response(
        `data: ${JSON.stringify({ error: errorMsg })}\n\ndata: [DONE]\n\n`,
        { status: 200, headers: { "Content-Type": "text/event-stream" } }
      );
    }

    // Direct streaming pipe — Hugging Face → Frontend
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no", // Nginx buffering disable karo
      },
    });

  } catch (error) {
    console.error("[GoalsAI] Unexpected error:", error);
    return new Response(
      `data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\ndata: [DONE]\n\n`,
      { status: 200, headers: { "Content-Type": "text/event-stream" } }
    );
  }
}