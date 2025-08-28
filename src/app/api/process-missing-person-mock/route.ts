import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      );
    }

    // Mock AI processing - extract data using simple text parsing
    // This simulates what OpenAI would do but uses pattern matching instead

    const extractedData = {
      firstName: extractField(text, ['first name', 'name:', 'given name']) || "Unknown",
      lastName: extractField(text, ['last name', 'surname', 'family name']) || "Unknown",
      dateOfBirth: extractField(text, ['date of birth', 'born', 'birth date', 'dob']) || "Unknown",
      placeOfBirth: extractField(text, ['place of birth', 'born in', 'birth place']) || "Unknown",
      hair: extractField(text, ['hair', 'hair color']) || "Unknown",
      eyes: extractField(text, ['eyes', 'eye color']) || "Unknown",
      height: extractField(text, ['height', 'tall']) || "Unknown",
      weight: extractField(text, ['weight', 'weighs']) || "Unknown",
      sex: extractField(text, ['sex', 'gender']) || "Unknown",
      race: extractField(text, ['race', 'ethnicity']) || "Unknown",
      missingSince: extractField(text, ['missing since', 'disappeared', 'last seen']) || "Unknown",
      image1: "",
      image2: ""
    };

    return NextResponse.json({ data: extractedData });

  } catch (error) {
    console.error("Mock AI processing error:", error);
    return NextResponse.json(
      { error: "Failed to process content" },
      { status: 500 }
    );
  }
}

// Simple text extraction helper
function extractField(text: string, patterns: string[]): string {
  const lines = text.toLowerCase().split('\n');

  for (const pattern of patterns) {
    for (const line of lines) {
      if (line.includes(pattern)) {
        // Try to extract the value after the pattern
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          return line.substring(colonIndex + 1).trim();
        }

        // Try to extract the next word/phrase
        const patternIndex = line.indexOf(pattern);
        if (patternIndex !== -1) {
          const afterPattern = line.substring(patternIndex + pattern.length).trim();
          const words = afterPattern.split(/\s+/);
          if (words.length > 0 && words[0]) {
            return words.slice(0, 3).join(' '); // Take up to 3 words
          }
        }
      }
    }
  }

  return "";
}
