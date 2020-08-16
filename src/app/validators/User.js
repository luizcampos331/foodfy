const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for(key of keys) {
    if(body[key] == '' && key != 'password')
      return {
        user: body,
        error: 'Por favor, preencha todos os campos!'
      };
  }
}

async function get(req, res, next) {
  if(!req.session.isAdmin)
    return res.redirect('/admin/profile')

  next()
}

async function post(req, res, next) {
  // Check Fields
  const fillAllFields = checkAllFields(req.body);

  if(fillAllFields) {
    return res.render('admin/users/create.njk', fillAllFields)
  }

  let { email } = req.body

  // Select User
  const user = await User.findOne({
    where: { email }
  })

  // Check User
  if(user) return res.render('admin/users/create.njk', {
    user: req.body,
    error: 'Usuário já cadastrado!'
  });

  //Check Admin
  if(req.body.admin)
    req.body.is_admin = true
  else
    req.body.is_admin = false

  next();
}

async function putAdmin(req, res, next) {
  // Check Fields
  const fillAllFields = checkAllFields(req.body);

  if(fillAllFields) {
    return res.render('admin/users/create.njk', fillAllFields)
  }

  //Check Admin
  if(req.body.admin)
    req.body.is_admin = true
  else
    req.body.is_admin = false

  next();
}

async function put(req, res, next) {
  // Check Fields
  const fillAllFields = checkAllFields(req.body);

  if(fillAllFields) {
    return res.render('admin/users/profile.njk', fillAllFields)
  }
  
  // === Check if exits Password
  const { id, password } = req.body

  if(!password) return res.render('admin/users/profile.njk', {
    user: req.body,
    error: 'Coloque sua senha para atualizar seu cadastro.'
  })

  const user = await User.findOne({ where: {id} })

  const passed = await compare(password, user.password)

  if(!passed) return res.render('admin/users/profile.njk', {
    user: req.body,
    error: 'Senha incorreta.'
  })

  req.user = user
  
  next()
}

module.exports = {
  get,
  post,
  putAdmin,
  put
}