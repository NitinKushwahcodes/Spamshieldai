const pool = require('../config/db');

const seedData = async () => {
  try {
    console.log('Seeding community reports...');
    
    // Clear existing community reports to avoid duplicates on re-runs
    await pool.query('DELETE FROM community_reports');

    const seedQueries = [
      {
        scam_type: 'KBC / Lucky Draw Scam',
        scam_category: 'prize_lottery',
        reported_number: '+91-9988776655',
        reported_url: null,
        description: 'Received WhatsApp call claiming to be KBC executive stating I won 25 Lakh lottery. Asked to pay 25,000 for registration tax.',
        city: 'Delhi',
        state: 'Delhi',
        report_count: 47
      },
      {
        scam_type: 'Fake IT Company Job Offer',
        scam_category: 'job_employment',
        reported_number: '+91-8877665544',
        reported_url: null,
        description: 'Received fake interview call letter from Wipro HR. Asked for 5,000 security deposit for laptop shipping.',
        city: 'Mumbai',
        state: 'Maharashtra',
        report_count: 23
      },
      {
        scam_type: 'Crypto Investment Scam',
        scam_category: 'financial_fraud',
        reported_number: null,
        reported_url: 'fake-investment.xyz',
        description: 'Telegram group admin promised 300% profit in 2 hours. Transferred 10,000 to website and account was frozen when asking for withdrawal.',
        city: 'Bangalore',
        state: 'Karnataka',
        report_count: 31
      },
      {
        scam_type: 'Fake Police Officer Call',
        scam_category: 'impersonation',
        reported_number: '+91-7766554433',
        reported_url: null,
        description: 'Caller impersonated CBI officer, stated a FedEx parcel containing illegal drugs in my name was caught in Mumbai customs and demanded money to settle.',
        city: 'Delhi',
        state: 'Delhi',
        report_count: 18
      },
      {
        scam_type: 'UPI Payment Request Fraud',
        scam_category: 'financial_fraud',
        reported_number: '+91-6655443322',
        reported_url: null,
        description: 'OLX buyer sent QR code claiming it will credit money to my bank. Scanning it actually debited 15,000 from my GPay.',
        city: 'Hyderabad',
        state: 'Telangana',
        report_count: 12
      }
    ];

    for (const report of seedQueries) {
      await pool.query(
        `INSERT INTO community_reports 
          (scam_type, scam_category, reported_number, reported_url, description, city, state, report_count) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          report.scam_type,
          report.scam_category,
          report.reported_number,
          report.reported_url,
          report.description,
          report.city,
          report.state,
          report.report_count
        ]
      );
    }

    console.log('Successfully seeded 5 community reports.');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    await pool.end();
    console.log('Database pool connection closed.');
  }
};

seedData();
