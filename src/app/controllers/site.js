const Site = require('../models/Site');

module.exports = {
  // Método GET para página home
  home(req, res) {
    Site.allRecipes(function(recipes) {
      //Retornando a página index renderizada
      return res.render('site/home', { recipes })
    })
  },

  // Método GET para página about
  about(req, res) {
    //Retornando a página index renderizada
    return res.render('site/about')
  },

  // Método GET para página recipes
  recipes(req, res) {
    let { filter, page, limit } = req.query;

    //page recebe ele mesmo ou 1 caso ele esteja vazio
    page = page || 1;
    //limit recebe ele mesmo ou 2 caso ele esteja vazio
    limit = limit || 2;
    //Tendo os valores padrões acima, offset recebe 2 * (1 - 1) = 0
    let offset = limit * (page - 1);

    // Cria objeto params
    const params = {
      filter,
      limit,
      offset,
      callback(recipes) {
        let total = 1
        if(recipes[0]) total = recipes[0].total
        const pagination = {
          //Math.ceil arredonda para cima
          total: Math.ceil(total / limit),
          page
        }

        //Retorna página de instrutores renderizada
        return res.render('site/recipes', { recipes, pagination, filter });
      }
    }

    // Inicia o paginate passado o objeto params como parametro
    Site.paginate(params);


    /*Site.allRecipes(function(recipes) {
      //Retornando a página index renderizada
      return res.render('site/recipes', { recipes })
    })*/
  },

  // Método GET para ágina recipes-details
  details(req, res) {
    Site.findRecipe(req.params.id, function(recipe) {
      //Passando o valor do index e o item que esta na posição "index" do array data.js
      return res.render('site/recipes-details', { recipe })
    });
  },

  chefs(req, res) {
    Site.allChefs(function(chefs) {
      return res.render('site/chefs', { chefs })
    });
  }
}