const db = require('../../config/db');
const fs = require('fs');

module.exports = {
  //usar {} no caso de os dados separem tratados antes da passagem para cá
  async createRecipe({filename, path, recipe_id}) {
    let query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

    let values = [
      filename,
      path,
    ];

    const results = await db.query(query, values);

    query = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
    `;

    values = [
      recipe_id,
      results.rows[0].id
    ];

    return db.query(query, values);
  }, 

  createChef(data) {
    const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

    const values = [
      data[0].filename,
      data[0].path
    ];

    return db.query(query, values);
  },

  async deleteRecipe(id) {
    try {
      let results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = results.rows[0];
      //Remove o arquivo pelo caminho = path
      fs.unlinkSync(file.path);

      await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [results.rows[0].id])
      
      return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch(error) {
      console.log(error);
    }
  },

  async deleteChef(id) {
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = results.rows[0];
      //Remove o arquivo pelo caminho = path
      fs.unlinkSync(file.path);
      
      return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch(error) {
      console.log(error);
    }
  },

  async deleteRecipeAll(id) {
    try {
      let query = `
        SELECT fi.* 
        FROM files fi
        LEFT JOIN recipe_files rec ON fi.id = rec.file_id
        WHERE rec.recipe_id = $1
      `;

      let results = await db.query(query, [id]);
      const files = results.rows;

      for(file of files) {
        //Remove o arquivo pelo caminho = path
        fs.unlinkSync(file.path);

        await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [file.id])
      
        await db.query(`DELETE FROM files WHERE id = $1`, [file.id]);
      }

      return

    } catch(error) {
      console.log(error);
    }
  },
}