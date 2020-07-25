const express = require('express');

const site = require('./app/controllers/site');
const adminRecipes = require('./app/controllers/adminRecipes');
const adminChefs = require('./app/controllers/adminChefs');
const multer = require('./app/middlewares/multer');

//Express da a variável a responsabilidade pelas rotas
const routes = express.Router();

// === Rotas - Clients ===
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

// === Rotas - Admin Recipes ===
//Rota tipo GET para página index
routes.get('/admin/recipes', adminRecipes.index);
//Rota tipo GET para página create
routes.get('/admin/recipes/create', adminRecipes.create);
//Rota tipo GET para página show
routes.get('/admin/recipes/:id', adminRecipes.show);
//Rota tipo GET para página edit
routes.get('/admin/recipes/:id/edit', adminRecipes.edit);
//Rota tipo POST para criação de receitas
routes.post('/admin/recipes', multer.array('photos', 5), adminRecipes.post);
//Rota tipo PUR para edição de receitas
routes.put('/admin/recipes', multer.array('photos', 5), adminRecipes.put);
//Rota tipo DELETE para exclusão de receitas
routes.delete('/admin/recipes', adminRecipes.delete);

// === Rotas - Admin Chefs ===
//Rota tipo GET para página index
routes.get('/admin/chefs', adminChefs.index);
//Rota tipo GET para página create
routes.get('/admin/chefs/create', adminChefs.create);
//Rota tipo GET para página show
routes.get('/admin/chefs/:id', adminChefs.show);
//Rota tipo GET para página edit
routes.get('/admin/chefs/:id/edit', adminChefs.edit);
//Rota tipo POST para criação de receitas
routes.post('/admin/chefs', multer.array('avatar', 1), adminChefs.post);// Caso seja passado via formulário arquivos, usar multer
//Rota tipo PUR para edição de receitas
routes.put('/admin/chefs', multer.array('avatar', 1), adminChefs.put);// Caso seja passado via formulário arquivos, usar multer
//Rota tipo DELETE para exclusão de receitas
routes.delete('/admin/chefs', adminChefs.delete);

// REDIRECT
routes.get('/admin', function(req, res) {
  res.redirect('admin/recipes')
});

//Caso nenhuma rota seja encontrada
routes.use(function(req, res) {
  res.status(404).render("site/not-found");
});

//Exportando a variável routes
module.exports = routes;