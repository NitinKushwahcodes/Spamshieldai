const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const isLocal = connectionString && (connectionString.includes('localhost') || connectionString.includes('127.0.0.1'));

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 4000,
  query_timeout: 3000,
  max: 10
});

// ─── IN-MEMORY DATABASE BACKUP STORE ─────────────────────────────────────────
// Emulates a relational PostgreSQL storage in case local DB is not accessible.
const memoryDb = {
  users: [],
  cases: [],
  evidence_items: [],
  documents: [],
  community_reports: []
};

// Seed initial community reports in memory
memoryDb.community_reports = [
  {
    id: uuidv4(),
    reported_by: null,
    scam_type: 'KBC / Lucky Draw Scam',
    scam_category: 'prize_lottery',
    reported_number: '+91-9988776655',
    reported_url: null,
    description: 'Received WhatsApp call claiming to be KBC executive stating I won 25 Lakh lottery. Asked to pay 25,000 for registration tax.',
    city: 'Delhi',
    state: 'Delhi',
    report_count: 47,
    created_at: new Date()
  },
  {
    id: uuidv4(),
    reported_by: null,
    scam_type: 'Fake IT Company Job Offer',
    scam_category: 'job_employment',
    reported_number: '+91-8877665544',
    reported_url: null,
    description: 'Received fake interview call letter from Wipro HR. Asked for 5,000 security deposit for laptop shipping.',
    city: 'Mumbai',
    state: 'Maharashtra',
    report_count: 23,
    created_at: new Date()
  },
  {
    id: uuidv4(),
    reported_by: null,
    scam_type: 'Crypto Investment Scam',
    scam_category: 'financial_fraud',
    reported_number: null,
    reported_url: 'fake-investment.xyz',
    description: 'Telegram group admin promised 300% profit in 2 hours. Transferred 10,000 to website and account was frozen when asking for withdrawal.',
    city: 'Bangalore',
    state: 'Karnataka',
    report_count: 31,
    created_at: new Date()
  },
  {
    id: uuidv4(),
    reported_by: null,
    scam_type: 'Fake Police Officer Call',
    scam_category: 'impersonation',
    reported_number: '+91-7766554433',
    reported_url: null,
    description: 'Caller impersonated CBI officer, stated a FedEx parcel containing illegal drugs in my name was caught in Mumbai customs and demanded money to settle.',
    city: 'Delhi',
    state: 'Delhi',
    report_count: 18,
    created_at: new Date()
  },
  {
    id: uuidv4(),
    reported_by: null,
    scam_type: 'UPI Payment Request Fraud',
    scam_category: 'financial_fraud',
    reported_number: '+91-6655443322',
    reported_url: null,
    description: 'OLX buyer sent QR code claiming it will credit money to my bank. Scanning it actually debited 15,000 from my GPay.',
    city: 'Hyderabad',
    state: 'Telangana',
    report_count: 12,
    created_at: new Date()
  }
];

let useMemoryDb = false;

// ─── SQL TO IN-MEMORY CRUD TRANSLATOR ────────────────────────────────────────
function queryMemoryDb(sqlText, params = []) {
  const sql = sqlText.trim().replace(/\s+/g, ' ');
  const result = { rows: [] };

  // 1. INSERT INTO users
  if (sql.startsWith('INSERT INTO users')) {
    const newUser = {
      id: uuidv4(),
      name: params[0],
      email: params[1],
      password_hash: params[2],
      city: params[3],
      state: params[4],
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryDb.users.push(newUser);
    result.rows = [newUser];
  }

  // 2. SELECT FROM users BY email
  else if (sql.startsWith('SELECT id, name, email, password_hash, city, state FROM users WHERE email = $1')) {
    const email = params[0].toLowerCase();
    const user = memoryDb.users.find(u => u.email === email);
    if (user) result.rows = [user];
  }

  // 3. SELECT FROM users BY id
  else if (sql.startsWith('SELECT id, name, email, city, state, created_at FROM users WHERE id = $1')) {
    const id = params[0];
    const user = memoryDb.users.find(u => u.id === id);
    if (user) result.rows = [user];
  }

  // 4. INSERT INTO cases
  else if (sql.startsWith('INSERT INTO cases')) {
    const newCase = {
      id: uuidv4(),
      user_id: params[0],
      original_message: params[1],
      scam_type: params[2],
      scam_category: params[3],
      severity: params[4],
      confidence_score: params[5],
      is_scam: params[6],
      how_it_works: params[7],
      red_flags: params[8],
      action_steps: params[9],
      relevant_law: params[10],
      status: 'reported',
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryDb.cases.push(newCase);
    result.rows = [newCase];
  }

  // 5. INSERT INTO evidence_items
  else if (sql.startsWith('INSERT INTO evidence_items')) {
    const caseId = params[0];
    const itemNames = params.slice(1);
    const addedItems = [];
    itemNames.forEach(name => {
      const newItem = {
        id: uuidv4(),
        case_id: caseId,
        item_name: name,
        is_collected: false,
        notes: '',
        created_at: new Date()
      };
      memoryDb.evidence_items.push(newItem);
      addedItems.push(newItem);
    });
    result.rows = addedItems;
  }

  // 6. SELECT cases BY user_id
  else if (sql.startsWith('SELECT * FROM cases WHERE user_id = $1 ORDER BY created_at DESC')) {
    const userId = params[0];
    const userCases = memoryDb.cases
      .filter(c => c.user_id === userId)
      .sort((a, b) => b.created_at - a.created_at);
    result.rows = userCases;
  }

  // 7. SELECT case BY id and user_id
  else if (sql.startsWith('SELECT * FROM cases WHERE id = $1 AND user_id = $2')) {
    const caseId = params[0];
    const userId = params[1];
    const singleCase = memoryDb.cases.find(c => c.id === caseId && c.user_id === userId);
    if (singleCase) result.rows = [singleCase];
  }

  // 8. SELECT evidence_items BY case_id
  else if (sql.startsWith('SELECT * FROM evidence_items WHERE case_id = $1 ORDER BY created_at ASC')) {
    const caseId = params[0];
    const items = memoryDb.evidence_items
      .filter(e => e.case_id === caseId)
      .sort((a, b) => a.created_at - b.created_at);
    result.rows = items;
  }

  // 9. SELECT documents BY case_id or user_id
  else if (sql.startsWith('SELECT id, case_id, doc_type, title, placeholders, created_at FROM documents WHERE user_id = $1')) {
    const userId = params[0];
    let docs = memoryDb.documents.filter(d => d.user_id === userId);
    if (params.length > 1) {
      const caseId = params[1];
      docs = docs.filter(d => d.case_id === caseId);
    }
    result.rows = docs.sort((a, b) => b.created_at - a.created_at);
  }

  // 10. UPDATE evidence_items is_collected / notes
  else if (sql.startsWith('UPDATE evidence_items SET is_collected = $1')) {
    const isCollected = params[0];
    let itemId, caseId;
    if (params.length === 3) {
      itemId = params[1];
      caseId = params[2];
      const itemIndex = memoryDb.evidence_items.findIndex(e => e.id === itemId && e.case_id === caseId);
      if (itemIndex !== -1) {
        memoryDb.evidence_items[itemIndex].is_collected = isCollected;
        result.rows = [memoryDb.evidence_items[itemIndex]];
      }
    } else if (params.length === 4) {
      const notes = params[1];
      itemId = params[2];
      caseId = params[3];
      const itemIndex = memoryDb.evidence_items.findIndex(e => e.id === itemId && e.case_id === caseId);
      if (itemIndex !== -1) {
        memoryDb.evidence_items[itemIndex].is_collected = isCollected;
        memoryDb.evidence_items[itemIndex].notes = notes;
        result.rows = [memoryDb.evidence_items[itemIndex]];
      }
    }
  }

  // 11. DELETE FROM cases
  else if (sql.startsWith('DELETE FROM cases WHERE id = $1 AND user_id = $2')) {
    const caseId = params[0];
    const userId = params[1];
    const index = memoryDb.cases.findIndex(c => c.id === caseId && c.user_id === userId);
    if (index !== -1) {
      memoryDb.cases.splice(index, 1);
      // clean up cascading child items
      memoryDb.evidence_items = memoryDb.evidence_items.filter(e => e.case_id !== caseId);
      memoryDb.documents = memoryDb.documents.filter(d => d.case_id !== caseId);
      result.rows = [{ id: caseId }];
    }
  }

  // 12. INSERT INTO documents
  else if (sql.startsWith('INSERT INTO documents')) {
    const newDoc = {
      id: uuidv4(),
      case_id: params[0],
      user_id: params[1],
      doc_type: params[2],
      title: params[3],
      content: params[4],
      placeholders: params[5],
      created_at: new Date()
    };
    memoryDb.documents.push(newDoc);
    result.rows = [newDoc];
  }

  // 13. SELECT document BY id and user_id
  else if (sql.startsWith('SELECT id, case_id, user_id, doc_type, title, content, placeholders, created_at FROM documents WHERE id = $1')) {
    const docId = params[0];
    const userId = params[1];
    const doc = memoryDb.documents.find(d => d.id === docId && d.user_id === userId);
    if (doc) result.rows = [doc];
  }

  // 14. SELECT community_reports
  else if (sql.startsWith('SELECT * FROM community_reports')) {
    let reports = [...memoryDb.community_reports];
    if (params.length > 0) {
      if (sql.includes('scam_type ILIKE') && sql.includes('city ILIKE')) {
        const typeFilter = params[0].replace(/%/g, '').toLowerCase();
        const cityFilter = params[1].replace(/%/g, '').toLowerCase();
        reports = reports.filter(r => 
          r.scam_type.toLowerCase().includes(typeFilter) && 
          r.city.toLowerCase().includes(cityFilter)
        );
      } else if (sql.includes('scam_type ILIKE')) {
        const typeFilter = params[0].replace(/%/g, '').toLowerCase();
        reports = reports.filter(r => r.scam_type.toLowerCase().includes(typeFilter));
      } else if (sql.includes('city ILIKE')) {
        const cityFilter = params[0].replace(/%/g, '').toLowerCase();
        reports = reports.filter(r => r.city.toLowerCase().includes(cityFilter));
      }
    }
    result.rows = reports.sort((a, b) => b.report_count - a.report_count);
  }

  // 15. INSERT INTO community_reports
  else if (sql.startsWith('INSERT INTO community_reports')) {
    const newReport = {
      id: uuidv4(),
      reported_by: params[0],
      scam_type: params[1],
      scam_category: params[2],
      reported_number: params[3],
      reported_url: params[4],
      description: params[5],
      city: params[6],
      state: params[7],
      report_count: params[8] || 1,
      created_at: new Date()
    };
    memoryDb.community_reports.push(newReport);
    result.rows = [newReport];
  }

  // 16. UPDATE community_reports
  else if (sql.startsWith('UPDATE community_reports SET report_count = $1')) {
    const count = params[0];
    const reportId = params[1];
    const idx = memoryDb.community_reports.findIndex(r => r.id === reportId);
    if (idx !== -1) {
      memoryDb.community_reports[idx].report_count = count;
      memoryDb.community_reports[idx].created_at = new Date();
      result.rows = [memoryDb.community_reports[idx]];
    }
  }

  // Default fallback for migration commands
  else {
    result.rows = [];
  }

  return result;
}

// ─── SAFE QUERY EXECUTOR ─────────────────────────────────────────────────────
const query = async (text, params) => {
  if (useMemoryDb) {
    return queryMemoryDb(text, params);
  }

  try {
    return await pool.query(text, params);
  } catch (err) {
    // Intercept connection and credentials errors
    const isConnErr = err.code === 'ECONNREFUSED' || 
                      err.code === '28P01' || 
                      err.code === '42P01' || 
                      err.code === 'ENOTFOUND' || 
                      err.message.includes('password authentication') || 
                      err.message.includes('relation') || 
                      err.message.includes('timeout') || 
                      err.message.includes('connect');

    if (isConnErr) {
      if (!useMemoryDb) {
        console.warn('\n======================================================================');
        console.warn('[DB WARNING] PostgreSQL connection failed:');
        console.warn(`"${err.message}"`);
        console.warn('-> ScamShield AI will fall back to In-Memory Database store.');
        console.warn('-> All features (Login, Cases, Checklists, Reports) will remain fully functional.');
        console.warn('======================================================================\n');
        useMemoryDb = true;
      }
      return queryMemoryDb(text, params);
    }
    throw err;
  }
};

// Run a quick startup connection check in the background to avoid blocking API requests
(async () => {
  try {
    const client = await pool.connect();
    client.release();
  } catch (err) {
    if (!useMemoryDb) {
      console.warn('\n======================================================================');
      console.warn('[DB WARNING] PostgreSQL startup connection failed:');
      console.warn(`"${err.message}"`);
      console.warn('-> ScamShield AI will fall back to In-Memory Database store.');
      console.warn('-> All features (Login, Cases, Checklists, Reports) will remain fully functional.');
      console.warn('======================================================================\n');
      useMemoryDb = true;
    }
  }
})();

module.exports = {
  query,
  pool,
  end: async () => {
    try {
      await pool.end();
    } catch (e) {
      // ignore end failure
    }
  }
};
