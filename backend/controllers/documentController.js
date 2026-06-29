const pool = require('../config/db');
const { generateComplaintDocument } = require('../services/aiService');

// POST /api/documents/generate
const generateDocument = async (req, res, next) => {
  const { case_id, doc_type } = req.body;

  if (!case_id || !doc_type) {
    return res.status(400).json({ success: false, message: 'case_id and doc_type are required' });
  }

  const validTypes = ['cybercrime_complaint', 'bank_freeze_letter', 'consumer_complaint'];
  if (!validTypes.includes(doc_type)) {
    return res.status(400).json({ success: false, message: 'Invalid doc_type. Must be cybercrime_complaint, bank_freeze_letter, or consumer_complaint' });
  }

  try {
    // 1. Fetch case details to ensure it belongs to the logged-in user
    const caseResult = await pool.query(
      'SELECT * FROM cases WHERE id = $1 AND user_id = $2',
      [case_id, req.user.id]
    );

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    const caseData = caseResult.rows[0];

    // 2. Call AI service to generate document content
    const docData = await generateComplaintDocument(doc_type, caseData);

    // 3. Save generated document in database
    const saveResult = await pool.query(
      `INSERT INTO documents (case_id, user_id, doc_type, title, content, placeholders) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, case_id, doc_type, title, content, placeholders, created_at`,
      [case_id, req.user.id, doc_type, docData.title, docData.content, docData.placeholders]
    );

    res.status(201).json({
      success: true,
      document: saveResult.rows[0]
    });
  } catch (err) {
    console.error('[generateDocument] Error:', err.message);
    res.status(500).json({ success: false, message: 'Document generation failed. Please try again.' });
  }
};

// GET /api/documents
const getDocuments = async (req, res, next) => {
  const { case_id } = req.query;

  try {
    let result;
    if (case_id) {
      result = await pool.query(
        'SELECT id, case_id, doc_type, title, placeholders, created_at FROM documents WHERE user_id = $1 AND case_id = $2 ORDER BY created_at DESC',
        [req.user.id, case_id]
      );
    } else {
      result = await pool.query(
        'SELECT id, case_id, doc_type, title, placeholders, created_at FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }

    res.json({
      success: true,
      documents: result.rows
    });
  } catch (err) {
    console.error('[getDocuments] Error:', err.message);
    next(err);
  }
};

// GET /api/documents/:id
const getDocumentById = async (req, res, next) => {
  const docId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT id, case_id, user_id, doc_type, title, content, placeholders, created_at FROM documents WHERE id = $1 AND user_id = $2',
      [docId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    res.json({
      success: true,
      document: result.rows[0]
    });
  } catch (err) {
    console.error('[getDocumentById] Error:', err.message);
    next(err);
  }
};

module.exports = {
  generateDocument,
  getDocuments,
  getDocumentById,
};
