const db = require('../../config/db');
const { date } = require('../../lib/util');

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM chefs ORDER BY id`, function(error, results) {
      if(error) throw `Database ALL Error!${error}`;

      callback(results.rows);
    });
  },

  create(data, callback) {
    const query = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [
      data.name,
      data.avatar_url,
      date(Date.now()).iso,
    ];

    db.query(query, values, function(error, results) {
      if(error) `Database CREATE Error!${error}`;

      callback(results.rows[0]);
    })
  },

  find(id, callback) {
    const query = `
      SELECT che.*, count(rec.id) as total_recipes
      FROM chefs che
      LEFT JOIN recipes rec ON che.id = rec.chef_id
      WHERE che.id = $1
      GROUP BY che.id
      ORDER BY che.name
    `;
    db.query(query, [id], function(error, results){
      if(error) throw `Database FIND Error!${error}`;

      callback(results.rows[0]);
    });
  },

  findRecipes(id, callback) {
    db.query(`SELECT * FROM recipes WHERE chef_id = $1`, 
      [id], 
      function(error, results) {
        if(error) throw `Database FIND RECIPES Error!${error}`;

        callback(results.rows);
    });
  },

  update(data, callback) {
    const query = `
      UPDATE chefs SET
        name = $1,
        avatar_url = $2
      WHERE id = $3
    `;

    const values = [
      data.name,
      data.avatar_url,
      data.id
    ];

    db.query(query, values, function(error, results) {
      if(error) throw `Database UPDATE Error!${error}`;

      callback();
    })
  },

  delete(id, callback) {
    db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(error, results) {
      if(error) throw `Database DELETE Error!${error}`;

      callback();
    });
  }
}