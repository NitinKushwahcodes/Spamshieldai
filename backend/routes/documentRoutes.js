const express = require('express');
const { generateDocument, getDocuments, getDocumentById } = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate', generateDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);

module.exports = router;
