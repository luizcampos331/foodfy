const db = require('../../config/db');
const { date } = require('../../lib/util');

module.exports = {
  all() {
    const query = `
      SELECT DISTINCT ON (rep.title) rep.*, fi.path as path, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      LEFT JOIN recipe_files rec ON rep.id = rec.recipe_id
      LEFT JOIN files fi ON rec.file_id = fi.id
      ORDER BY rep.title
    `;

    return db.query(query);
  },

  create(data) {
    const query = `
      INSERT INTO recipes(
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.author,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    return db.query(query, values)
  },

  find(id) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      WHERE rep.id = $1
      ORDER BY rep.title
    `;

    return db.query(query, [id])
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
      data.author,
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

  chefSelectOptions() {
    return db.query('SELECT id, name FROM chefs');
  },

  files(id) {
    return db.query(`
      SELECT fi.* FROM files fi 
      LEFT JOIN recipe_files rec ON fi.id = rec.file_id 
      WHERE rec.recipe_id = $1
      `, [id]
    );
  },
}