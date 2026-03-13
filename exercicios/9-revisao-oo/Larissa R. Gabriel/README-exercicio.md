# Exercício – Aula 4 – Revisão de conceitos OOP

## Estudante

- **Nome:** Larissa R. Gabriel
- **Matrícula:** 2024005516

---

## Descrição da solução

> Atividade 1:
Nessa atividade eu criei as classes: Curso, Turma e Estudante, onde na classe Curso haviam as informações de Nome e Carga horária do curso, na classe Estudante os atributos do nome e a matricula, e a classe Turma se tornou o ponto de encontro dos dados de ambos. De forma que seu construtor recebe um curso e uma lista de estudantes, gerada a partir dos métodos adicionarEstudante e adicionarlistaEstudantes.

> Atividade 2:
Para a atividade 2 onde o objetivo era encapsular um carrinho de compras, foram criadas apenas duas classes: Itens e CarrinhoDeCompras. A classe Item tem como atributos descrição, preço e quantidade, além de possuir um método para exibir essas informações de forma já formatada. Já a classe CarrinhoDeCompras gerencia os itens adicionados ao carrinho, utilizando encapsulamento para manter a lista de itens privada. Alem de possuir também métodos para adicionar e remover itens, adicionar uma lista de itens, listar os produtos presentes no carrinho e calcular o valor total da compra. No final do código, alguns itens são criados e adicionados ao carrinho por meio de um laço de repetição, e o programa exibe no terminal a descrição de cada item e o valor total da compra.

> Atividade 3:
Na Atividade 4, foi criada a classe base Veiculo, que representa um veículo genérico e possui atributos como marca, modelo e ano, além de um método descricao() que retorna essas informações. E a partir dessa classe, foram criadas as classes Carro e Moto, que herdam as características de Veiculo. Cada uma dessas classes adiciona um novo atributo específico como portas para carros e cilindradas para motos, sobrescrevendo o método descricao(), demonstrando o conceito de polimorfismo, ao exibir as informações específicas de cada tipo de veículo. No final do código, são criados um objeto Carro e um objeto Moto, e suas descrições são exibidas no terminal.

> Atividade 4:
Nessa atividade, foram criadas classes para representar livros, usuários da biblioteca e a biblioteca em si. A classe Livro armazena informações como título, autor e gênero, enquanto a classe usuarioBiblioteca representa os usuários e mantém uma lista dos livros que eles pegaram emprestados. Já a classe Biblioteca possui a lista de livros disponíveis e os usuários cadastrados, utilizando encapsulamento para proteger seus dados internos. Além disso, ela também possui métodos para adicionar livros, cadastrar usuários e listar os empréstimos realizados, sempre conferindo os dados inseridos.


> Atividade 5:
Para essa atividade, criei a classe Pagamento, que possui um método processar() responsável por informar que um pagamento está sendo processado. A partir dessa classe base, criei três classes filhas: PagamentoCartao, PagamentoPix e PagamentoBoleto, que herdam de Pagamento e sobrescrevem o método processar() para exibir mensagens informando o processamento do pagamento. Além da função chamada pagamento que recebe um objeto de pagamento e chama o método processar(), permitindo que diferentes tipos de mensagens sejam exibidas de acordo com o tipo de pagamento.

---

## Como executar

# No VS Code
# Abra um terminal e navegue até o diretório correto:

cd PASTAS ANTERIORES DO SEU COMPUTADOR\prog2-eco-2026-projetos\exercicios\9-revisao-oo\Larissa R. Gabriel

# Escreva o node e nome do arquivo do exercício:
node Ativ1.js
node Ativ2.js
node Ativ3.js
node Ativ4.js
node Ativ5.js

```

---

## Arquivos entregues

|   Arquivo     |   Descrição            |
|---------------|------------------------|
| `Ativ1.js`    | Código da Atividade 1  |
| `Ativ2.js`    | Código da Atividade 2  |
| `Ativ3.js`    | Código da Atividade 3  |
| `Ativ4.js`    | Código da Atividade 4  |
| `Ativ5.js`    | Código da Atividade 5  |

---

## Dificuldades encontradas

Para mim o mais complicado ao desenvolver esses códigos foi a adaptação ao JavaScript.
