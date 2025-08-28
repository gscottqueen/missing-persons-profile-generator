# Missing Persons Image Generator

This is a [Next.js](https://nextjs.org) application that allows users to extract and display missing person information from FBI wanted person pages with AI-powered aged progression image generation.

## Features

- **Web Scraping**: Extract missing person data directly from FBI wanted person web pages
- **AI-Powered Data Processing**: Parse and structure missing person details automatically
- **Interactive Profile Display**: Beautiful, responsive profile cards using shadcn/ui components
- **AI Aged Progression Images**: Generate realistic aged progression photos using OpenAI DALL-E
- **Two-Column Layout**: Display original photo alongside AI-generated aged progression
- **Detailed Information Display**: Shows all relevant missing person details in an organized format
- **Automatic Age Calculation**: Calculates years passed and estimated current age

## Setup

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- OpenAI API key (required for AI image generation)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for text processing and data extraction

## Usage

1. **Enter PDF URL**: Input an FBI missing person PDF URL (must end with .pdf and be from fbi.gov)
2. **Automatic Processing**: The app will:
   - Download and parse the PDF content
   - Extract text using pdf-parse
   - Process the text with OpenAI to structure the data
   - Display the formatted missing person profile
3. **View Results**: The extracted data will populate the missing person profile card

### Example PDF URL Format
```
https://www.fbi.gov/wanted/kidnap/jane-doe/download.pdf
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **PDF Processing**: pdf-parse
- **AI Processing**: OpenAI GPT-4
- **TypeScript**: Full type safety

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
