<h1 align="center">
  <img src="public/assets/logo.png" height="30">
</h1>

<h1>
  <img src="public/assets/gifs/demo.gif">
</h1>

## Apresentação
<p align="center">
  <a href="public/assets/gifs/site.gif">Site</a> |
  <a href="public/assets/gifs/user.gif">User</a> |
  <a href="public/assets/gifs/admin.gif">Admin</a>
</p>

## Indice
<p align="center">
  <a href="#bookmark-sobre">Sobre</a> |
  <a href="#computer-tecnologias-utilizadas">Tecnologias</a> |
  <a href="#dart-objetivo">Objetivo</a> |
  <a href="#gear-requisitos">Requisitos</a> |
  <a href="#package-como-baixar-o-projeto">Baixar</a> |
  <a href="#bust_in_silhouette-autor">Autor</a> |
  <a href="#pencil-licença">Licença</a>
</p>

## :bookmark: Sobre
Site para visualização de receitas culinárias. </br>
Conta com área administrativa para gerenciar as receitas e os chefs responsáveis.</br>
Gerenciamento de upload de imagens das receitas e dos chefs.</br>
Gerenciamento de sessão de usuário e níveis de permessão dentro da aplicação.
Ainda em desenvolvimento...

## :computer: Tecnologias Utilizadas
Front-End:
- HTML
- CSS
- Nunjucks
- JavaScript

Back-End:
- NodeJS
- Express
- Method Override
- Multer
- bcryptjs
- express-session
- nodemailer

Banco de dados:
- PostgreSQL

## :dart: Objetivo
Site tem como objetivo disponibilizar:
- Cadastrar usuários do sistema em dois níveis de permissão (Comum/Admin)
- Visualização de receitas culinárias e os chefs que as criaram
- Cadastro, listagem, edição e exclusão de receitas culinárias
- Cadastro, listagem, edição e exclusão de chefs
- Vinculo de receitas com chefs

## :gear: Requisitos:
- Editor de código (recomendo o Visual Studio Code: https://code.visualstudio.com/)
- Node JS (https://nodejs.org/en/)
- PostgreSQL (https://www.postgresql.org/)

## :package: Como Baixar o projeto
Pelo seu terminal, escolha um local para o projeto e rode os comandos:
```bash
  # Clonar o repositório
  $ git clone https://github.com/luizcampos331/foodfy.git

  # Entrar no diretório
  $ cd foodfy

  # Instalar dependências
  $ npm install

```

Obs: utilize o conteúdo do arquivo <a href="foodfy.sql">foodfy.sql</a> para a criação do banco de dados. Após a criação do banco de dados, crie dados fakes para testar a aplicação com o comando no terminal estando na pasta raiz do projeto:
```bash
  $ node seed.js
```

## :bust_in_silhouette: Autor:
Luiz Eduardo Campos da Silva</br>
LinkedIn: <a href="https://www.linkedin.com/in/luiz-campos">@luiz-campos</a></br>
Github: <a href="https://www.github.com/luizcampos331">@luizcampos331</a>


## :pencil: Licença
Copyright © 2020 <a href="https://www.github.com/luizcampos331">Luiz Campos</a></br>
Este projeto é licenciado pelo <a href="LICENSE">MIT</a>
