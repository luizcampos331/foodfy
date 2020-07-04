const db = require('../../config/db');
const { date } = require('../../lib/util');

module.exports = {
  all(callback) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      ORDER BY rep.id
    `;

    db.query(query, function(error, results) {
      if(error) throw `Database SELECT Error!${error}`;

      callback(results.rows);
    });
  },

  create(data, callback) {
    const query = `
      INSERT INTO recipes(
        chef_id,
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      data.author,
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso,
    ];

    db.query(query, values, function(error, results) {
      if(error) throw `Database INSERT Error!${error}`

      callback(results.rows[0]);
    })
  },

  find(id, callback) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      WHERE rep.id = $1
      ORDER BY rep.title
    `;

    db.query(query, [id], function(error, results) {
      if(error) throw `Database SELECT ID Error!${error}`

      callback(results.rows[0]);
    })
  },

  update(data, callback) {
    const query = `
      UPDATE recipes SET
        chef_id = $1,
        image = $2,
        title = $3,
        ingredients = $4,
        preparation = $5,
        information = $6
      WHERE id = $7
    `;

    const values = [
      data.author,
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ];

    db.query(query, values, function(error, results) {
      if(error) throw `Datasabe UPDATE Error!${error}`

      callback();
    })
  },

   // === DELETE id ===
   delete(id, callback) {
    //Operação no banco de dados
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(error) {
      if(error) throw `Database DELETE Id Error!${error}`;

      callback();
    })
  },

  chefSelectOptions(callback) {
    db.query(`SELECT id, name FROM chefs`, function(error, results) {
      if(error) throw `Database CHEFS Error!${error}`;

      callback(results.rows);
    });
  }
}