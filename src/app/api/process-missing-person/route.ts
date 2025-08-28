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
    const missingSinceRaw = summaryLines[0] || '';
    const lastSeenLocation = summaryLines[1] || '';

    // Attempt to separate date from location if they're combined
    let missingSince = '';
    let missingFrom = '';

    // Look for patterns like "March 19, 2004Montgomery, Vermont" or "March 19, 2004 Montgomery, Vermont"
    // Try to match date patterns followed by location
    const dateLocationMatch = missingSinceRaw.match(/^([A-Za-z]+ \d{1,2}, \d{4})\s*(.*)$/);

    if (dateLocationMatch) {
      missingSince = dateLocationMatch[1].trim();
      missingFrom = dateLocationMatch[2].trim();
    } else {
      // If no pattern match, use the raw data
      missingSince = missingSinceRaw;
      missingFrom = lastSeenLocation;
    }

    // Remove missingFrom if it's empty or just whitespace
    if (!missingFrom || missingFrom.trim() === '') {
      missingFrom = lastSeenLocation;
    }

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
      missingFrom: missingFrom || undefined,
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
