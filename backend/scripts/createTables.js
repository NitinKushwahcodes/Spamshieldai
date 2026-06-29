const pool = require('../config/db');

const createTables = async () => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      city VARCHAR(100),
      state VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Cases Table
    CREATE TABLE IF NOT EXISTS cases (
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
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Evidence checklist per case
    CREATE TABLE IF NOT EXISTS evidence_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
      item_name VARCHAR(200) NOT NULL,
      is_collected BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Generated complaint documents
    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      doc_type VARCHAR(50) NOT NULL,
      title VARCHAR(255),
      content TEXT NOT NULL,
      placeholders TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Community scam reports
    CREATE TABLE IF NOT EXISTS community_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
      scam_type VARCHAR(200),
      scam_category VARCHAR(100),
      reported_number VARCHAR(50),
      reported_url TEXT,
      description TEXT,
      city VARCHAR(100),
      state VARCHAR(100),
      report_count INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    console.log('Connecting to database and executing table creation...');
    await pool.query(query);
    console.log('All tables created or verified successfully.');
  } catch (err) {
    console.error('Error creating tables:', err.message);
  } finally {
    await pool.end();
    console.log('Database pool connection closed.');
  }
};

createTables();
