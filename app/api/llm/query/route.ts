import { NextResponse } from "next/server";
import { LLMService } from "@/lib/LLMService";
import deploymentsData from "@/fixtures/deployments.json";

export async function POST(request: Request) {
  const body = await request.json();
  const { query } = body;

  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const answer = await LLMService.naturalLanguageQuery(query, deploymentsData);
    
    return NextResponse.json({
      answer,
      mode: LLMService.getMode(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process query" },
      { status: 500 }
    );
  }
}

