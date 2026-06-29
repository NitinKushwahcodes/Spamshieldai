const express = require('express');
const { getCases, getCaseById, updateEvidence, deleteCase } = require('../controllers/caseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all case routes
router.use(authMiddleware);

router.get('/', getCases);
router.get('/:id', getCaseById);
router.patch('/:id/evidence/:item_id', updateEvidence);
router.delete('/:id', deleteCase);

module.exports = router;
