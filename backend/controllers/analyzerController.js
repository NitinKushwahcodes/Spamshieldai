// controllers/analyzerController.js
// Main controller — handles scam analysis requests

const pool = require('../config/db');
const { analyzeScam } = require('../services/aiService');
const { getEvidenceChecklist } = require('../services/scamPrompts');

const analyze = async (req, res) => {
  const { message, save_case } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Please provide more details about the suspicious message' });
  }

  try {
    const analysis = await analyzeScam(message);
    let caseId = null;

    // save to DB if user is logged in and wants to save
    if (save_case && req.user) {
      const evidenceChecklist = getEvidenceChecklist(analysis.scam_category);

      const caseResult = await pool.query(
        `INSERT INTO cases
          (user_id, original_message, scam_type, scam_category, severity,
           confidence_score, is_scam, how_it_works, red_flags, action_steps, relevant_law)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [
          req.user.id,
          message.trim(),
          analysis.scam_type,
          analysis.scam_category,
          analysis.severity,
          analysis.confidence_score,
          analysis.is_scam,
          analysis.how_it_works,
          analysis.red_flags,
          analysis.action_steps,
          analysis.relevant_law,
        ]
      );
      caseId = caseResult.rows[0].id;

      // create evidence checklist items
      if (evidenceChecklist.length > 0) {
        const placeholders = evidenceChecklist.map((_, i) => `($1, $${i + 2})`).join(', ');
        await pool.query(
          `INSERT INTO evidence_items (case_id, item_name) VALUES ${placeholders}`,
          [caseId, ...evidenceChecklist]
        );
      }
    }

    res.json({ success: true, analysis, case_id: caseId });
  } catch (err) {
    console.error('[analyze] Error:', err.message);
    res.status(500).json({ success: false, message: 'Analysis failed. Please try again.' });
  }
};

module.exports = { analyze };
