const multer = require('multer');

//Informações do arquivo
const storage = multer.diskStorage({
  //Pasta de destino
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  //Nome do arquivo
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`) //Data atual antes do nome
  }
});

//Formatos permitidos
const fileFilter = (req, file, cb) => {
  const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
  .find(acceptedFormat => acceptedFormat == file.mimetype);

  if(isAccepted) return cb(null, true);

  return cb(null, false);
}

module.exports = multer({
  storage,
  fileFilter
});