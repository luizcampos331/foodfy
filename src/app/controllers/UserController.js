const User = require('../models/User')
const File = require('../models/File')
const Recipe = require('../models/Recipe')
const mailer = require('../../lib/mailer')

module.exports = {
  async index(req, res) {
    try {
      // === Select Chefs
      const users = await User.all()
  
      // === End
      return res.render('admin/users/index.njk', { users })
    } catch(error) {
      console.error(error)
    }
  },

  create(req, res) {
    return res.render('admin/users/create.njk')
  },

  async post(req, res) {
    try {
      // === Create Chef
      const password = await User.create(req.body);

      // === Send Email = Password
      await mailer.sendMail({
        to: req.body.email,
        from: 'no_reply@foodfy.com.br',
        subject: 'Nova conta - Foodfy',
        html: `
          <h2>Acesse sua conta!</h2>
          <p>Olá, o administrador do Foodfy criou uma nova conta para você!</p>
          <p>E-mail: ${req.body.email}</p>
          <p>Senha: ${password}</p>
        `,
      })
    
      // === End
      return res.redirect('/admin/users');
    } catch(error) {
      console.error(error)
    }
  },

  async edit(req, res) {
    try {
      // === Select Chef
      const id = req.params.id
      const user = await User.findOne({ where: { id } })
      
      // === End
      return res.render('admin/users/edit.njk', { user })
    } catch(error) {
      console.error(error)
    }
  },

  async put(req, res) {
    try {
      const { id, name, email, is_admin } = req.body
      // === Update Chef
      await User.update(id, {
        name,
        email,
        is_admin
      })

      // === End
      return res.render('admin/users/edit.njk', { 
        user: req.body,
        success: 'Atualizado com sucesso!'
      })
    } catch(error) {
      console.log(error)
    }
  },

  async delete(req, res) {
    try {
      // === Select Recipes
      const recipes = await User.findRecipes(req.body.id)

      // === Delete Files
      const deleteFilesPromise = recipes.map(recipe => File.deleteRecipeAll(recipe.id));
      await Promise.all(deleteFilesPromise);

      // === Delete Recipe
      const deleteRecipesPromise = recipes.map(recipe => Recipe.delete(recipe.id));
      await Promise.all(deleteRecipesPromise);
      
      // === Delete User
      await User.delete(req.body.id)

      // === End
      return res.redirect(`/admin/users`)

    } catch(error) {
      console.log(error)
    }
  }
}