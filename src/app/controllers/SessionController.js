const User = require('../models/User')
const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')

module.exports = {
  loginForm(req, res) {
    return res.render('session/login.njk')
  },

  async login(req, res) {
    try {
      // === Save Data
      const { id, is_admin } = req.user
  
      // === Persist Data
      req.session.userId = id
      req.session.isAdmin = is_admin
  
      // === Check is Admin / End
      if(is_admin)
        return res.redirect('/admin/users')
      else
        return res.redirect('/admin/profile')
    } catch(error) {
      console.error(error);

      // === Error
      return res.render('session/login.njk', {
        user: req.body,
        error: 'Erro inesperado, tente novamente!'
      })
    }
  },

  logout(req, res) {
    req.session.destroy()

    return res.redirect('/')
  },

  forgotForm(req, res) {
    return res.render('session/forgot-password.njk')
  },

  resetForm(req, res) {
    return res.render('session/password-reset.njk', { token: req.query.token })
  },

  async forgot(req, res) {
    const user = req.user

    try {
      // === Create Token
      const token = crypto.randomBytes(20).toString('hex')

      // === Create Date Expire
      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      // === Update User - Token
      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })

      // === Send Email - Password Reset
      await mailer.sendMail({
        to: user.email,
        from: 'no_reply@launchstore.com.br',
        subject: 'Recuperação de e-mail',
        html: `
          <h2>Perdeu a senha?</h2>
          <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
          <p>
            <a href="http://localhost:5005/session/password-reset?token=${token}" taget="_blank">
              RECUPERAR SENHA
            </a>
          </p>
        `,
      })

      // === End
      return res.render('session/forgot-password.njk', {
        success: 'Verifique seu email para trocar a sua senha!'
      })
    } catch(error) {
      console.error(error)

      // === Error
      return res.render('session/forgot-password.njk', {
        error: 'Erro inesperado, tente novamente!'
      })
    }
  },

  async reset(req, res) {
    const { password, token } = req.body
    const user = req.user

    try {
      // === Create New Password
      const newPassword = await hash(password, 8)

      // === Update User
      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      })

      // === End
      return res.render('session/login.njk', {
        user: req.body,
        success: 'Senha atualizada! Faça o seu login.'
      })

    } catch(error) {
      console.error(error);

      // === Error
      return res.render('session/password-reset.njk', {
        user: req.body,
        token,
        error: 'Erro inesperado, tente novamente!'
      })
    }
  }
}