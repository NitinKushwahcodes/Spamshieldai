const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const analyzerRoutes = require('./routes/analyzerRoutes');
const caseRoutes = require('./routes/caseRoutes');
const documentRoutes = require('./routes/documentRoutes');
const communityRoutes = require('./routes/communityRoutes');

// Middleware imports
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Trust proxy for Render/Vercel load balancers to prevent rate-limit crashes
app.set('trust proxy', 1);

// ─── SECURITY & MIDDLEWARE ───────────────────────────────────────────────────
app.use(helmet());

// Configure CORS for Cookie Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// ─── RATE LIMITERS ───────────────────────────────────────────────────────────
// Separate limiters for Authentication vs standard API requests
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 20 : 1000,
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 200 : 10000,
  message: { success: false, message: 'API rate limit exceeded. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────
// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ScamShield AI backend running' });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/analyze', apiLimiter, analyzerRoutes);
app.use('/api/cases', apiLimiter, caseRoutes);
app.use('/api/documents', apiLimiter, documentRoutes);
app.use('/api/community', apiLimiter, communityRoutes);

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── SERVER STARTUP ──────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`ScamShield AI Backend active on Port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`=========================================`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end(() => {
      console.log('Database pool closed.');
      process.exit(0);
    });
  });
});
