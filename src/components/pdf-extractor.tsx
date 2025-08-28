"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, AlertCircle } from "lucide-react";

interface MissingPersonData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  hair: string;
  eyes: string;
  height: string;
  weight: string;
  sex: string;
  race: string;
  missingSince: string;
  image1?: string;
  image2?: string;
}

interface PdfExtractorProps {
  onDataExtracted: (data: MissingPersonData) => void;
}

export default function PdfExtractor({ onDataExtracted }: PdfExtractorProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "processing" | "extracted">("input");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a valid PDF URL");
      return;
    }

    // Validate URL format
    if (!url.includes("fbi.gov/wanted")) {
      setError("Please enter a valid FBI wanted page URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setStep("processing");

    try {
      // Step 1: Scrape web page data
      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`Failed to scrape webpage: ${errorData.error || response.statusText}`);
      }

      const scrapedData = await response.json();
      setExtractedText(`Scraped data from: ${scrapedData.name}\nSummary: ${scrapedData.summary}`);

      // Step 2: Process scraped data into structured format
      const aiResponse = await fetch("/api/process-missing-person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scrapedData }),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json().catch(() => ({ error: aiResponse.statusText }));
        throw new Error(`Failed to process data: ${errorData.error || aiResponse.statusText}`);
      }

      const { data } = await aiResponse.json();
      setStep("extracted");
      onDataExtracted(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("input");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setExtractedText("");
    setError("");
    setStep("input");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          FBI Missing Person Data Extractor
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter an FBI missing person webpage URL to automatically extract and populate the profile data
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-url">FBI Wanted Page URL</Label>
              <Input
                id="pdf-url"
                type="url"
                placeholder="https://www.fbi.gov/wanted/kidnap/sarah-burton"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Example: https://www.fbi.gov/wanted/kidnap/sarah-burton
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Data...
                </>
              ) : (
                "Extract Data from Webpage"
              )}
            </Button>
          </form>
        )}

        {step === "processing" && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg font-medium">Processing Webpage...</span>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">Scraping webpage content</Badge>
              <Badge variant="outline">Extracting person details</Badge>
              <Badge variant="outline">Structuring data</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Extracting missing person information directly from the FBI webpage.
            </p>
          </div>
        )}

        {step === "extracted" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="bg-green-500">
                Data Extracted Successfully
              </Badge>
              <Button variant="outline" onClick={handleReset}>
                Extract Another Page
              </Button>
            </div>

            {extractedText && (
              <div className="space-y-2">
                <Label htmlFor="extracted-text">Extracted Content (Preview)</Label>
                <Textarea
                  id="extracted-text"
                  value={extractedText.substring(0, 500) + (extractedText.length > 500 ? "..." : "")}
                  readOnly
                  className="min-h-[100px] text-xs"
                />
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              The missing person profile has been generated below with the extracted data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
