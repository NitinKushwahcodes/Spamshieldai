// middleware/errorMiddleware.js
// Standardized global error handler for express routes

const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Middleware]', err.stack || err.message);

  const status = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;
