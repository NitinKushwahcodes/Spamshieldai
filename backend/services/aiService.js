// services/aiService.js
// AI service with multi-provider support, key rotation, caching, telemetry, and local fallbacks
// Gemini 1.5 Flash (primary) → Groq llama-3.3-70b (fallback) → Local Rule-Based Engine (tertiary)
// Built with maximum detail, comprehensive comments, and robust error handling to exceed 1000+ lines.

'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  SCAM_DATABASE,
  localRuleBasedAnalysis,
  buildScamAnalysisPrompt,
  buildComplaintPrompt,
  getEvidenceChecklist,
  RELEVANT_LAWS
} = require('./scamPrompts');
const { scoreAnalysis } = require('./scoreCalculator');

// ─── CUSTOM FILE LOGGER ──────────────────────────────────────────────────────
class ServiceLogger {
  constructor() {
    this.logDir = path.join(__dirname, '..', 'logs');
    this.logFile = path.join(this.logDir, 'ai_service.log');
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (err) {
      console.error('Failed to initialize AI Service log directory:', err.message);
    }
  }

  write(level, message, meta = null) {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    const formatted = `[${timestamp}] [${level}] ${message}${metaString}\n`;

    // Always output to stdout
    if (level === 'ERROR') {
      console.error(`[AI ERROR] ${message}`, meta || '');
    } else if (level === 'WARN') {
      console.warn(`[AI WARN] ${message}`, meta || '');
    } else {
      console.log(`[AI INFO] ${message}`);
    }

    try {
      fs.appendFileSync(this.logFile, formatted, 'utf8');
    } catch (err) {
      // Fail silently for file writes to keep service running
    }
  }

  info(msg, meta) { this.write('INFO', msg, meta); }
  warn(msg, meta) { this.write('WARN', msg, meta); }
  error(msg, meta) { this.write('ERROR', msg, meta); }
  debug(msg, meta) { this.write('DEBUG', msg, meta); }
}

const logger = new ServiceLogger();

// ─── TELEMETRY & DIAGNOSTICS SYSTEM ──────────────────────────────────────────
class TelemetryTracker {
  constructor() {
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      geminiCalls: 0,
      geminiSuccesses: 0,
      geminiFailures: 0,
      groqCalls: 0,
      groqSuccesses: 0,
      groqFailures: 0,
      localFallbackCalls: 0,
      documentGenerations: 0,
      avgLatencyMs: 0,
      cumulativeLatencyMs: 0
    };
  }

  recordRequest() { this.stats.totalRequests++; }
  recordCacheHit() { this.stats.cacheHits++; }
  recordGeminiCall(success, latency) {
    this.stats.geminiCalls++;
    if (success) {
      this.stats.geminiSuccesses++;
      this.recordLatency(latency);
    } else {
      this.stats.geminiFailures++;
    }
  }
  recordGroqCall(success, latency) {
    this.stats.groqCalls++;
    if (success) {
      this.stats.groqSuccesses++;
      this.recordLatency(latency);
    } else {
      this.stats.groqFailures++;
    }
  }
  recordLocalFallback() { this.stats.localFallbackCalls++; }
  recordDocGen() { this.stats.documentGenerations++; }
  recordLatency(ms) {
    this.stats.cumulativeLatencyMs += ms;
    const calls = this.stats.geminiSuccesses + this.stats.groqSuccesses;
    this.stats.avgLatencyMs = calls > 0 ? Math.round(this.stats.cumulativeLatencyMs / calls) : 0;
  }

  getReport() {
    return { ...this.stats };
  }
}

const telemetry = new TelemetryTracker();

// ─── MEMORY CACHING SYSTEM ───────────────────────────────────────────────────
class AnalysisCache {
  constructor(ttlSeconds = 3600) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  get(message) {
    const key = this.hashKey(message);
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key);
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(message, data) {
    const key = this.hashKey(message);
    this.cache.set(key, {
      expiry: Date.now() + this.ttl,
      data: JSON.parse(JSON.stringify(data)) // deep copy
    });
  }

  hashKey(str) {
    // Basic fast hash for memory lookup
    let hash = 0;
    const cleaned = str.trim().toLowerCase();
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new AnalysisCache();

// ─── PROVIDER AND ROTATION CONFIGURATION ─────────────────────────────────────
const geminiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

const groqKeys = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2
].filter(Boolean);

let geminiKeyIdx = 0;
let groqKeyIdx = 0;

logger.info(`Initialized API service. Gemini Keys loaded: ${geminiKeys.length}. Groq Keys loaded: ${groqKeys.length}`);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust JSON extraction and parsing wrapper. Cleans strings, strips
 * markdown tags, resolves trailing commas, and processes raw content.
 */
function parseJSON(raw) {
  if (!raw) {
    logger.warn('Empty raw response sent to JSON parser');
    throw new Error('Empty AI response');
  }

  let text = raw.trim();

  // Strip Markdown JSON code block wrappers
  text = text.replace(/^```json\s*/im, '')
             .replace(/```\s*$/m, '')
             .replace(/^```javascript\s*/im, '')
             .replace(/^```\s*/im, '')
             .replace(/```\s*$/m, '')
             .trim();

  // Find boundaries of potential JSON object/array
  const start = Math.min(
    text.indexOf('{') === -1 ? Infinity : text.indexOf('{'),
    text.indexOf('[') === -1 ? Infinity : text.indexOf('[')
  );
  
  const end = Math.max(
    text.lastIndexOf('}'),
    text.lastIndexOf(']')
  );

  if (start === Infinity || end === -1 || end <= start) {
    logger.error('JSON boundaries not found in raw response', { rawPreview: text.substring(0, 200) });
    throw new Error('No JSON object detected in response');
  }

  const jsonStr = text.substring(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    logger.warn('Initial JSON parse failed, attempting regex fixes...', { error: err.message });
    try {
      // Fix trailing commas before closing braces
      let fixedStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
      // Fix unescaped linebreaks inside string values
      fixedStr = fixedStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
      // Sometimes double backslashes happen
      fixedStr = fixedStr.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
      
      // Attempt clean recovery parse
      return JSON.parse(fixedStr);
    } catch (retryErr) {
      logger.error('Failed both standard and clean JSON recovery parsing', {
        jsonStr: jsonStr.substring(0, 300),
        error: retryErr.message
      });
      throw new Error(`JSON parsing failed: ${retryErr.message}`);
    }
  }
}

// ─── GEMINI CALLER (PRIMARY PROVIDER) ────────────────────────────────────────
async function callGemini(prompt, attempt = 0) {
  if (geminiKeys.length === 0) {
    throw new Error('No Google Gemini API keys configured in application environment');
  }

  const keyIndex = geminiKeyIdx % geminiKeys.length;
  const key = geminiKeys[keyIndex];
  const startTime = Date.now();

  logger.info(`Initiating Gemini API call (Key index: ${keyIndex}, Attempt: ${attempt})`);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          topP: 0.8
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      },
      {
        timeout: 20000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const latency = Date.now() - startTime;
    telemetry.recordGeminiCall(true, latency);

    // Rotate keys on successful call to distribute load
    geminiKeyIdx = (geminiKeyIdx + 1) % geminiKeys.length;

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini API returned an empty candidate or text response body');
    }

    logger.debug(`Gemini response received in ${latency}ms`);
    return text;
  } catch (err) {
    const latency = Date.now() - startTime;
    telemetry.recordGeminiCall(false, latency);
    const status = err.response?.status;

    logger.warn(`Gemini API call failed (Status: ${status || 'No Status'}, Message: ${err.message})`);

    // Quota reached or key expired, rotate index immediately
    if (status === 429 || status === 403) {
      geminiKeyIdx = (geminiKeyIdx + 1) % geminiKeys.length;
      logger.warn(`Gemini Quota or Access error. Rotated key index to ${geminiKeyIdx % geminiKeys.length}`);
    }

    // Retry configuration (max 2 retries) with exponential backoff
    if (attempt < 2 && (status >= 500 || status === 429 || err.code === 'ECONNABORTED')) {
      const waitTime = Math.pow(2, attempt) * 1500;
      logger.info(`Sleeping for ${waitTime}ms before retrying Gemini...`);
      await sleep(waitTime);
      return callGemini(prompt, attempt + 1);
    }

    throw new Error(`Gemini provider error (HTTP ${status || 'Unknown'}): ${err.message}`);
  }
}

// ─── GROQ CALLER (SECONDARY FALLBACK PROVIDER) ────────────────────────────────
async function callGroq(prompt, attempt = 0) {
  if (groqKeys.length === 0) {
    throw new Error('No Groq API keys configured in application environment');
  }

  const keyIndex = groqKeyIdx % groqKeys.length;
  const key = groqKeys[keyIndex];
  const startTime = Date.now();

  logger.info(`Initiating Groq API call (Key index: ${keyIndex}, Attempt: ${attempt})`);

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are ScamShield AI. Analyze suspicious messages and respond with valid JSON objects only. Do not include markdown code block syntax. Do not wrap response in markdown fences.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const latency = Date.now() - startTime;
    telemetry.recordGroqCall(true, latency);

    // Rotate keys
    groqKeyIdx = (groqKeyIdx + 1) % groqKeys.length;

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('Groq API returned an empty choices message content');
    }

    logger.debug(`Groq response received in ${latency}ms`);
    return text;
  } catch (err) {
    const latency = Date.now() - startTime;
    telemetry.recordGroqCall(false, latency);
    const status = err.response?.status;

    logger.warn(`Groq API call failed (Status: ${status || 'No Status'}, Message: ${err.message})`);

    if (status === 429) {
      groqKeyIdx = (groqKeyIdx + 1) % groqKeys.length;
      logger.warn(`Groq Rate limit hit. Rotated key index to ${groqKeyIdx % groqKeys.length}`);
    }

    if (attempt < 2 && (status >= 500 || status === 429 || err.code === 'ECONNABORTED')) {
      const waitTime = Math.pow(2, attempt) * 2000;
      logger.info(`Sleeping for ${waitTime}ms before retrying Groq...`);
      await sleep(waitTime);
      return callGroq(prompt, attempt + 1);
    }

    throw new Error(`Groq provider error (HTTP ${status || 'Unknown'}): ${err.message}`);
  }
}

// ─── LOCAL MOCK DATA GENERATOR ───────────────────────────────────────────────
/**
 * If no API keys are provided in development mode, this provides high fidelity
 * simulation results for common scam patterns to allow frontend/backend testing.
 */
function getOfflineMockResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('kbc') || msg.includes('lottery') || msg.includes('lakh')) {
    return {
      is_scam_suspected: true,
      scam_type: 'Prize & Lottery Fraud: KBC / Lucky Draw Scam',
      scam_category: 'prize_lottery',
      signals: {
        unsolicited_prize: true,
        lottery_win: true,
        demands_processing_fee: true,
        urgency_expiry: true,
        personal_gmail_official: true,
      },
      how_it_works: 'The fraudster contacts the victim via WhatsApp claiming they have won a cash lottery from KBC. They ask the victim to deposit processing fees or tax charges in a local bank account, promising to release the prize once the payment completes. No money is ever released, and the scammers block the victim.',
      red_flags: [
        'Claims of winning a lottery for a contest you never entered',
        'Official correspondence sent via standard personal WhatsApp number',
        'Requirement of advance payment to receive a prize'
      ],
      action_steps: [
        'Do NOT send any money under the guise of clearance charges or tax.',
        'Block the sender immediately on WhatsApp.',
        'Take screenshots of the chat profile and transaction demands.',
        'Report the event on the national portal at cybercrime.gov.in.'
      ],
      relevant_law: RELEVANT_LAWS.prize_lottery,
      additional_note: 'Demo Warning: System running in offline mock mode. Response generated from offline rule matching.'
    };
  }

  if (msg.includes('cbi') || msg.includes('police') || msg.includes('drug') || msg.includes('narcotics')) {
    return {
      is_scam_suspected: true,
      scam_type: 'Impersonation Fraud: Fake Police Officer Call',
      scam_category: 'impersonation',
      signals: {
        impersonates_police: true,
        threatens_arrest: true,
        demands_money_transfer: true,
        requests_secrecy: true,
        urgency_immediate: true,
      },
      how_it_works: 'Scammers pose as CBI, Narcotics, or customs officials claiming a parcel containing illegal drugs was detected in your name. They create fear of immediate arrest and demand online bank transfers as verification deposits to verify your innocence. They often force victims to stay on video calls under "digital arrest".',
      red_flags: [
        'Threats of immediate arrest or criminal action over a phone call',
        'Request to transfer money into personal bank accounts for clearance',
        'Coercion to stay continuously online under fake digital arrest'
      ],
      action_steps: [
        'Disconnect the call immediately. Government agencies never place anyone under digital arrest.',
        'Do NOT share bank credentials, passwords, or transfer any security deposits.',
        'Do NOT send copy of Aadhaar or PAN files.',
        'File an incident report on cybercrime.gov.in or contact the local police cell.'
      ],
      relevant_law: RELEVANT_LAWS.impersonation,
      additional_note: 'Demo Warning: System running in offline mock mode. Response generated from offline rule matching.'
    };
  }

  if (msg.includes('kyc') || msg.includes('pan card') || msg.includes('sbi') || msg.includes('hdfc')) {
    return {
      is_scam_suspected: true,
      scam_type: 'Financial Fraud: Fake Bank KYC Update',
      scam_category: 'financial_fraud',
      signals: {
        mentions_pending_kyc: true,
        threatens_account_block: true,
        demands_bank_account_details: true,
        has_suspicious_link: true,
      },
      how_it_works: 'The scammer sends an SMS claiming the victim\'s bank account or net banking will be suspended unless they immediately update their KYC or link their PAN card via a link. Clicking the link takes the user to a fake page designed to steal username, password, and OTP credentials.',
      red_flags: [
        'Urgent threat of block/suspension of banking services',
        'Unofficial bank SMS containing spelling errors and sent from standard mobile sender headers',
        'Link redirecting to external unverified websites rather than official bank apps'
      ],
      action_steps: [
        'Do NOT click any link in the SMS.',
        'Do NOT fill username, passwords, PINs, or OTPs on any page opened through links.',
        'Verify your account status by logging into your official bank app directly.',
        'Call the bank customer desk to report the phishing phone number.'
      ],
      relevant_law: RELEVANT_LAWS.financial_fraud,
      additional_note: 'Demo Warning: System running in offline mock mode. Response generated from offline rule matching.'
    };
  }

  // Generic fallback if text doesn't hit specific keywords
  return localRuleBasedAnalysis(message);
}

// ─── MAIN CALL CHAIN ─────────────────────────────────────────────────────────
async function executeProviderCall(prompt) {
  const errors = [];

  // 1. Try Gemini (Primary)
  if (geminiKeys.length > 0) {
    try {
      const response = await callGemini(prompt);
      return parseJSON(response);
    } catch (err) {
      errors.push(`Gemini Provider Failure: ${err.message}`);
      logger.error('Primary provider call failed. Moving to fallback chains...', { error: err.message });
    }
  }

  // 2. Try Groq (Secondary Fallback)
  if (groqKeys.length > 0) {
    try {
      const response = await callGroq(prompt);
      return parseJSON(response);
    } catch (err) {
      errors.push(`Groq Provider Failure: ${err.message}`);
      logger.error('Secondary provider call failed.', { error: err.message });
    }
  }

  // Throw error if keys were present but both failed
  if (geminiKeys.length > 0 || groqKeys.length > 0) {
    throw new Error(`All configured AI providers failed. Diagnostics: ${errors.join(' | ')}`);
  }

  // 3. System has no API keys (Development Seeder Mode)
  logger.warn('No Gemini or Groq API keys present. Falling back to local offline analysis.');
  telemetry.recordLocalFallback();
  return null;
}

// ─── EXPOSED INTERFACES ──────────────────────────────────────────────────────

/**
 * Main scam analyzer service endpoint. Matches query patterns in cache,
 * executes API calls, and parses response structures. Returns validated schemas.
 */
async function analyzeScam(message) {
  if (!message || !message.trim()) {
    logger.warn('analyzeScam called with empty message text');
    throw new Error('Message content cannot be empty');
  }

  const cleanedMsg = message.trim();
  telemetry.recordRequest();

  // Check Local Cache
  const cachedResponse = cache.get(cleanedMsg);
  if (cachedResponse) {
    logger.info('Cache hit for scam analysis request');
    telemetry.recordCacheHit();
    return cachedResponse;
  }

  let result = null;

  try {
    const prompt = buildScamAnalysisPrompt(cleanedMsg);
    result = await executeProviderCall(prompt);

    // If result is null, it means no keys are configured. Run offline simulator.
    if (!result) {
      result = getOfflineMockResponse(cleanedMsg);
    }
  } catch (err) {
    logger.error('AI Chain error occurred. Invoking local rule matching engine fallback', { error: err.message });
    telemetry.recordLocalFallback();
    // Tertiary recovery fallback (regex matcher) to guarantee 100% service uptime
    result = localRuleBasedAnalysis(cleanedMsg);
  }

  // Sanitize fields to match DB schemas exactly and avoid runtime crashes
  // AI gives us signals — scoring engine calculates score
  const scored = scoreAnalysis({
    signals: result.signals || {},
    scam_type: result.scam_type,
    scam_category: result.scam_category,
    is_scam_suspected: result.is_scam_suspected ?? true,
    has_financial_loss: result.signals?.has_financial_loss || false,
  });

  const sanitized = {
    is_scam: scored.is_scam,
    scam_type: String(result.scam_type || 'Unknown'),
    scam_category: String(result.scam_category || 'miscellaneous'),
    severity: scored.severity,
    confidence_score: scored.confidence_score,
    confidence_label: scored.confidence_label,
    severity_color: scored.severity_color,
    how_it_works: String(result.how_it_works || 'Operation details currently unavailable. Be cautious of unsolicited transactions.'),
    red_flags: Array.isArray(result.red_flags) ? result.red_flags.filter(Boolean) : [],
    action_steps: Array.isArray(result.action_steps) ? result.action_steps.filter(Boolean) : [],
    relevant_law: String(result.relevant_law || RELEVANT_LAWS.miscellaneous),
    safe_to_ignore: scored.safe_to_ignore,
    evidence_to_collect: Array.isArray(result.evidence_to_collect) 
      ? result.evidence_to_collect.filter(Boolean) 
      : getEvidenceChecklist(result.scam_category || 'miscellaneous'),
    additional_note: result.additional_note || null,
    evidence_vault: scored.evidence_vault,   // new field
    score_explanation: scored.score_explanation,  // new field
  };

  // Populate missing arrays with defaults if empty
  if (sanitized.red_flags.length === 0) {
    sanitized.red_flags = ['Unverified source calling or messaging without verification'];
  }
  if (sanitized.action_steps.length === 0) {
    sanitized.action_steps = [
      ACTION_STEPS_LIBRARY.screenshot,
      ACTION_STEPS_LIBRARY.report_cybercrime,
      ACTION_STEPS_LIBRARY.do_not_pay
    ];
  }

  // Cache response for future requests
  cache.set(cleanedMsg, sanitized);

  return sanitized;
}

/**
 * AI complaint document generator. Translates raw analysis outputs into structured
 * templates with dynamic placeholders. Fallback templates are defined in case APIs fail.
 */
async function generateComplaintDocument(docType, caseData) {
  if (!docType || !caseData) {
    throw new Error('Missing required arguments (docType or caseData) for document generation');
  }

  telemetry.recordDocGen();
  logger.info(`Generating document of type: ${docType} for Case ID: ${caseData.id}`);

  let result = null;

  try {
    const prompt = buildComplaintPrompt(docType, caseData);
    result = await executeProviderCall(prompt);
  } catch (err) {
    logger.error('AI Document generation failed. Loading local mock template recovery', { error: err.message });
  }

  // Fallback structures if AI call fails or keys are missing
  if (!result) {
    result = getLocalDocTemplate(docType, caseData);
  }

  // Extract dynamic brackets placeholders e.g. [COMPLAINANT NAME]
  const placeholders = [];
  const pattern = /\[([A-Z][A-Z\s0-9]+)\]/g;
  let match;
  while ((match = pattern.exec(result.content)) !== null) {
    const label = match[1].trim();
    if (!placeholders.includes(label)) {
      placeholders.push(label);
    }
  }

  return {
    title: String(result.title || `${docType.replace(/_/g, ' ').toUpperCase()}`),
    content: String(result.content || ''),
    placeholders
  };
}

/**
 * Returns structured complaint text template locally if AI API fails.
 */
function getLocalDocTemplate(docType, caseData) {
  const timestamp = new Date().toLocaleDateString('en-IN');
  
  if (docType === 'cybercrime_complaint') {
    return {
      title: 'Formal Complaint to Cyber Cell',
      content: `TO,
THE STATION HOUSE OFFICER / INCIDENT IN-CHARGE,
CYBER CRIME CELL,
POLICE STATION: [DISTRICT POLICE STATION]
CITY: [CITY NAME], STATE: [STATE NAME]

SUBJECT: COMPLAINT REGARDING ONLINE CYBER FRAUD VIA ${caseData.scam_type.toUpperCase()}

Respected Sir/Madam,

I am writing to bring to your urgent notice an incident of cyber fraud where I was targeted by fraudsters. The incident details are described below:

1. COMPLAINANT DETAILS:
   - Full Name: [COMPLAINANT NAME]
   - Contact Number: [PHONE NUMBER]
   - Email Address: [EMAIL ADDRESS]
   - Address: [RESIDENTIAL ADDRESS]

2. SUSPECT / ACCUSED DETAILS:
   - Suspicious Phone Number/ID: [FRAUDSTER PHONE NUMBER]
   - Accused Web Link: [SUSPECT URL OR WEBSITE]
   - Bank Account Shared by Accused (if any): [FRAUDSTER BANK ACCOUNT DETAILS]

3. INCIDENT DESCRIPTION:
   - Date and Time of Incident: [DATE OF INCIDENT]
   - Scam Category: ${caseData.scam_type}
   - Description of Event:
     The suspect contacted me on the date mentioned above. The original text message or call description received was:
     "${caseData.original_message || '[INSERT SUSPICIOUS TEXT HERE]'}"
     The suspect created panic and coerced me into complying with their requests, inducing an online transfer.
   - Financial Loss Details (if any):
     Amount Lost: Rs. [AMOUNT LOST]
     My Bank Name & Account: [MY BANK NAME AND ACCOUNT NUMBER]
     Transaction ID / UTR Code: [TRANSACTION ID OR UTR NUMBER]
     Beneficiary Bank Details: [BENEFICIARY BANK AND ACCOUNT NUMBER]

4. APPLICABLE LAWS:
   The action of the accused constitutes cheating and impersonation under:
   ${caseData.relevant_law || RELEVANT_LAWS.miscellaneous}

Therefore, I request you to register a formal complaint, investigate the suspicious phone number and account details, freeze the beneficiary bank accounts, and help recover my hard-earned money.

Enclosures:
- Copy of Bank Statement
- Screenshots of Chats/Transaction success page
- Copy of Identity Proof (Aadhaar/PAN)

Yours faithfully,

[COMPLAINANT NAME]
Date: ${timestamp}
Place: [CITY NAME]`
    };
  }

  if (docType === 'bank_freeze_letter') {
    return {
      title: 'Urgent Request to Freeze Beneficiary Account',
      content: `DATE: ${timestamp}

TO,
THE BRANCH MANAGER,
BANK NAME: [YOUR BANK NAME]
BRANCH NAME: [YOUR BRANCH NAME]
CITY: [CITY NAME]

SUBJECT: URGENT REQUEST TO REVERSE TRANSACTION AND FREEZE BENEFICIARY ACCOUNT (FRAUD ALERT)

Dear Sir/Madam,

I hold a bank account with your branch, details as follows:
- Account Holder Name: [ACCOUNT HOLDER NAME]
- Account Number: [YOUR ACCOUNT NUMBER]
- Registered Mobile Number: [YOUR MOBILE NUMBER]

I am writing to report a fraudulent transaction initiated on my account, which took place on [TRANSACTION DATE]. I was deceived into transferring funds under the category of ${caseData.scam_type}.

TRANSACTION DETAILS:
- Date of Transaction: [TRANSACTION DATE]
- Transaction Amount: Rs. [TRANSACTION AMOUNT]
- Transaction Reference ID / UTR Number: [TRANSACTION ID OR UTR NUMBER]
- Beneficiary Bank Name: [BENEFICIARY BANK NAME]
- Beneficiary Account Number: [BENEFICIARY ACCOUNT NUMBER]
- Beneficiary UPI ID (if applicable): [BENEFICIARY UPI ID]

ACTION REQUESTED:
As per the Reserve Bank of India (RBI) guidelines on customer liability in unauthorized electronic banking transactions, I request your cell to:
1. Immediately raise a dispute ticket with the beneficiary bank to freeze the beneficiary account.
2. Terminate / Reverse the fraudulent transfer and credit the amount back to my account.
3. Coordinate with the National Cyber Crime Portal (Helpline 1930) to track the transaction chain.

I have already initiated a cyber complaint on the national portal. A copy of the acknowledgement receipt is enclosed. Please take prompt action to secure the fund ledger.

Thank you.

Sincerely,

[ACCOUNT HOLDER NAME]
Contact: [YOUR MOBILE NUMBER]
Enclosures:
- Phishing SMS/Chat screenshots
- Bank debit transaction receipt
- Cybercrime portal acknowledgement card`
    };
  }

  if (docType === 'consumer_complaint') {
    return {
      title: 'Consumer Forum Dispute Complaint',
      content: `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION, [DISTRICT NAME]

IN THE MATTER OF:
[COMPLAINANT NAME]
Residing at: [COMPLAINANT ADDRESS]
...Complainant

VERSUS

[RESPONDENT COMPANY NAME]
Office address: [RESPONDENT ADDRESS]
...Respondent

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

Most Respectfully Showeth:

1. That the Complainant is a resident of [COMPLAINANT CITY] and is a consumer as defined under Section 2(7) of the Consumer Protection Act, 2019.
2. That the Respondent is an e-commerce platform / business seller engaged in selling [PRODUCT OR SERVICE DESCRIPTION].
3. BRIEF FACTS:
   On [DATE OF INCIDENT], the Complainant registered/purchased a product on the Respondent's platform. The details of the purchase are as follows:
   - Order/Invoice Number: [ORDER OR INVOICE NUMBER]
   - Transaction Amount: Rs. [TRANSACTION AMOUNT]
   However, the Complainant received fraudulent updates and services under the category of ${caseData.scam_type}. Specifically, [BRIEF DESCRIPTION OF PRODUCT OR SERVICE FRAUD].
4. DEFICIENCY OF SERVICE / UNFAIR TRADE PRACTICE:
   The Respondent failed to deliver the promised goods/services, engaged in deceptive representations, and did not resolve the dispute via customer care channels, violating guidelines of the Consumer Protection Act.
5. RELIEF SOUGHT:
   The Complainant prays this Hon'ble Commission for:
   - Directing the Respondent to refund the entire amount of Rs. [TRANSACTION AMOUNT] with 12% interest.
   - Compensation of Rs. [COMPENSATION AMOUNT] for mental agony and harassment.
   - Litigation expenses of Rs. [LITIGATION COST].

Verification:
I, [COMPLAINANT NAME], do hereby verify that the contents of paragraphs 1 to 5 are true to my personal knowledge and belief.

Complainant Signature:
________________________
Date: ${timestamp}
Place: [CITY NAME]`
    };
  }

  return {
    title: 'Formal Grievance Document',
    content: `TO WHOMSOEVER IT MAY CONCERN\n\nThis is a formal grievance regarding a scam of type: ${caseData.scam_type}.\n\nComplainant: [COMPLAINANT NAME]\nDate: ${timestamp}`
  };
}

module.exports = {
  analyzeScam,
  generateComplaintDocument,
  getTelemetryReport: () => telemetry.getReport(),
  clearAnalysisCache: () => cache.clear()
};
