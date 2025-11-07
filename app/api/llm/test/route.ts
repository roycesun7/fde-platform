import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const body = await request.json();
  const { apiKey, model } = body;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "API key is required" },
      { status: 400 }
    );
  }

  try {
    const client = new OpenAI({ apiKey });

    // Test with a simple completion
    const completion = await client.chat.completions.create({
      model: model || "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Say 'test successful' if you can read this.",
        },
      ],
      max_tokens: 10,
    });

    if (completion.choices[0].message.content) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "No response from API" },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Connection failed" },
      { status: 500 }
    );
  }
}

