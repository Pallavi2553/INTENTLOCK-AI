// server.js - INTENTLOCK AI Backend Server
// The payment firewall for autonomous AI

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging for audit visibility
app.use((req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/health') {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'INTENTLOCK AI Engine API',
    tagline: 'The payment firewall for autonomous AI',
    status: 'OPERATIONAL',
    environment: 'SYNTHETIC_DEMO',
    notice: 'Synthetic environment only. No real banking connections or financial transactions.',
    docs: {
      health: '/api/health',
      dashboard: '/api/dashboard',
      createIntent: 'POST /api/intent/create',
      firewallCheck: 'POST /api/firewall/check',
      chaosAttack: 'POST /api/chaos/run',
      judgeDemo: 'POST /api/demo/judge-flow'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    service: 'INTENTLOCK AI Engine'
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                      INTENTLOCK AI                       ║
  ║          The Payment Firewall for Autonomous AI          ║
  ║                   Mode: SYNTHETIC DEMO                   ║
  ║                                                          ║
  ║  Server running on: http://localhost:${PORT}               ║
  ║  Health Check:      http://localhost:${PORT}/api/health    ║
  ╚══════════════════════════════════════════════════════════╝
  `);
});

export default app;
