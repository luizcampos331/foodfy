const express = require('express');
const routes = express.Router();

// Controllers 
const RecipesController = require('../app/controllers/RecipesController');
const multer = require('../app/middlewares/multer');

// Validators
const RecipeValidator = require('../app/validators/Recipes')

// === Rotas ===
//Rota tipo GET para página index
routes.get('/', RecipesController.index);
//Rota tipo GET para página create
routes.get('/create', RecipesController.create);
//Rota tipo GET para página show
routes.get('/:id', RecipeValidator.show, RecipesController.show);
//Rota tipo GET para página edit
routes.get('/:id/edit', RecipeValidator.get, RecipesController.edit);
//Rota tipo POST para criação de receitas
routes.post('/', multer.array('photos', 5), RecipeValidator.post, RecipesController.post);
//Rota tipo PUR para edição de receitas
routes.put('/', multer.array('photos', 5), RecipeValidator.put, RecipesController.put);
//Rota tipo DELETE para exclusão de receitas
routes.delete('/', RecipesController.delete);

module.exports = routes;