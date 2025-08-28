"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface MissingPersonProfileProps {
  data: MissingPersonData;
}

interface GeneratedImage {
  imageUrl: string;
  yearsProgressed: number;
  estimatedCurrentAge: string | number;
}

export default function MissingPersonProfile({ data }: MissingPersonProfileProps) {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const generateAgedImage = useCallback(async () => {
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-aged-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personData: data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      setGeneratedImage(result);
    } catch (error) {
      console.error('Error generating aged image:', error);
      setGenerateError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [data]);

  // Auto-generate image when component mounts
  useEffect(() => {
    generateAgedImage();
  }, [generateAgedImage]);

  const {
    firstName,
    lastName,
    dateOfBirth,
    placeOfBirth,
    hair,
    eyes,
    height,
    weight,
    sex,
    race,
    missingSince,
    missingFrom,
    image1,
  } = data;

  const details = [
    { label: "Date(s) of Birth Used", value: dateOfBirth },
    { label: "Place of Birth", value: placeOfBirth },
    { label: "Hair", value: hair },
    { label: "Eyes", value: eyes },
    { label: "Height", value: height },
    { label: "Weight", value: weight },
    { label: "Sex", value: sex },
    { label: "Race", value: race },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          {firstName} {lastName}
        </h1>
        
        {/* Missing Information */}
        <div className="space-y-2">
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
            Missing Since: <span className="text-slate-900 dark:text-white">{missingSince}</span>
          </div>
          {missingFrom && (
            <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Missing From: <span className="text-slate-900 dark:text-white">{missingFrom}</span>
            </div>
          )}
        </div>
        
        <Badge variant="destructive" className="text-base px-6 py-2 bg-red-600 hover:bg-red-700 shadow-lg">
          MISSING PERSON
        </Badge>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Please contact law enforcement immediately if you have any information about this missing person.
        </p>
      </div>

      {/* Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Original Photo */}
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Original Photo
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative overflow-hidden">
              {image1 ? (
                <Image
                  src={image1}
                  alt={`${firstName} ${lastName} - Photo 1`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">Original Photo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Aged Progression */}
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              AI Aged Progression
              {generatedImage && (
                <span className="block text-sm font-normal text-slate-600 dark:text-slate-400 mt-1">
                  {generatedImage.yearsProgressed} years later
                  {generatedImage.estimatedCurrentAge &&
                   generatedImage.estimatedCurrentAge !== "unknown" &&
                   generatedImage.estimatedCurrentAge !== null &&
                    ` (Age ${generatedImage.estimatedCurrentAge})`
                  }
                </span>
              )}
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 dark:text-slate-400">Generating aged progression...</p>
                </div>
              ) : generatedImage ? (
                <Image
                  src={generatedImage.imageUrl}
                  alt={`${firstName} ${lastName} - AI Aged Progression`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : generateError ? (
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400">{generateError}</p>
                  <Button size="sm" onClick={generateAgedImage} className="bg-red-600 hover:bg-red-700 text-white">
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4 p-8">
                  <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mb-3">Generate AI aged progression</p>
                  <Button 
                    size="sm" 
                    onClick={generateAgedImage}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
                  >
                    Generate Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Missing Person Details
          </h2>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300 mb-1 sm:mb-0">
                  {detail.label}:
                </span>
                <span className="text-slate-900 dark:text-white sm:text-right font-medium">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">
              Have Information?
            </h3>
            <p className="text-red-700 dark:text-red-300 text-lg">
              If you have any information about this missing person, please contact authorities immediately.
            </p>
            <div className="space-y-3 pt-4">
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="font-bold text-red-800 dark:text-red-200 text-xl">
                  National Missing Persons Hotline
                </p>
                <p className="text-2xl font-mono font-bold text-red-900 dark:text-red-100">
                  1-800-THE-LOST
                </p>
              </div>
              <p className="text-red-600 dark:text-red-400">
                Or contact your local law enforcement agency
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
