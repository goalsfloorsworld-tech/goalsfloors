// src/app/api/chat-ai/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ab ye direct tumhari .env.local file se URL uthaayega!
    const HUGGING_FACE_URL = process.env.HF_SPACE_URL;

    if (!HUGGING_FACE_URL) {
      console.error("HF_SPACE_URL is missing in .env.local");
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500 });
    }

    const response = await fetch(HUGGING_FACE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "AI Server Error" }), { status: 500 });
    }

    // Direct streaming pipe - Super Fast!
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Chat Proxy Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}