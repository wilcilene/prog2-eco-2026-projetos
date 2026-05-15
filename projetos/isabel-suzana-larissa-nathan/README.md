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
