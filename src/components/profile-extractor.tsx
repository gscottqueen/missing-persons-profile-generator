"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  missingFrom?: string;
  image1?: string;
  image2?: string;
}

interface ProfileExtractorProps {
  onDataExtracted: (data: MissingPersonData) => void;
}

export default function ProfileExtractor({ onDataExtracted }: ProfileExtractorProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "processing" | "extracted">("input");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a valid profile URL");
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
      const response = await fetch("/api/extract-profile", {
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
    setError("");
    setStep("input");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          Data Extraction
        </CardTitle>
        <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          Enter an FBI missing person webpage URL to automatically extract and populate the profile data
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="profile-url" className="text-base font-medium text-slate-700 dark:text-slate-300">
                FBI Wanted Page URL
              </Label>
              <Input
                id="profile-url"
                type="url"
                placeholder="https://www.fbi.gov/wanted/kidnap/sarah-burton"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="h-12 text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-slate-700"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="text-blue-500">💡</span>
                Example: https://www.fbi.gov/wanted/kidnap/sarah-burton
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 transition-all duration-200">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Extracting Data...
                </>
              ) : (
                "Extract Profile Data"
              )}
            </Button>
          </form>
        )}

        {step === "processing" && (
          <div className="text-center space-y-6 py-8">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Processing Webpage...
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                  Scraping webpage content
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                  Extracting person details
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                  Structuring data
                </Badge>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Extracting missing person information directly from the FBI webpage.
            </p>
          </div>
        )}

        {step === "extracted" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">
                ✓ Data Extracted Successfully
              </Badge>
              <Button variant="outline" onClick={handleReset} className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/20">
                Extract Another Page
              </Button>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300">
                The missing person profile has been generated below with the extracted data.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
