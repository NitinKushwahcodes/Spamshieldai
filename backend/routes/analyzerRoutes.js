const express = require('express');
const { analyze } = require('../controllers/analyzerController');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Optional authentication middleware specifically for analysis
// Allows guest analyses but extracts user ID if logged in
const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
    } catch (err) {
      // invalid token, but allow request to proceed as guest
      console.warn('[optionalAuth] Invalid token, proceeding as guest');
    }
  }
  next();
};

router.post('/', optionalAuth, analyze);

module.exports = router;
