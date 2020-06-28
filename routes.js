const express = require('express');

const clients = require('./controllers/clients');
const admin = require('./controllers/admin');

//Express da a variável a responsabilidade pelas rotas
const routes = express.Router();

// === Rotas - Clients ===
//Rota tipo GET para a página home
routes.get('/', clients.home);
//Rota tipo GET para a página about
routes.get('/sobre', clients.about);
//Rota tipo GET para a página recipes
routes.get('/receitas', clients.recipes);
//Rota tipo GET para a página recipes-details
routes.get('/receitas/:index', clients.details);

// === Rotas - Admin ===
//Rota tipo GET para página index
routes.get('/admin/recipes', admin.index);
//Rota tipo GET para página create
routes.get('/admin/recipes/create', admin.create);
//Rota tipo GET para página show
routes.get('/admin/recipes/:index', admin.show);
//Rota tipo GET para página edit
routes.get('/admin/recipes/:index/edit', admin.edit);
//Rota tipo POST para criação de receitas
routes.post('/admin/recipes', admin.post);
//Rota tipo PUR para edição de receitas
routes.put('/admin/recipes', admin.put);
//Rota tipo DELETE para exclusão de receitas
routes.delete('/admin/recipes', admin.delete);

// REDIRECT
routes.get('/admin', function(req, res) {
  res.redirect('admin/recipes')
})

//Exportando a variável routes
module.exports = routes;