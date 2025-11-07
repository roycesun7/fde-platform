import { NextResponse } from "next/server";
import { LLMService } from "@/lib/LLMService";

export async function POST(request: Request) {
  const body = await request.json();
  const { apiKey, model, useStub } = body;

  LLMService.configure({
    apiKey,
    model,
    useStub,
  });

  return NextResponse.json({ success: true });
}

