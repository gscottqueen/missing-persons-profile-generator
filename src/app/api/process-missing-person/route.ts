import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { scrapedData } = await request.json();

    if (!scrapedData) {
      return NextResponse.json(
        { error: "Scraped data is required" },
        { status: 400 }
      );
    }

    // Convert scraped data to structured format
    const { name, summary, description, images } = scrapedData;

    // Parse name
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Parse summary for missing date and location
    const summaryLines = summary.split('\n').map((line: string) => line.trim()).filter(Boolean);
    const missingSince = summaryLines[0] || '';
    const lastSeenLocation = summaryLines[1] || '';

    // Map description table to our format
    const structuredData = {
      firstName,
      lastName,
      dateOfBirth: description["Date(s) of Birth Used"] || '',
      placeOfBirth: description["Place of Birth"] || lastSeenLocation,
      hair: description["Hair"] || '',
      eyes: description["Eyes"] || '',
      height: description["Height"] || '',
      weight: description["Weight"] || '',
      sex: description["Sex"] || '',
      race: description["Race"] || '',
      missingSince,
      image1: images[0] || '',
      image2: images[1] || '',
    };

    return NextResponse.json({ data: structuredData });

  } catch (error) {
    console.error("Data processing error:", error);
    return NextResponse.json(
      { error: "Failed to process scraped data" },
      { status: 500 }
    );
  }
}
