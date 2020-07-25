const Recipe = require('../models/AdminRecipe');
const File = require('../models/File');

module.exports = {
  // === Método Index - Visualizar Página ===
  async index(req, res) {
    let results = await Recipe.all()
    const recipes = results.rows;

    for(recipe of recipes) {
      if(recipe.path)
        recipe.path = `${req.protocol}://${req.headers.host}${recipe.path.replace('public', '')}`;
    }

    return res.render('admin/recipes/index.njk', { recipes })
  },

  // === Método Create - Visualizar página ===
  async create(req, res) {
    const results = await Recipe.chefSelectOptions();
    const chefOptions = results.rows;

    return res.render('admin/recipes/create.njk', { chefOptions })
  },

  // === Método POST - Ação ===
  async post(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      /*Verificando se keys já chegou no ultimo campo, como o ultimo campos não é
      obrigatório, ele não precisa passar pelo próximo if */
      if(req.body[key] == '' && key != "information" && key != "removed_files")
        return res.send('Please, fill all fields - create!');
    }

    if(req.files.length == 0) {
      return res.send('Uma foto pelo menos!')
    }

    const results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    //Guarda na variável filesPromises um array de promessas, no caso a inserção da imagem no banco
    const filesPromise = req.files.map(file => File.createRecipe({...file, recipe_id: recipeId}));
    //Espera a criação do arquivo para seguir em frente
    await Promise.all(filesPromise);
    
    return res.redirect(`/admin/recipes/${recipeId}`)
  },

  // === Método Show - Visualizar página ===
  async show(req, res) {
    // Get Recipes
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0];

    if(isNaN(parseInt(req.params.id, 10)))
      return res.status(404).render("admin/not-found");

    if(!recipe) return res.status(404).render("admin/not-found");

    // Get Images
    results = await Recipe.files(recipe.id);
    const files = results.rows.map(file => ({
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
    }));

    return res.render('admin/recipes/show.njk', { recipe, files });
  },

  // === Método Edit - Visualizar página ===
  async edit(req, res) {
    // Get Recipe
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if(isNaN(parseInt(req.params.id, 10)))
    {
      return res.status(404).render("admin/not-found");
    }

    if(!recipe) return res.status(404).render("admin/not-found");

    // Get Chefs
    results = await Recipe.chefSelectOptions();
    const chefOptions = results.rows;

    // Get Images
    results = await Recipe.files(recipe.id);
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
    }));

    return res.render('admin/recipes/edit.njk', { recipe, chefOptions, files })
  },

  // === Método PUT - Ação ===
  async put(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      /*Verificando se keys já chegou no ultimo campo, como o ultimo campos não é
      obrigatório, ele não precisa passar pelo próximo if */
      if(req.body[key] == '' && key != "information" && key != "removed_files")
        //Verificando a existencia de valores em cada uma das chaves do req.body
        return res.send('Please, fill all fields! - update');
    }

    if(!req.body.photo_id && req.files.length == 0) 
      return res.send('Uma foto pelo menos!');

    //Verifico se existem imagens para serem cadastradas
    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.createRecipe({
        ...file, 
        recipe_id: req.body.id
      }));

      await Promise.all(newFilesPromise);
    }

    //Verifico se o input removed_files existe
    if(req.body.removed_files) {
      //Guardo os vlores contidos nele como um array
      const removedFiles = req.body.removed_files.split(',');
      //Guarda o index da ultima posição do array
      const lastIndex = removedFiles.length -1
      //Removo a ultima posição pois não tera nenhum valor guardado
      removedFiles.splice(lastIndex, 1);
      //Crio um array de promessas de exclusão das imagens
      const removedFilesPromise = removedFiles.map(id => File.deleteRecipe(id));
      //Aguarda a criação do arquivo para seguir em em frente
      await Promise.all(removedFilesPromise);
    }

    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },

  // === Método DELETE - Ação ===
  async delete(req, res) {

    await File.deleteRecipeAll(req.body.id);

    await Recipe.delete(req.body.id);
    
    return res.redirect('/admin/recipes');
  }
}