# Análise de Ferramentas de Desenvolvimento
**Programação II – ECO 2026/1**

---

## Identificação dos estudantes

| | |
|---|---|
| **Integrante 1** | Alessandro dos Santos |
| **Integrante 2** | Rafael Henrique Reichardt  |
| **Integrante 3** | Cremilson Pereira Nunes Junior  |
---

## Seção 1 – IDEs e editores de código

**Categoria obrigatória**

### Ferramentas comparadas:

* **Ferramenta 1:** Visual Studio Code
* **Ferramenta 2:** IntelliJ IDEA
* **Ferramenta 3:** Eclipse
* **Ferramenta 4:** Neovim

### Introdução

As IDEs e editores de código são ferramentas essenciais no desenvolvimento web, pois permitem escrever, testar e organizar o código de forma eficiente. Elas oferecem recursos como destaque de sintaxe, integração com sistemas de controle de versão, depuração de código e extensões que facilitam o trabalho do desenvolvedor. A escolha da ferramenta pode impactar diretamente na produtividade, organização e qualidade do desenvolvimento de aplicações web.

### Tabela comparativa

| Característica                 | (VS Code) | (IntelliJ IDEA) | (Eclipse) |(Neovim) |
| ------------------------------ | ---------------------- | ---------------------------- | ---------------------- | --------------------- |
| Facilidade de instalação       | Fácil                  | Média                        | Média                  | Média                 |
| Suporte a JavaScript e Node.js | Excelente (extensões)  | Bom (plugins)                | Bom (plugins)          | Bom (plugins)         |
| Suporte a HTML e CSS           | Excelente              | Bom                          | Bom                    | Bom                   |
| Debugger integrado             | Sim                    | Sim                          | Sim                    | Não nativo            |
| Terminal integrado             | Sim                    | Sim                          | Sim                    | Sim                   |
| Integração com Git             | Sim                    | Sim                          | Sim                    | Sim                   |
| Extensões disponíveis          | Muito grande           | Grande                       | Média                  | Grande (plugins)      |
| **Nota geral (1 a 5)** | 5 | 4 | 4 | 3 |

**Ferramenta escolhida:** `VS code`

**Justificativa:**
_O Visual Studio Code foi escolhido devido à sua facilidade de uso, grande quantidade de extensões disponíveis, integração nativa com Git e suporte amplo a tecnologias web, o que o torna uma ferramenta versátil e adequada tanto para iniciantes quanto para desenvolvedores experientes._

---

## Seção 2 – Clientes de banco de dados
> Categoria obrigatória

**Ferramentas comparadas:**
- Ferramenta 1: `PostgreSQL`
- Ferramenta 2: `SQLite`
- Ferramenta 3: `Dbeaver`
- Ferramenta 4: `MySQL`

**Introdução:**
_O banco de dados é uma das partes mais importantes de um sistema e a que exige maior cuidado, pois nele são armazenados todos os dados essenciais, desde informações operacionais da própria aplicação até dados pessoais dos usuários. Nele também está contida toda a modelagem relacional, ou seja, a forma como as informações se conectam entre si por meio de tabelas, colunas e chaves de relacionamento. É no banco de dados que se utiliza a linguagem SQL (Structured Query Language), responsável pela realização de consultas, inserções, atualizações e exclusões de dados. Essas operações são posteriormente acessadas pelas aplicações por meio de APIs, permitindo que as informações sejam manipuladas de forma segura e organizada._

**Tabela comparativa:**

| Característica | PostgreSQL | SQLite | Dbeaver | MySQL |
|---|---|---|---|---|
| Facilidade de instalação |Média |Muito alta |Alta |Alta |
| Visualização de tabelas |Média |Baixa |Muito alta |Média |
| Editor de queries SQL |Sim |Sim |Sim |Sim |
| Integração com a IDE |Alta |Alta |Média |Alta |
| Custo / licença |open source |open source |open source |open source |
| **Nota geral (1 a 5)** |4 |2 |5 |3 |

**Ferramenta escolhida:** `Dbeaver`

**Justificativa:**
_O DBeaver destaca-se pela facilidade de conexão com diferentes bancos de dados, tanto locais quanto hospedados em servidores remotos. Outra vantagem importante é o suporte a uma ampla variedade de sistemas gerenciadores de banco de dados, o que permite trabalhar com diferentes dialetos da linguagem SQL sem se limitar a apenas uma tecnologia específica. Além disso, a ferramenta oferece configuração simples e intuitiva no momento da criação e administração das conexões, facilitando o gerenciamento e a manipulação dos dados de forma eficiente._

---

## Seção 3 – Qualidade e padronização de código

**Categoria escolhida:** Qualidade e padronização de código

**Ferramentas comparadas:**
- Ferramenta 1: ESLint
- Ferramenta 2: Prettier
- Ferramenta 3: EditorConfig

**Introdução:**
As ferramentas de qualidade e padronização auxiliam tanto para seguir um template de código, mantendo um padrão de qualidade e facilitando a leitura, ao mesmo tempo que auxiliam na limpeza de variáveis e referências não utilizadas.

**Tabela comparativa:**

| Característica | ESLint | Prettier | EditorConfig |
|---|---|---|---|
| Facilidade de uso | Sim | Sim | Sim |
| Integração com a IDE | Sim | Sim | Sim |
| Documentação e comunidade | Sim | Sim | Sim |
| Custo / licença | 0 | 0 | 0 |
| **Nota geral (1 a 5)** | 5 | 4 | 5 |

**Ferramenta escolhida:** `ESLint e EditorConfig`

**Justificativa:**
O ESLint limpa variáveis que não foram usadas e referências inexistentes, o EditorConfig ajuda na correção de código durante a criação do programa e o Prettier formata o código baseado em um padrão, porém falta opções de configuração para o Prettier.

---

## Seção 4 – Deploy e ambiente de execução

**Categoria escolhida:** Deploy

**Ferramentas comparadas:**
- Ferramenta 1: `Node.js`
- Ferramenta 2: `Render`
- Ferramenta 3: `Railway`
- Ferramenta 4: `Docker`

**Introdução:**
_Quando falamos de deploy, consideramos que já existe um produto ou alteração final pronta para ser disponibilizada em produção. Essa etapa é essencial para garantir que a aplicação funcione corretamente fora do ambiente de desenvolvimento, evitando problemas como o clássico “na minha máquina funciona”. Ferramentas de deploy permitem padronizar bibliotecas, frameworks e versões, assegurando consistência entre ambientes. Além disso, o processo costuma envolver automação por meio de CI/CD, testes em ambientes intermediários, possibilidade de rollback em caso de falhas e monitoramento após a implantação, garantindo estabilidade, segurança e confiabilidade do sistema._

**Tabela comparativa:**

| Característica | Node.js | Render | Railway | Docker |
|---|---|---|---|---|
| Facilidade de uso |Alta |Muito alta |Muito alta |Média |
| Integração com a IDE |Alta |Média |Média |Média |
| Documentação e comunidade |Muito alta |Alta |Alta |Muito alta |
| Custo / licença |open source |Possui plano gratuito |Possui plano gratuito |open source |
| **Nota geral (1 a 5)** |4 |3 | 3| 5|

**Ferramenta escolhida:** `Docker`

**Justificativa:**
_Devido à sua facilidade de uso e ao controle proporcionado pela conteinerização, é possível visualizar logs, identificar bugs e realizar depuração de diferentes microserviços, como backend, frontend, banco de dados e serviços de pagamento. Dessa forma, obtém-se maior controle operacional e garantia de padronização das bibliotecas e dependências utilizadas, além de maior consistência entre os ambientes de execução. O Docker permite isolar aplicações em contêineres, compartilhando o mesmo kernel do sistema operacional hospedeiro, mas mantendo ambientes independentes, o que reduz conflitos e facilita a portabilidade entre diferentes máquinas._

---

## Conclusão geral

**Conjunto de ferramentas escolhido pela equipe:**

| Categoria | Ferramenta escolhida |
|---|---|
| IDE / Editor de código |VS code |
| Cliente de banco de dados |Dbeaver |
| Teste de API | |
| Deploy | Docker |

**Considerações finais:**
_Cada ferramenta foi escolhida intencionalmente por sua facilidade na conexão uma com a outra o Dbeaver será usado paranco de dados e SGBD assim com o docker e o vs code que sem completam com facilidade na integração_

---

## Referências consultadas

- [Postgresql](https://www.postgresql.org/docs/)
- [Sqlite](https://sqlite.org/docs.html)
- [Dbeaver](https://dbeaver.io/docs/)
- [MySQL](https://dev.mysql.com/doc/)
- [Node.js](https://nodejs.org/docs/latest/api/)
- [Render](https://render.com/docs)
- [Railway](https://docs.railway.app/)
- [Docker](https://docs.docker.com/)
---

_Programação II – ECO 2026/1 | [Página da disciplina](https://wilcilene.github.io/estudos/disciplinas/programacaoii-eco/)_