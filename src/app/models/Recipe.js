const db = require('../../config/db');
const { date } = require('../../lib/util');

module.exports = {
  async all() {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      ORDER BY rep.created_at DESC
    `;

    const results = await db.query(query);
    return results.rows
  },

  async create(data) {
    const query = `
      INSERT INTO recipes(
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.user_id
    ];

    const result = await db.query(query, values)
    return result.rows[0].id
  },

  async find(id) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      WHERE rep.id = $1
      ORDER BY rep.title
    `;

    const result = await db.query(query, [id])
    return result.rows[0]
  },

  update(data) {
    const query = `
      UPDATE recipes SET
        chef_id = $1,
        title = $2,
        ingredients = $3,
        preparation = $4,
        information = $5
      WHERE id = $6
    `;

    const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ];

    return db.query(query, values)
  },

  delete(id) {
    //Operação no banco de dados
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
  },

  async chefSelectOptions() {
    const results = await db.query('SELECT id, name FROM chefs');
    return results.rows
  },

  async files(id) {
    const results = await db.query(`
      SELECT fi.* FROM files fi 
      LEFT JOIN recipe_files rec ON fi.id = rec.file_id 
      WHERE rec.recipe_id = $1
      `, [id]
    );

    return results.rows
  },
}