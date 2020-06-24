//Importação do express para roteamento
const express = require('express');
//Importação do nunjucks para template engine
const nunjucks = require('nunjucks');
//Importando array de data.js
const recipes_data = require('./data');

//Colocando funcionalidades do express na constante server
const server = express();

//Server usando arquivos estáticos (css) da pasta public
server.use(express.static('public'));

//setando que o server ira ser um motor de visualização (view engine) do tipo html
server.set('view engine', 'njk');

// === comando "npm start" no terminal para começar o servidor === //

//configurando o nunjucks para a pasta de views
nunjucks.configure('views', {
  //definindo o uso do express e a variavel que o mesmo esta usando
  express: server,
  //permite tags html dentro de variáveis neste arquivo
  autoescape: false,
  noCache: true
});

//Rota tipo GET para a página home.njk
server.get('/', function (req, res) {
  //Retornando a página index renderizada
  return res.render('home', {items: recipes_data})
});

//Rota tipo GET para a página about.njk
server.get('/sobre', function (req, res) {
  //Retornando a página index renderizada
  return res.render('about')
});

//Rota tipo GET para a página recipes.njk
server.get('/receitas', function (req, res) {
  //Retornando a página index renderizada
  return res.render('recipes', {items: recipes_data})
});

//Rota tipo GET para a página recipes-details.njk
server.get("/receitas/:index", function (req, res) {
  //Buscando index da url
  const recipeIndex = req.params.index;

  //Passando o valor do index e o item que esta na posição "index" do array data.js
  return res.render('recipes-details', {recipeIndex, item: recipes_data[recipeIndex]})
})

server.listen(5000);