// server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const domainRoutes = require('./routes/domainRoutes'); // Add new routes
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2/promise');

const envPath = path.join(__dirname, '.env');
try {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw result.error;
  }
  console.log('Successfully loaded .env from:', envPath);
} catch (error) {
  console.error('Failed to load .env:', error.message);
  process.exit(1);
}

console.log('Environment Variables:', {
  DB_HOST: process.env.DB_HOST || 'NOT_SET',
  DB_PORT: process.env.DB_PORT || 'NOT_SET',
  DB_USER: process.env.DB_USER || 'NOT_SET',
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : 'NOT_SET',
  DB_NAME: process.env.DB_NAME || 'NOT_SET',
  NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
  PORT: process.env.PORT || 'NOT_SET',
  FRONTEND_URL: process.env.FRONTEND_URL || 'NOT_SET',
  BASE_DOMAIN: process.env.BASE_DOMAIN || 'NOT_SET',
  JWT_SECRET: process.env.JWT_SECRET ? '[REDACTED]' : 'NOT_SET',
});

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/sites', express.static(path.join(__dirname, 'public/sites'), { index: 'index.html' }));

app.use((req, res, next) => {
  const host = req.headers.host;
  console.log('Host detected:', host);
  const [domain, port] = host.split(':');
  const hostParts = domain.split('.');
  const baseDomain = process.env.BASE_DOMAIN || 'localhost';
  const baseDomainParts = baseDomain.split('.');
  if (hostParts.length > baseDomainParts.length) {
    const sub = hostParts[0];
    console.log('Subdomain detected:', sub);
    const domainName = sub;
    console.log('Domain name:', domainName);
    const sitePath = path.join(__dirname, 'public/sites', domainName);
    console.log('Site path:', sitePath);
    if (fs.existsSync(sitePath) && fs.existsSync(path.join(sitePath, 'index.html'))) {
      return express.static(sitePath, { index: 'index.html' })(req, res, next);
    } else {
      return res.status(404).json({ message: `Site not found for subdomain ${sub}` });
    }
  }
  next();
});

// Mount routes
app.use('/api', authRoutes);
app.use('/api', domainRoutes); // Add domain routes

app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({ message: 'Erreur interne du serveur.' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server started on port ${PORT}`);
});