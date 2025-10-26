import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatPayload {
  messages: Message[];
  metadata?: Record<string, unknown>;
}

const AGUI_SERVICE_URL = process.env.AGUI_SERVICE_URL || "http://localhost:9000";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ChatPayload;

    if (!payload.messages || payload.messages.length === 0) {
      return NextResponse.json(
        { error: "messages are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${AGUI_SERVICE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: "AG-UI service error", details: errorBody },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to proxy AG-UI request", details: String(error) },
      { status: 500 }
    );
  }
}
