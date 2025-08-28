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
    { label: "Missing Since", value: missingSince },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with name */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {firstName} {lastName}
        </h1>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          MISSING PERSON
        </Badge>
      </div>

      {/* Two column layout with images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Image */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
              {image1 ? (
                <Image
                  src={image1}
                  alt={`${firstName} ${lastName} - Photo 1`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-24 h-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-500"
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
                  <p className="text-sm text-gray-500">Photo 1</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Second Image - AI Generated Aged Progression */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold text-center">
              AI Aged Progression
              {generatedImage && (
                <span className="text-sm font-normal text-gray-600 block">
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
            <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 flex items-center justify-center relative">
              {isGenerating ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Generating aged progression...</p>
                </div>
              ) : generatedImage ? (
                <Image
                  src={generatedImage.imageUrl}
                  alt={`${firstName} ${lastName} - AI Aged Progression`}
                  fill
                  className="object-cover"
                />
              ) : generateError ? (
                <div className="text-center space-y-3 p-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-600">{generateError}</p>
                  <Button size="sm" onClick={generateAgedImage} className="mt-2">
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-24 h-24 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-500"
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
                  <p className="text-sm text-gray-500">AI Generated Image</p>
                  <Button size="sm" onClick={generateAgedImage}>
                    Generate Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Missing Person Details
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                  {detail.label}:
                </span>
                <span className="text-gray-900 dark:text-gray-100 sm:text-right">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Have Information?
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">
            If you have any information about this missing person, please contact authorities immediately.
          </p>
          <div className="space-y-2">
            <p className="font-medium text-red-800 dark:text-red-200">
              National Missing Persons Hotline: 1-800-THE-LOST
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              Or contact your local law enforcement agency
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
