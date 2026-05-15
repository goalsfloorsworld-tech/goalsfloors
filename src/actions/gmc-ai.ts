"use server";

/**
 * GMC AI Optimization using Gemini API
 */
export async function optimizeProductText(title: string, description: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { 
      success: false, 
      error: "GEMINI_API_KEY is missing in .env.local. Please add it to use AI features." 
    };
  }

  const prompt = `Act as a Google Shopping SEO expert. 
Take the following product title and description and optimize them for maximum search visibility and click-through rate.
Requirements:
1. Title MUST be under 150 characters.
2. Description should be engaging, professional, and use bullet points for key features.
3. Keep the brand tone premium.
4. Return ONLY a valid JSON object.

Output Format:
{
  "optimizedTitle": "...",
  "optimizedDescription": "..."
}

Original Title: ${title}
Original Description: ${description}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "AI API call failed");
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) throw new Error("No optimization result returned");

    const result = JSON.parse(resultText);
    // Gemini may return an array — always take the first element
    const parsed = Array.isArray(result) ? result[0] : result;
    return { success: true, optimizedTitle: parsed.optimizedTitle, optimizedDescription: parsed.optimizedDescription };
  } catch (e: any) {
    console.error("[GMC AI] Optimization error:", e.message);
    return { success: false, error: e.message };
  }
}
