// === Página de receitas ===
//Guarda na variável recipes todos so elementos que tiverem a classe .recipe
const recipes = document.querySelectorAll('.recipe');
//Percorre todos od elementos de recipes
for(let recipe of recipes) {
  //Fica ouvindo o click nos elementos dentro do recipe
  recipe.addEventListener("click", function() {
    //Guarda o id do elemento recipe na variável id
    const id = recipe.getAttribute('id');
    //Abre a página de detalhes da receita com base no id
    window.location.href = `/receitas/${id}`
  });
}


// === Página de detalhes da receita ===
//Guarda num array todos os campos com as classes solicitadas
const hide = [
  document.querySelector('#hide1'), 
  document.querySelector('#hide2'),
  document.querySelector('#hide3')
];

//Guarda num array todos os campos com as classes solicitadas
const maximize = [
  document.querySelector('.ingredients'),
  document.querySelector('.steps'),
  document.querySelector('.information')
];

/*Se o primeiro array não estiver vazio, entra no bloco de código, usado para não
interferir com os código abaixo */
if(hide[0]){ 
  //Percorre todo o array hide
  for(let i = 0; i < hide.length; i++) {
    //Fica ouvindo o click nos elementos dentro do hide
    hide[i].addEventListener('click', function() {
      //Se a classe maximize ja existir na posição do array "maximize"
      if(maximize[i].classList.contains('maximize')) {
        //A classe é removida
        maximize[i].classList.remove('maximize');
        document.getElementById(hide[i].id).innerHTML="ESCONDER";
      } else {
        //Se não ela é adicionada
        maximize[i].classList.add('maximize');
        document.getElementById(hide[i].id).innerHTML="MOSTRAR";
      }
    });
  }
}

// === Página de criação de receita ===
//Novo ingrediente ===
function addIngredient() {
  //Guarda na variável ingredients a div com id "ingredients"
  const ingredients = document.querySelector("#ingredients");
  //Guarda na variável fieldContainer todos as divs com a classe "ingredient"
  const fieldContainer = document.querySelectorAll(".ingredient");

  // Guarda na variável newField um clone do ultimo input do array fieldContainer
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona uma nova div ingredient se o último input tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do novo input da nova div ingredient vazio
  newField.children[0].value = "";
  //Adiciona a nova div e seu input na div de ingredients
  ingredients.appendChild(newField);
}

//Guarda na variável ingredients o botão "adicionar novo ingrediente"
const ingredients = document.querySelector('.add-ingredient')

//Se a variável não estiver fazia, entra no if, estratégia para não ocorrerem erros
if(ingredients)
  //Monitória o click no botão citado acima e, caso aja click, adicona a funcition addIngredient
  ingredients.addEventListener("click", addIngredient);

//Novo passo de preparo ===
function addPreparation() {
  //Guarda na variável preparations a div com id "preparations"
  const preparations = document.querySelector("#preparations");
  //Guarda na variável fieldContainer todos as divs com a classe "preparation"
  const fieldContainer = document.querySelectorAll(".preparation");

  // Guarda na variável newField um clone do ultimo input do array fieldContainer
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona uma nova div preparation se o último input tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do novo input da nova div preparation vazio
  newField.children[0].value = "";
  //Adiciona a nova div e seu input na div de preparations
  preparations.appendChild(newField);
}

//Guarda na variável preparation o botão "adicionar novo passo"
const preparation = document.querySelector('.add-preparation');

//Se a variável não estiver fazia, entra no if, estratégia para não ocorrerem erros
if(preparation)
  //Monitória o click no botão citado acima e, caso aja click, adicona a funcition addPreparation
  preparation.addEventListener("click", addPreparation);



// === Confirmação de delete ===
//Guarda todo o form-delete na variavel formDelete
const formDelete = document.querySelector('#form-delete')
//Quando for gerado um evento de submit dentro do form-delete ele entra na function
if(formDelete){
  formDelete.addEventListener('submit', function(event) {
    //Mostra um popup de confirmação da exclusão
    const confirmation = confirm('Deseja excluir esta receita?')
    //Se a confirmação for cancelada ele interrompe o submit do botão deletar
    if(!confirmation) event.preventDefault()
  })
}

// === Cor do menu na página atual - Admin ===
//location vem do obejto global window, assim como document, por isso posso usa-lo direto
//Será guardado na variável currentPage a rota selecionada, /instructors ou /members
const currentPage = location.pathname;
//Guarda na variável menuItems os links do menu
const menuItems = document.querySelectorAll('.content-admin .header .links-admin a');

//Percorre os items do menu
for(item of menuItems) {
  /*Caso dentro do currentPage tenha alguma string que seja igual ao href de algum dos links,
  ele entra no if */
  if(currentPage.includes(item.getAttribute('href'))) {
    //Adiciona a classe active ao a do menu
    item.classList.add('active');
  }
}

// === Cor do menu na página atual - Site ===
//location vem do obejto global window, assim como document, por isso posso usa-lo direto
//Será guardado na variável currentPage a rota selecionada, /instructors ou /members
const currentPageSite = location.pathname;
//Guarda na variável menuItems os links do menu
const menuItemsSite = document.querySelectorAll('.content-page header .links a');

//Percorre os items do menu
for(item of menuItemsSite) {
  /*Caso dentro do currentPage tenha alguma string que seja igual ao href de algum dos links,
  ele entra no if */
  if(currentPageSite.includes(item.getAttribute('href'))) {
    //Adiciona a classe active ao a do menu
    item.classList.add('active-site');
  }
}

// === Valida campos Forms ===
const validation = document.querySelector('.validation')
if(validation){
  validation.addEventListener('submit', function(event) {
    const inputs = document.querySelectorAll('.input')

    for(let i = 0; i < inputs.length; i++) {
      const x = document.getElementById(`empty${i}`)
      if(x) x.remove();
    }

    for(let i = 0; i < inputs.length; i++) {
      if(inputs[i].value == '') {
        const items = document.querySelectorAll('.inputs');
        items[i].innerHTML += `<p class="empty" id="empty${i}">* Campo obrigatório!</p>`
        items[i].children[1].value = '';
        event.preventDefault();
      }
    }
  });
}