const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { pool } = require("./db");

const store = new MySQLStore(
  {
    createDatabaseTable: true,
    charset: 'utf8mb4_bin',
    clearExpired: true,
    checkExpirationInterval: 900000
  },
  pool 
);

store.clearExpiredSessions(); 

setInterval(() => {
  store.clearExpiredSessions((err) => {
    if (err) console.error('Expired sessions cleanup error:', err);
    else console.log('Lejárt sessionök kitakarítva');
  });
}, 1000 * 60 * 60 * 24);

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  store,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: "lax"
  }
});

