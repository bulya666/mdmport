require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { loadSqlOnStart, dumpSqlOnShutdown } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

loadSqlOnStart().finally(() => {
  app.listen(PORT, () => {
    console.log(`MDM Port API fut: http://localhost:${PORT}`);
    console.log(`Példák:`);
    console.log(`   GET  http://localhost:${PORT}/api/games`);
    console.log(`   POST http://localhost:${PORT}/api/login`);
  });
});

// Graceful shutdown + dump
let shuttingDown = false;
const handleShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} jel érkezett → adatbázis mentése...`);
  dumpSqlOnShutdown();
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);