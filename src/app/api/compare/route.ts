import { NextResponse } from "next/server";
import { generateComparisonLogic } from "@/lib/compare-logic";

export async function POST(req: Request) {
  try {
    const { category, productA, productB } = await req.json();

    if (!category || !productA || !productB) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const savedData = await generateComparisonLogic(category, productA, productB);

    return NextResponse.json({ success: true, data: savedData });
  } catch (error: any) {
    console.error("Compare API Route Error:", error);
    
    // Graceful error handling for Gemini API rate limits or service unavailability
    const errString = String(error?.message || error).toLowerCase();
    if (
      errString.includes("429") || 
      errString.includes("too many requests") || 
      errString.includes("503") || 
      errString.includes("overloaded") || 
      errString.includes("quota")
    ) {
      return NextResponse.json(
        { error: "AI_BUSY", message: "Our AI is currently analyzing a high volume of requests." }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
