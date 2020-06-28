const recipes = document.querySelectorAll('.recipe');

for(let recipe of recipes) {
  //addEventListener é um ouvidor de eventos, nesse caso o evento de click
  recipe.addEventListener("click", function() {
    const id = recipe.getAttribute('id');
    window.location.href = `/receitas/${id}`
  });
}


// === Página de detalhes da receita ===
const hide = [
  document.querySelector('.hide1'), 
  document.querySelector('.hide2'),
  document.querySelector('.hide3')
];

const maximize = [
  document.querySelector('.ingredients'),
  document.querySelector('.steps'),
  document.querySelector('.information')
];


if(hide[0]){
  console.log(hide)
  hide[0].addEventListener('click', function() {

    if(maximize[0].classList.contains('maximize')) 
      maximize[0].classList.remove('maximize');
    else
      maximize[0].classList.add('maximize');
    
  });

  hide[1].addEventListener('click', function() {

    if(maximize[1].classList.contains('maximize'))
      maximize[1].classList.remove('maximize');
    else 
      maximize[1].classList.add('maximize');

  });

  hide[2].addEventListener('click', function() {

    if(maximize[2].classList.contains('maximize'))
      maximize[2].classList.remove('maximize');
    else
      maximize[2].classList.add('maximize');
      
  });
}

// === Página de criação de receita ===
//Novo ingrediente
function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

document
  .querySelector('.add-ingredient')
  .addEventListener("click", addIngredient);

//Novo passo de preparo
function addPreparation() {
  const preparations = document.querySelector("#preparations");
  const fieldContainer = document.querySelectorAll(".preparation");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  preparations.appendChild(newField);
}

document
  .querySelector('.add-preparation')
  .addEventListener("click", addPreparation);

// === Confiormação de delete ===
//Guarda todo o form-delete na variavel formDelete
const formDelete = document.querySelector('#form-delete')
//Quando for gerado um evento de submit dentro do form-delete ele entra na function
formDelete.addEventListener('submit', function(event) {
  //Mostra um popup de confirmação da exclusão
  const confirmation = confirm('Deseja deletar?')
  //Se a confirmação for cancelada ele interrompe o submit do botão deletar
  if(!confirmation) event.preventDefault()
})