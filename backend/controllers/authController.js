const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/register
const register = async (req, res, next) => {
  const { name, email, password, city, state } = req.body;

  // Basic Validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    // Hash password (salt rounds: 12)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, city, state) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, city, state, created_at`,
      [name.trim(), email.toLowerCase().trim(), passwordHash, city?.trim() || null, state?.trim() || null]
    );

    const user = newUser.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        state: user.state,
      }
    });
  } catch (err) {
    console.error('[register] Error:', err.message);
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Find user
    const userResult = await pool.query(
      'SELECT id, name, email, password_hash, city, state FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        state: user.state,
      }
    });
  } catch (err) {
    console.error('[login] Error:', err.message);
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.clearCookie('token', {
    ...cookieOptions,
    maxAge: 0 // instantly expire
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const userResult = await pool.query(
      'SELECT id, name, email, city, state, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: userResult.rows[0]
    });
  } catch (err) {
    console.error('[getMe] Error:', err.message);
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
