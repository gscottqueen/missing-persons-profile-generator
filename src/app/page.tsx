"use client";

import { useState } from "react";
import MissingPersonProfile from "@/components/missing-person-profile";
import ProfileExtractor from "@/components/profile-extractor";

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

export default function Home() {
  const [extractedData, setExtractedData] = useState<MissingPersonData | null>(null);

  const handleDataExtracted = (data: MissingPersonData) => {
    setExtractedData(data);
  };

  const handleReset = () => {
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Missing Person Profile Generator
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Generate comprehensive missing person profiles with AI-powered age progression imagery
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Profile Extractor Form */}
        <ProfileExtractor onDataExtracted={handleDataExtracted} onReset={handleReset} />

        {/* Missing Person Profile - Only render when we have extracted data */}
        {extractedData && (
          <MissingPersonProfile data={extractedData} />
        )}
      </div>
    </div>
  );
}
