const Chef = require('../models/AdminChef');

module.exports = {
  index(req, res) {
    Chef.all(function(chefs) {
      return res.render('admin/chefs/index', { chefs });
    })
  },

  create(req, res) {
    return res.render('admin/chefs/create');
  },

  post(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == ""){
        return 
      }
    }

    Chef.create(req.body, function(chef) {
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  },

  show(req, res) {
    if(isNaN(parseInt(req.params.id, 10)))
    {
      return res.status(404).render("admin/not-found");
    }

    Chef.find(req.params.id, function(chef) {
      
      Chef.findRecipes(req.params.id, function(recipes) {
        return res.render('admin/chefs/show', { chef, recipes })
      });
    });
  },

  edit(req, res) {
    if(isNaN(parseInt(req.params.id, 10)))
    {
      return res.status(404).render("admin/not-found");
    }
    
    Chef.find(req.params.id, function(chef) {
      if(!chef) return res.send('Chef not found');
      /*Retornando página de edição de uma receita renderizada, passado dados
      somente da receita correta, atravez de sua posição no array de dados*/
      return res.render('admin/chefs/edit', { chef })
    });
  },

  put(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == ""){
        return res.send('Please, fill all fields!');
      }
    }

    Chef.update(req.body, function(chef) {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },

  delete(req, res) {
    Chef.findRecipes(req.body.id, function(recipe){
      if(recipe[0]) {
        return res.send('Chefs com receitas vinculadas!');
      }

      Chef.delete(req.body.id, function() {
        return res.redirect('/admin/chefs');
      });
    });
  }
}