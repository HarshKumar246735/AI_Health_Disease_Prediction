const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { clientOrigins } = require('./config/env');
const sanitize = require('./middleware/sanitize');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.set('trust proxy', 1); // Render sits behind a proxy; needed for correct client IPs in rate limiting
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => (!origin || clientOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '50kb' }));
app.use(sanitize);
app.use(
  '/api',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many requests. Please slow down.' } })
);

app.get('/', (req, res) => res.json({ name: 'HealthPredict API', status: 'ok' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/diseases', require('./routes/diseaseRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
