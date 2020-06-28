const fs = require('fs');
const data = require('../data.json');

// === Método Index - Visualizar Página ===
exports.index = function(req, res) {
  return res.render('admin/index', { items: data.recipes })
}

// === Método Create - Visualizar página ===
exports.create = function(req, res) {
  return res.render('admin/create')
}

// === Método Show - Visualizar página ===
exports.show = function(req, res) {
  const index = req.params.index;

  return res.render('admin/show', { item: data.recipes[index] })
}

// === Método Edit - Visualizar página ===
exports.edit = function(req, res) {
  const index = req.params.index;

  return res.render('admin/edit', { item: data.recipes[index] })
}

// === Método POST - Ação ===
exports.post = function(req, res) {
  //Variáveis recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  //Percorrendo o array keys
  for(let key of keys){
    if(req.body[key] != req.body.information) {
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }
  }

  let { image, title, author, ingredients, preparation, information } = req.body;

  //Pego o ultimo membro do array
  const lastRecipe= data.recipes[data.recipes.length - 1]
  //Inicio o id com 1
  let id = 0;
  //Se lastMember não estiver vazio ele guarda o lastMember.id + 1 na variável id
  if(lastRecipe) id = lastRecipe.id + 1;

  //Adiciona um novo objetivo ao final do array de instructors
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
    if(error) return res.send("Write file error!")

    return res.redirect("/admin/recipes")
  });
}

// === Método PUT - Ação ===
exports.put = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  let index = 0;
  
  /*Se algum id da receita for igual ao id passado corpo da requisição
  os dados da receita serão guardados na variável foundRecipe */
  const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
    if (id == recipe.id) {
      index = foundIndex;
      return true;
    }
  });

  //Se não for achado nenhuma receita com id igual ao da url é retornada uma mensagem
  if(!foundRecipe) return res.send('Recipe not found!');

  const recipe = {
    ...foundRecipe,
    ...req.body,
    id: Number(req.body.id),
  }

  data.recipes[index] = recipe;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect(`/admin/recipes/${id}`)
  })
}

// === Método DELETE - Ação ===
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredRecipe = data.recipes.filter(function(recipe) {
    return id != recipe.id;
  });

  data.recipes = filteredRecipe;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect('/admin/recipes');
  })
}