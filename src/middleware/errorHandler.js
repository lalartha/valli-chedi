/**
 * Custom application error with HTTP status code.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wraps an async route handler to catch errors and forward to Express error handler.
 * Usage: router.get('/path', asyncHandler(myHandler))
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Centralized error handling middleware.
 * Must be registered LAST with app.use().
 */
export function errorHandler(err, req, res, _next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Supabase errors often have a `code` field
  if (err.code === 'PGRST116') {
    statusCode = 404;
    message = 'Resource not found.';
  }

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error:', {
      message: err.message,
      statusCode,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export default errorHandler;
