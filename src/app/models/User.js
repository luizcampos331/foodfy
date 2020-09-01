const db = require('../../config/db');
const { hash } = require('bcryptjs');
const crypto = require('crypto');

const Base = require('./Base')

Base.init({ table: 'users'})

module.exports = {
  ...Base,

  async findRecipes(id) {
    try {
      const results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [id])

      return results.rows
    } catch(error) {
      console.error(error)
    }
  }
}