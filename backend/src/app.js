import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import healthRoutes from './routes/health.routes.js';
import medicineRoutes from './routes/medicines.routes.js';
import labRoutes from './routes/lab.routes.js';
import forumRoutes from './routes/forum.routes.js';

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet()); // Set various HTTP headers
app.use(compression()); // Compress response payloads

// CORS Configuration
const corsOptions = {
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Rate limiting - API route protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per 15 minutes
  skipSuccessfulRequests: true,
});

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API version endpoint
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    message: 'SwasthAI API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      doctors: '/api/v1/doctors',
      appointments: '/api/v1/appointments',
      health: '/api/v1/health',
      medicines: '/api/v1/medicines',
      lab: '/api/v1/lab',
      forum: '/api/v1/forum',
    },
  });
});

// API Routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/lab', labRoutes);
app.use('/api/v1/forum', forumRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Sentry error handler (must be after all other middleware and routes)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Global error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      SwasthAI Backend API Server       ║
║              v1.0.0                    ║
╚════════════════════════════════════════╝

🚀 Server running on port ${PORT}
📝 Environment: ${process.env.NODE_ENV}
🔗 API URL: http://localhost:${PORT}/api/v1
✅ Health Check: http://localhost:${PORT}/health

📚 Available Routes:
   • /api/v1/auth       - Authentication
   • /api/v1/users      - User management
   • /api/v1/doctors    - Doctor profiles
   • /api/v1/appointments - Appointments
   • /api/v1/health     - Health records
   • /api/v1/medicines  - Medicine orders
   • /api/v1/lab        - Lab bookings
   • /api/v1/forum      - Health forum

${process.env.NODE_ENV === 'development' ? '⚠️  Running in DEVELOPMENT mode' : '✅ Running in PRODUCTION mode'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
