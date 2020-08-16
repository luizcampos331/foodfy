const express = require('express');
const routes = express.Router();

// Controllers
const site = require('../app/controllers/Site');

// === Rotas ===
//Rota tipo GET para a página home
routes.get('/', site.home);
//Rota tipo GET para a página about
routes.get('/sobre', site.about);
//Rota tipo GET para a página recipes
routes.get('/receitas', site.recipes);
//Rota tipo GET para a página recipes-details
routes.get('/receitas/:id', site.details);
//Rota tipo GET para a página chefs
routes.get('/chefs', site.chefs);

module.exports = routes;