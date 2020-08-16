const User = require('../models/User')

module.exports = {
  async index(req, res) {
    try {
      const id = req.session.userId
      const user = await User.findOne({ where: { id }})

      return res.render('admin/users/profile.njk', { user })
    } catch(error) {
      console.error(error)
    }
  },

  async put(req, res) {
    try {
      const { id, name, email } = req.body
      await User.update(id, {
        name,
        email
      })

      return res.render('admin/users/profile.njk', {
        user: req.body,
        success: 'Atualizado com sucesso!'
      })
    } catch(error) {
      console.error(error)
    }
  }
}