import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import corsOptions from './config/corsOptions.js';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';
import passport from './config/passport.js';
import { generateToken } from './utils/generateToken.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false })); // allow images to be served cross-origin
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(apiRateLimiter);
app.use(passport.initialize());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    statusCode: 200,
    message: 'QueueBite API Server',
    data: { version: '1.0.0', environment: env.NODE_ENV },
  });
});

app.use('/api/v1', apiRoutes);

// Google OAuth routes
app.get(
  '/api/v1/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);

app.get(
  '/api/v1/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/v1/auth/google/failure',
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken({
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });

    // Redirect to frontend with token
    res.redirect(`${env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

app.get('/api/v1/auth/google/failure', (req, res) => {
  res.redirect(`${env.CLIENT_URL}/login?error=google_auth_failed`);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
    data: null,
  });
});

app.use(errorHandler);

export default app;
