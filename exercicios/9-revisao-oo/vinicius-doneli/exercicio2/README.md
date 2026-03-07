# Exercício – Aula 01 – [Exercicio2]

## Estudante

- **Nome:** Vinicius dos Santos Doneli
- **Matrícula:** 2022002382

---

## Descrição da solução

> Descreva brevemente o que você implementou, as classes criadas e as decisões que tomou.
A classe "CarrinhoDeCompras" foi desenvolvida para representar um carrinho de compras simples, contendo uma lista interna de itens. Cada item do carrinho possui três propriedades: descrição, preço e quantidade.

Para garantir o encapsulamento, a lista de itens foi definida como um atributo privado, impedindo o acesso direto fora da classe. Dessa forma, a manipulação dos dados ocorre apenas por meio dos métodos disponibilizados pela própria classe.

O método adicionarItem(descricao, preco, quantidade) permite adicionar novos itens ao carrinho. Durante essa operação são realizadas validações para garantir que a descrição seja informada corretamente, que o preço seja maior que zero e que a quantidade seja um número inteiro positivo, evitando valores inválidos como zero ou negativos.

O método removerItem(descricao) foi implementado para permitir a remoção de um item do carrinho a partir de sua descrição. Caso o item não seja encontrado, o método informa que o produto não existe no carrinho.

Para calcular o valor total da compra, foi criado o método calcularTotal(), que percorre todos os itens armazenados e soma o resultado da multiplicação entre preço e quantidade de cada produto.

Por fim, o método listarItens() retorna todos os itens presentes no carrinho, permitindo visualizar os produtos adicionados sem acessar diretamente a lista interna.
---

## Como executar

```bash
# No navegador
# Abra o arquivo index.html no navegador e pressione F12 para ver o console.

# Ou com Node.js
node exercici2.js
```

---

## Arquivos entregues

| Arquivo | Descrição |
|---------|-----------|
| `exercicio2.js` | Código principal |
| `index.html` | Arquivo HTML (se houver) |

---

## Dificuldades encontradas

> Opcional. Descreva o que foi mais difícil de implementar ou o que ficou pendente.
