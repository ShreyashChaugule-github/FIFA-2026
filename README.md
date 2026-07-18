# StadiumIQ

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Gemini-AI-8E75FF?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/hero.png" alt="StadiumIQ banner" width="100%" />
</p>

<p align="center">
  <strong>AI-powered stadium intelligence for FIFA World Cup 2026</strong><br/>
  Built for fans, organizers, volunteers, and staff who need fast, accessible, multilingual support.
</p>

## 🚀 What this project does

- 🏟️ Delivers a premium FIFA 2026 experience with live operations, venue discovery, and navigation
- 🤖 Powers an AI command center with Google Gemini for personalized support
- 👥 Supports role-based guidance for fans, organizers, volunteers, and staff
- 📊 Includes a live dashboard with alerts, transport insights, and crowd-awareness context
- 🧭 Offers immersive stadium guidance through a 3D-inspired navigator experience
- 🔐 Uses Firebase Authentication for secure account access

## 🧰 Tech stack

- ⚛️ Next.js 16
- ⚛️ React 19
- 🔥 Firebase Authentication
- 🤖 Google Gemini AI
- 🎨 Tailwind CSS
- ✅ ESLint and Node-based test coverage

## 🏗️ Architecture flow

```text
User / Fan / Staff / Organizer
            │
            ▼
   Authentication Layer
      (Firebase Auth)
            │
            ▼
   Frontend Experience
  (Next.js + React UI)
            │
            ├── Live Dashboard
            ├── AI Command Center
            ├── Stadium Navigator
            └── Venue Explorer
            │
            ▼
   AI / Data Layer
 (Gemini API + Prompt Validation)
            │
            ▼
   Response to User
```

## 📁 Project structure

- app/ — app routes, layout, and API endpoints
- components/ — reusable UI sections for the experience
- context/ — authentication context
- lib/ — Firebase and Gemini integration helpers
- tests/ — regression tests for the AI flow

## ▶️ Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file with the required values:

```bash
cp .env.local .env.local
```

Add your Firebase and Gemini credentials:

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

## 🛠️ Available scripts

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run start    # run the production server
npm run lint     # lint the project
npm test         # run the automated tests
```

## ✅ Quality checks

The project has been verified with:

```bash
npm run lint
npm test
npm run build
```

## 💡 Notes

The AI features work best when valid Gemini credentials are configured. If no API key is present, the app falls back to a demo-style response for safe local testing.

