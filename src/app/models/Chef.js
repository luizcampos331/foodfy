const db = require('../../config/db');
const { date } = require('../../lib/util');

module.exports = {
  async all() {
    const query = `
      SELECT che.*, fi.path as path 
      FROM chefs che
      LEFT JOIN files fi ON che.file_id = fi.id
      ORDER BY che.name
    `;
    const results = await db.query(query);
    return results.rows
  },

  async create(data, file_id) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;

    const values = [
      data.name,
      file_id
    ];

    const results = await db.query(query, values);
    return results.rows[0].id
  },

  async find(id) {
    const query = `
      SELECT che.*, count(rec.id) AS total_recipes
      FROM chefs che
      LEFT JOIN recipes rec ON che.id = rec.chef_id
      WHERE che.id = $1
      GROUP BY che.id
      ORDER BY che.name
    `;
    const results = await db.query(query, [id]);
    return results.rows[0]
  },

  update(data, file_id) {
    const query = `
      UPDATE chefs SET
        name = $1,
        file_id = $2
      WHERE id = $3
    `;

    const values = [
      data.name,
      file_id,
      data.id
    ];

    return db.query(query, values);
  },

  delete(id) {
    return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
  },

  async files(id) {
    const query = `
      SELECT fi.* 
      FROM files fi 
      LEFT JOIN chefs che ON che.file_id = fi.id
      WHERE che.id = $1
    `;

    const results = await db.query(query, [id]);
    return results.rows[0]
  },

  async filesRecipe(id) {
    const query = `
      SELECT fi.*
      FROM files fi
      LEFT JOIN recipe_files rec ON fi.id = rec.file_id
      WHERE rec.recipe_id = $1
    `;

    const results = await db.query(query, [id]);
    return results.rows
  },

  async findRecipes(id) {
    const query = `
      SELECT *
      FROM recipes
      WHERE chef_id = $1
      ORDER BY created_at DESC
    `;
    const results = await db.query(query, [id]);
    return results.rows
  },
}