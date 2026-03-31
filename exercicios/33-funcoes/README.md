# Entregas

https://wilcilene.github.io/estudos/disciplinas/programacaoii-eco/funcoes-callbacks-arrow.html

## Funções
Funções são blocos de código reutilizáveis que executam uma tarefa específica.

## Callbacks
Callbacks são funções passadas como argumento para outras funções e executadas posteriormente.

## Arrow Functions
As arrow functions são uma forma mais curta de escrever funções em JavaScript e não possuem seu próprio `this`.

---

## Estrutura das entregas
Indique os nomes em ordem alfabética

```
📁 33-funcoes/nome-um-e-nome-dois
├── exercicio01.js
├── exercicio02.js
├── exercicio03.js
├── ...
└── README.md
```

---

# Passo a passo para facilitar as entregas
https://wilcilene.github.io/estudos/disciplinas/programacaoii-eco/git-e-github.html


---

# Exemplos

## Callback
```javascript
function saudacao(nome, callback) {
  console.log("Olá, " + nome);
  callback();
}

function despedida() {
  console.log("Até mais!");
}

saudacao("Maria", despedida);
```

---

## Arrow Function
```javascript
const soma = (a, b) => a + b;

console.log(soma(2, 3)); // 5
```

---

## Callback com Arrow Function
```javascript
function executar(callback) {
  callback();
}

executar(() => console.log("Executando callback com arrow function"));
```

---
