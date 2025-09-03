"use client";

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

interface GeneratedImage {
  imageUrl: string;
  yearsProgressed: number;
  estimatedCurrentAge: string | number;
}

interface PrintData {
  data: MissingPersonData;
  generatedImage: GeneratedImage | null;
  ageAtDisappearance: number | null;
  parsedDate: string;
  displayMissingFrom: string;
  details: Array<{ label: string; value: string }>;
}

export const printMissingPersonFlyer = ({
  data,
  generatedImage,
  ageAtDisappearance,
  parsedDate,
  displayMissingFrom,
  details
}: PrintData) => {
  const { firstName, lastName, missingSince, image1 } = data;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Missing Person Flyer - ${firstName} ${lastName}</title>
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #000;
            background: white;
          }

          .flyer {
            width: 100%;
            max-width: 7.5in;
            height: 10in;
            margin: 0 auto;
            padding: 0.25in;
            display: flex;
            flex-direction: column;
          }

          .header {
            text-align: center;
            background: #dc2626;
            color: white;
            padding: 12px;
            margin-bottom: 16px;
            border-radius: 8px;
          }

          .missing-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .missing-info {
            font-size: 14px;
          }

          .images-section {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            flex: 1;
            min-height: 4in;
          }

          .image-container {
            flex: 1;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .image-title {
            background: #f3f4f6;
            padding: 8px;
            font-weight: bold;
            font-size: 14px;
            border-bottom: 1px solid #ddd;
          }

          .image-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 3in;
            background: #f9fafb;
          }

          .image-content img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            width: auto;
            height: auto;
          }

          .no-image {
            color: #666;
            font-style: italic;
          }

          .details-section {
            background: #f9fafb;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
          }

          .details-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;
          }

          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 8px;
            background: white;
            border-radius: 4px;
            font-size: 12px;
          }

          .detail-label {
            font-weight: bold;
          }

          .contact-section {
            background: #dc2626;
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            margin-top: auto;
          }

          .contact-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .hotline {
            font-size: 20px;
            font-weight: bold;
            font-family: monospace;
            margin: 8px 0;
          }

          .contact-info {
            font-size: 12px;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; }
            .flyer { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="flyer">
          <div class="header">
            <div class="missing-title">MISSING PERSON</div>
            <div class="name">${firstName} ${lastName}</div>
            <div class="missing-info">
              Missing Since: ${parsedDate || missingSince}
              ${displayMissingFrom ? `<br>Missing From: ${displayMissingFrom}` : ''}
            </div>
          </div>

          <div class="images-section">
            <div class="image-container">
              <div class="image-title">
                Original Photo
                ${ageAtDisappearance !== null ? `<br><small>Age ${ageAtDisappearance} at time of disappearance</small>` : ''}
              </div>
              <div class="image-content">
                ${image1 ?
                  `<img src="${image1}" alt="${firstName} ${lastName} - Original Photo" />` :
                  '<div class="no-image">Original Photo<br>Not Available</div>'
                }
              </div>
            </div>

            <div class="image-container">
              <div class="image-title">
                AI Aged Progression
                ${generatedImage ?
                  `<br><small>${generatedImage.yearsProgressed} years later${
                    generatedImage.estimatedCurrentAge &&
                    generatedImage.estimatedCurrentAge !== "unknown" &&
                    generatedImage.estimatedCurrentAge !== null ?
                    ` (Age ${generatedImage.estimatedCurrentAge})` : ''
                  }</small>` : ''
                }
              </div>
              <div class="image-content">
                ${generatedImage ?
                  `<img src="${generatedImage.imageUrl}" alt="${firstName} ${lastName} - AI Aged Progression" />` :
                  '<div class="no-image">AI Aged Progression<br>Not Available</div>'
                }
              </div>
            </div>
          </div>

          <div class="details-section">
            <div class="details-title">Missing Person Details</div>
            <div class="details-grid">
              ${details.map(detail => `
                <div class="detail-row">
                  <span class="detail-label">${detail.label}:</span>
                  <span>${detail.value || "Not available"}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="contact-section">
            <div class="contact-title">Have Information?</div>
            <div class="contact-info">If you have any information about this missing person, please contact authorities immediately.</div>
            <div class="hotline">1-800-THE-LOST</div>
            <div class="contact-info">National Missing Persons Hotline<br>Or contact your local law enforcement agency</div>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for images to load before printing
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};
