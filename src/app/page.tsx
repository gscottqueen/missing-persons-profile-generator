"use client";

import { useState } from "react";
import MissingPersonProfile from "@/components/missing-person-profile";
import PdfExtractor from "@/components/pdf-extractor";

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
    missingSince: "July 16, 2018",
    image1: "/images/sbreport.webp",
    image2: "/images/sbreport_aged.png",
  };

  const [extractedData, setExtractedData] = useState<MissingPersonData | null>(null);
  const [showSample, setShowSample] = useState(true);

  const handleDataExtracted = (data: MissingPersonData) => {
    setExtractedData(data);
    setShowSample(false);
  };

  const handleShowSample = () => {
    setShowSample(true);
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 space-y-8">
        {/* PDF Extractor Form */}
        <PdfExtractor onDataExtracted={handleDataExtracted} />
        
        {/* Toggle buttons if we have extracted data */}
        {extractedData && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowSample(false)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !showSample 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Show Extracted Data
            </button>
            <button
              onClick={handleShowSample}
              className={`px-4 py-2 rounded-md transition-colors ${
                showSample 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Show Sample Data
            </button>
          </div>
        )}

        {/* Missing Person Profile */}
        <MissingPersonProfile 
          data={showSample ? sampleData : (extractedData || sampleData)} 
        />
      </div>
    </div>
  );
}
