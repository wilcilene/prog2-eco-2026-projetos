# [Amigo Fiel] – Equipe Isabel, Larissa, Suzana e Nathan

## Integrantes

| Nome | Matrícula | GitHub |
|------|-----------|--------|
| Isabel Schifler | 2024003899 | [@isabelschifler](https://github.com/isabelschifler) |
| Suzana Silveira | 2024002283 | [@SuzanaSilveira](https://github.com/SuzanaSilveira) |
| Larissa Damasceno | 2023009987 | [@lariiferraz](https://github.com/lariiferraz) |
| Nathan | 2023007991| [@Nathan](https://github.com/M1st3r2) |

---

## Descrição do projeto

O Amigo Fiel é uma plataforma web desenvolvida para facilitar e incentivar a adoção responsável de animais. O sistema conecta animais que aguardam por um lar a pessoas interessadas em adotar, promovendo transparência, segurança e eficiência no processo de adoção.

## Funcionalidades do Sistema

### Para o Administrador

- ✅ Cadastrar, editar e gerenciar animais disponíveis para adoção
- ✅ Manter informações completas (nome, espécie, porte, idade, status)
- ✅ Gerenciar solicitações de adoção
- ✅ Entrar em contato com os usuários interessados

### Para o Usuário (Adotante)

- ✅ Visualizar todos os animais cadastrados com detalhes
- ✅ Acessar informações completas de cada animal
- ✅ Adicionar animais a lista de favoritos
- ✅ Realizar contato com os responsáveis por meio de mensagens internas
- ✅ Filtrar animais por espécie, porte e disponibilidade


## Modelagem do Sistema

Para representar o funcionamento do projeto Amigo Fiel, foram desenvolvidos diagramas UML que auxiliam na compreensão das funcionalidades e da estrutura do sistema.

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](casodeuso-casodeuso.drawio.png)


## Diagrama de Classes

![Diagrama de Classes](./casodeuso-diagramadeclasse.drawio.jpeg)

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express.js
- SQLite

As tecnologias escolhidas para o desenvolvimento do Amigo Fiel foram selecionadas por oferecerem praticidade, boa documentação e ampla utilização no desenvolvimento web. O JavaScript (ES6+) foi utilizado para implementar a lógica do sistema tanto no frontend quanto no backend. O HTML5 e o CSS3 foram escolhidos para estruturar e estilizar as páginas da aplicação, possibilitando a criação de uma interface intuitiva e responsiva. O Node.js foi utilizado como ambiente de execução do backend, permitindo o gerenciamento eficiente das requisições do sistema. Já o Express.js foi empregado para facilitar a criação da API REST e a organização das rotas da aplicação. O SQLite, juntamente com comandos SQL, foi definido para armazenar e gerenciar os dados de usuários, animais e contatos de forma segura e organizada.

## Como executar o projeto

### Pré-requisitos

- Node.js (versão 18.x ou superior) - https://nodejs.org/
- Git - https://git-scm.com/
- NPM (já vem com o Node.js)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/SuzanaSilveira/projeto-progII.git

# 2. Entre na pasta
cd projeto-progII

# 3. Instale as dependências
cd backend
npm install

# 4. Inicie o servidor
npm start

# 5. Acesse no navegador
# http://localhost:3000

```

## Estrutura de pastas

```
projeto-progII/
│
├── backend/
│   ├── package.json            
│   ├── package-lock.json      
│   ├── .env     
│   ├── uploads/
│   │
│   └── src/
│       ├── server.js           
│       │
│       ├── controladores/     
│       │   ├── animalController.js
│       │   └── adminController.js
│       │   └── authController.js
│       │   └── favoritoController.js
│       │   └── uploadController.js
│       │
│       ├── rotas/              
│       │   └── adminRoutes.js
│       │   └── authRoutes.js
│       │   └── publicRoutes.js
│       │   └── favoritoRoutes.js
│       │   └── uploadRoutes.js
│       │
│       ├── database/           
│       │   ├── database.js
│       │   ├── apagar-animais.js
│       │   └── amigofiel.db
│       │
│       ├── middleware/
│       │   ├── adminMiddleware.js
│       │   └── uploadConfig.js
│       │ 
│       ├── entidades/
│       │   ├── Animal.js
│       │   └── Usuario.js
│       │   └── Contato.js
│       │
│       ├── models/
│       │   ├── Favorito.js
│
│
├── frontend/
│       ├── css/           
│       │   ├── cadastro-animal.css
│       │   └── cadastro.css
│       │   └── detalhes-animal.css
│       │   └── home.css
│       │   └── index.css
│       │   └── interesses.css
│       │   └── login.css
│       │   └── style.css
│       │   └── tela-admin.css
│       │   └── favorito.css
│       │
│       ├── js/
│       │   ├── cadastro-animal.js
│       │   └── cadastro.js
│       │   └── detalhes-animal.js
│       │   └── home.js
│       │   └── index.js
│       │   └── interesses.js
│       │   └── login.js
│       │   └── tela-admin.js
│       │   └── favoritos.js
│       │
│       ├── pages/
│       │   ├── cadastro-animal.html
│       │   └── cadastro.html
│       │   └── detalhes-animal.html
│       │   └── home.html 
│       │   └── index.html
│       │   └── interesses.html
│       │   └── login.html
│       │   └── tela-admin.html
│       │   └── favoritos.html
│       │
|
└── .gitignore                  
```
