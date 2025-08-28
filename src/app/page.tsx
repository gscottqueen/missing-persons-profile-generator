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
  // Sample data based on your requirements
  const sampleData: MissingPersonData = {
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "February 22, 1990",
    placeOfBirth: "Joplin, Missouri",
    hair: "Light brown",
    eyes: "Blue",
    height: "5'7\" (at the time of her disappearance)",
    weight: "170 pounds (at the time of her disappearance)",
    sex: "Female",
    race: "White",
    missingSince: "March 19, 2004",
    missingFrom: "Montgomery, Vermont",
    image1: "/images/sbreport.webp",
    image2: "/images/sbreport_aged.png",
  };

  const [extractedData, setExtractedData] = useState<MissingPersonData | null>(null);
  const [showSample, setShowSample] = useState(false);

  const handleDataExtracted = (data: MissingPersonData) => {
    setExtractedData(data);
    setShowSample(false);
  };

  const handleShowSample = () => {
    setShowSample(true);
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
        <ProfileExtractor onDataExtracted={handleDataExtracted} />

        {/* Toggle buttons if we have extracted data */}
        {extractedData && (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowSample(false)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                !showSample
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              Show Extracted Data
            </button>
            <button
              onClick={handleShowSample}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                showSample
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
              }`}
            >
              Show Sample Data
            </button>
          </div>
        )}

        {/* Missing Person Profile - Only render when we have data */}
        {(extractedData || showSample) && (
          <MissingPersonProfile
            data={showSample ? sampleData : extractedData!}
          />
        )}
      </div>
    </div>
  );
}
