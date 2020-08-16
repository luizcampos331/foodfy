const express = require('express');
const routes = express.Router();

// Controllers 
const ChefsController = require('../app/controllers/ChefsController');
const multer = require('../app/middlewares/multer');

// Validators
const ChefsValidator = require('../app/validators/Chefs')

// === Rotas ===
//Rota tipo GET para página index
routes.get('/', ChefsController.index);
//Rota tipo GET para página create
routes.get('/create', ChefsValidator.get, ChefsController.create);
//Rota tipo GET para página show
routes.get('/:id', ChefsController.show);
//Rota tipo GET para página edit
routes.get('/:id/edit', ChefsValidator.get, ChefsController.edit);
//Rota tipo POST para criação de receitas
routes.post('/', multer.array('avatar', 1), ChefsValidator.post, ChefsController.post);// Caso seja passado via formulário arquivos, usar multer
//Rota tipo PUR para edição de receitas
routes.put('/', multer.array('avatar', 1), ChefsValidator.put, ChefsController.put);// Caso seja passado via formulário arquivos, usar multer
//Rota tipo DELETE para exclusão de receitas
routes.delete('/', ChefsValidator.del, ChefsController.delete);

module.exports = routes;