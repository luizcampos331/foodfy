const db = require('../../config/db');
const { hash } = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  async all() {
    try{
      const results = await db.query('SELECT id, name, email, is_admin FROM users ORDER BY name')
      return results.rows
    } catch(error) {
      console.error(error)
    }
  },

  async findOne(filters) {
    let query = 'SELECT * FROM users';

    Object.keys(filters).map(key => {
      // WHERE | OR
      query = `${query} ${key}` // SELECT * FROM users WHERE ... OR ...

      Object.keys(filters[key]).map(field => {
        // email | cpf_cnpj
        query = `${query} ${field} = '${filters[key][field]}'` // SELECT * FROM users WHERE email = '...' OR cpf_cnpj = '...'
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },

  async create(data) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING password
      `;

      const password = crypto.randomBytes(5).toString('hex')

      const passwordHash = await hash(password, 8);
      
      const values = [
        data.name,
        data.email,
        passwordHash,
        data.is_admin
      ]

      await db.query(query, values);

      return password;
    } catch(error) {
      console.log(error);
    }
  },

  async update(id, fields) {
    try {
      let query = 'UPDATE users SET'

      Object.keys(fields).map((key, index, array) => {
        if((index + 1) < array.length) {
          query = `${query}
            ${key} = '${fields[key]}',
          `
        } else {
          //last iteration
          query = `${query}
            ${key} = '${fields[key]}'
            WHERE id = ${id}
          `
        }
      })
  
      await db.query(query)
  
      return
    } catch(error) {
      console.log(error);
    }


    /*try {
      const query = `
        UPDATE users SET
          name = $1,
          email = $2,
          is_admin = $3
        WHERE id = $4
      `

      const values = [
        data.name,
        data.email,
        data.is_admin,
        data.id
      ]

      return db.query(query, values)
      } catch(error) {
      console.log(error);
    }*/
  },

  delete(id) {
    return db.query('DELETE FROM users WHERE id = $1', [id])
  },

  async findRecipes(id) {
    try {
      const results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id])

      return results.rows
    } catch(error) {
      console.error(error)
    }
  }
}