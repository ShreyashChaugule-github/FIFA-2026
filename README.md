# StadiumIQ

StadiumIQ is a polished, AI-powered experience designed for FIFA World Cup 2026 fans, organizers, volunteers, and staff. The app brings together live operational intelligence, multilingual support, venue discovery, and immersive stadium navigation in a single interface.

## What the project does

- Provides a modern landing experience for the FIFA 2026 ecosystem
- Offers an AI command center powered by Google Gemini
- Supports role-based guidance for fans, organizers, volunteers, and staff
- Includes a live operations dashboard with alerts and transport insights
- Showcases iconic stadium venues and an interactive 3D stadium navigator
- Uses Firebase Authentication for secure sign-in and account access

## Tech stack

- Next.js 16
- React 19
- Firebase Authentication
- Google Gemini AI
- Tailwind CSS
- ESLint and Node-based tests

## Project structure

- app/ — main routes and API endpoints
- components/ — reusable UI sections for the dashboard and experience
- context/ — authentication context
- lib/ — Firebase and Gemini integration helpers
- tests/ — regression tests for the AI prompt validation flow

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file with the required values:

```bash
cp .env.local .env.local
```

Add your Firebase and Gemini credentials, for example:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Available scripts

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run start    # run the production server
npm run lint     # lint the project
npm test         # run the automated tests
```

## Quality checks

The project has been verified with:

```bash
npm run lint
npm test
npm run build
```

## Notes

The AI features are designed to work best when valid Gemini credentials are configured. If no API key is present, the app will fall back to a demo-style response for safe local testing.

