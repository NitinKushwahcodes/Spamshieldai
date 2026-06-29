const pool = require('../config/db');

// GET /api/community
const getReports = async (req, res, next) => {
  const { scam_type, city } = req.query;

  try {
    let queryText = 'SELECT * FROM community_reports';
    const queryParams = [];
    const clauses = [];

    if (scam_type) {
      queryParams.push(`%${scam_type}%`);
      clauses.push(`scam_type ILIKE $${queryParams.length}`);
    }

    if (city) {
      queryParams.push(`%${city}%`);
      clauses.push(`city ILIKE $${queryParams.length}`);
    }

    if (clauses.length > 0) {
      queryText += ' WHERE ' + clauses.join(' AND ');
    }

    queryText += ' ORDER BY report_count DESC, created_at DESC';

    const result = await pool.query(queryText, queryParams);

    res.json({
      success: true,
      reports: result.rows
    });
  } catch (err) {
    console.error('[getReports] Error:', err.message);
    next(err);
  }
};

// POST /api/community/report
const createReport = async (req, res, next) => {
  const { scam_type, scam_category, reported_number, reported_url, description, city, state } = req.body;

  if (!scam_type || !scam_category || (!reported_number && !reported_url)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Scam type, category, and either reported number or reported URL are required' 
    });
  }

  const userId = req.user ? req.user.id : null;

  try {
    // 1. Check for duplicates (existing number or URL)
    let duplicateCheck = { rows: [] };
    
    if (reported_number && reported_number.trim()) {
      duplicateCheck = await pool.query(
        'SELECT id, report_count FROM community_reports WHERE reported_number = $1',
        [reported_number.trim()]
      );
    } else if (reported_url && reported_url.trim()) {
      duplicateCheck = await pool.query(
        'SELECT id, report_count FROM community_reports WHERE reported_url = $1',
        [reported_url.trim()]
      );
    }

    // 2. If duplicate exists, increment count and update description if needed
    if (duplicateCheck.rows.length > 0) {
      const existingReport = duplicateCheck.rows[0];
      const newCount = existingReport.report_count + 1;

      const updateResult = await pool.query(
        `UPDATE community_reports 
         SET report_count = $1, created_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [newCount, existingReport.id]
      );

      return res.status(200).json({
        success: true,
        message: 'Report count updated for existing entry',
        report: updateResult.rows[0]
      });
    }

    // 3. Otherwise, insert new report
    const insertResult = await pool.query(
      `INSERT INTO community_reports 
        (reported_by, scam_type, scam_category, reported_number, reported_url, description, city, state, report_count) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1) 
       RETURNING *`,
      [
        userId,
        scam_type,
        scam_category,
        reported_number ? reported_number.trim() : null,
        reported_url ? reported_url.trim() : null,
        description ? description.trim() : null,
        city ? city.trim() : null,
        state ? state.trim() : null
      ]
    );

    res.status(201).json({
      success: true,
      report: insertResult.rows[0]
    });
  } catch (err) {
    console.error('[createReport] Error:', err.message);
    next(err);
  }
};

module.exports = {
  getReports,
  createReport,
};
