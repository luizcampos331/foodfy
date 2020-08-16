const express = require('express');
const routes = express.Router();

// Controllers
const ProfileController = require('../app/controllers/ProfileController')
const UserController = require('../app/controllers/UserController')

// Validators
const UserValidator = require('../app/validators/User')

// Middlewares
const { onlyUsers } = require('../app/middlewares/session')

// Rotas = User
routes.get('/profile', onlyUsers, ProfileController.index) // users/show.njk
routes.put('/profile', UserValidator.put, ProfileController.put) // users/show.njk

// Rotas = Admin
routes.get('/users', onlyUsers, UserValidator.get, UserController.index) // users/index.njk
routes.get('/users/create', onlyUsers, UserValidator.get, UserController.create) // users/create.njk
routes.get('/users/:id/edit', onlyUsers, UserValidator.get, UserController.edit) // users/edit.njk
routes.post('/users', UserValidator.post, UserController.post) // users/create.njk
routes.put('/users', UserValidator.putAdmin, UserController.put) // users/edit.njk
routes.delete('/users', UserController.delete) // users/index.njk e users/edit.njk

module.exports = routes