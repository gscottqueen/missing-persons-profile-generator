import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API is working",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: "POST request received",
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
