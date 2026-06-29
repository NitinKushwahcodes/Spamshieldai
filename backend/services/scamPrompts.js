// services/scamPrompts.js
// Complete Indian scam knowledge base and AI prompt builders
// This file determines response quality — built thoroughly with 800+ lines

'use strict';

/**
 * ─── COMPLETE INDIAN SCAM TYPE DATABASE ──────────────────────────────────────
 * Detailed structures for 100+ scam types mapped to their definitions,
 * indicators, and target demographics to enrich the AI prompts and fallback engine.
 */
const SCAM_DATABASE = {
  financial_fraud: {
    label: 'Financial Fraud',
    description: 'Fraud involving unauthorized money transfers, bank account manipulation, fake investment schemes, or credit card updates.',
    types: [
      'UPI Payment Request Fraud',
      'QR Code Scam',
      'Fake Bank KYC Update',
      'Credit Card Upgrade Scam',
      'Loan App Fraud',
      'Fake Loan Offer',
      'Investment Fraud (Ponzi)',
      'Crypto Investment Scam',
      'Stock Market Tip Fraud',
      'Fake Mutual Fund Scheme',
      'Chit Fund Fraud',
      'MLM / Pyramid Scheme',
      'Advance Fee Fraud (Nigerian 419)',
      'Fake Insurance Policy',
      'Insurance Claim Fraud',
      'EMI Fraud',
      'Fake RBI Notification',
      'Fake SEBI Notification',
      'Account Takeover via OTP',
      'Vishing (Voice Phishing for bank details)',
      'SIM Swap Fraud',
      'Fake UPI Collect Request',
      'Payment Gateway Fraud',
      'Fake Cashback Offer'
    ],
    keywords: [
      'gpay', 'paytm', 'phonepe', 'upi', 'collect request', 'qr code', 'kyc', 'bank account', 
      'blocked', 'credit card', 'limit increase', 'loan app', 'instant loan', 'double money', 
      'investment return', 'crypto', 'bitcoin', 'stock market', 'trading tips', 'chit fund', 
      'rbi notice', 'sebi notice', 'otp', 'verification code', 'sim card', 'beneficiary', 
      'cashback', ' scratch card', 'refund'
    ]
  },
  job_employment: {
    label: 'Job & Employment Fraud',
    description: 'Scams targeting job seekers by charging registration fees, promising fake government placements, or demanding task completions for small payouts.',
    types: [
      'Fake Job Offer (Registration Fee)',
      'Work From Home Scam',
      'Data Entry Job Fraud',
      'Fake Government Job Notification',
      'Placement Agency Scam',
      'Fake IT Company Job Offer',
      'Task Completion Scam (YouTube likes, reviews)',
      'Fake Internship Offer',
      'Part-time Job Fraud',
      'Overseas Job Fraud',
      'Fake Railway/PSU Job',
      'Modelling / Acting Casting Fraud',
      'Fake CA / Accountant Job'
    ],
    keywords: [
      'job offer', 'work from home', 'data entry', 'typing job', 'government job', 'railway recruitment', 
      'placement fee', 'registration fee', 'interview letter', 'appointment letter', 'youtube likes', 
      'google reviews', 'part-time job', 'task completion', 'daily salary', 'visa processing', 
      'overseas job', 'audition', 'casting call', 'wipro hr', 'tcs hr', 'infosys hr'
    ]
  },
  prize_lottery: {
    label: 'Prize & Lottery Fraud',
    description: 'Scams notifying victims they won lotteries (e.g. KBC), gift draws, or scholarship funds, and demanding processing fees to release the prize.',
    types: [
      'KBC / Lucky Draw Scam',
      'Fake Amazon/Flipkart Prize',
      'Lottery Winner Notification',
      'Gift Card Scam',
      'Fake Contest Winner',
      'Courier Prize Delivery Fraud',
      'Fake Scholarship Winner',
      'Fake Government Scheme Prize'
    ],
    keywords: [
      'kbc', 'lottery', 'lucky draw', 'won 25 lakh', 'amazon prize', 'flipkart scratch card', 
      'wheel of fortune', 'gift card', 'contest winner', 'courier fee', 'customs clearance fee', 
      'scholarship approval', 'subsidy prize', 'claim prize', 'kaun banega crorepati'
    ]
  },
  impersonation: {
    label: 'Impersonation Fraud',
    description: 'Scammers calling or messaging while posing as police officers, CBI agents, tax officials, or telecom regulators to threaten arrest or disconnection.',
    types: [
      'Fake Police Officer Call',
      'Fake CBI / ED Officer',
      'Fake Income Tax Department',
      'Fake Telecom Regulatory Authority (TRAI)',
      'Fake Bank Manager Call',
      'Fake RBI Official',
      'Fake Narcotics Control Bureau',
      'Fake Customs Department',
      'Fake Supreme Court Notice',
      'Fake High Court Summons',
      'Fake Electricity Department',
      'Fake Gas Company',
      'Fake Social Security',
      'Impersonating Army / Defence',
      'Fake NGO Collection',
      'Impersonating Minister / MP Office'
    ],
    keywords: [
      'cbi', 'narcotics', 'customs', 'arrest warrant', 'supreme court', 'high court', 'police officer', 
      'fedex parcel', 'illegal drugs', 'electricity bill', 'power cut', 'gas connection', 'disconnection', 
      'trai block', 'sim card blocked', 'defence officer', 'army officer', 'ngo donation', 'prime minister relief'
    ]
  },
  digital_online: {
    label: 'Digital & Online Fraud',
    description: 'Attacks leveraging software tools, links, social engineering, or app installations to extract details or ransom files.',
    types: [
      'Phishing Link (fake login page)',
      'Smishing (SMS phishing)',
      'Malware / Spyware Link',
      'Fake App Download',
      'Remote Access Scam (AnyDesk / TeamViewer)',
      'Fake OTP Request',
      'Social Media Account Hack',
      'Instagram / Facebook Investment Scam',
      'WhatsApp Impersonation (friend in trouble)',
      'Fake Online Shopping Site',
      'OLX / Marketplace Fraud',
      'Fake Rental Property',
      'Matrimonial / Dating Scam',
      'Sextortion',
      'Fake Charity / Donation',
      'Fake COVID Relief Scheme',
      'Email Spoofing',
      'Man in the Middle Attack',
      'Fake VPN / Security Software',
      'Ransomware'
    ],
    keywords: [
      'phishing', 'smishing', 'click link', 'update password', 'anydesk', 'teamviewer', 'rustdesk', 
      'remote access', 'otp verification', 'account hacked', 'whatsapp chat', 'olx buyer', 'army renting फ्लैट', 
      'matrimonial profile', 'dating chat', 'video call extortion', 'sextortion', 'charity funding', 
      'covid scheme', 'spoofed email', 'vpn download', 'ransomware', 'files locked'
    ]
  },
  ecommerce_delivery: {
    label: 'E-commerce & Delivery Fraud',
    description: 'Scams involving online store orders, fake tracking updates, COD delivery payments for empty parcels, or customer care search manipulation.',
    types: [
      'Fake Delivery Agent Call',
      'COD Fraud (wrong item delivered)',
      'Fake Amazon Seller',
      'Refund Processing Scam',
      'Fake Tracking Link',
      'Product Not Delivered',
      'Counterfeit Product Fraud',
      'Fake Customer Care Number'
    ],
    keywords: [
      'delivery agent', 'cod payment', 'cash on delivery', 'tracking link', 'order cancelled', 
      'refund process', 'fake seller', 'counterfeit product', 'not delivered', 'customer care number', 
      'google search contact', 'post office package', 'dhl tracking'
    ]
  },
  real_estate: {
    label: 'Real Estate Fraud',
    description: 'Property sales or rent frauds involving fake deeds, phantom landlords, double sales, or unfulfilled developer completions.',
    types: [
      'Fake Property Listing',
      'Advance Rent Fraud',
      'Fake Landlord',
      'Property Document Fraud',
      'Builder Fraud (flat not delivered)',
      'Fake Government Land Scheme'
    ],
    keywords: [
      'property listing', 'advance rent', 'deposit amount', 'fake registry', 'builder fraud', 
      'flat possession', 'rera complaint', 'land allotment', 'registry papers', 'lease agreement'
    ]
  },
  romance_social: {
    label: 'Romance & Social Engineering',
    description: 'Emotional scams building trust through online relationships before fabricating high-value problems or investment opportunities.',
    types: [
      'Romance Scam (fake relationship)',
      'Honey Trap',
      'Pig Butchering Scam (investment via romance)',
      'Friend in Emergency Scam',
      'Grandparent Scam',
      'Fake Military Romance'
    ],
    keywords: [
      'romance', 'dating app', 'tinder', 'bumble', 'girlfriend', 'boyfriend', 'customs gift', 
      'pig butchering', 'shaadi profile', 'money request emergency', 'hospital bill friend', 
      'grandson accident', 'military deployment'
    ]
  },
  government_scheme: {
    label: 'Fake Government Scheme',
    description: 'Manipulative announcements or texts claiming standard state benefits, subsidies, or card integrations require processing fees.',
    types: [
      'Fake PM Kisan Scheme',
      'Fake Ayushman Bharat Card',
      'Fake Aadhaar Update Required',
      'Fake Voter ID Update',
      'Fake Gas Cylinder Subsidy',
      'Fake EPFO Settlement',
      'Fake MNREGA Payment',
      'Fake Scholarship Scheme',
      'Fake Ration Card Update',
      'Fake PAN Card Linking'
    ],
    keywords: [
      'pm kisan', 'ayushman bharat', 'aadhaar link', 'voter id update', 'gas subsidy', 'epfo claim', 
      'mnrega wage', 'scholarship portal', 'ration card update', 'pan card link', 'income tax refund', 
      'sarkari subsidy'
    ]
  },
  tech_support: {
    label: 'Tech Support Fraud',
    description: 'Popups or cold calls convincing users their computer is infected or account is breached to charge fees for software setups.',
    types: [
      'Fake Microsoft Support',
      'Fake Google Support',
      'Fake Antivirus Alert',
      'Browser Warning Pop-up Scam',
      'Fake App Store Alert'
    ],
    keywords: [
      'microsoft support', 'windows locked', 'google security', 'virus detected', 'ransomware alert', 
      'antivirus expired', 'toll-free technical support', 'browser frozen'
    ]
  },
  miscellaneous: {
    label: 'Other Fraud Types',
    description: 'Other diverse cybercrime attempts like fake tantriks, medical emergency requests, blackmails, and kidnapping threats.',
    types: [
      'Fake Astrologer / Tantrik',
      'Medical Treatment Fraud',
      'Fake Medicine / Supplement',
      'Education Loan Fraud',
      'Fake NGO Adoption',
      'Religious Donation Fraud',
      'Fake Legal Notice',
      'Blackmail / Extortion',
      'Kidnapping Threat Call',
      'Unknown Transaction Alert (fake)'
    ],
    keywords: [
      'astrologer', 'tantrik', 'black magic', 'cancer cure', 'miracle drug', 'ngo adoption', 
      'temple donation', 'legal notice court', 'blackmail photo', 'kidnapped son', 'unauthorized debit'
    ]
  }
};

// Flatten all categories with their types
const ALL_SCAM_TYPES = Object.entries(SCAM_DATABASE).flatMap(([catKey, cat]) =>
  cat.types.map(t => `${cat.label}: ${t}`)
);

/**
 * ─── RED FLAG PATTERNS ────────────────────────────────────────────────────────
 * Specific visual, verbal, or request-based red flags.
 */
const RED_FLAG_PATTERNS = [
  'Requests OTP, password, or security PIN via text or chat',
  'Asks you to click an unfamiliar shortened or misspelled URL (e.g. upi-link.cc)',
  'Creates immediate urgency, threat of arrest, or deadline pressure (e.g. within 24 hours)',
  'Promises unrealistically high investment returns (e.g. 5x profit in 1 day)',
  'Demands advance fee, registration deposit, or processing fee to release money',
  'Uses standard WhatsApp numbers for official bank, government, or business outreach',
  'Claims to be government, CBI, Narcotics, customs, or bank official via unofficial call',
  'Asks to install screen sharing tools (AnyDesk, TeamViewer, RustDesk)',
  'Requests QR code scan for receiving money (QR codes are ONLY for paying, never receiving)',
  'Uses poor grammar, typos, or amateur layout in official-looking communications',
  'Caller ID or number does not match verified channels from official websites',
  'Insists on keeping the transaction or matter strictly confidential and secret',
  'Threatens instant power, gas, or SIM card disconnection due to unpaid dues',
  'Congratulates for a prize draw, lottery, or contest you never enrolled in',
  'Offers remote freelance jobs requiring you to perform reviews, likes, or tasks for prepaid deposits',
  'Presents fake bank transaction screenshots or certificates with alignment discrepancies',
  'Uses generic greetings (e.g. Dear Customer) instead of addressing you by name',
  'Requests sensitive documents like Aadhaar, PAN, or cancelled checks via messaging apps',
  'Offers instant employment without any standard interview, test, or CV review',
  'Sends payment receipts first as proof, then claims they sent extra and demands refund'
];

/**
 * ─── DETAILED ACTION STEPS LIBRARY ──────────────────────────────────────────
 * Concrete, numbered, and category-tailored action steps.
 */
const ACTION_STEPS_LIBRARY = {
  do_not_pay: 'Do NOT transfer any money or pay registration fees, clearance fees, or verification taxes.',
  do_not_share: 'Do NOT share OTP, password, PIN, CVV, Aadhaar, PAN, or banking details with anyone.',
  do_not_click: 'Do NOT click on any link in the message. Delete the message to avoid accidental clicks.',
  do_not_install: 'Do NOT install any application suggested by the sender (especially AnyDesk, TeamViewer, or third-party APKs).',
  block_number: 'Block the sender\'s phone number on WhatsApp and your mobile carrier immediately.',
  screenshot: 'Take high-quality screenshots of all chat conversations, numbers, payments, and website links right now.',
  report_cybercrime: 'File a formal complaint on the government portal (cybercrime.gov.in) or call 1930 (National Cyber Crime Helpline) immediately.',
  contact_bank: 'Call your bank\'s customer care immediately (using the number on the back of your card) to report the fraud.',
  freeze_account: 'Instruct your bank to block your net banking account, credit card, or UPI services immediately to prevent further debits.',
  change_passwords: 'Change the password of your net banking, UPI apps, email, and social media accounts using a secure device.',
  uninstall_app: 'Uninstall any remote-access app (AnyDesk, TeamViewer, RustDesk) if you installed it during the incident.',
  file_fir: 'Visit the nearest local police station or Cyber Cell to file an FIR with all your compiled evidence.',
  report_whatsapp: 'Report the number on WhatsApp: Open chat → Tap options (three dots) → More → Report.',
  report_google: 'If a phishing link was shared, report the URL to Google Safe Browsing (safebrowsing.google.com).',
  preserve_evidence: 'Save all call logs, SMS texts, and bank statement PDFs. Do not delete them as they are legal evidence.',
  contact_family: 'If you feel threatened or scared, immediately speak to a family member, trusted friend, or counselor.'
};

/**
 * ─── RELEVANT LAWS BY SCAM CATEGORY ──────────────────────────────────────────
 * IPC and IT Act mappings for incident reports.
 */
const RELEVANT_LAWS = {
  financial_fraud: 'Section 420 (Cheating), Section 406 (Criminal Breach of Trust) of Indian Penal Code (IPC); Section 66C (Identity Theft), Section 66D (Cheating by Impersonation) of Information Technology (IT) Act.',
  job_employment: 'Section 420 (Cheating), Section 406 (Criminal Breach of Trust), Section 120B (Criminal Conspiracy) of IPC; Section 66D of IT Act.',
  prize_lottery: 'Section 420 (Cheating), Section 120B of IPC; Section 66D of IT Act; Prize Chits and Money Circulation Schemes (Banning) Act 1978.',
  impersonation: 'Section 170 (Impersonating a Public Servant), Section 419 (Cheating by Impersonation), Section 420 of IPC; Section 66D of IT Act.',
  digital_online: 'Section 43 (Damage to Computer Systems), Section 66 (Computer Related Offences), Section 66C (Identity Theft), Section 66D of IT Act; Section 420 of IPC.',
  ecommerce_delivery: 'Section 420, Section 415 of IPC; Section 66D of IT Act; Section 89 of Consumer Protection Act 2019 (Misleading Advertisements).',
  real_estate: 'Section 420 (Cheating), Section 406 (Criminal Breach of Trust), Section 467 (Forgery of Valuable Security) of IPC; Section 31 of RERA Act 2016.',
  romance_social: 'Section 420 (Cheating), Section 384 (Extortion), Section 506 (Criminal Intimidation) of IPC; Section 66E (Violation of Privacy), Section 67 (Publishing Obscene Material) of IT Act.',
  government_scheme: 'Section 170 (Impersonating Public Servant), Section 419, Section 420 of IPC; Section 66D of IT Act.',
  tech_support: 'Section 43, Section 66 of IT Act; Section 420 of IPC.',
  miscellaneous: 'Section 420 (Cheating), Section 384 (Extortion), Section 406 of IPC; Section 66D of IT Act.'
};

/**
 * Maps categories to specific evidence collections
 */
function getEvidenceChecklist(scamCategory) {
  const common = [
    'Screenshot of suspicious message / WhatsApp chat',
    'Sender\'s phone number, email address, or website URL',
    'Exact date and time of receiving the message / call',
    'Your own phone number or account details targeted'
  ];

  const specific = {
    financial_fraud: [
      'UPI Transaction ID (12-digit UTR number)',
      'Bank account statement showing transaction debits',
      'Beneficiary UPI ID or account number',
      'Screenshots of UPI app payment success screens',
      'Amount transferred and currency details'
    ],
    job_employment: [
      'Copy of fake appointment or recruitment letter',
      'Screenshots of task lists, daily ratings, or reviews performed',
      'Receipts or UTR numbers of registration fee payments',
      'Job advertisement links or portal registrations'
    ],
    prize_lottery: [
      'Copy of scratch card image or lottery certificate received',
      'Caller ID / WhatsApp number claiming to represent KBC/Brands',
      'Receipts of processing fee or taxes paid',
      'Audio recordings of calls (if recorded)'
    ],
    impersonation: [
      'Audio call recordings (highly recommended)',
      'Screenshots of fake Police/CBI/Narcotics department badges',
      'Copy of fake legal summon notices or warrant files sent',
      'Phone numbers used to dial your phone'
    ],
    digital_online: [
      'Screenshot of browser URL showing phishing page address',
      'Copy of full email headers from spoofed email inbox',
      'Names of apps installed (AnyDesk, remote tools)',
      'Session IDs of remote access apps (if noted)'
    ],
    ecommerce_delivery: [
      'Original online shop order details and receipt',
      'Fake courier tracking link or SMS screenshot',
      'Photos of the parcel contents and invoice sheet',
      'Delivery boy details or agent contact numbers'
    ]
  };

  return [...common, ...(specific[scamCategory] || [])];
}

/**
 * ─── RULE-BASED SCAM CLASSIFIER (FALLBACK ENGINE) ────────────────────────────
 * This provides high-quality backup classifications if AI models are down.
 * It iterates through keywords in SCAM_DATABASE to categorize inputs,
 * extracts key red flags, selects action steps, and outlines relevant laws.
 */
function localRuleBasedAnalysis(message) {
  const lowerMsg = message.toLowerCase();
  let matchedCategory = 'miscellaneous';
  let matchedType = 'Unknown Fraud Type';
  let highestCount = 0;

  // Find best category match by counting keyword occurrences
  for (const [catKey, cat] of Object.entries(SCAM_DATABASE)) {
    let count = 0;
    cat.keywords.forEach(kw => {
      if (lowerMsg.includes(kw)) count++;
    });
    if (count > highestCount) {
      highestCount = count;
      matchedCategory = catKey;
      // Default type to first element of the category list
      matchedType = cat.types[0];
    }
  }

  // Refine Type based on specific keywords
  if (matchedCategory === 'financial_fraud') {
    if (lowerMsg.includes('qr')) matchedType = 'QR Code Scam';
    else if (lowerMsg.includes('kyc') || lowerMsg.includes('aadhaar') || lowerMsg.includes('pan')) matchedType = 'Fake Bank KYC Update';
    else if (lowerMsg.includes('credit card') || lowerMsg.includes('upgrade')) matchedType = 'Credit Card Upgrade Scam';
    else if (lowerMsg.includes('loan app') || lowerMsg.includes('instant loan')) matchedType = 'Loan App Fraud';
    else if (lowerMsg.includes('crypto') || lowerMsg.includes('bitcoin') || lowerMsg.includes('usdt')) matchedType = 'Crypto Investment Scam';
    else if (lowerMsg.includes('stock') || lowerMsg.includes('tip') || lowerMsg.includes('trading')) matchedType = 'Stock Market Tip Fraud';
    else matchedType = 'UPI Payment Request Fraud';
  } else if (matchedCategory === 'job_employment') {
    if (lowerMsg.includes('work from home') || lowerMsg.includes('wfh')) matchedType = 'Work From Home Scam';
    else if (lowerMsg.includes('likes') || lowerMsg.includes('youtube') || lowerMsg.includes('reviews') || lowerMsg.includes('task')) matchedType = 'Task Completion Scam (YouTube likes, reviews)';
    else matchedType = 'Fake Job Offer (Registration Fee)';
  } else if (matchedCategory === 'prize_lottery') {
    if (lowerMsg.includes('kbc') || lowerMsg.includes('crorepati')) matchedType = 'KBC / Lucky Draw Scam';
    else if (lowerMsg.includes('amazon') || lowerMsg.includes('flipkart')) matchedType = 'Fake Amazon/Flipkart Prize';
    else matchedType = 'Lottery Winner Notification';
  } else if (matchedCategory === 'impersonation') {
    if (lowerMsg.includes('police') || lowerMsg.includes('arrest')) matchedType = 'Fake Police Officer Call';
    else if (lowerMsg.includes('cbi') || lowerMsg.includes('ed') || lowerMsg.includes('narcotics')) matchedType = 'Fake CBI / ED Officer';
    else if (lowerMsg.includes('electricity') || lowerMsg.includes('bill') || lowerMsg.includes('power cut')) matchedType = 'Fake Electricity Department';
    else if (lowerMsg.includes('trai') || lowerMsg.includes('telecom')) matchedType = 'Fake Telecom Regulatory Authority (TRAI)';
    else matchedType = 'Fake Customs Department';
  } else if (matchedCategory === 'digital_online') {
    if (lowerMsg.includes('anydesk') || lowerMsg.includes('teamviewer') || lowerMsg.includes('remote')) matchedType = 'Remote Access Scam (AnyDesk / TeamViewer)';
    else if (lowerMsg.includes('link') || lowerMsg.includes('http') || lowerMsg.includes('.cc')) matchedType = 'Phishing Link (fake login page)';
    else if (lowerMsg.includes('sextortion') || lowerMsg.includes('video call')) matchedType = 'Sextortion';
    else matchedType = 'WhatsApp Impersonation (friend in trouble)';
  }

  // Populate signals object dynamically
  const signals = {
    demands_money_transfer: lowerMsg.includes('transfer') || lowerMsg.includes('send money') || lowerMsg.includes('gpay') || lowerMsg.includes('paytm') || lowerMsg.includes('phonepe') || lowerMsg.includes('upi'),
    demands_processing_fee: lowerMsg.includes('processing fee') || lowerMsg.includes('processing charge') || lowerMsg.includes('clearance fee'),
    demands_registration_fee: lowerMsg.includes('registration fee') || lowerMsg.includes('deposit fee'),
    demands_otp: lowerMsg.includes('otp') || lowerMsg.includes('verification code') || lowerMsg.includes('one-time password'),
    demands_password: lowerMsg.includes('password') || lowerMsg.includes('mpin'),
    demands_cvv_pin: lowerMsg.includes('cvv') || lowerMsg.includes('pin number') || lowerMsg.includes('atm pin'),
    demands_bank_account_details: lowerMsg.includes('account details') || lowerMsg.includes('account number') || lowerMsg.includes('ifsc'),
    demands_aadhaar_pan: lowerMsg.includes('aadhaar') || lowerMsg.includes('pan card') || lowerMsg.includes('pan photo'),
    demands_qr_scan_to_pay: lowerMsg.includes('qr code') || lowerMsg.includes('scan qr'),
    demands_gift_card_payment: lowerMsg.includes('gift card') || lowerMsg.includes('google play card') || lowerMsg.includes('amazon card'),

    threatens_arrest: lowerMsg.includes('arrest') || lowerMsg.includes('police station') || lowerMsg.includes('custody'),
    threatens_legal_action: lowerMsg.includes('legal notice') || lowerMsg.includes('fir') || lowerMsg.includes('court') || lowerMsg.includes('case filed'),
    threatens_account_block: lowerMsg.includes('block') || lowerMsg.includes('freeze') || lowerMsg.includes('suspended'),
    threatens_disconnection: lowerMsg.includes('disconnect') || lowerMsg.includes('power cut') || lowerMsg.includes('sim block'),
    threatens_property_seizure: lowerMsg.includes('seizure') || lowerMsg.includes('attach property'),
    threatens_family_harm: lowerMsg.includes('family') && (lowerMsg.includes('threat') || lowerMsg.includes('kidnap')),
    blackmail_sextortion: lowerMsg.includes('video call') || lowerMsg.includes('sextortion') || lowerMsg.includes('blackmail'),

    impersonates_cbi_ed: lowerMsg.includes('cbi') || lowerMsg.includes('ncb') || lowerMsg.includes('ed officer'),
    impersonates_police: lowerMsg.includes('police') || lowerMsg.includes('inspector') || lowerMsg.includes('dcp') || lowerMsg.includes('sho'),
    impersonates_court: lowerMsg.includes('court') || lowerMsg.includes('judge'),
    impersonates_rbi: lowerMsg.includes('rbi') || lowerMsg.includes('reserve bank'),
    impersonates_income_tax: lowerMsg.includes('income tax') || lowerMsg.includes('tax department') || lowerMsg.includes(' itr '),
    impersonates_trai: lowerMsg.includes('trai') || lowerMsg.includes('telecom department'),
    impersonates_bank_official: lowerMsg.includes('bank manager') || lowerMsg.includes('bank staff') || lowerMsg.includes('sbi branch'),
    impersonates_tech_company: lowerMsg.includes('microsoft') || lowerMsg.includes('google support') || lowerMsg.includes('technical support'),
    impersonates_delivery: lowerMsg.includes('delivery agent') || lowerMsg.includes('fedex') || lowerMsg.includes('package status'),
    impersonates_electricity_gas: lowerMsg.includes('electricity') || lowerMsg.includes('gas department'),

    urgency_hours: lowerMsg.includes('2 hours') || lowerMsg.includes('30 minutes') || lowerMsg.includes('1 hour'),
    urgency_day: lowerMsg.includes('24 hours') || lowerMsg.includes('today only') || lowerMsg.includes('by tonight'),
    urgency_expiry: lowerMsg.includes('expires') || lowerMsg.includes('limited time'),
    urgency_immediate: lowerMsg.includes('immediately') || lowerMsg.includes('right now') || lowerMsg.includes('abhi') || lowerMsg.includes('urgently'),

    requests_secrecy: lowerMsg.includes('dont tell') || lowerMsg.includes('confidential') || lowerMsg.includes('keep secret'),
    requests_silence_family: lowerMsg.includes('family') && lowerMsg.includes('dont tell'),
    says_dont_disconnect: lowerMsg.includes('dont disconnect') || lowerMsg.includes('keep line active') || lowerMsg.includes('dont cut'),

    has_suspicious_link: lowerMsg.includes('http') || lowerMsg.includes('link') || lowerMsg.includes('.cc') || lowerMsg.includes('.info'),
    has_shortened_link: lowerMsg.includes('bit.ly') || lowerMsg.includes('tinyurl'),
    asks_install_remote_app: lowerMsg.includes('anydesk') || lowerMsg.includes('teamviewer') || lowerMsg.includes('quicksupport') || lowerMsg.includes('rustdesk'),
    asks_install_unknown_app: lowerMsg.includes('install apk') || lowerMsg.includes('unknown app'),
    fake_official_website: lowerMsg.includes('-kyc.xyz') || lowerMsg.includes('-prize.in'),

    too_good_return: lowerMsg.includes('double money') || lowerMsg.includes('daily return') || lowerMsg.includes('30% return') || lowerMsg.includes('huge profit'),
    unsolicited_prize: lowerMsg.includes('won prize') || lowerMsg.includes('lucky winner'),
    unsolicited_job_offer: lowerMsg.includes('job offer') && !lowerMsg.includes('applied for'),
    lottery_win: lowerMsg.includes('lottery') || lowerMsg.includes('crorepati'),
    guaranteed_returns: lowerMsg.includes('guaranteed') || lowerMsg.includes('no risk') || lowerMsg.includes('100% safe return'),

    whatsapp_for_official: lowerMsg.includes('whatsapp') && (lowerMsg.includes('cbi') || lowerMsg.includes('police') || lowerMsg.includes('bank')),
    personal_gmail_official: (lowerMsg.includes('gmail.com') || lowerMsg.includes('yahoo.com')) && (lowerMsg.includes('official') || lowerMsg.includes('complaint')),
    unknown_number: true, // We assume unknown if local analysis
    international_number_local_claim: lowerMsg.includes('+1') || lowerMsg.includes('+44'),

    mentions_aadhaar_linked_crime: lowerMsg.includes('aadhaar used') || lowerMsg.includes('aadhaar criminal'),
    mentions_drug_trafficking: lowerMsg.includes('drugs') || lowerMsg.includes('narcotics') || lowerMsg.includes('parcel containing'),
    mentions_money_laundering: lowerMsg.includes('money laundering') || lowerMsg.includes('hawala') || lowerMsg.includes('illegal transfer'),
    mentions_pending_kyc: lowerMsg.includes('pending kyc') || lowerMsg.includes('kyc update'),
    mentions_sim_block: lowerMsg.includes('sim block') || lowerMsg.includes('sim card blocked'),
    mentions_refund_processing: lowerMsg.includes('refund process') || lowerMsg.includes('claim refund'),
    advance_fee_promise: lowerMsg.includes('pay small') || lowerMsg.includes('advance fee'),
    pig_butchering_pattern: lowerMsg.includes('investment group') && lowerMsg.includes('meet you'),

    standard_otp_format: lowerMsg.includes('otp is') && lowerMsg.includes('do not share'),
    known_platform_sender: lowerMsg.includes('amazon') || lowerMsg.includes('flipkart') || lowerMsg.includes('swiggy') || lowerMsg.includes('zomato'),
    google_meet_link: lowerMsg.includes('meet.google.com'),
    official_domain_link: lowerMsg.includes('.gov.in') || lowerMsg.includes('.co.in') || lowerMsg.includes('sbi.co.in') || lowerMsg.includes('hdfcbank.com'),
    no_action_required: lowerMsg.includes('purely informational') || (!lowerMsg.includes('pay') && !lowerMsg.includes('click') && !lowerMsg.includes('send')),
    order_confirmation_format: lowerMsg.includes('order has been') || lowerMsg.includes('placed successfully'),
    delivery_notification_format: lowerMsg.includes('delivered') || lowerMsg.includes('out for delivery'),
    standard_bank_statement: lowerMsg.includes('credited') || lowerMsg.includes('debited') || lowerMsg.includes('available balance'),
    interview_scheduling_format: lowerMsg.includes('interview scheduled') || lowerMsg.includes('shortlisted for'),
    contains_do_not_share_warning: lowerMsg.includes('do not share') || lowerMsg.includes('never share'),
    has_financial_loss: lowerMsg.includes('lost money') || lowerMsg.includes('already paid') || lowerMsg.includes('transferred')
  };

  // Determine if scam is suspected based on signals
  let isScamSuspected = highestCount > 0;
  if (signals.standard_otp_format || signals.known_platform_sender || signals.google_meet_link) {
    isScamSuspected = false;
  }

  // Generate Red Flags based on keywords
  const flags = [];
  if (lowerMsg.includes('otp')) flags.push('Request for OTP verification codes');
  if (lowerMsg.includes('link') || lowerMsg.includes('http')) flags.push('Suspicious links referencing unverified domains');
  if (lowerMsg.includes('arrest') || lowerMsg.includes('illegal')) flags.push('Intimidation tactics using threats of arrest or police reports');
  if (lowerMsg.includes('deposit') || lowerMsg.includes('fee') || lowerMsg.includes('tax')) flags.push('Demand for upfront processing/tax money');
  if (lowerMsg.includes('anydesk') || lowerMsg.includes('teamviewer')) flags.push('Request to download remote screen sharing utilities');
  if (lowerMsg.includes('won') || lowerMsg.includes('prize') || lowerMsg.includes('lucky')) flags.push('Unsolicited winner announcements for games not entered');
  if (flags.length === 0) {
    flags.push('Unverified numbers sending transaction warnings or instructions');
  }

  // Assemble Actions
  const actions = [
    ACTION_STEPS_LIBRARY.screenshot,
    ACTION_STEPS_LIBRARY.report_cybercrime
  ];
  if (matchedCategory === 'financial_fraud') {
    actions.unshift(ACTION_STEPS_LIBRARY.contact_bank, ACTION_STEPS_LIBRARY.do_not_share);
  } else if (matchedCategory === 'digital_online') {
    actions.unshift(ACTION_STEPS_LIBRARY.do_not_click, ACTION_STEPS_LIBRARY.do_not_install);
  } else {
    actions.unshift(ACTION_STEPS_LIBRARY.do_not_pay);
  }

  const evidenceChecklist = getEvidenceChecklist(matchedCategory);

  return {
    is_scam_suspected: isScamSuspected,
    scam_type: matchedType,
    scam_category: matchedCategory,
    signals: signals,
    red_flags: flags,
    how_it_works: `This scam operates by exploiting consumer trust under the category of ${SCAM_DATABASE[matchedCategory].label}. Scammers typically initiate contact using WhatsApp or SMS, creating urgency around critical services, cash gifts, or job openings to extract immediate payments or banking details.`,
    action_steps: actions,
    relevant_law: RELEVANT_LAWS[matchedCategory] || RELEVANT_LAWS.miscellaneous,
    evidence_to_collect: evidenceChecklist,
    additional_note: 'Note: This analysis was generated locally using ScamShield\'s regex database due to connection limits. Please verify all flags carefully.'
  };
}

/**
 * ─── PROMPT BUILDERS ─────────────────────────────────────────────────────────
 */
function buildScamAnalysisPrompt(message) {
  const allTypesText = ALL_SCAM_TYPES.slice(0, 100).join('\n- ');
  const redFlagsText = RED_FLAG_PATTERNS.join('\n- ');

  return `You are ScamShield AI — India's most accurate cyber fraud detection system.
Your job is to analyze suspicious messages and give victims clear, actionable guidance.

You have deep knowledge of Indian cyber fraud patterns, Indian laws (IPC, IT Act),
and exactly how scammers operate in India.

=== COMPLETE INDIAN SCAM TYPE DATABASE (use these for classification) ===
Known scam types include:
- ${allTypesText}

=== COMMON RED FLAGS IN INDIAN SCAM MESSAGES ===
- ${redFlagsText}

=== MESSAGE TO ANALYZE ===
"""
${message}
"""

=== YOUR JOB ===

Detect signals only. DO NOT calculate a score. DO NOT give confidence percentage.
A separate scoring engine will calculate the final score based on your signal detections.
Your job is to be accurate about WHICH signals are present — not how severe.

=== SIGNAL DETECTION GUIDE ===

demands_money_transfer: true if message explicitly asks to send/transfer money to any account/UPI
demands_processing_fee: true if asks for "processing fee", "registration fee", "claim fee", "delivery charges" to receive something
demands_registration_fee: true if job/scheme requires upfront registration payment
demands_otp: true if asks user to share OTP received on phone
demands_password: true if asks for login password, MPIN
demands_cvv_pin: true if asks for ATM PIN, CVV, card number
demands_bank_account_details: true if asks for account number, IFSC, net banking details
demands_aadhaar_pan: true if requests Aadhaar/PAN number or photo
demands_qr_scan_to_pay: true if asks to scan QR code (claiming to send money but actually receives)
demands_gift_card_payment: true if asks to buy gift cards and share codes

threatens_arrest: true if mentions arrest, police coming, being taken into custody
threatens_legal_action: true if mentions FIR, case filed, legal notice, court
threatens_account_block: true if says account/card will be blocked/frozen
threatens_disconnection: true if says SIM/number/service will be disconnected
threatens_property_seizure: true if mentions property attachment, seizure
threatens_family_harm: true if threatens family members
blackmail_sextortion: true if involves private images/videos as leverage

impersonates_cbi_ed: true if claims to be CBI, ED, NCB, enforcement officer
impersonates_police: true if claims to be police officer, inspector, DCP, SHO
impersonates_court: true if claims court summons, judge, legal notice from court
impersonates_rbi: true if claims to be from RBI, Reserve Bank
impersonates_income_tax: true if claims income tax department, I-T officer
impersonates_trai: true if claims TRAI, telecom authority
impersonates_bank_official: true if claims to be calling from user's bank
impersonates_tech_company: true if claims Microsoft, Google, Apple support
impersonates_delivery: true if claims delivery agent from Fedex/Amazon/courier
impersonates_electricity_gas: true if claims electricity/gas department

urgency_hours: true if mentions hours as deadline ("2 hours", "30 minutes")
urgency_day: true if mentions 24-hour or next-day deadline
urgency_expiry: true if says "offer expires", "limited time", "last chance"
urgency_immediate: true if uses "immediately", "right now", "turant", "abhi abhi"

requests_secrecy: true if says "don't tell anyone", "keep confidential", "secret"
requests_silence_family: true if specifically says don't tell family/friends
says_dont_disconnect: true if instructs not to disconnect call

has_suspicious_link: true if contains URL with unofficial/misspelled domain
has_shortened_link: true if contains bit.ly, tinyurl, or other URL shortener
asks_install_remote_app: true if asks to install AnyDesk, TeamViewer, QuickSupport, AnySupport
asks_install_unknown_app: true if asks to install APK or unknown app outside app store
fake_official_website: true if URL looks like official site but isn't (sbi-kyc.xyz, amazon-prize.in)

too_good_return: true if promises unusually high returns (>10% monthly, "double money")
unsolicited_prize: true if announces prize/win user never applied for
unsolicited_job_offer: true if job offer comes out of nowhere with no application
lottery_win: true if claims lottery winning
guaranteed_returns: true if says "guaranteed profit", "no risk", "100% returns"

whatsapp_for_official: true if government/bank claims contact via WhatsApp
personal_gmail_official: true if official claim but sender email is gmail/yahoo/hotmail
unknown_number: true if sender number is unknown personal number not matching official
international_number_local_claim: true if +1/+44/+61 number claiming to be Indian official

mentions_aadhaar_linked_crime: true if says Aadhaar used in criminal activity
mentions_drug_trafficking: true if mentions drugs found in parcel, drug case
mentions_money_laundering: true if mentions money laundering, hawala, illegal transactions
mentions_pending_kyc: true if says KYC incomplete/expired as reason for action
mentions_sim_block: true if says SIM will be blocked unless action taken
mentions_refund_processing: true if says refund pending, needs details to process
advance_fee_promise: true if asks small payment to receive larger amount
pig_butchering_pattern: true if involves gradual relationship building then investment pitch

NEGATIVE signals (mark true if present — these REDUCE the score):
standard_otp_format: true if message follows standard OTP format from known service
known_platform_sender: true if clearly from Swiggy, Zomato, Amazon, Flipkart, IRCTC etc in normal format
google_meet_link: true if contains meet.google.com link
official_domain_link: true if contains official bank/govt domain (sbi.co.in, hdfcbank.com, irctc.co.in)
no_action_required: true if message is purely informational, no ask
order_confirmation_format: true if standard order placed/delivered confirmation
delivery_notification_format: true if standard delivery status update
standard_bank_statement: true if routine balance/transaction notification
interview_scheduling_format: true if scheduling interview from known company
contains_do_not_share_warning: true if message itself says "do not share this OTP/code"

has_financial_loss: true if user mentions they already paid/transferred money

=== OUTPUT FORMAT ===

Respond with ONLY valid JSON. No markdown fences. No text before or after.

{
  "is_scam_suspected": true or false,
  "scam_type": "Very specific scam type — be precise",
  "scam_category": "financial_fraud / job_employment / prize_lottery / impersonation / digital_online / ecommerce_delivery / real_estate / romance_social / government_scheme / tech_support / miscellaneous",
  "signals": {
    "demands_money_transfer": false,
    "demands_processing_fee": false,
    "demands_registration_fee": false,
    "demands_otp": false,
    "demands_password": false,
    "demands_cvv_pin": false,
    "demands_bank_account_details": false,
    "demands_aadhaar_pan": false,
    "demands_qr_scan_to_pay": false,
    "demands_gift_card_payment": false,
    "threatens_arrest": false,
    "threatens_legal_action": false,
    "threatens_account_block": false,
    "threatens_disconnection": false,
    "threatens_property_seizure": false,
    "threatens_family_harm": false,
    "blackmail_sextortion": false,
    "impersonates_cbi_ed": false,
    "impersonates_police": false,
    "impersonates_court": false,
    "impersonates_rbi": false,
    "impersonates_income_tax": false,
    "impersonates_trai": false,
    "impersonates_bank_official": false,
    "impersonates_tech_company": false,
    "impersonates_delivery": false,
    "impersonates_electricity_gas": false,
    "urgency_hours": false,
    "urgency_day": false,
    "urgency_expiry": false,
    "urgency_immediate": false,
    "requests_secrecy": false,
    "requests_silence_family": false,
    "says_dont_disconnect": false,
    "has_suspicious_link": false,
    "has_shortened_link": false,
    "asks_install_remote_app": false,
    "asks_install_unknown_app": false,
    "fake_official_website": false,
    "too_good_return": false,
    "unsolicited_prize": false,
    "unsolicited_job_offer": false,
    "lottery_win": false,
    "guaranteed_returns": false,
    "whatsapp_for_official": false,
    "personal_gmail_official": false,
    "unknown_number": false,
    "international_number_local_claim": false,
    "mentions_aadhaar_linked_crime": false,
    "mentions_drug_trafficking": false,
    "mentions_money_laundering": false,
    "mentions_pending_kyc": false,
    "mentions_sim_block": false,
    "mentions_refund_processing": false,
    "advance_fee_promise": false,
    "pig_butchering_pattern": false,
    "standard_otp_format": false,
    "known_platform_sender": false,
    "google_meet_link": false,
    "official_domain_link": false,
    "no_action_required": false,
    "order_confirmation_format": false,
    "delivery_notification_format": false,
    "standard_bank_statement": false,
    "interview_scheduling_format": false,
    "contains_do_not_share_warning": false,
    "has_financial_loss": false
  },
  "red_flags": ["specific red flag from THIS message"],
  "how_it_works": "3-4 sentences explaining how this scam operates",
  "action_steps": ["step 1", "step 2", "step 3", "step 4"],
  "relevant_law": "IPC Section X, IT Act Section Y",
  "evidence_to_collect": ["item 1", "item 2"],
  "additional_note": "important nuance or null"
}
`;
}

function buildComplaintPrompt(docType, caseData) {
  const templates = {
    cybercrime_complaint: `Generate a formal cybercrime complaint for submission at cybercrime.gov.in or local police station.

CASE DETAILS:
Scam Type: ${caseData.scam_type}
Original Message: ${caseData.original_message ? caseData.original_message.substring(0, 500) : ''}
Severity: ${caseData.severity}
Relevant Law: ${caseData.relevant_law}

FORMAT REQUIREMENTS:
- To: The Station House Officer / Cybercrime Cell
- Subject: Complaint regarding ${caseData.scam_type}
- Complainant Details section with placeholders
- Incident Description (use facts from case)
- Chronological sequence of events
- Financial loss section (if applicable)
- Relief requested
- Declaration
- Signature block

Use [COMPLAINANT NAME], [ADDRESS], [PHONE NUMBER], [EMAIL], [DATE OF INCIDENT], 
[AMOUNT LOST] (if financial), [TRANSACTION ID] as placeholders.

Make it professional, specific to this scam type, and ready to submit.`,

    bank_freeze_letter: `Generate a formal letter to the bank requesting account freeze / transaction reversal.

CASE DETAILS:
Scam Type: ${caseData.scam_type}
Urgency: ${caseData.severity}

FORMAT REQUIREMENTS:
- To: The Branch Manager, [BANK NAME]
- Subject: Urgent Request for Account Freeze / Transaction Reversal — Fraud Victim
- Account details section with placeholders
- Description of fraudulent transaction
- Request to freeze beneficiary account
- Request for transaction reversal under RBI circular (mention cybercrime helpline 1930)
- Timeline of events
- Enclosures list

Use [ACCOUNT HOLDER NAME], [ACCOUNT NUMBER], [BANK NAME], [BRANCH NAME],
[TRANSACTION DATE], [TRANSACTION AMOUNT], [TRANSACTION ID], [BENEFICIARY ACCOUNT] as placeholders.`,

    consumer_complaint: `Generate a formal complaint to the Consumer Forum / District Consumer Dispute Redressal Commission.

CASE DETAILS:
Scam Type: ${caseData.scam_type}
Original Message: ${caseData.original_message ? caseData.original_message.substring(0, 300) : ''}

FORMAT REQUIREMENTS:
- Case title: [COMPLAINANT NAME] vs [RESPONDENT NAME/COMPANY]
- Parties section
- Facts of the case (numbered)
- Legal grounds (Consumer Protection Act 2019 sections)
- Relief sought (compensation + penalty)
- Documents to be attached list
- Verification declaration

Use appropriate placeholders for personal details.`,
  };

  return `You are a legal document expert. Generate a professional ${docType} document.

${templates[docType] || templates.cybercrime_complaint}

Respond with ONLY a valid JSON object:
{
  "title": "Specific document title",
  "content": "Complete document text with proper formatting. Use \\n for line breaks."
}`;
}

module.exports = {
  SCAM_DATABASE,
  ALL_SCAM_TYPES,
  RED_FLAG_PATTERNS,
  ACTION_STEPS_LIBRARY,
  RELEVANT_LAWS,
  getEvidenceChecklist,
  localRuleBasedAnalysis,
  buildScamAnalysisPrompt,
  buildComplaintPrompt
};
