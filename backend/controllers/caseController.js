const pool = require('../config/db');

// GET /api/cases
const getCases = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cases WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      cases: result.rows
    });
  } catch (err) {
    console.error('[getCases] Error:', err.message);
    next(err);
  }
};

// GET /api/cases/:id
const getCaseById = async (req, res, next) => {
  const caseId = req.params.id;

  try {
    // 1. Fetch case details
    const caseResult = await pool.query(
      'SELECT * FROM cases WHERE id = $1 AND user_id = $2',
      [caseId, req.user.id]
    );

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const caseData = caseResult.rows[0];

    // 2. Fetch evidence checklist items
    const evidenceResult = await pool.query(
      'SELECT * FROM evidence_items WHERE case_id = $1 ORDER BY created_at ASC',
      [caseId]
    );

    // 3. Fetch generated documents
    const documentsResult = await pool.query(
      'SELECT id, doc_type, title, created_at FROM documents WHERE case_id = $1 ORDER BY created_at DESC',
      [caseId]
    );

    res.json({
      success: true,
      case: {
        ...caseData,
        evidence_items: evidenceResult.rows,
        documents: documentsResult.rows
      }
    });
  } catch (err) {
    console.error('[getCaseById] Error:', err.message);
    next(err);
  }
};

// PATCH /api/cases/:id/evidence/:item_id
const updateEvidence = async (req, res, next) => {
  const caseId = req.params.id;
  const itemId = req.params.item_id;
  const { is_collected, notes } = req.body;

  if (is_collected === undefined) {
    return res.status(400).json({ success: false, message: 'is_collected status is required' });
  }

  try {
    // Verify user owns the case first
    const caseCheck = await pool.query(
      'SELECT id FROM cases WHERE id = $1 AND user_id = $2',
      [caseId, req.user.id]
    );

    if (caseCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    // Update evidence item
    let result;
    if (notes !== undefined) {
      result = await pool.query(
        'UPDATE evidence_items SET is_collected = $1, notes = $2 WHERE id = $3 AND case_id = $4 RETURNING *',
        [is_collected, notes, itemId, caseId]
      );
    } else {
      result = await pool.query(
        'UPDATE evidence_items SET is_collected = $1 WHERE id = $2 AND case_id = $3 RETURNING *',
        [is_collected, itemId, caseId]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Evidence item not found' });
    }

    res.json({
      success: true,
      evidence_item: result.rows[0]
    });
  } catch (err) {
    console.error('[updateEvidence] Error:', err.message);
    next(err);
  }
};

// DELETE /api/cases/:id
const deleteCase = async (req, res, next) => {
  const caseId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM cases WHERE id = $1 AND user_id = $2 RETURNING id',
      [caseId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    res.json({
      success: true,
      message: 'Case deleted successfully'
    });
  } catch (err) {
    console.error('[deleteCase] Error:', err.message);
    next(err);
  }
};

module.exports = {
  getCases,
  getCaseById,
  updateEvidence,
  deleteCase,
};
