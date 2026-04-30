import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  return NextResponse.json({
    answer: `AI chatbot stub received your message: "${message}". Replace this with a real model or backend AI integration.`
  });
}
