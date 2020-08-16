const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  //utilize as informações do seu servidor de e-mail
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "13f1b8ea6d6a5e",
    pass: "3637e0837a0b96"
  }
});