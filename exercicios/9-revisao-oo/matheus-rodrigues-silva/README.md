# Exercício – Aula 4 – Revisão de conceitos OOP

## Estudante

- **Nome:** Matheus Rodrigues Silva
- **Matrícula:** 2024003816

---

## Descrição da solução

### Atividade 1:

Na atividade 1, criei as classes Curso, Estudante e Turma, no qual a turma deveria ter um curso pre definido e estudantes.
Os estudantes eram opcionais no constructor, caso não enviasse o estudante, iria criar uma lista vazia. 
Assim, para adicionar novos estudantes individualemente foi criado as funções adicionarEstudante e adicionarlistaEstudantes que consequentemente chama a adicionarEstudante. Além de que antes de adicionar a lista da turma em si, é verificado se o estudante já estava na lista por meio da matricula.

### Atividade 2:

Na atividade 2, criei as classes Item, e na classe CarrinhoDeCompras, no qual armazena uma lista encapsulada dos intens.
O carrinho de compras é criado sem nenhum parametro no constructor, portanto, tem-se as funções adicionarItem, removerItem, que tem função de gerenciar a lista dos itens no carrinho de compra.
Além disso, possui a função calcularTotal para ver o valor total a se pagar e listarItens que seria basigamente um get da lista de itens.

### Atividade 3:

Na atividade 3, criei a classe Veiculo e subclasses desta, como a Moto e o Carro.
A classe Moto e Carro, possui os mesmo atributos veiculo, com adição da rodas, onde cada uma tem um valor especifico, assim sobrescrevendo o metodo descricao da classe mãe Veiculo.
Além disso, fora das classes existe uma função imprimirDescricao que recebe um veiculo e imprime a descrição deles independente se é carro ou moto.

### Atividade 4:

Na atividade 4, criei a classe Livro e a classe UsuarioBiblioteca que tem um lista de livros encapsulada.
A classe UsuarioBiblioteca possui os métodos adicionar_livro para gerenciar os livros que são emprestados, verificando se já possui o livro na lista, para que assim não fique duplicado, e ele verifica isso por meio do nome do livro.
Além disso, o UsuarioBiblioteca também possui a função listar_livros que serve como um get da lista de livros

### Atividade 5:

Na atividade 5, criei a classe Pagamento e a subclasses desta, como o PagamentoCartao, PagamentoPix, PagamentoBoleto.
Todas as subclasses rescrevem a função processar da classe Pagamento, alterando a mensagem "fazendo pagamento em {tipo da classe}", aplicando assim o polimorfismo.
Além disso, fora das classes existe uma função pagar que recebe um Pagamento e chama a função processar independente da subclasse.

---

## Como executar

```bash

# No VS Code
# Abra um terminal e navegue até o diretório correto:

cd PASTAS ANTERIORES DO SEU COMPUTADOR\prog2-eco-2026-projetos\exercicios\9-revisao-oo\matheus-rodrigues-silva

# Escreva o node e nome do arquivo do exercício:
node Atv1-abstração.js
node Atv2-encapsulamento.js
node Atv3-herança_polimorfismo.js
node Atv4-biblioteca.js
node Atv5-sistema-de-pagamento.js

```

---

## Arquivos entregues

| Arquivo | Descrição |
|---------|-----------|
| `Atv1-abstração.js` | Código da atividade 1 |
| `Atv2-encapsulamento.html` | Código da atividade 2 |
| `Atv3-herança_polimorfismo.js` | Código da atividade 3 |
| `Atv4-biblioteca.html` | Código da atividade 4 |
| `Atv5-sistema-de-pagamento.js` | Código da atividade 5 |

---

## Dificuldades encontradas

Penso que a maior dificultade que passei foi me acostumar com a sintaxe do javascript que nunca tinha utilizado
