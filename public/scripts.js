/*
* Criação da variavel modalOverlay
* document.querySelector = seleciona um objeto em especifico do documento
* Objeto selecionado será o .modal-overlay baseado no seletor css
*/
/*
* Criação da variavel cards
* document.querySelectorAll = seleciona todos os objeto especificados do documento
* Objetos selecionados serão os .card baseado no seletor css
*/
const recipes = document.querySelectorAll('.recipe');

for(let recipe of recipes) {
  //addEventListener é um ouvidor de eventos, nesse caso o evento de click
  recipe.addEventListener("click", function() {
    const id = recipe.getAttribute('id');
    console.log(id)
    window.location.href = `/receitas/${id}`
  });
}

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