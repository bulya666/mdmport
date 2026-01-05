const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { pool } = require("./db");

const store = new MySQLStore(
  {
    createDatabaseTable: true,
  },
  pool 
);

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: "lax"
  }
});