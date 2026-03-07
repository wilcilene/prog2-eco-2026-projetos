# Exercício – Aula 01 – [Exercicio4]

## Estudante

- **Nome:** Vinicius dos Santos Doneli
- **Matrícula:** 2022002382

---

## Descrição da solução

> Descreva brevemente o que você implementou, as classes criadas e as decisões que tomou.

Neste exercício foi desenvolvido um pequeno sistema de gerenciamento de empréstimos de livros utilizando Programação Orientada a Objetos (POO) em JavaScript. Foram criadas as classes Livro e UsuarioBiblioteca para representar os principais elementos do sistema.

A classe Livro é responsável por armazenar as informações básicas de um livro, contendo os atributos título e autor. Durante a criação do objeto são realizadas validações para garantir que esses dados sejam informados corretamente.

A classe UsuarioBiblioteca representa um usuário da biblioteca e possui uma lista interna de livros emprestados. Para garantir o encapsulamento, essa lista foi definida como um atributo privado, impedindo o acesso direto fora da classe.

O método emprestarLivro(livro) permite adicionar um livro à lista de empréstimos do usuário. Durante essa operação é feita uma verificação para impedir que o mesmo livro seja emprestado mais de uma vez para o mesmo usuário, garantindo a integridade dos dados.

Também foi implementado o método devolverLivro(titulo), responsável por remover um livro da lista de empréstimos quando ele é devolvido.

Para consultar os empréstimos atuais, foi criado o método listarEmprestimosAtivos(), que retorna todos os livros que ainda estão emprestados para o usuário.

---

## Como executar

```bash
# No navegador
# Abra o arquivo index.html no navegador e pressione F12 para ver o console.

# Ou com Node.js
node exercicio4.js
```

---

## Arquivos entregues

| Arquivo | Descrição |
|---------|-----------|
| `exercicio4.js` | Código principal |
| `index.html` | Arquivo HTML (se houver) |

---

## Dificuldades encontradas

> Opcional. Descreva o que foi mais difícil de implementar ou o que ficou pendente.
