# Análise de Ferramentas de Desenvolvimento
**Programação II – ECO 2026/1 **

---

## Identificação dos estudantes

| | |
|---|---|
| **Integrante 1** | João Victor de Souza Mendes  |
| **Integrante 2** | Yan Scholze  |
| **Integrante 3** | Miguel Moreira  |

---

## Seção 1 – IDEs e editores de código
> Categoria obrigatória

**Ferramentas comparadas:**
- Ferramenta 1: `VS Code`
- Ferramenta 2: `WebStorm`
- Ferramenta 3: `Sublime Text`
- Ferramenta 4: `Replit`

**Introdução:**
Um ambiente de desenvolvimento integrado (IDE) ou editor de código é uma aplicação que ajuda os programadores a desenvolver software de maneira eficiente. No desenvolvimento web, essas ferramentas são fundamentais porque oferecem recursos que facilitam a escrita, a organização e o teste dos programas. Com funcionalidades inteligentes, como autocompletar, formatação e detecção de erros em tempo real, o código-fonte é escrito de forma mais rápida, padronizada e limpa.

**Tabela comparativa:**

| Característica | Ferramenta 1 (VS Code) | Ferramenta 2 (WebStorm) | Ferramenta 3 (Sublime) | Ferramenta 4 (Replit) |
|---|---|---|---|---|
| Facilidade de instalação | Muito Alta | Média | Alta | Online (Nenhuma) |
| Suporte a JavaScript e Node.js | Sim (Nativo) | Sim | Sim | Sim |
| Suporte a HTML e CSS | Sim | Sim | Sim | Sim |
| Debugger integrado | Sim | Sim | Não (requer plugin) | Sim |
| Terminal integrado | Sim | Sim | Não (requer plugin) | Sim (Online) |
| Integração com Git | Sim | Sim | Parcial | Sim |
| Extensões disponíveis | Diversas (Gigante) | Inclusas nativamente | Requer gerenciador | Limitado |
| Performance | Alta | Média (pode ser pesado) | Muito Alta | Depende da internet |
| Custo / licença | Gratuito | Pago (Gratuito p/ estudante) | Premium / Pago | Premium |
| **Nota geral (1 a 5)** | 5 | 4,5 | 3,5 | 4 |

**Ferramenta escolhida:** `VS Code`

**Justificativa:**
O VS Code é a escolha ideal por ser extremamente fácil de usar, gratuito e altamente customizável. Enquanto o WebStorm é uma ferramenta fantástica e robusta, ele pode ser mais pesado e exige licença paga (ou de estudante). O Sublime Text é rápido, mas requer a instalação manual de muitos plugins para obter recursos básicos de desenvolvimento atual (como terminal e debugger). O Replit é ótimo para testes rápidos online, mas não substitui um ambiente local. O VS Code oferece o melhor equilíbrio: é leve, não exige configurações complexas iniciais e domina o mercado, centralizando extensões fundamentais.

---

## Seção 2 – Clientes de banco de dados
> Categoria obrigatória

**Ferramentas comparadas:**
- Ferramenta 1: `DBeaver`
- Ferramenta 2: `TablePlus`
- Ferramenta 3: `PostgreSQL (pgAdmin)`
- Ferramenta 4: `MySQL (Workbench)`

**Introdução:**
Clientes de banco de dados são ferramentas essenciais para visualizar, consultar e gerenciar dados armazenados em sistemas de gerenciamento de banco de dados (SGBD). Eles oferecem uma interface gráfica que substitui a necessidade de usar apenas linhas de comando no terminal, tornando o trabalho muito mais visual e intuitivo. No desenvolvimento web, essas ferramentas permitem testar consultas SQL e acompanhar os dados salvos pela aplicação em tempo real.

**Tabela comparativa:**

| Característica | Ferramenta 1 (DBeaver) | Ferramenta 2 (TablePlus) | Ferramenta 3 (pgAdmin) | Ferramenta 4 (Workbench) |
|---|---|---|---|---|
| Facilidade de instalação | Alta | Alta | Média | Média |
| Visualização de tabelas | Sim | Sim | Sim | Sim |
| Editor de queries SQL | Sim | Sim | Sim | Sim |
| Integração com a IDE | Parcial (via extensões) | Não | Não | Não |
| Custo / licença | Gratuito (Open Source) | Freemium | Gratuito | Gratuito |
| **Nota geral (1 a 5)** | 4,5 | 4,5 | 3,5 | 3,5 |

**Ferramenta escolhida:** `DBeaver`

**Justificativa:**
O DBeaver foi escolhido por ser uma ferramenta universal, gratuita e relativamente fácil de configurar. Diferente do MySQL Workbench ou do pgAdmin, que ficam restritos aos seus respectivos bancos de dados, o DBeaver permite conectar-se a praticamente qualquer banco de dados relacional usando a mesma interface. O TablePlus possui uma interface muito amigável para iniciantes, mas sua versão gratuita limita a quantidade de abas abertas, atrapalhando o fluxo de trabalho. O DBeaver entrega uma experiência completa, sem custos e centraliza o gerenciamento dos dados.

---

## Seção 3 – Ferramentas de teste de API
> Categoria obrigatória

**Ferramentas comparadas:**
- Ferramenta 1: `Postman`
- Ferramenta 2: `Insomnia`
- Ferramenta 3: `Thunder Client`
- Ferramenta 4: `curl`

**Introdução:**
Ferramentas de teste de API são indispensáveis para o desenvolvimento de aplicações REST. Elas permitem simular o envio de requisições HTTP para as rotas da aplicação (como requisições GET para buscar dados ou POST para salvar dados) e inspecionar visualmente as respostas do servidor. Essas ferramentas garantem que o backend esteja funcionando perfeitamente antes mesmo da construção da interface frontend.

**Tabela comparativa:**

| Característica | Ferramenta 1 (Postman) | Ferramenta 2 (Insomnia) | Ferramenta 3 (Thunder) | Ferramenta 4 (curl) |
|---|---|---|---|---|
| Facilidade de uso | Alta | Muito Alta | Muito Alta | Baixa |
| Suporte a métodos HTTP (GET, POST, PUT, DELETE) | Sim | Sim | Sim | Sim |
| Visualização da resposta | Sim | Sim | Sim | Não (Apenas texto) |
| Organização de requisições | Sim | Sim | Sim | Não |
| Integração com a IDE | Não | Não | Sim (Extensão nativa) | Sim (Via terminal) |
| Custo / licença | Freemium | Freemium | Gratuito | Gratuito |
| **Nota geral (1 a 5)** | 4,5 | 4,5 | 5 | 3 |

**Ferramenta escolhida:** `Thunder Client`

**Justificativa:**
Mantendo a filosofia de buscar a maior produtividade, o Thunder Client é a escolha ideal porque funciona como uma extensão embutida diretamente no VS Code. Isso significa que a equipe pode codificar e testar a API na mesma tela, sem precisar abrir um programa à parte. O Postman é a ferramenta mais completa do mercado, mas tornou-se bastante pesado. O Insomnia é excelente e possui uma interface muito limpa, mas o Thunder Client ganha no quesito praticidade e integração direta com o nosso editor principal.

---

## Seção 4 – Categoria complementar

**Categoria escolhida:** `Deploy e ambiente de execução`

**Ferramentas comparadas:**
- Ferramenta 1: `Node.js`
- Ferramenta 2: `Render`
- Ferramenta 3: `Vercel`
- Ferramenta 4: `Docker`

**Introdução:**
As ferramentas de deploy e ambiente de execução são essenciais para colocar uma aplicação no ar e garantir que ela rode perfeitamente fora da máquina local do desenvolvedor. Escolhemos analisar essa categoria porque a entrega final do projeto depende de um ambiente onde a aplicação possa ser hospedada e acessada pela web. Compreender essas ferramentas aproxima o ambiente acadêmico do cenário profissional real de publicação de software.

**Tabela comparativa:**

| Característica | Ferramenta 1 (Node.js) | Ferramenta 2 (Render) | Ferramenta 3 (Vercel) | Ferramenta 4 (Docker) |
|---|---|---|---|---|
| Facilidade de uso | Alta | Alta | Muito Alta | Média |
| Integração com a IDE | Sim (Terminal) | Parcial | Sim (Via GitHub/CLI) | Sim |
| Documentação e comunidade | Excelente | Boa | Excelente | Excelente |
| Custo / licença | Gratuito | Gratuito (com limites) | Gratuito | Gratuito |
| **Nota geral (1 a 5)** | 5 | 4 | 5 | 3,5 |

**Ferramenta escolhida:** `Node.js + Vercel`

**Justificativa:**
O Node.js será o nosso ambiente de execução principal para construir e rodar o backend em JavaScript. Para a hospedagem (deploy), o Vercel foi o escolhido por ser incrivelmente fácil de integrar ao GitHub: ele faz o deploy automático a cada nova atualização no código. Ele dispensa configurações complexas de infraestrutura em nuvem (como ocorreria usando o Docker, que adicionaria uma curva de aprendizado desnecessária) e oferece uma hospedagem gratuita, veloz e muito amigável para projetos de estudantes.

---

## Conclusão geral

**Conjunto de ferramentas escolhido pela equipe:**

| Categoria | Ferramenta escolhida |
|---|---|
| IDE / Editor de código | VS Code |
| Cliente de banco de dados | DBeaver |
| Teste de API | Thunder Client |
| Categoria complementar | Node.js + Vercel |

**Considerações finais:**
A equipe pretende utilizar esse conjunto de ferramentas de forma altamente integrada ao longo do semestre. O objetivo é manter o VS Code como a "central de comando" do projeto. Usaremos a extensão Thunder Client para testar as rotas da API em tempo real e o DBeaver para gerenciar os dados de forma universal e gratuita, tudo rodando no ambiente Node.js e publicado automaticamente via Vercel. A principal dificuldade durante a pesquisa foi justamente filtrar opções robustas que não exigissem licenciamento pago ou configurações avançadas de infraestrutura que pudessem desviar o foco do aprendizado das linguagens de programação.

---

## Referências consultadas

- [Documentação do Visual Studio Code](https://code.visualstudio.com/docs)
- [Site oficial do DBeaver](https://dbeaver.io/)
- [Documentação oficial do Node.js](https://nodejs.org/pt-br/docs/)
- [Documentação do Vercel](https://vercel.com/docs)

---
