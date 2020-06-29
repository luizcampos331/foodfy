//Importando biblioteca File System para manipular arquivos
const fs = require('fs');
//Importando dados do data.jsob
const data = require('../data.json');

// === Método Index - Visualizar Página ===
exports.index = function(req, res) {
  //Retornando a página renderizada e passando os dados de todas as receitas
  return res.render('admin/index', { items: data.recipes })
}

// === Método Create - Visualizar página ===
exports.create = function(req, res) {
  //Retornando página de criação de receitas renderizada
  return res.render('admin/create')
}

// === Método Show - Visualizar página ===
exports.show = function(req, res) {
  //Recuperando o index da url
  const index = req.params.index;

  /*Retornando página de detalhes de uma receita renderizada, passado dados
  somente da receita correta, atravez de sua posição no array de dados*/
  return res.render('admin/show', { item: data.recipes[index] })
}

// === Método Edit - Visualizar página ===
exports.edit = function(req, res) {
  //Recuperando o index da url
  const index = req.params.index;

  /*Retornando página de edição de uma receita renderizada, passado dados
  somente da receita correta, atravez de sua posição no array de dados*/
  return res.render('admin/edit', { item: data.recipes[index] })
}

// === Método POST - Ação ===
exports.post = function(req, res) {
  //Variável keys recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  //Percorrendo o array keys
  for(let key of keys){
    /*Verificando se keys já chegou no ultimo campo, como o ultimo campos não é
    obrigatório, ele não precisa passar pelo próximo if */
    if(req.body[key] != req.body.information) {
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }
  }

  //Desestruturando os campos no formulário que vem no req.body
  let { image, title, author, ingredients, preparation, information } = req.body;

  //Pego o ultimo membro do array
  const lastRecipe= data.recipes[data.recipes.length - 1]
  //Inicio o id com 0 para servir para index do array
  let id = 0;
  //Se lastRecipe não estiver vazio ele guarda o lastRecipe.id + 1 na variável id
  if(lastRecipe) id = lastRecipe.id + 1;

  //Adiciona um novo objetivo ao final do array de recipes
  data.recipes.push({
    id,
    image,
    title,
    author,
    ingredients,
    preparation,
    information,
    accessed: true,
  })

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    //Caso de algo erro, a mensagem é retornada
    if(error) return res.send("Write file error!")

    //Redireciona para a página de receitas (index)
    return res.redirect("/admin/recipes")
  });
}

// === Método PUT - Ação ===
exports.put = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  
  /*Se algum id de receita for igual ao id passado no corpo da requisição,
  os dados da receita serão guardados na variável foundRecipe */
  const foundRecipe = data.recipes.find(function(recipe) {
      return id == recipe.id;
  });

  //Se não for achado nenhuma receita com id igual ao da url é retornada uma mensagem
  if(!foundRecipe) return res.send('Recipe not found!');

  //Recipe guarda o objeto com os dados da receita atualizada
  const recipe = {
    ...foundRecipe,
    ...req.body,
    id: Number(req.body.id),
  }

  //a receita do array recebe os novos valores
  data.recipes[id] = recipe;

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    //Redireciona para a página de detalhes da receita
    return res.redirect(`/admin/recipes/${id}`)
  })
}

// === Método DELETE - Ação ===
exports.delete = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  //Filtra os dados do data.json e guarda somente os que não forem igual ao id passado
  const filteredRecipe = data.recipes.filter(function(recipe) {
    return id != recipe.id;
  });

  //Guarda os dados novamente no array de receitas
  data.recipes = filteredRecipe;

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

      //Redireciona para a página de receitas (index)
    return res.redirect('/admin/recipes');
  })
}