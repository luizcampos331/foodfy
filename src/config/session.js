const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./db');

//Configuração da sessão
module.exports = session({
  store: new pgSession({
    pool: db
  }),
  secret: 'pass',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias = 2.592.000.000 milisegundos
  }
})