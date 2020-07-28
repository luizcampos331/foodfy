const db = require('../../config/db');

module.exports = {
  allRecipes() {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      ORDER BY rep.updated_at
    `;

    return db.query(query);
  },

  findRecipe(id) {
    const query = `
      SELECT rep.*, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      WHERE rep.id = $1
      ORDER BY rep.title
    `;

    return db.query(query, [id]);
  },

  allChefs() {
    const query = `
      SELECT che.*, count(rec.id) as total_recipes
      FROM chefs che
      LEFT JOIN recipes rec ON che.id = rec.chef_id
      GROUP BY che.id
    `;

    return db.query(query)
  },

  fileChefs(file_id) {
    return db.query(`SELECT path FROM files WHERE id = $1`, [file_id]);
  },

  paginate(params) {
    //Desconstruindo objeto "params"
    const { filter, limit, offset } = params;

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
      SELECT rep.*, ${totalQuery}, che.name as author
      FROM recipes rep
      LEFT JOIN chefs che ON rep.chef_id = che.id
      ${filterQuery}
      ORDER BY rep.updated_at LIMIT $1 OFFSET $2
    `;

    //Operação no banco de dados
    return db.query(query, [ limit, offset ]);
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