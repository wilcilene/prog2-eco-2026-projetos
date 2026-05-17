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

O sistema é uma plataforma web voltada para a adoção de animais, na qual administradores podem cadastrar, editar e gerenciar os animais disponíveis, mantendo informações como identificação, características e status. Usuários interessados podem criar uma conta, informando dados básicos e localização, além de definir preferências para refinar a busca por animais compatíveis. A plataforma permite a visualização dos animais cadastrados, acesso aos detalhes e a realização de contato com os responsáveis por meio de mensagens, centralizando a comunicação.

## Funcionalidades do Sistema

- Cadastro de administradores e usuários adotantes  
- Cadastro, edição e remoção de animais para adoção  
- Upload de imagens dos animais  
- Busca de animais por preferências  
- Visualização de detalhes dos animais  
- Contato com responsáveis via WhatsApp  
- Preenchimento automático de endereço via CEP  
- Gerenciamento de anúncios ativos

## Modelagem do Sistema

Para representar o funcionamento do projeto Amigo Fiel, foram desenvolvidos diagramas UML que auxiliam na compreensão das funcionalidades e da estrutura do sistema. O diagrama de casos de uso apresenta as principais interações entre os atores e a plataforma. Nele, o ator Administrador possui responsabilidades como cadastrar conta, cadastrar animais, visualizar os animais cadastrados e editar ou excluir anúncios. Já o ator Usuário (adotante) pode realizar cadastro na plataforma, definir preferências de busca, navegar entre os animais disponíveis e visualizar detalhes dos animais, além de entrar em contato com o responsável pelo anúncio. Essas funcionalidades representam o fluxo principal do sistema e demonstram como ocorre o processo de adoção dentro da plataforma.

Já o diagrama de classes representa a estrutura interna do sistema e os relacionamentos entre suas entidades principais: Administrador, Usuário, Animal e Contato. A classe Administrador é responsável pelo gerenciamento dos anúncios de adoção, enquanto a classe Usuário permite definir preferências e buscar animais compatíveis. A classe Animal armazena informações como nome, espécie, idade, porte, descrição, status e também poderá armazenar a URL da imagem enviada por meio da integração com a API do Cloudinary. Por fim, a classe Contato gerencia a comunicação entre usuários interessados e responsáveis pelos animais. Essa modelagem contribui para uma melhor organização da aplicação e facilita futuras expansões e manutenções do sistema.

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](./Diagrama%20Caso%20de%20Uso.png)

## Diagrama de Classes

![Diagrama de Classes](./diagramadeclasse.png)

---

## Tecnologias utilizadas

- JavaScript (ES6+)
- HTML5 / CSS3
- Node.js
- Banco de dados: SQLite
- Framework web: Tailwind

As tecnologias escolhidas para o desenvolvimento do Amigo Fiel foram selecionadas por oferecerem praticidade, boa documentação e ampla utilização no desenvolvimento web. O JavaScript (ES6+) foi utilizado para implementar a lógica do sistema tanto no frontend quanto no backend. O HTML5 e CSS3 foram escolhidos para estruturar e estilizar as páginas da aplicação. O Node.js permite executar o backend de forma eficiente e gerenciar as requisições do sistema. O PostgreSQL, juntamente com comandos SQL, foi definido para armazenar e gerenciar os dados de usuários, animais e contatos de forma segura e organizada. Já o Tailwind CSS foi escolhido para agilizar o desenvolvimento da interface, permitindo criar páginas responsivas e modernas com maior produtividade.

## Aplicação do padrão Factory Method

No desenvolvimento do sistema Amigo Fiel, foi utilizado o padrão de projeto Factory Method, cujo objetivo é centralizar a criação de objetos e permitir que subclasses definam qual tipo específico será instanciado. A escolha desse padrão ocorreu devido à necessidade do sistema trabalhar com diferentes tipos de usuários, como Administrador e Usuário Adotante, cada um possuindo responsabilidades e permissões específicas dentro da plataforma.

Com a utilização do Factory Method, o processo de criação desses usuários torna-se mais organizado e desacoplado das demais classes do sistema, evitando que a lógica de instanciamento fique espalhada pelo código. Dessa forma, a manutenção do sistema é facilitada e futuras expansões tornam-se mais simples, permitindo a adição de novos perfis de usuários sem causar grandes alterações na estrutura existente. Essa abordagem contribui para um código mais reutilizável, escalável e alinhado com boas práticas de desenvolvimento orientado a objetos.

## Estrutura de Rotas, Controllers e Views

Seguindo os conceitos estudados na disciplina sobre organização de aplicações web com Node.js e Express, o projeto Amigo Fiel foi estruturado separando as responsabilidades entre as camadas de rotas, controllers e views, tornando o sistema mais organizado e facilitando futuras manutenções. Nessa arquitetura, as rotas são responsáveis por definir os caminhos de navegação e as requisições do sistema, direcionando cada ação para seu respectivo controller. Entre as principais rotas definidas estão /login, /cadastro, /animais, /detalhes-animal, /perfil e /contato, permitindo que os usuários naveguem entre as funcionalidades da plataforma de adoção. Essa organização segue o modelo de roteamento utilizado no Express, no qual cada URL é associada a uma funcionalidade específica da aplicação.

Os controllers são responsáveis por receber as requisições feitas pelas rotas, processar os dados e aplicar as regras de negócio do sistema, como cadastrar usuários, autenticar login, registrar animais para adoção, atualizar informações e realizar contatos entre adotantes e responsáveis pelos animais. Já as views representam a interface visual do sistema, desenvolvida com HTML, CSS, JavaScript e Tailwind, sendo responsáveis por exibir formulários, listas de animais, páginas de detalhes e telas de cadastro. Essa separação de responsabilidades torna o projeto mais escalável e organizado, permitindo que novas funcionalidades sejam adicionadas futuramente com maior facilidade

## Integração com APIs Externas

O projeto Amigo Fiel utiliza uma API própria desenvolvida com Node.js e Express.js para realizar a comunicação entre o frontend, backend e banco de dados PostgreSQL. Por meio dessa API, são realizadas requisições HTTP utilizando métodos como GET, POST, PUT e DELETE, permitindo funcionalidades como cadastro de usuários, login, gerenciamento de animais disponíveis para adoção, atualização de informações e registro de contatos. Os dados trafegam no formato JSON, seguindo o modelo estudado em sala sobre desenvolvimento e consumo de APIs.

Além da API interna, o sistema também realiza o consumo de APIs externas para ampliar suas funcionalidades. A API do ViaCEP será utilizada para preencher automaticamente os dados de endereço a partir do CEP informado pelo usuário. A API do Cloudinary será responsável pelo armazenamento das imagens dos animais cadastrados na plataforma. Além disso, será utilizada integração com o WhatsApp por meio de links diretos para facilitar a comunicação entre adotantes e responsáveis pelos animais. Dessa forma, o sistema aplica na prática os conceitos de integração, consumo de APIs e troca de dados entre diferentes serviços, tornando a plataforma mais completa e funcional.

---

## Como executar o projeto

```bash
# Clone o repositório
git clone https://github.com/wilcilene/prog2-eco-2026-projetos.git

# Acesse a pasta do projeto
cd projetos/dupla-XX-nome1-nome2

# Instale as dependências (se houver)
npm install

# Execute
npm start
```

---

## Estrutura de pastas

```
projeto-progII/
│
├── backend/
│   ├── package.json            ← configura dependências e scripts do Node.js
│   ├── package-lock.json       ← controle de versões das dependências
│   ├── .env                    ← variáveis de ambiente
│   │
│   └── src/
│       ├── server.js           ← ponto de entrada da aplicação
│       │
│       ├── controladores/      ← lógica das requisições
│       │   ├── animalController.js
│       │   └── usuarioController.js
│       │
│       ├── rotas/              ← definição das rotas da API
│       │   ├── Animal.js
│       │   └── Usuario.js
│       │
│       ├── database/           ← configuração e armazenamento do banco
│       │   ├── database.js
│       │   └── amigofiel.db
│       │
│       └── models/             ← modelos/entidades do sistema (se forem adicionados futuramente)
│
└── .gitignore                  ← arquivos ignorados pelo Git
```



---

## Histórico de entregas

| Entrega | Descrição | Data | Status |
|---------|-----------|------|--------|
| E1 | Definição do projeto | 06/04/2026 | ✅  |
| E2 | Modelagem | 10/04/2026 | ✅ |
| E3 | Backend + BD | 15/04/2026 |  ✅ |
| E4 | Interface integrada | 15/05/2026 | 🔄 |
| E5 | Projeto final | — | ⏳ |

> ⏳ Pendente | ✅ Concluído | 🔄 Em andamento
