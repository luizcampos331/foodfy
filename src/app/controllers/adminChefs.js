const Chef = require('../models/AdminChef');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    //await espera a resolução da Promise "Chef.all()", assim que recebe a resposta
    //Caso tudo tenha dado certo, guarda o valor da resposta em "results"
    let results = await Chef.all()
    //Guarda em chef as linhas da resposta anterior, formando um array
    const chefs = results.rows;

    //For para percorrer as posição do array de "chefs"
    for(chef of chefs) {
      //Espera a resolução da promise e guarda o valor caso tenha dado certo
      results = await Chef.files(chef.id);

      //Percorre o array e adiciona um novo campo para cada posição
      const files = results.rows.map(file => ({
        //src receberá o caminho "URL" da imagem para ser apresentada
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
      }));

      //Se tiver valor na primeira posição de files
      if(files[0])
        chef.path = files[0].src //Path é reescrito com o caminho da imagem
    }

    //Retorna a página de chefs renderizada com os valores
    return res.render('admin/chefs/index', { chefs });
  },

  create(req, res) {
    //Retorna a página de criação de chefs
    return res.render('admin/chefs/create');
  },

  async post(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array de keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }

    //Verifico se existe pelo menos uma imagem
    if(req.files.length == 0) {
      return res.send('Pelo menos uma foto!')
    }

    //Espera a resolução da promise e guarda o valor caso tenha dado certo
    let results = await File.createChef(req.files);
    //Guarda a primeira posição dos resultados em "avatar"
    const avatar = results.rows[0];

    //Espera a resolução da promise e guarda o valor caso tenha dado certo
    results = await Chef.create(req.body, avatar.id)
    //Guarda a primeira posição dos resultados em "chef"
    const chef = results.rows[0];

    //Redireciona para páfina de detalhes de chef
    return res.redirect(`/admin/chefs/${chef.id}`);
  },

  async show(req, res) {
    // === Verificações ===
    if(isNaN(parseInt(req.params.id, 10)))
    {
      return res.status(404).render("admin/not-found");
    }

    // === GET CHEFS ===
    let results = await Chef.find(req.params.id);
    const chef = results.rows[0];

    if(!chef) return res.status(404).render("admin/not-found");

    // GET IMAGE CHEF
    async function getImageChef(chefId) {
      let results = await Chef.files(chefId)
      const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

      return files[0];
    }

    chef.img = await getImageChef(chef.id);

    // === GET RECIPES ===
    results = await Chef.findRecipes(req.params.id);
    const recipes = results.rows;

    // GET IMAGE RECIPE
    async function getImageRecipe(recipeId) {
      let results = await Chef.filesRecipe(recipeId)
      const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

      return files[0];
    }
    
    const recipesPromise = recipes.map(async recipe => {
      recipe.img = await getImageRecipe(recipe.id);

      return recipe
    });

    const lastAdded = await Promise.all(recipesPromise);
    
    // === Renderiza a página de petalhes do chef
    return res.render('admin/chefs/show', { chef, recipes: lastAdded })
  },

  async edit(req, res) {
    //Verifica se o id é numérico
    if(isNaN(parseInt(req.params.id, 10)))
    {
      //Caso não seja, renderiza a página de erro
      return res.status(404).render("admin/not-found");
    }
    
    //Espera a resolução da promise e guarda o valor caso tenha dado certo
    let results = await Chef.find(req.params.id);
    //Guarda a primeira posição dos resultados em "chef"
    const chef = results.rows[0];

    //Verifica se chef posui algum valor
    if(!chef) return res.status(404).render("admin/not-found");

    // GET Images
    results = await Chef.files(chef.id);
    const file = results.rows[0];
    if(file)
      file.path = `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;

    //Renderiza página de edição de chef
    return res.render('admin/chefs/edit', { chef, file })
  },

  async put(req, res) {
    //Variável keys recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "" && key != "removed_files")
        return res.send('Please, fill all fields!');
    }

    //Verifica se existe alguma foto ja cadastrada ou para serem cadastrada
    if(!req.body.photo_id && req.files.length == 0) 
      return res.send('Uma foto pelo menos!');

    //Verifica se existem imagens para serem cadastradas
    if(req.files.length != 0) {
      //Espera a resolução da promise e guarda o valor caso tenha dado certo
      const results = await File.createChef(req.files);
      //Guarda a primeira posição dos resultados em "avatar"
      const avatar = results.rows[0];

      //Espera a resolução da promise
      await Chef.update(req.body, avatar.id);

      //Verifico se o input removed_files existe
      if(req.body.removed_files) {
        //Cria um array separando as posições baseado nas virgulas
        const removedFiles = req.body.removed_files.split(',');
        
        //Espera a resolução da promise
        await File.deleteChef(removedFiles[0]);
      }
    } else {
      //Espera a resolução da promise e guarda o valor caso tenha dado certo
      const results = await Chef.find(req.body.id)
      //Guarda a primeira posição dos resultados em "avatar"
      const avatar = results.rows[0]

      //Espera a resolução da promise
      await Chef.update(req.body, avatar.id);
    }

    //Redirecio para página de detalhes do chef
    return res.redirect(`/admin/chefs/${req.body.id}`);
  },

  async delete(req, res) {
    //Espera a resolução da promise e guarda o valor caso tenha dado certo
    let results = await Chef.findRecipes(req.body.id)
    //Guarda a primeira posição dos resultados em "recipe"
    const recipe = results.rows[0];

    //Se existirem receitas vinculadas ao chef
    if(recipe) return res.send('Chefs com receitas vinculadas!');

    //Espera a resolução da promise e guarda o valor caso tenha dado certo
    results = await Chef.find(req.body.id);
    //Guarda a primeira posição dos resultados em "chef"
    const chef = results.rows[0];

    //Espera a resolução da promise
    await Chef.delete(req.body.id);

    //Espera a resolução da promise
    await File.deleteChef(chef.file_id);

    //Redirecina para página de chefs
    return res.redirect('/admin/chefs');
  }
}