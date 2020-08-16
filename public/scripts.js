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
    const confirmation = confirm('Tem certeza que deseja excluir? Esta operação não poderá ser desfeita!')
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

// === Paginação ===
function paginate(selectedPage, totalPages) {
  let pages = [],
      oldPage

  for(let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage -2;

    if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
      if(oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if(oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages
}

function createPagination(pagination) {
  //Pega o valor de filter
  const filter = pagination.dataset.filter;
  //Pega o valor de page
  const page = +pagination.dataset.page;
  //Pega o valor de total
  const total = +pagination.dataset.total;
  //Recebe a paginação na variável pages
  const pages = paginate(page, total);

  let elements = '';

  //Caso tenha mais de uma página
  if(pages.length > 1) {
    //Percorre todas as posições de pages
    for(let page of pages) {
      //Caso o page inclua os pontos ...
      if(String(page).includes('...')){
        //Variável recebe SPAN
        elements += `<span>${page}</span>`;
      } else {
        if(filter) {
          elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
        }
        else {
          elements += `<a href="?page=${page}">${page}</a>`;
        }
      }
    }
    //Caso seja somente uma página
  } else {
    if(filter) {
      elements += `<a href="?page=${pages}&filter=${filter}">${page}</a>`;
    }
    else {
      elements += `<a href="?page=${pages}">${pages}</a>`;
    }
  }

  //Adiciona ao HTML
  pagination.innerHTML = elements
}

//Guarda div de paginação
const pagination = document.querySelector('.pagination');

if(pagination) {
  createPagination(pagination);
}


// === Imagens das Receitas ===
const PhotosUpload = {
  input: '',
  preview: document.querySelector('#photos-preview'),
  previewAvatar: document.querySelector('.photos-preview-avatar'),
  uploadLimit: 5,
  avatarLimit: 1,
  files: [],

  handleFileInput(event) {
    //Extraindo os arquivos de input e chamando-os de "fileList"
    const { files: fileList } = event.target;
    //Input recebe o input de arquivos
    PhotosUpload.input = event.target;

    //Se o retorno for true ele retorna a função e não procegue com o código
    if(PhotosUpload.hasLimit(event)) return

    //Transformando o fileList em um array e percorrendo ele com forEach
    //file => é um arrow function, pode ser usado no lugar de uma function
    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)

      //Variável para ver arquivos
      const reader = new FileReader();

      //Será executado quando terminar de ler os arquivos
      reader.onload = () => {
        const image = new Image(); //Criação de tag <img>
        image.src = String(reader.result);
        
        let div = '';

        if(PhotosUpload.previewAvatar)
          div = PhotosUpload.getContainerAvatar(image);
        else
          div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      }

      //Lendo os arquivos
      reader.readAsDataURL(file);
    });

    //Atualiza as fotos
    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  
  hasLimit(event) {
    const { uploadLimit, avatarLimit, input, preview } = PhotosUpload
    const { files: fileList } = input;

    //Se a quantidade de fotos for maior que o limite, informa na tela e retorna true
    if(fileList.length > uploadLimit){
      alert(`Envie no máximo ${uploadLimit} fotos!`);
      event.preventDefault()
      return true
    }

    const photosDiv = [];
    const photosAvatarDiv = [];
    
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'photo')
        photosDiv.push(item)
    });

    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == 'avatar')
        photosAvatarDiv.push(item)
    });

    const totalPhotos = fileList.length + photosDiv.length
    const totalAvatarPhotos = fileList.length + photosAvatarDiv.length

    if(totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos!')
      event.preventDefault();
      return true;
    }

    if(totalAvatarPhotos > avatarLimit) {
      alert('Máximo de uma foto!')
      event.preventDefault();
      return true;
    }

    //Se a quantidade de fotos não for maior que o limite retorna false
    return false;
  },

  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files
  },
  
  getContainer(image) {
    const div = document.createElement('div'); //Criação de uma "div"
    //Adiciona uma classe na div
    div.classList.add('photo');
    //Ao receber um clique remove a foto, event é passado automaticamente para removePhoto
    div.onclick = PhotosUpload.removePhoto;
    //adiciona imagem por imagem a div criada
    div.appendChild(image);
    //Adiciona a tag "i" à div criada
    div.appendChild(PhotosUpload.getRemoveButton());
    //Retona a div
    return div
  },

  getContainerAvatar(image) {
    const div = document.createElement('div'); //Criação de uma "div"
    //Adiciona uma classe na div
    div.classList.add('avatar');
    //Ao receber um clique remove a foto, event é passado automaticamente para removePhoto
    div.onclick = PhotosUpload.removePhoto;
    //adiciona imagem por imagem a div criada
    div.appendChild(image);
    //Adiciona a tag "i" à div criada
    div.appendChild(PhotosUpload.getRemoveButton());
    //Retona a div
    return div
  },

  getRemoveButton() {
    //Cria uma tag "i" e guarda na variável button
    const button = document.createElement('i');

    //Adiciona a classe "material-icons" a tag "i"
    button.classList.add('material-icons');
    //Adiciona o texto entre a abertura e fechamento do tag "i"
    button.innerHTML = 'close';

    return button
  },

  removePhoto(event) {
    //event.target é o "i", parentNode é um acima, a div da img
    const photoDiv = event.target.parentNode; // <div class="photo">
    //PhotosUpload.preview.childer é a lista de fotos, são transofrmadas em array
    //e guardadas em photosArray
    const photosArray = Array.from(PhotosUpload.preview.children);
    //photosArray.indexOf(photoDiv) procura na lista posição do array está o photoDiv
    let index = photosArray.indexOf(photoDiv);

    let count = 0;

    //Caso o formulário ja tenha imagens (PUT)
    for(let photoArray of photosArray) {
      if(photoArray.id || photoArray.type == 'hidden')
        count++;
    }
    index = index - count

    //Remove o arquivo de foto
    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },

  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    console.log(photoDiv.id);

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]');
      
      if(removedFiles){
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
    target.classList.add('active');

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  }
}

const Lightbox = {
  target: document.querySelector('.lightbox-target'),
  image: document.querySelector('.lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),

  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeButton.style.top = '8px';
  },

  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = '-100%';
    Lightbox.target.style.bottom = 'initial';
    Lightbox.closeButton.style.top = '-80px';
  }
}


const Validate = {
  //Será passado um input e a função do Mask
  apply(input, func) {
    Validate.clearErrors(input);
    let results = Validate[func](input.value);
    input.value = results.value;

    if(results.error)
      Validate.displayError(input, results.error);

  },

  displayError(input, error) {
    const div = document.createElement('div');
    div.classList.add('error');
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.focus();
  },

  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector('.error');

    if(errorDiv)
      errorDiv.remove();
  },

  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    if(!value.match(mailFormat))
      error = "E-mail inválido!"

    return {
      error,
      value
    }
  }
}