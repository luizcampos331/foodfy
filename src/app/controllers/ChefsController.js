const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    try {
      // === Select Chefs
      const chefs = await Chef.all()
  
      // === Select Files
      async function getImageChef(chefId) {
        let files = await Chef.files(chefId)
        files = `${req.protocol}://${req.headers.host}${files.path.replace('public', '')}`;
  
        return files;
      }
      
      // === Correction Chefs
      const chefsPromise = chefs.map(async chef => {
        chef.img = await getImageChef(chef.id);
  
        return chef
      });
  
      const lastAdded = await Promise.all(chefsPromise);
  
      // === End
      return res.render('admin/chefs/index', { chefs: lastAdded });
    } catch(error) {
      console.error(error)
    }
  },

  create(req, res) {
    //Retorna a página de criação de chefs
    return res.render('admin/chefs/create');
  },

  async post(req, res) {
    try {
      // === Insert File
      const fileId = await File.createFileChef(req.files);
  
      // === Insert Chef
      const chefId = await Chef.create(req.body, fileId)
  
      // === End
      return res.redirect(`/admin/chefs/${chefId}`);
    } catch(error) {
      console.error(error)
    }
  },

  async show(req, res) {
    try {
      // === Select Chef
      const chef = await Chef.find(req.params.id);
  
      // === Select File Chef
      async function getImageChef(chefId) {
        let files = await Chef.files(chefId)
        files = `${req.protocol}://${req.headers.host}${files.path.replace('public', '')}`;
  
        return files;
      }
  
      // === Correction Chef
      chef.img = await getImageChef(chef.id);
  
      // === Select Recipes
      const recipes = await Chef.findRecipes(req.params.id);
  
      // === Select Files Recipes
      async function getImageRecipe(recipeId) {
        const results = await Chef.filesRecipe(recipeId)
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
      return res.render('admin/chefs/show', { chef, recipes: lastAdded })
    } catch(error) {
      console.error(error)
    }
  },

  async edit(req, res) {
    try {
      // === Select Chef
      const chef  = await Chef.find(req.params.id);
  
      // === Select File
      const file = await Chef.files(chef.id);
  
      // === Correction Recipes
      if(file)
        file.path = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
  
      // === End
      return res.render('admin/chefs/edit', { chef, file })
    } catch(error) {
      console.error(error)
    }
  },

  async put(req, res) {
    try {
      if(req.files.length == 0) {
        // === Update Chef
        await Chef.update(req.body, req.body.photo_id);
      } else {
        // === Insert File
        const fileId = await File.createFileChef(req.files);
  
        // === Update Chef
        await Chef.update(req.body, fileId);
  
        const removedFiles = req.body.removed_files.split(',');
        if(removedFiles) {
            
          // === Delete File
          await File.deleteChef(removedFiles[0]);
        }
      }
  
      //Redirecio para página de detalhes do chef
      return res.redirect(`/admin/chefs/${req.body.id}`);
    } catch(error) {
      console.error(error)
    }
  },

  async delete(req, res) {
    try {
      // === Select chef
      const chef = await Chef.find(req.body.id);
  
      // === Delete Chef
      await Chef.delete(req.body.id);
  
      // === Delete File
      await File.deleteChef(chef.file_id);
  
      // === End
      return res.redirect('/admin/chefs');
    } catch(error) {
      console.error(error)
    }
  }
}