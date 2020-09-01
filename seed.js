const { hash } = require('bcryptjs')
const faker = require('faker')

const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const Chef = require('./src/app/models/Chef')
const File = require('./src/app/models/File')

let usersIds = []
let chefsIds = []
let filesIds = []
let recipesIds = []
let totalRecipes = 5
let totalChefs = 1

async function createUsers() {
  const users = []
  const password = await hash('123', 8)

  while (users.length < 1) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin: true
    })
  }

  const usersPromise = users.map(user => User.create(user))

  usersIds = await Promise.all(usersPromise)
}

async function createChefs() {
  let files = []

  while(files.length < totalChefs) {
    files.push({
      filename: faker.image.image(),
      path: `public/images/placeholder-chef.jpeg`,
    })
  }
  
  filesIds = await File.createFileChef(files)
  
  let chefs = []

  while(chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.title(),
      file_id: filesIds,
    })
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef))
  chefsIds = await Promise.all(chefsPromise) 
}

async function createRecipes() {
  let recipes = []

  while(recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[0],
      title: faker.name.title(),
      ingredients: [faker.name.title(), faker.name.title(), faker.name.title()],
      preparation: [faker.name.title(), faker.name.title(), faker.name.title()],
      information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
      user_id: usersIds[0],
    })
  }

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
  recipesIds = await Promise.all(recipesPromise)

  let files = []
  let count = 0

  while(files.length < totalRecipes) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder-recipe.png`,
      recipe_id: recipesIds[count]
    })

    count++
  }

  const filesPromise = files.map(file => File.createFileRecipe({
    filename: file.name,
    path: file.path,
    recipe_id: file.recipe_id
  }))
  filesIds = await Promise.all(filesPromise)
}

async function init() {
  await createUsers()
  await createChefs()
  await createRecipes()
}

init()