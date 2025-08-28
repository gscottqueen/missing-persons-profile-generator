import { NextRequest, NextResponse } from "next/server";
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Convert PDF URL to web page URL
    let webUrl = url;
    if (url.includes("/download.pdf")) {
      webUrl = url.replace("/download.pdf", "");
    }

    // Validate URL is from FBI
    if (!webUrl.includes("fbi.gov/wanted")) {
      return NextResponse.json(
        { error: "Invalid URL. Must be from FBI missing persons page" },
        { status: 400 }
      );
    }

    // Fetch the web page
    const response = await fetch(webUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch webpage: ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract data from the wanted-person-wrapper
    const wantedPersonWrapper = $('.wanted-person-wrapper');

    if (wantedPersonWrapper.length === 0) {
      return NextResponse.json(
        { error: "Could not find wanted person information on this page" },
        { status: 400 }
      );
    }

    // Extract basic info
    const name = $('.documentFirstHeading').text().trim();
    const summary = $('.summary').text().trim();

    // Extract description table data
    const description: Record<string, string> = {};
    $('.wanted-person-description table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length === 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        description[key] = value;
      }
    });

    // Extract images
    const images: string[] = [];

    // Main mugshot
    const mugshot = $('.wanted-person-mug img').attr('src');
    if (mugshot) {
      images.push(mugshot.startsWith('http') ? mugshot : `https://www.fbi.gov${mugshot}`);
    }

    // Gallery images
    $('.wanted-person-images .thumbnail-container img').each((_, img) => {
      const src = $(img).attr('src');
      if (src && src.includes('thumb')) {
        // Convert thumbnail to full size
        const fullSrc = src.replace('/thumb', '/large');
        const fullUrl = fullSrc.startsWith('http') ? fullSrc : `https://www.fbi.gov${fullSrc}`;
        if (!images.includes(fullUrl)) {
          images.push(fullUrl);
        }
      }
    });

    // Extract details section
    const details = $('.wanted-person-details p').text().trim();

    const extractedData = {
      name,
      summary,
      description,
      images,
      details,
      url: webUrl
    };

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error("Web scraping error:", error);
    return NextResponse.json(
      {
        error: "Failed to extract information from webpage",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
