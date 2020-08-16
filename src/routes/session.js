const express = require('express');
const routes = express.Router();

// Controllers
const SessionController = require('../app/controllers/SessionController')

// Validators
const SessionValidator = require('../app/validators/Session')

// Middlewares
const { isLoggedRedirectToUsers } = require('../app/middlewares/session')

// Rotas = Login
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// Rotas = Forgot/Reset
routes.get('/forgot-password', isLoggedRedirectToUsers, SessionController.forgotForm);
routes.get('/password-reset', isLoggedRedirectToUsers, SessionController.resetForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

module.exports = routes