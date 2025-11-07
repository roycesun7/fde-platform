import { NextResponse } from "next/server";

/**
 * API route to send Slack notifications
 * This proxies requests to avoid CORS issues
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webhookUrl, payload } = body;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook URL is required" },
        { status: 400 }
      );
    }

    // Validate webhook URL format
    if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
      return NextResponse.json(
        { error: "Invalid Slack webhook URL" },
        { status: 400 }
      );
    }

    // Send to Slack
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to send Slack notification' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Slack API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

