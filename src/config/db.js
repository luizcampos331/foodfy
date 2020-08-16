//Guarda a autorização de um usuário para executar querys
const { Pool } = require('pg');

//Configurações de acesso ao banco de dados
module.exports = new Pool({
  user: 'luiz',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'foodfy'
});

//Inicie o PostgreSQL antes de iniciar o sistema
//pg_ctl -D /usr/local/var/postgres start