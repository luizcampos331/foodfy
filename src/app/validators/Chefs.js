const Chef = require('../models/Chef')
const fs = require('fs')

function checkFile(files) {
  if(files.length < 1) return 'Por favor, envie pelo menos uma foto!'
}

function checkFilePut(body, files) {
  if(!body.photo_id && files.length == 0) return 'Por favor, envie pelo menos uma foto!'
}

function checkAllFields(body, files) {  

  //Variável keys recebendo um array com todos os campos do formulário
  const keys = Object.keys(body);

  //Percorrendo o array keys
  for(key of keys) {
    if(body[key] == '' && key != 'removed_files') {
      
      //Deleta a imagem
      for(file of files) {
        //Remove o arquivo pelo caminho = path
        fs.unlinkSync(file.path);
      }

      return 'Por favor, preencha todos os campos com ( * )'
    }
  }
}

async function get(req, res, next) {
  if(!req.session.isAdmin)
    return res.redirect('/admin/chefs')

  next()
}

async function post(req, res, next) {  
  //check inputs
  const fillAllFields = checkAllFields(req.body, req.files);

  if(fillAllFields) {
    return res.render('admin/chefs/create.njk', {
      chef: req.body,
      error: fillAllFields
    })
  }

  // check image
  const zeroImage = checkFile(req.files);

  if(zeroImage) {
    return res.render('admin/chefs/create.njk', {
      chef: req.body,
      error: zeroImage
    })
  }
  
  next()
}

async function show(req, res, next) {
  const chef = await Chef.find(req.params.id)

  if(isNaN(parseInt(req.params.id, 10)))
    return res.status(404).render("admin/not-found")

  if(!chef) return res.status(404).render("admin/not-found")

  next()
}

async function put(req, res, next) {
  // === Select Files
  const file = await Chef.files(req.body.id);
  file.path = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

  //check inputs
  const fillAllFields = checkAllFields(req.body, req.files);

  if(fillAllFields) {
    return res.render('admin/chefs/edit.njk', {
      chef: req.body,
      file,
      error: fillAllFields
    })
  }

  // check image
  const zeroImage = checkFilePut(req.body, req.files);

  if(zeroImage) {
    return res.render('admin/chefs/edit.njk', {
      chef: req.body,
      error: zeroImage
    })
  }

  next()
}

async function del(req, res, next) {
  // === Select Recipes
  const recipe = await Chef.findRecipes(req.body.id)

  // === Select Chef
  const chef = await Chef.find(req.body.id)

  // === Select Files
  const file = await Chef.files(req.body.id);
  file.path = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

  if(recipe[0]) return res.render('admin/chefs/edit.njk', {
    chef,
    file,
    error: 'O chef não pode ser deletado, há receitas vinculadas a ele!'
  });

  next()
}

module.exports = {
  get,
  post,
  show,
  put,
  del
}