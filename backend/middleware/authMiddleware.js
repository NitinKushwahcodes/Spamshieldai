const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    next();
  } catch (err) {
    console.error('[authMiddleware] Token validation failed:', err.message);
    // Clear cookie on verification failure
    res.clearCookie('token');
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
};

module.exports = authMiddleware;
