require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { loadSqlOnStart, dumpSqlOnShutdown } = require('./config/db');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
    path: '/'
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '../../public')));

const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.error('Szerver hiba:', err);
  res.status(500).json({ message: 'Szerver hiba' });
});

loadSqlOnStart().finally(() => {
  app.listen(PORT, () => {
    console.log(`MDM Port API fut: http://localhost:${PORT}`);
    console.log(`Példák:`);
    console.log(`   GET  http://localhost:${PORT}/api/games`);
    console.log(`   POST http://localhost:${PORT}/api/login`);
  });
});

let shuttingDown = false;
const handleShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} jel érkezett → adatbázis mentése...`);
  dumpSqlOnShutdown();
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);