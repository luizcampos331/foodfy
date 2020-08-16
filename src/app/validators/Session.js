const User = require('../models/User')
const { compare } = require('bcryptjs');

async function login(req, res, next) {
  const { email, password } = req.body

  try {
    // === Select User
    const user = await User.findOne({ where: {email} })

    // === Check User
    if(!user) return res.render('session/login.njk', {
      user: req.body,
      error: "Usuário não cadastrado!"
    })

    const passed = await compare(password, user.password)
  
    // === Check Password
    if(!passed) return res.render('session/login.njk', {
      user: req.body,
      error: 'Senha incorreta.'
    })

    // === Save data User
    req.user = user
    
    next()
  } catch(error) {
    console.error(error)
  }
}

async function forgot(req, res, next) {
  const { email } = req.body

  try {
    // === Select User
    let user = await User.findOne({ where: { email }})

    // === Check E-mail User
    if(!user) return res.render('session/forgot-password', {
      user: req.body,
      error: 'E-mail não cadastrado'
    })

    // === Save data User
    req.user = user

    next()
  } catch(error) {
    console.error(error)
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body

  try {
    // === Select User
    const user = await User.findOne({ where: {email} })

    // === Check E-mail User 
    if(!user) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: "Usuário não cadastrado!"
    })
    
    // === Check - Password = Password Repeat
    if(password != passwordRepeat) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Senha e repetição da senha são diferentes!'
    });

    // === Check Token 
    if(token != user.reset_token) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Token inválido! Solicite uma nova recuperação de senha.'
    })

    // === Check Expire Token
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render('session/password-reset.njk', {
      user: req.body,
      token,
      error: 'Token expirado! Solicite uma nova recuperação de senha.'
    })

    // === Save data User
    req.user = user

    next()
    
  } catch(error) {
    console.error(error)
  }
}

module.exports = {
  login,
  forgot,
  reset
}