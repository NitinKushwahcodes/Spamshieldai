const express = require('express');
const { getReports, createReport } = require('../controllers/communityController');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Optional authentication middleware for community reporting
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
    } catch (err) {
      // invalid token, proceed as guest
    }
  }
  next();
};

router.get('/', getReports);
router.post('/report', optionalAuth, createReport);

module.exports = router;
