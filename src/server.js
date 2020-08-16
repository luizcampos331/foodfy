//Imports
const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const methodOverride = require('method-override');
const session = require('./config/session');

const server = express();

//Disponibiliza durante a aplicação inteira o controle de sessão de usuário
server.use(session);
//Disponibiliza a sessão para todas as páginas usarem
server.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

//Responsável por liberar a passagem de dados de um formulário POST via req.body
server.use(express.urlencoded({ extended: true }));
//Server poderá usar arquivos estáticos (css) da pasta public
server.use(express.static('public'));
/*Caso seja pedido, irá sobreescrever o method da página, nesse caso será para
transformar o method POST em PUT */
server.use(methodOverride('_method'));
//Server irá usar as funcionalidades do routes
server.use(routes);

//setando que o server ira ser um motor de visualização (view engine) do tipo html
server.set('view engine', 'njk');

// === comando "npm start" no terminal para começar o servidor === //

//configurando o nunjucks para a pasta de views
nunjucks.configure('src/app/views', {
  //definindo o uso do express e a variavel que o mesmo esta usando
  express: server,
  //permite tags html dentro de variáveis neste arquivo
  autoescape: false,
  //Não guardar cache
  noCache: true
});


server.listen(5005);