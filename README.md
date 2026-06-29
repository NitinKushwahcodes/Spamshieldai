# ScamShield AI — India's Cyber Fraud Protection Platform

ScamShield AI is an AI-powered cyber fraud detection and response platform built to protect citizens in India from online scams. In 2023, India lost an estimated ₹1.6 Lakh Crore to cyber fraud. Most victims fail to recover their money due to panic, a lack of clear immediate recovery actions, and difficulty filing official complaints. ScamShield AI solves all of these challenges in one portal.

Live Demo: https://spamshieldaix.vercel.app
---

## Key Features

1. **AI Scam Analyzer**: Pastes suspicious WhatsApp forwards, SMS messages, job offers, phishing links, or call transcripts. The system identifies the specific scam type (from 100+ categories), measures severity (Low, Medium, High, Critical), highlights red flags, outlines immediate numbered action steps, and links relevant Indian penal codes (IPC & IT Act).
2. **Evidence Vault**: Guides users through gathering necessary forensic items (e.g. UPI transaction IDs, chat logs, bank statements) with an interactive checklist syncable to the database.
3. **Complaint Generator**: Automatically generates formal Cybercrime Portal complaints (`cybercrime.gov.in` format), RBI-compliant Bank Reversal/Freeze requests, and Consumer Forum dispute filings.
4. **Community Database**: A crowdsourced registry tracking reported phone numbers and links. It deduplicates entries by incrementing counter frequencies when numbers are reported multiple times.
5. **Incident Dashboard**: Tracks active reports, document folders, and response checklists in a responsive light/dark design.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router & TypeScript)
- **Styling**: Tailwind CSS (custom design tokens for backgrounds, surfaces, and threat severity levels)
- **Forms & Validation**: React Hook Form + Zod
- **Icons & Markdown**: Lucide React + React Markdown
- **HTTP client**: Axios (supporting cookies with credentials sharing)

### Backend
- **Core Server**: Node.js + Express
- **Database**: PostgreSQL (raw SQL queries, pg driver, no ORM)
- **Session Auth**: JWT shared securely in HTTP-only cookies
- **AI Integrations**: Google Gemini 1.5 Flash (Primary) & Groq Llama-3.3-70b (Fallback) with multi-key rotation and exponential backoff retries.
- **Offline Fallback**: Rule-based regex keyword engine (zero-crash fallback) + complete SQL-to-in-memory emulation layer (db.js) allowing fully functional app operations without active database servers.

---

## Project Structure

```
spamshieldai/
├── backend/
│   ├── config/db.js                  # Database connection pool + In-memory emulators
│   ├── controllers/                  # Auth, Analyzer, Cases, Documents, Community controllers
│   ├── middleware/                   # JWT Auth & Global Error handlers
│   ├── routes/                       # Express router mapping files
│   ├── services/
│   │   ├── aiService.js              # Multi-provider AI core (Gemini + Groq + local engine)
│   │   └── scamPrompts.js            # 100+ Scam type knowledge base & Prompt builders
│   ├── scripts/
│   │   ├── createTables.js           # Database migration table schemas
│   │   ├── seedCommunity.js          # Demo seeder for reported targets
│   │   └── generatePdfDocs.js        # Programmatic PDF documentation compiler
│   ├── server.js                     # Express setup with Helmet & Cors credentials
│   └── package.json
├── frontend/
│   ├── app/                          # Next.js App Router (Layouts, Auth, Dashboard panel)
│   ├── components/                   # Landing, Analyzer, Cases, Documents, Community UI blocks
│   ├── hooks/                        # Custom React hooks (useAuth, useAnalyzer)
│   ├── lib/                          # API Axios client
│   └── package.json
├── ScamShield_AI_Documentation.pdf   # Compiled specifications manual
└── README.md
```

---

## Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL active locally (Optional: ScamShield has a built-in in-memory database fallback if a connection is not detected, meaning it runs instantly without DB configurations!)

### Step 1: Clone and Set Up Environment
In the `backend/` folder, rename or populate `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spamshield
JWT_SECRET=a_very_secure_secret_key_32_chars_long_for_scamshield
CLIENT_URL=http://localhost:3000

# API Keys (Optional: local fallback regex engine executes if left empty)
GEMINI_API_KEY_1=
GROQ_API_KEY_1=
```

### Step 2: Install Backend & Run Migrations
```bash
cd backend
npm install

# Run database setup (skips automatically if Postgres is offline)
node scripts/createTables.js
node scripts/seedCommunity.js

# Compile PDF documentation manual
node scripts/generatePdfDocs.js

# Start Express server
npm run dev
```

### Step 3: Install Frontend & Launch Client
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Verification & Architecture Notes
- **In-Memory database fallback**: If the postgres pool detects authentication errors or connection drops, the database driver (`backend/config/db.js`) redirects operations to a local in-memory emulator, keeping all flows (user profiles, saved cases, checklist edits) operational.
- **Robust AI Analysis Uptime**: The system passes requests through Gemini -> Groq -> Local Regex keywords, yielding zero-crash scanning logs regardless of network or quota blocks.
