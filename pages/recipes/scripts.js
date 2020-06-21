/*
* Criação da variavel modalOverlay
* document.querySelector = seleciona um objeto em especifico do documento
* Objeto selecionado será o .modal-overlay baseado no seletor css
*/
const modalOverlay = document.querySelector('.modal-overlay');
/*
* Criação da variavel cards
* document.querySelectorAll = seleciona todos os objeto especificados do documento
* Objetos selecionados serão os .card baseado no seletor css
*/
const recipes = document.querySelectorAll('.recipe');

for(let recipe of recipes) {
  //addEventListener é um ouvidor de eventos, nesse caso o evento de click
  recipe.addEventListener("click", function() {
    const recipeImg = recipe.querySelector('img').getAttribute('src')
    const recipeName = recipe.querySelector('.name').innerHTML;
    const recipeAuthor = recipe.querySelector('.author').innerHTML;

    console.log(`url(../../assets/${recipeImg})`)
    //Adicionando o "active" a lista de classes do modalOverlay
    modalOverlay.classList.add('active');
    
    modalOverlay.querySelector('.image').style.backgroundImage = `url(../../${recipeImg})`
    modalOverlay.querySelector('.name').innerHTML = recipeName
    modalOverlay.querySelector('.author').innerHTML = recipeAuthor
  });
}
//addEventListener é um ouvidor de eventos, nesse caso o evento de click
document.querySelector('.close').addEventListener("click", function() {
  //Removendo o "active" a lista de classes do modalOverlay
  modalOverlay.classList.remove('active');
});