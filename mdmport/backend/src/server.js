require('dotenv').config();

console.log('Teljes betöltött env változólista:');
console.log(require('dotenv').config().parsed);

console.log('SESSION_SECRET from env:', process.env.SESSION_SECRET);
console.log('Current working directory:', process.cwd());
console.log('Env file loaded:', require('dotenv').config().parsed ? 'YES' : 'NO');

console.log('SESSION_SECRET közvetlenül:', process.env.SESSION_SECRET);

const express = require('express');
const cors = require('cors');
const { loadSqlOnStart, dumpSqlOnShutdown } = require('./config/db');
const apiRoutes = require('./routes/api');
const sessionConfig = require('./config/session');
const app = express();
app.use(cors());
app.use(express.json());
app.use(sessionConfig);
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

let shuttingDown = false;
const handleShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} jel érkezett → adatbázis mentése...`);
  dumpSqlOnShutdown();
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);