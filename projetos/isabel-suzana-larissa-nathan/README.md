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

Conforme representado no diagrama de casos de uso, o sistema contempla as principais interações entre os atores e a plataforma, incluindo funcionalidades como cadastro de conta por administradores e usuários, definição de preferências, navegação e busca de animais disponíveis, além da visualização de detalhes e possibilidade de contato com o responsável pelo animal. Essas ações evidenciam o fluxo de utilização do sistema, destacando como os usuários interagem com as funcionalidades para atingir o objetivo de adoção.

Já o diagrama de classes evidencia a estrutura interna do sistema, apresentando entidades como Administrador, Usuário, Animal e Contato, juntamente com seus respectivos atributos e métodos. Além disso, demonstra os relacionamentos entre essas classes, como a associação entre usuários e animais por meio do contato, e as responsabilidades de cada entidade dentro do sistema. Dessa forma, o modelo estrutural contribui para a organização e implementação da aplicação, tornando o processo de adoção mais acessível, eficiente e seguro, além de auxiliar na redução do abandono e no incentivo à adoção responsável.

---

## Tecnologias utilizadas

- JavaScript (ES6+)
- HTML5 / CSS3
- Node.js
- Banco de dados: PostGre e SQL
- Framework web: Tailwind

As tecnologias escolhidas para o desenvolvimento do Amigo Fiel foram selecionadas por oferecerem praticidade, boa documentação e ampla utilização no desenvolvimento web. O JavaScript (ES6+) foi utilizado para implementar a lógica do sistema tanto no frontend quanto no backend. O HTML5 e CSS3 foram escolhidos para estruturar e estilizar as páginas da aplicação. O Node.js permite executar o backend de forma eficiente e gerenciar as requisições do sistema. O PostgreSQL, juntamente com comandos SQL, foi definido para armazenar e gerenciar os dados de usuários, animais e contatos de forma segura e organizada. Já o Tailwind CSS foi escolhido para agilizar o desenvolvimento da interface, permitindo criar páginas responsivas e modernas com maior produtividade.

## Aplicação do padrão Factory Method

No desenvolvimento do sistema Amigo Fiel, foi utilizado o padrão de projeto Factory Method, cujo objetivo é centralizar a criação de objetos e permitir que subclasses definam qual tipo específico será instanciado. A escolha desse padrão ocorreu devido à necessidade do sistema trabalhar com diferentes tipos de usuários, como Administrador e Usuário Adotante, cada um possuindo responsabilidades e permissões específicas dentro da plataforma.

Com a utilização do Factory Method, o processo de criação desses usuários torna-se mais organizado e desacoplado das demais classes do sistema, evitando que a lógica de instanciamento fique espalhada pelo código. Dessa forma, a manutenção do sistema é facilitada e futuras expansões tornam-se mais simples, permitindo a adição de novos perfis de usuários sem causar grandes alterações na estrutura existente. Essa abordagem contribui para um código mais reutilizável, escalável e alinhado com boas práticas de desenvolvimento orientado a objetos.

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
src/
  ├── index.html        ← ponto de entrada
  ├── css/
  ├── js/
  │   ├── model/          ← classes de domínio
  │   ├── service/        ← regras de negócio
  │   ├── controller/     ← controladores
  │   └── repository/     ← acesso ao banco
  └── db/               ← scripts SQL
```

---

## Histórico de entregas

| Entrega | Descrição | Data | Status |
|---------|-----------|------|--------|
| E1 | Definição do projeto | 06/04/2026 | ✅  |
| E2 | Modelagem | 10/04/2026 | ✅ |
| E3 | Backend + BD | 13/04/2026 |  🔄 |
| E4 | Interface integrada | 04/05/2026 | 🔄 |
| E5 | Projeto final | — | ⏳ |

> ⏳ Pendente | ✅ Concluído | 🔄 Em andamento
