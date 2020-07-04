const db = require('../../config/db');

module.exports = {
  allRecipes(callback) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      ORDER BY rep.id
    `;

    db.query(query, function(error, results) {
      if(error) throw `Database SELECT RECIPES Error!${error}`;

      callback(results.rows);
    });
  },

  findRecipe(id, callback) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      WHERE rep.id = $1
      ORDER BY rep.title
    `;

    db.query(query, [id], function(error, results) {
      if(error) throw `Database SELECT RECIPE ID Error!${error}`

      callback(results.rows[0]);
    })
  },

  allChefs(callback) {
    const query = `
      SELECT che.*, count(rec.id) as total_recipes
      FROM chefs che
      LEFT JOIN recipes rec ON che.id = rec.chef_id
      GROUP BY che.id
      ORDER BY che.name
    `;

    db.query(query, function(error, results) {
      if(error) throw `Database SELECT CHEFS Error!${error}`
      
      callback(results.rows);
    });
  },

  paginate(params) {
    //Desconstruindo objeto "params"
    const { filter, limit, offset, callback } = params;

    //Iniciando as variável query em bracno, filter em branco e totalQuery como subquery
    let query = '',
        filterQuery = '',
        totalQuery = `(SELECT count(*) FROM recipes rep) AS total`;

    //Caso exista valor dentro do filter
    if(filter) {
      //A variável recebe parte da query
      filterQuery = `
        WHERE rep.title ILIKE '%${filter}%'
      `;

      //Subquery completada
      totalQuery = `
        (SELECT count(*) FROM recipes rep
        ${filterQuery}) AS total
      `;
    }

    //Query completa
    query = `
      SELECT *, ${totalQuery}
      FROM recipes rep
      ${filterQuery}
      ORDER BY rep.title LIMIT $1 OFFSET $2
    `;

    //Operação no banco de dados
    db.query(query, [ limit, offset ], function(error, results) {
      if(error) throw `Database PAGINATION Error!${error}`;
      callback(results.rows);
    });
  }
}