import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import valliRoutes from './routes/valliRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import homeDebtRoutes from './routes/homeDebtRoutes.js';
import growthRoutes from './routes/growthRoutes.js';

// Cron jobs
import { startReminderCron } from './jobs/reminderCron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Global Middleware
// ---------------------------------------------------------------------------

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
});
app.use('/api', limiter);

// ---------------------------------------------------------------------------
// Health Check (no auth required)
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'valli-chedi-backend',
    timestamp: new Date().toISOString(),
    tagline: 'Permission granted. Consequences pending.',
  });
});

// ---------------------------------------------------------------------------
// Public Routes (no auth required)
// ---------------------------------------------------------------------------

app.use('/api/auth', authRoutes);

// ---------------------------------------------------------------------------
// Protected Routes (auth required)
// ---------------------------------------------------------------------------

app.use('/api/activities', authenticate, activityRoutes);
app.use('/api/vallis', authenticate, valliRoutes);
app.use('/api/permissions', authenticate, permissionRoutes);
app.use('/api/reminders', authenticate, reminderRoutes);
app.use('/api/home-debt', authenticate, homeDebtRoutes);
app.use('/api', authenticate, growthRoutes);

// ---------------------------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------------------------

app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.',
  });
});

// ---------------------------------------------------------------------------
// Error Handler (must be last)
// ---------------------------------------------------------------------------

app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('');
  console.log('🌿 ═══════════════════════════════════════════ 🌿');
  console.log('');
  console.log('   VALLI CHEDI BACKEND');
  console.log('   Permission granted. Consequences pending.');
  console.log('');
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Health check:     http://localhost:${PORT}/health`);
  console.log(`   Environment:      ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('🌿 ═══════════════════════════════════════════ 🌿');
  console.log('');

  // Start the reminder cron job
  startReminderCron();
});

export default app;
