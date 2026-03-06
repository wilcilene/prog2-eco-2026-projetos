# Como contribuir com este repositório

Este guia explica passo a passo como você pode configurar seu ambiente, organizar seu código e fazer entregas ao longo do semestre.

---

## 1. Pré-requisitos

Antes de começar, instale na sua máquina:

- [Git](https://git-scm.com/) (controle de versão).
- [Node.js](https://nodejs.org/) (ambiente de execução JavaScript).
- Um editor de código, de preferência [VS Code](https://code.visualstudio.com/).
- Uma conta no [GitHub](https://github.com/).

---

## 2. Configurando o repositório localmente

### 2.1 Fork do repositório

1. Acesse a página do repositório da disciplina.
2. Clique no botão **Fork** (canto superior direito).
3. Isso criará uma cópia do repositório na sua conta do GitHub.

### 2.2 Clone para sua máquina

No terminal, execute:

```bash
git clone https://github.com/SEU-USUARIO/prog2-eco-2026-projetos.git
cd prog2-eco-2026-projetos
```
Obs: troque /SEU-USUARIO/ pelo seu usuário. Exemplo /wilcilene/

### 2.3 Configure o repositório original como upstream

```bash
git remote add upstream https://github.com/wilcilene/prog2-eco-2026-projetos.git
```

Isso permite que você atualize sua cópia com as novidades do repositório oficial sempre que necessário:

```bash
git fetch upstream
git merge upstream/main
```

---

## 3. Estrutura das pastas

### Projeto semestral (dupla)

Cada dupla trabalha exclusivamente dentro da própria pasta:

```
projetos/dupla-01-nome1-nome2/
  ├── README.md   ← descrição do projeto, integrantes e prints/link
  └── src/        ← todo o código-fonte do projeto
```

Use o modelo em `templates/README-dupla.md` para criar o README da sua dupla.

### Exercícios

Cada estudante cria uma pasta com seu nome dentro da pasta do exercício:

```
exercicios/9-revisao-oo/entregas/
  └── seu-nome/
      ├── README.md   ← breve descrição da sua solução
      └── exercicio1
        ├── script.js, index.html, etc.
```

---

## 4. Fluxo de entrega

### Passo a passo para cada entrega

1. **Sincronize** com o repositório oficial antes de começar:

   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Crie uma branch** com seu nome e o nome da entrega:

   ```bash
   git checkout -b entrega/seu-nome/exercicio1
   ```

3. **Adicione seus arquivos** na pasta correta.

4. **Faça commit** com uma mensagem clara:

   ```bash
   git add .
   git commit -m "exercício: 9-revisao-oo - seu nome"
   ```

5. **Envie para o seu fork**:

   ```bash
   git push origin entrega/seu-nome
   ```

6. **Abra um Pull Request** no GitHub:
   - Acesse o repositório original.
   - Clique em **Compare & pull request**.
   - Preencha o título e a descrição conforme o template.
   - Clique em **Create pull request**.
