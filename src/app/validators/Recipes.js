const Recipe = require('../models/Recipe')
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
    if((body[key] == '' && key != "information" && key != "removed_files") || body[key] == 'Selecione um chef') {
      
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
  const userId = req.session.userId
  
  const recipe = await Recipe.find(req.params.id)

  if(userId != recipe.user_id)
    return res.redirect('/admin/recipes')

  next()
}

async function post(req, res, next) {
  const chefOptions = await Recipe.chefSelectOptions()
  
  // check image
  const zeroImage = checkFile(req.files);

  if(zeroImage) {
    return res.render('admin/recipes/create.njk', {
      recipe: req.body,
      chefOptions,
      error: zeroImage
    })
  }
  
  //check inputs
  const fillAllFields = checkAllFields(req.body, req.files);

  if(fillAllFields) {
    return res.render('admin/recipes/create.njk', {
      recipe: req.body,
      chefOptions,
      error: fillAllFields
    })
  }
  
  next()
}

async function show(req, res, next) {
  const recipe = await Recipe.find(req.params.id)

  if(isNaN(parseInt(req.params.id, 10)))
    return res.status(404).render("admin/not-found")

  if(!recipe) return res.status(404).render("admin/not-found")

  next()
}

async function put(req, res, next) {
  // === Select Files
  const chefOptions = await Recipe.chefSelectOptions()

  // === Select Files
  const results = await Recipe.files(req.body.id);
  const files = results.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
  }));

  // check image
  const zeroImage = checkFilePut(req.body, req.files);

  if(zeroImage) {
    return res.render('admin/recipes/edit.njk', {
      recipe: req.body,
      chefOptions,
      error: zeroImage
    })
  }
  
  //check inputs
  const fillAllFields = checkAllFields(req.body, req.files);

  if(fillAllFields) {
    return res.render('admin/recipes/edit.njk', {
      recipe: req.body,
      files,
      chefOptions,
      error: fillAllFields
    })
  }

  next()
}

module.exports = {
  get,
  post,
  show,
  put
}