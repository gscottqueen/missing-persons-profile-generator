import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    console.log("Received extraction request for:", url);

    if (!url) {
      return NextResponse.json(
        { error: "PDF URL is required" },
        { status: 400 }
      );
    }

    // For now, let's just test with a mock response to verify the API works
    // We'll replace this with actual PDF parsing once we confirm the endpoint is working

    const mockText = `
MISSING PERSON INFORMATION

Name: John Doe
Date of Birth: January 1, 1990
Place of Birth: Sample City, Sample State
Hair: Brown
Eyes: Blue
Height: 6'0"
Weight: 180 lbs
Sex: Male
Race: White
Missing Since: January 1, 2024

Additional details about the missing person...
    `;

    return NextResponse.json({
      text: mockText.trim(),
      pages: 1,
      info: { title: "Test PDF" }
    });

  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      {
        error: "Failed to extract PDF content",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
