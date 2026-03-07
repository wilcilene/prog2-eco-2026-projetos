# Exercício – Aula 01 – [Exercicio1]

## Estudante

- **Nome:** Vinicius dos Santos Doneli
- **Matrícula:** 2022002382

---

## Descrição da solução

> Descreva brevemente o que você implementou, as classes criadas e as decisões que tomou.

Foi pedido pelo exercício a criação de duas classes, são elas "Curso" e "Turma".
A classe Curso contém as informações básicas de um curso, contendo os atributos nome e carga horária. Durante a criação do objeto, foram implementadas validações para garantir que o nome do curso não seja vazio e que a carga horária seja um número inteiro positivo.

A classe Turma representa uma turma vinculada a um curso específico. No construtor da classe, é realizada uma validação para garantir que a turma esteja associada a um objeto válido da classe Curso. Além disso, a turma mantém uma lista de estudantes, armazenados em um vetor.

Para adicionar estudantes à turma, foi criado o método adicionarEstudante(nome, matricula). Esse método realiza validações para garantir que o nome e a matrícula sejam informados corretamente. Também foi implementada uma verificação para impedir que dois estudante com a mesma matrícula sejam adicionados a turma, evitando alunos duplicados.

Os estudantes são armazenados como objetos simples dentro da lista de estudantes, contendo nome e matrícula. Foi implementado também o método listarEstudantes(), que retorna todos os estudantes cadastrados na turma.

---

## Como executar

```bash
# No navegador
# Abra o arquivo index.html no navegador e pressione F12 para ver o console.

# Ou com Node.js
node exercicio1.js
```

---

## Arquivos entregues

| Arquivo | Descrição |
|---------|-----------|
| `exercicio1.js` | Código principal |
| `index.html` | Arquivo HTML (se houver) |

---

## Dificuldades encontradas

> Opcional. Descreva o que foi mais difícil de implementar ou o que ficou pendente.
