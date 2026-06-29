const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = () => {
  const destPath = path.join(__dirname, '..', '..', 'ScamShield_AI_Documentation.pdf');
  console.log(`Generating PDF documentation at: ${destPath}`);

  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
    bufferPages: true
  });

  const stream = fs.createWriteStream(destPath);
  doc.pipe(stream);

  // Define Palette
  const colorPrimary = '#DC2626'; // ScamShield Danger Red
  const colorSecondary = '#1E293B'; // Dark Slate
  const colorBody = '#334155'; // Grey text
  const colorAccent = '#1D4ED8'; // Trust Blue

  // Helper for Section Titles
  const addHeader = (text) => {
    doc.fillColor(colorPrimary)
       .font('Helvetica-Bold')
       .fontSize(18)
       .text(text, { underline: true });
    doc.moveDown(0.5);
  };

  // Helper for Sub-headers
  const addSubHeader = (text) => {
    doc.fillColor(colorSecondary)
       .font('Helvetica-Bold')
       .fontSize(13)
       .text(text);
    doc.moveDown(0.3);
  };

  // Helper for normal body text
  const addParagraph = (text) => {
    doc.fillColor(colorBody)
       .font('Helvetica')
       .fontSize(10)
       .text(text, { align: 'justify', lineGap: 3 });
    doc.moveDown(0.8);
  };

  // Helper for code snippets
  const addCodeBlock = (text) => {
    doc.fillColor('#0F172A')
       .font('Courier')
       .fontSize(8.5)
       .rect(doc.x - 5, doc.y - 5, 500, doc.heightOfString(text) + 10)
       .fill('#F1F5F9');
    
    doc.fillColor('#0F172A')
       .text(text, doc.x, doc.y);
    doc.moveDown(1);
    doc.font('Helvetica'); // restore font
  };

  // ─── TITLE PAGE ────────────────────────────────────────────────────────────
  doc.rect(0, 0, 595, 842).fill('#0F172A'); // Cover Page Dark background

  doc.fillColor(colorPrimary)
     .font('Helvetica-Bold')
     .fontSize(36)
     .text('SCAMSHIELD AI', 100, 250, { align: 'center' });

  doc.fillColor('#FFFFFF')
     .font('Helvetica')
     .fontSize(16)
     .text('India\'s Ultimate Cyber Fraud Detection & Incident Response Platform', { align: 'center' });

  doc.moveDown(2);
  doc.fillColor('#94A3B8')
     .fontSize(11)
     .text('COMPLETE TECHNICAL PRODUCT DOCUMENTATION', { align: 'center', characterSpacing: 1.5 });

  doc.moveDown(6);
  doc.fillColor('#FFFFFF')
     .fontSize(10)
     .text('Developer: Nitin Kushwah, IIT Guwahati', { align: 'center' })
     .text('Version: 1.0.0 (Production-Grade Release)', { align: 'center' })
     .text('Date: June 2026', { align: 'center' });

  // Start Second Page
  doc.addPage();
  doc.fillColor('#FFFFFF'); // Reset color defaults

  // Header / Footer setup for all content pages
  const addHeaderFooter = () => {
    const pages = doc.bufferedPageRange();
    for (let i = 1; i < pages.count; i++) {
      doc.switchToPage(i);
      
      // Header
      doc.fillColor('#94A3B8')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('SCAMSHIELD AI — SPECIFICATIONS MANUAL', 50, 25);
      
      doc.moveTo(50, 35)
         .lineTo(545, 35)
         .lineWidth(0.5)
         .stroke('#E2E8F0');

      // Footer
      doc.moveTo(50, 790)
         .lineTo(545, 790)
         .lineWidth(0.5)
         .stroke('#E2E8F0');

      doc.fillColor('#94A3B8')
         .font('Helvetica')
         .fontSize(8)
         .text(`Page ${i + 1} of ${pages.count}`, 50, 800, { align: 'right' });
    }
  };

  // ─── SECTION 1: INTRODUCTION & VISION ──────────────────────────────────────
  addHeader('1. Executive Summary & Vision');
  addParagraph(
    'In 2023 alone, citizens in India suffered accumulated losses exceeding Rs. 1.6 Lakh Crore to online and cybercrime fraud. The vast majority of scam victims face panic due to three primary gaps: (1) Uncertainty around whether a communication is indeed a scam, (2) Lack of knowledge of standard incident responses, and (3) Inability to easily construct formal complaint requests for banks and law enforcement.'
  );
  addParagraph(
    'ScamShield AI addresses this crisis by offering an automated, centralized cyber fraud response service. A victim simply copies and pastes a suspicious forward, message, call transcript, or email. The ScamShield AI analysis engine processes the content, yields an instant risk verdict (Low, Medium, High, Critical), explains the scam mechanics, identifies specific red flags, maps out numbered recovery steps, notes the legal sections (IPC/IT Act) that apply, and provides a portal to generate complaint documents. ScamShield AI is not a simple spam filter—it is a comprehensive cyber incident response assistant.'
  );
  doc.moveDown(1);

  // ─── SECTION 2: ARCHITECTURE OVERVIEW ──────────────────────────────────────
  addHeader('2. System Architecture');
  addParagraph(
    'The product employs a robust two-tier client-server layout designed for horizontal scaling, rapid response cycles, and complete offline survivability:'
  );
  
  addSubHeader('Backend Application Tier (Node.js & Express):');
  addParagraph(
    'Responsible for secure JWT sessions, rate limiting, request validation, PostgreSQL database queries, and AI provider scheduling. It incorporates express-rate-limit to protect auth routes (max 20 requests per 15 min) and API routes (max 200 requests per 15 min).'
  );

  addSubHeader('Frontend Client Tier (Next.js 14 & Tailwind CSS):');
  addParagraph(
    'A state-of-the-art Next.js App Router workspace utilizing React Hook Form + Zod validation, responsive custom design tokens, dark/light theme adjustments, Lucide React icons, and Markdown-rendered AI responses.'
  );

  addSubHeader('Primary & Fallback AI Infrastructure:');
  addParagraph(
    'The AI Analyzer operates with a multi-provider fallback loop: Google Gemini 1.5 Flash is checked first; if it returns rate limits (HTTP 429) or failures, the engine rotates credentials and calls Groq (Llama-3.3-70b). In the event that all external APIs are unreachable, a local rules-based regex keyword engine (scamPrompts.js) evaluates the text and structures a standard classification to ensure 100% service uptime.'
  );
  doc.moveDown(1);

  // ─── SECTION 3: DATABASE MODELS ───────────────────────────────────────────
  doc.addPage();
  addHeader('3. Database Relational Models');
  addParagraph(
    'ScamShield uses a clean, relational PostgreSQL schema to represent case histories, evidence tracking check sheets, community-based number bans, and documents:'
  );

  addSubHeader('Users Table Schema:');
  addCodeBlock(
    `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`
  );

  addSubHeader('Cases Table Schema (AI Analysis Logs):');
  addCodeBlock(
    `CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_message TEXT NOT NULL,
  scam_type VARCHAR(200),
  scam_category VARCHAR(100),
  severity VARCHAR(20),
  confidence_score INTEGER,
  is_scam BOOLEAN,
  how_it_works TEXT,
  red_flags TEXT[],
  action_steps TEXT[],
  relevant_law TEXT,
  status VARCHAR(50) DEFAULT 'reported',
  created_at TIMESTAMP DEFAULT NOW()
);`
  );

  addSubHeader('Evidence Items Table Schema:');
  addCodeBlock(
    `CREATE TABLE evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  item_name VARCHAR(200) NOT NULL,
  is_collected BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`
  );
  doc.moveDown(1);

  // ─── SECTION 4: CORE AI CLASSIFICATION ENGINE ─────────────────────────────
  doc.addPage();
  addHeader('4. Core AI Analysis Prompt Design');
  addParagraph(
    'The AI engine uses highly structured prompt engineering to command models to return JSON output without markdown delimiters. This ensures direct programmatic ingestion. The schema matches:'
  );
  addCodeBlock(
    `{
  "is_scam": true || false,
  "scam_type": "Specific scam classification",
  "scam_category": "financial_fraud" | "job_employment" | "prize_lottery" | ...,
  "severity": "Low" | "Medium" | "High" | "Critical",
  "confidence_score": 87,
  "confidence_label": "High - 87% likely scam",
  "how_it_works": "3-5 sentences detailed explanation of scam model",
  "red_flags": ["visual cues", "requests made", "irregularities"],
  "action_steps": ["step 1", "step 2"],
  "relevant_law": "IPC / IT Act sections",
  "evidence_to_collect": ["file items to gather"]
}`
  );
  
  addParagraph(
    'The local rule fallback parses keywords (e.g. UPI, AnyDesk, KBC, Narcotics) to yield the exact same JSON format structure. This dual approach ensures high-quality intelligence and zero crashes.'
  );

  // ─── SECTION 5: INSTALLATION GUIDE ─────────────────────────────────────────
  addHeader('5. Installation & Deployment Guide');
  addParagraph(
    'To build and boot ScamShield AI locally, follow the steps below in order:'
  );

  addSubHeader('Step 1: Database Migration');
  addParagraph('Ensure PostgreSQL is active. Run migrations to setup tables:');
  addCodeBlock(`cd backend
npm install
node scripts/createTables.js`);

  addSubHeader('Step 2: Seed Community Database');
  addParagraph('Seed the community reported numbers database with initial demo entries:');
  addCodeBlock(`node scripts/seedCommunity.js`);

  addSubHeader('Step 3: Run the Express Server');
  addParagraph('Start development server. It will listen on PORT 5000:');
  addCodeBlock(`npm run dev`);

  addSubHeader('Step 4: Launch Frontend');
  addParagraph('In a separate terminal, install frontend dependencies and run Next.js:');
  addCodeBlock(`cd ../frontend
npm install
npm run dev`);

  doc.moveDown(1);

  // Complete doc and calculate page numbers
  addHeaderFooter();
  doc.end();

  stream.on('finish', () => {
    console.log('PDF Document generated successfully.');
  });
};

module.exports = generatePDF;

// Run script if executed directly
if (require.main === module) {
  generatePDF();
}
