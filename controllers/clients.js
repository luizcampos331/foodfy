const data = require('../data.json');

// Método GET para página home
exports.home = function (req, res) {
  //Retornando a página index renderizada
  return res.render('clients/home', {items: data.recipes})
}

// Método GET para página about
exports.about = function (req, res) {
  //Retornando a página index renderizada
  return res.render('clients/about')
}

// Método GET para página recipes
exports.recipes = function (req, res) {
  //Retornando a página index renderizada
  return res.render('clients/recipes', {items: data.recipes})
}

// Método GET para ágina recipes-details
exports.details = function (req, res) {
  //Buscando index da url
  const recipeIndex = req.params.index;

  //Passando o valor do index e o item que esta na posição "index" do array data.js
  return res.render('clients/recipes-details', { item: data.recipes[recipeIndex] })
}