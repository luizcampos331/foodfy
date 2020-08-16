const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  // === Método Index - Visualizar Página ===
  async index(req, res) {
    try {
      // === Select Recipes
      const recipes = await Recipe.all()
  
      // === Select Files
      async function getImageRecipe(recipeId) {
        const results = await Recipe.files(recipeId)
        const files = results.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);
  
        return files[0];
      }
      
      // === Correction Recipes
      const recipesPromise = recipes.map(async recipe => {
        recipe.img = await getImageRecipe(recipe.id);
  
        return recipe
      });
  
      const lastAdded = await Promise.all(recipesPromise);
      
      // === End
      return res.render('admin/recipes/index.njk', { recipes: lastAdded })
    } catch(error) {
      console.error(error)
    }
  },

  // === Método Create - Visualizar página ===
  async create(req, res) {
    try {
      // === Select Chefs
      const chefOptions = await Recipe.chefSelectOptions();
  
      // === End
      return res.render('admin/recipes/create.njk', { chefOptions })
    } catch(error) {
      console.error(error)
    }
  },

  // === Método POST - Ação ===
  async post(req, res) {
    try {
      req.body.user_id = req.session.userId

      // === Insert Recipe
      const recipeId = await Recipe.create(req.body);
      
      // === Insert Files
      //Guarda na variável filesPromises um array de promessas, no caso a inserção da imagem no banco
      const filesPromise = req.files.map(file => File.createFileRecipe({...file, recipe_id: recipeId}));
      //Espera a criação do arquivo para seguir em frente
      await Promise.all(filesPromise);
      
      // === End
      return res.redirect(`/admin/recipes/${recipeId}`)
    } catch(error) {
      console.error(error);
    }
  },

  // === Método Show - Visualizar página ===
  async show(req, res) {
    try {
      // === Select Recipes
      const recipe = await Recipe.find(req.params.id)  
  
      // === Select Files
      const results = await Recipe.files(recipe.id)
      const files = results.map(file => ({
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
  
      // === End
      return res.render('admin/recipes/show.njk', { recipe, files });
    } catch(error) {
      console.error(error)
    }
  },

  // === Método Edit - Visualizar página ===
  async edit(req, res) {
    try {
      // === Select Recipe
      const recipe = await Recipe.find(req.params.id);
  
      // === Select Chefs
      const chefOptions = await Recipe.chefSelectOptions();
  
      // === Select Files
      const results = await Recipe.files(recipe.id);

      // === Correction Recipes
      const files = results.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));
  
      return res.render('admin/recipes/edit.njk', { recipe, chefOptions, files })
    } catch(error) {
      console.error(error)
    }
  },

  // === Método PUT - Ação ===
  async put(req, res) {
    try {
      // === Insert Files
      //Verifico se existem imagens para serem cadastradas
      if(req.files.length != 0) {
        const newFilesPromise = req.files.map(file => File.createFileRecipe({
          ...file, 
          recipe_id: req.body.id
        }));
  
        await Promise.all(newFilesPromise);
      }
  
      // === Delete Files
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
  
      // === Update Files
      await Recipe.update(req.body);
  
      // === End
      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch(error) {
      console.error(error)
    }
  },

  // === Método DELETE - Ação ===
  async delete(req, res) {
    try {
      // === Delete Files
      await File.deleteRecipeAll(req.body.id);
      
      // === Delete Recipe
      await Recipe.delete(req.body.id);
      
      // === End
      return res.redirect('/admin/recipes');
    } catch(error) {
      console.error(error)
    }
  }
}