const express = require('express');

const site = require('./site')
const recipes = require('./recipes')
const chefs = require('./chefs')
const session = require('./session')
const users = require('./users')

const routes = express.Router();

// === Rotas - Clients ===
routes.use('/', site)
// === Rotas - Admin ===
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)
routes.use('/admin', users)

// === Rotas - login ===
routes.use('/session', session)

// alias
routes.get('/session', function(req, res) {
  res.redirect('session/login')
})

routes.get('/admin', function(req, res) {
  res.redirect('admin/recipes')
});

// NOT FOUND
routes.use(function(req, res) {
  res.status(404).render("site/not-found");
});

module.exports = routes;