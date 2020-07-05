const Recipe = require('../models/AdminRecipe');

module.exports = {
  // === Método Index - Visualizar Página ===
  index(req, res) {
    Recipe.all(function(recipes) {
      //Retornando a página renderizada e passando os dados de todas as receitas
      return res.render('admin/recipes/index', { recipes })
    })
  },

  // === Método Create - Visualizar página ===
  create(req, res) {
    Recipe.chefSelectOptions(function(options) {
      //Retornando página de criação de receitas renderizada
      return res.render('admin/recipes/create', { chefOptions: options })
    })
  },

  // === Método POST - Ação ===
  post(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      /*Verificando se keys já chegou no ultimo campo, como o ultimo campos não é
      obrigatório, ele não precisa passar pelo próximo if */
      if(key != 'information') {
        //Verificando a existencia de valores em cada uma das chaves do req.body
        if(req.body[key] == ""){
          return res.send('Please, fill all fields!');
        }
      }
    }

    Recipe.create(req.body, function(recipe) {
      return res.redirect(`/admin/recipes/${recipe.id}`)
    });

  },

  // === Método Show - Visualizar página ===
  show(req, res) {
    if(isNaN(parseInt(req.params.id, 10)))
    {
      return res.status(404).render("admin/not-found");
    }

    Recipe.find(req.params.id, function(recipe) {
      /*Retornando página de detalhes de uma receita renderizada, passado dados
      somente da receita correta, atravez de sua posição no array de dados*/
      return res.render('admin/recipes/show', { recipe })
    });
  },

  // === Método Edit - Visualizar página ===
  edit(req, res) {
    if(isNaN(parseInt(req.params.id, 10)))
    {
      return res.status(404).render("admin/not-found");
    }
    
    Recipe.find(req.params.id, function(recipe) {
      if(!recipe) return res.send('Recipe not found');

      Recipe.chefSelectOptions(function(options) {
          /*Retornando página de edição de uma receita renderizada, passado dados
          somente da receita correta, atravez de sua posição no array de dados*/
          return res.render('admin/recipes/edit', { recipe, chefOptions: options })
      });
    });
  },

  // === Método PUT - Ação ===
  put(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      /*Verificando se keys já chegou no ultimo campo, como o ultimo campos não é
      obrigatório, ele não precisa passar pelo próximo if */
      if(req.body[key] != req.body.information) {
        //Verificando a existencia de valores em cada uma das chaves do req.body
        if(req.body[key] == ""){
          return res.send('Please, fill all fields!');
        }
      }
    }

    Recipe.update(req.body, function() {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },

  // === Método DELETE - Ação ===
  delete(req, res) {
    Recipe.delete(req.body.id, function() {
      return res.redirect('/admin/recipes');
    });
  }
}