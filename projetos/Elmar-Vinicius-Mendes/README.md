# [Zerion] – Trio
![Logo-Zerion](/public/img/img-README/LogoReadMe.png)

## Integrantes
|           Nome              | Matrícula  |                        GitHub                              |
|-----------------------------|------------|------------------------------------------------------------|
| Elmar Grossl Júnior         | 2021015288 | [@Elmargrjr](https://github.com/Elmargrjr)                 |
| João Victor de Souza Mendes | 2024000734 | [@JoaoVictorSMendes](https://github.com/JoaoVictorSMendes) |
| Vinicius dos Santos Doneli  | 2022002382 | [@Donelli0](https://github.com/Donelli0)                   |

## Descrição do projeto

> O projeto consiste na criação de uma rede social chamada "Zerion", Onde o usuário consegue criar uma conta, ver postagens em um feed, fazer comentários e dar curtidas nas postagens, além de poder seguir ou bloquear outros usuários. A rede social também conta com a parte do administrador que consegue excluir postagens e contas de usuários se alguma política for violada.


## Diagrama de Classes
![Diagrama-Classe](/public/img/img-README/DiagramaDeClasses.png)

---

## Tecnologias utilizadas

- JavaScript (ES6+)
- HTML5 / CSS3
- Node.js
- Banco de dados: MySQL Workbench
- Framework web: Express

---

## Como executar o projeto

```bash
# Clone o repositório
git clone https://github.com/wilcilene/prog2-eco-2026-projetos.git

# Acesse a pasta do projeto
cd projetos/Elmar-Vinicius-Mendes

# Instale as dependências (se houver)
npm install

# Execute
npm start
```

---

## Estrutura de pastas

```
logs/                  ← Registros do que foi feito no dia
public/                
  ├──css               ← Estilização das páginas
  ├──img               ← Imagens do projeto
  ├──js                ← JavaScript do frontend
  ├──index.html        ← Ponto de Entrada
src/
  ├── js/
  │   ├── model/          ← classes de domínio
  │   ├── service/        ← regras de negócio
  │   ├── controller/     ← controladores
  │   └── repository/     ← acesso ao banco
  └── db/               ← scripts SQL
```

---

## Histórico de entregas

| Entrega |     Descrição        | Data | Status |
|---------|----------------------|------|--------|
| E1      | Definição do projeto |06.04 |   ✅   |
| E2      | Modelagem            |13.04 |   ✅   |
| E3      | Backend + BD         |15.06 |   ✅   |
| E4      | Interface integrada  |19.06 |   ✅   |
| E5      | Projeto final        |02.07 |   ✅   |

> ⏳ Pendente | ✅ Concluído | 🔄 Em andamento
