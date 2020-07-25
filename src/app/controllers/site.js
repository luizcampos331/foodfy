const Site = require('../models/Site');

module.exports = {
  // Método GET para página home
  async home(req, res) {
    const results = await Site.allRecipes()
    const recipes = results.rows;

    for(recipe of recipes) {
      recipe.path = `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`;
    }

    //Retornando a página index renderizada
    return res.render('site/home', { recipes })
  },

  // Método GET para página about
  about(req, res) {
    //Retornando a página index renderizada
    return res.render('site/about')
  },

  // Método GET para página recipes
  async recipes(req, res) {
    let { filter, page, limit } = req.query;

    //page recebe ele mesmo ou 1 caso ele esteja vazio
    page = page || 1;
    //limit recebe ele mesmo ou 2 caso ele esteja vazio
    limit = limit || 9;
    //Tendo os valores padrões acima, offset recebe 2 * (1 - 1) = 0
    let offset = limit * (page - 1);

    // Cria objeto params
    const params = {
      filter,
      limit,
      offset
    }

    // Inicia o paginate passado o objeto params como parametro
    const results = await Site.paginate(params);
    const recipes = results.rows;

    //Corrige o path da imagem
    for(recipe of recipes) {
      recipe.path = `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`;
    }

    //Corrige o total de itens
    let total = 1
    if(recipes[0]) total = recipes[0].total

    const pagination = {
      //Cria o total de páginas
      total: Math.ceil(total / limit),//Math.ceil arredonda para cima
      //Página atual
      page
    }      

    //Retorna página de instrutores renderizada
    return res.render('site/recipes', { recipes, pagination, filter });
  },

  // Método GET para ágina recipes-details
  async details(req, res) {
    let results = await Site.findRecipe(req.params.id);
    const recipe = results.rows[0];

    if(!recipe) return res.status(404).render("site/not-found");

    // Get Images
    results = await Site.files(recipe.id);
    const files = results.rows.map(file => ({
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
    }));
    
    //Passando o valor do index e o item que esta na posição "index" do array data.js
    return res.render('site/recipes-details', { recipe, files })
  },

  async chefs(req, res) {
    let results = await Site.allChefs();
    const chefs = results.rows;

    for(chef of chefs) {
      results = await Site.fileChefs(chef.file_id);
      let path = results.rows[0].path;

      path = `${req.protocol}://${req.headers.host}${path.replace('public', '')}`;

      chef.path = path;
    }

    return res.render('site/chefs', { chefs });
  }
}