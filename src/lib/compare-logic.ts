import { supabaseAdmin } from "@/lib/supabase";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export function generateCleanSlug(productA: string, productB: string) {
  return `${productA.toLowerCase().replace(/\s+/g, '-')}-vs-${productB.toLowerCase().replace(/\s+/g, '-')}`;
}

export async function generateComparisonLogic(category: string, productA: string, productB: string) {
  if (!category || !productA || !productB) {
    throw new Error("Missing required fields");
  }

  const slug = generateCleanSlug(productA, productB);

  // 1. Check Database First
  const { data: existingComparison } = await supabaseAdmin
    .from("product_comparisons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (existingComparison) {
    return existingComparison;
  }

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // 2. Fetch Context from Aggregated JSON Files
  const { aggregateProductKnowledge } = await import("@/lib/dataAggregator");
  
  const factsA = aggregateProductKnowledge(productA) || { price: "Varied", thickness: "Standard", series: "Standard" };
  const factsB = aggregateProductKnowledge(productB) || { price: "Varied", thickness: "Standard", series: "Standard" };

  const prompt = `You are a Senior Architectural Materials Consultant working for Goals Floors, the leading supplier in Gurgaon and Delhi NCR. Your goal is to provide a highly authoritative, factual, and unbiased comparison between Product A and Product B. Follow E-E-A-T principles:

Comparing: "${category}"
First Product: ${productA}
Second Product: ${productB}

HARD FACTS (DO NOT HALLUCINATE OR INVENT):
Data for ${productA}: ${JSON.stringify(factsA)}
Data for ${productB}: ${JSON.stringify(factsB)}
You MUST use these exact prices, dimensions, thicknesses, and series names. Do not invent or hallucinate data.

STRICT RULES:
1. Expertise & Authority: Use precise architectural terminology. Explain *why* a product is better for a specific use case based on the provided hard facts.
2. Local Context (Crucial): Naturally weave the keyword 'Gurgaon' and NCR environmental factors (like extreme summer heat, monsoon humidity, or 'seelan' / dampness) into the 'overview' and 'verdict'. It MUST flow naturally, do not force it awkwardly.
3. NO ROBOTIC TERMS: NEVER use terms like "(Product A)" or "(Product B)" or "First Product". Use the actual product names naturally.
4. TABLE BREVITY: For the 'comparison_data', keep every cell to a maximum of 12-15 words. Be punchy and direct. NO paragraphs.
5. Meta Tags:
   - 'meta_title': Must be exactly formatted as '${productA} vs ${productB} in Gurgaon | Goals Floors'. (Max 60 chars).
   - 'meta_description': Must mention both products, 'Gurgaon', and a clear value proposition. (Max 155 chars).
6. Quotes: Generate a highly experiential, emotive, and aesthetic 5-8 word quote for Product A ('quote_a') and Product B ('quote_b'). Do NOT make it sound like a cheap advertisement or sales pitch. Make it feel motivational and focused on the vibe/experience of the space. 
   Example quotes: 
   - 'Breathe life into your empty spaces.'
   - 'Feel the warmth of authentic textures.'
   - 'Where modern aesthetics meet everyday peace.'
   Make sure it matches the specific characteristic of the product beautifully.
7. Verdict Constraints: The 'verdict' MUST be definitive, punchy, and actionable. Limit it to exactly 2 to 4 sentences maximum. Tell the homeowner exactly which one to choose based on their specific priority.
8. direct_answer: A punchy, 40-word paragraph answering "Which is better?" directly for the Google Answer Box.
9. winner_table: A key-value object assigning the winner between the two products across 4-5 parameters (e.g., Durability, Price, Installation). Return {"Parameter": "Product Name"}.
10. use_cases: Two arrays specifying where to strictly use Product A and where to use Product B.
11. recommendation_matrix: An array of objects for specific buyer scenarios (e.g., "If your priority is X, choose Y because Z"). Keys: "scenario", "recommended", "reason".
12. paa_faqs: Generate 10-15 highly relevant 'People Also Ask' style questions and their short answers regarding these two specific products. Keys: "question", "answer".
13. Format: Output strictly in the requested JSON format matching our schema. Do not include any markdown fences (like \`\`\`json) or extra text, just the raw JSON object.

Schema:
{
  "meta_title": "...",
  "meta_description": "...",
  "quote_a": "...",
  "quote_b": "...",
  "overview": "...",
  "comparison_data": {
    "Durability": { "${productA}": "...", "${productB}": "..." },
    "Installation": { "${productA}": "...", "${productB}": "..." },
    "Water Resistance": { "${productA}": "...", "${productB}": "..." },
    "Maintenance": { "${productA}": "...", "${productB}": "..." }
  },
  "exact_specs": {
    "price": { "${productA}": "...", "${productB}": "..." },
    "dimensions": { "${productA}": "...", "${productB}": "..." },
    "thickness": { "${productA}": "...", "${productB}": "..." },
    "series": { "${productA}": "...", "${productB}": "..." }
  },
  "pros_cons": {
    "${productA}": { "pros": ["...", "..."], "cons": ["...", "..."] },
    "${productB}": { "pros": ["...", "..."], "cons": ["...", "..."] }
  },
  "verdict": "...",
  "direct_answer": "...",
  "winner_table": { "Durability": "${productA}", "Price": "${productB}", "Installation": "Tie" },
  "use_cases": {
    "product_a": ["...", "..."],
    "product_b": ["...", "..."]
  },
  "recommendation_matrix": [
    { "scenario": "...", "recommended": "...", "reason": "..." }
  ],
  "paa_faqs": [
    { "question": "...", "answer": "..." }
  ]
}`;

  // 2. Call Gemini API with Fallback Logic
  const models = ["gemini-2.5-flash", "gemini-flash-latest"];
  let aiResponse;

  for (const model of models) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    aiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (aiResponse.ok) {
      break; // Success! Break out of the loop
    } else {
      const errorText = await aiResponse.text();
      console.warn(`[Gemini Warning] Model ${model} failed:`, errorText);
    }
  }

  if (!aiResponse || !aiResponse.ok) {
    throw new Error(`Failed to generate comparison from AI after trying models: ${models.join(", ")}`);
  }

  const aiData = await aiResponse.json();
  const resultText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!resultText) {
    throw new Error("Empty response from AI");
  }

  const parsedData = JSON.parse(resultText);

  const newComparison = {
    slug,
    category,
    product_a: productA,
    product_b: productB,
    meta_title: parsedData.meta_title,
    meta_description: parsedData.meta_description,
    quote_a: parsedData.quote_a,
    quote_b: parsedData.quote_b,
    overview: parsedData.overview,
    comparison_data: parsedData.comparison_data,
    exact_specs: parsedData.exact_specs,
    pros_cons: parsedData.pros_cons,
    verdict: parsedData.verdict,
    direct_answer: parsedData.direct_answer,
    winner_table: parsedData.winner_table,
    use_cases: parsedData.use_cases,
    recommendation_matrix: parsedData.recommendation_matrix,
    paa_faqs: parsedData.paa_faqs
  };

  // 3. Save to Supabase
  const { data: savedData, error: insertError } = await supabaseAdmin
    .from("product_comparisons")
    .insert([newComparison])
    .select()
    .single();

  if (insertError) {
    console.error("Supabase Insert Error:", insertError);
    throw new Error("Failed to save comparison to DB");
  }

  return savedData;
}
