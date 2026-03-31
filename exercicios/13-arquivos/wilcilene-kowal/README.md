# Exercícios – Interfaces, Exceções e Manipulação de Arquivos

**Disciplina:** Programação II – Engenharia de Computação – IFC  
**Aluna:** Wilcilene Kowal  
**Tópico:** Interfaces, Exceções e Manipulação de Arquivos em JavaScript

---

## Estrutura das pastas

```
wilcilene-kowal/
├── exercicio1/   → Calculadora com interface de operação
├── exercicio2/   → Leitor de arquivo CSV simples
├── exercicio3/   → Diário de estudos com exportação
└── exercicio4/   → Tratamento de erros de rede com fetch (extra)
```

---

## Como executar os exercícios

Existem três formas de rodar os arquivos. Escolha a que for mais conveniente para você.

---

### Opção A – GitHub Pages (sem instalar nada, só o navegador)

Como o repositório já está publicado no GitHub Pages, você pode acessar cada exercício diretamente pelo navegador:

| Exercício | Link |
|-----------|------|
| Exercício 1 – Calculadora | [Abrir](https://wilcilene.github.io/prog2-eco-2026-projetos/exercicios/13-arquivos/wilcilene-kowal/exercicio1/) |
| Exercício 2 – Leitor CSV | [Abrir](https://wilcilene.github.io/prog2-eco-2026-projetos/exercicios/13-arquivos/wilcilene-kowal/exercicio2/) |
| Exercício 3 – Diário de estudos | [Abrir](https://wilcilene.github.io/prog2-eco-2026-projetos/exercicios/13-arquivos/wilcilene-kowal/exercicio3/) |
| Exercício 4 – Erros de rede (extra) | [Abrir](https://wilcilene.github.io/prog2-eco-2026-projetos/exercicios/13-arquivos/wilcilene-kowal/exercicio4/) |

> **Dica:** se o link abrir uma página em branco, aguarde alguns minutos — o GitHub Pages pode demorar um pouco para publicar novos arquivos após o commit.

---

### Opção B – Baixar e abrir direto no navegador (sem instalar nada)

Essa opção funciona para os exercícios 1, 2 e 3. O exercício 4 usa `fetch` e pode não funcionar corretamente desta forma (veja a observação abaixo).

**Passo a passo:**

1. Acesse a pasta do exercício desejado aqui no GitHub.
2. Clique no arquivo `index.html`.
3. Clique no botão **Raw** (canto superior direito do arquivo).
4. No navegador, pressione `Ctrl+S` para salvar o arquivo no seu computador.
5. Salve com o nome `index.html` em uma pasta de sua escolha.
6. Clique duas vezes no arquivo salvo — ele abrirá no navegador.

> ⚠️ **Exercício 4:** usa `fetch` para buscar dados de uma API. Quando o arquivo é aberto diretamente do disco (`file://`), alguns navegadores bloqueiam esse tipo de requisição por segurança. Use a Opção A ou C para testar o exercício 4 corretamente.

---

### Opção C – VS Code com Live Server (recomendada para quem quer desenvolver)

Essa opção funciona para **todos os exercícios**, incluindo o 4.

**Passo a passo:**

1. Instale o [VS Code](https://code.visualstudio.com/) caso ainda não tenha.
2. Abra o VS Code, vá em **Extensões** (ícone de quadradinhos na barra lateral ou `Ctrl+Shift+X`) e instale a extensão **Live Server** (autor: Ritwick Dey).
3. Baixe os arquivos do repositório:
   - Clique no botão verde **Code** na página principal do repositório.
   - Escolha **Download ZIP**, descompacte em uma pasta.
   - Ou, se tiver o Git instalado: `git clone https://github.com/wilcilene/prog2-eco-2026-projetos.git`
4. No VS Code, abra a pasta do exercício desejado (`exercicio1`, `exercicio2`, etc.).
5. Clique com o **botão direito** no arquivo `index.html` e escolha **"Open with Live Server"**.
6. O navegador abrirá automaticamente em `http://127.0.0.1:5500`.

> **Vantagem do Live Server:** a página atualiza automaticamente toda vez que você salvar o arquivo. Ótimo para quem quiser modificar o código e ver o resultado em tempo real.

---

## Resumo – qual opção usar em cada exercício?

| | Opção A (GitHub Pages) | Opção B (arquivo local) | Opção C (Live Server) |
|---|:---:|:---:|:---:|
| Exercício 1 – Calculadora | ✅ | ✅ | ✅ |
| Exercício 2 – Leitor CSV | ✅ | ✅ | ✅ |
| Exercício 3 – Diário de estudos | ✅ | ✅ | ✅ |
| Exercício 4 – Erros de rede | ✅ | ⚠️ pode falhar | ✅ |

---

## Sobre cada exercício

### Exercício 1 – Calculadora com interface de operação
Demonstra o conceito de **interface** usando uma classe base `Operacao` e subclasses (`Soma`, `Subtracao`, `Multiplicacao`, `Potencia`, `DivisaoSegura`). O usuário digita dois valores, escolhe a operação e clica em calcular. Erros são tratados com `try/catch`.

### Exercício 2 – Leitor de arquivo CSV
O usuário escolhe um arquivo `.csv` do seu computador. O código usa a API `FileReader` para ler o conteúdo, monta uma tabela HTML dinamicamente e destaca a linha com o maior valor numérico da última coluna.

**Para testar:** crie um arquivo `.csv` com o bloco de notas, por exemplo:
```
nome,nota
Ana,9.5
João,7.2
Maria,10.0
Pedro,8.1
```
Salve como `notas.csv` e carregue no exercício.

### Exercício 3 – Diário de estudos com exportação
Formulário para registrar estudos por data, disciplina e resumo. Os registros ficam em memória e podem ser filtrados por disciplina. Um botão exporta tudo para um arquivo `.txt` que é baixado automaticamente.

### Exercício 4 – Tratamento de erros de rede (extra)
Demonstra `fetch` com `async/await` e `try/catch/finally`. Três botões buscam dados de fontes diferentes: usuários, posts (ambos de uma API pública de testes) e uma URL inválida que propositalmente gera erro, mostrando como tratar falhas de rede.

---

## Dúvidas?

Anote suas dúvidas durante o estudo e traga para a próxima aula de Programação II. 🚀
