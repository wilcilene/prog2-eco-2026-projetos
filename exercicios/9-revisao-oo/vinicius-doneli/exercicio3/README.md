# Exercício – Aula 01 – [Exercicio3]

## Estudante

- **Nome:** Vinicius dos Santos Doneli
- **Matrícula:** 2022002382

---

## Descrição da solução

> Descreva brevemente o que você implementou, as classes criadas e as decisões que tomou.

Inicialmente foi criada a classe Veiculo, responsável por representar as informações básicas de um veículo. Essa classe possui os atributos marca, modelo e ano, além do método descricao(), que retorna uma descrição textual do veículo. Também foram incluídas validações para garantir que os dados informados sejam válidos.

A partir da classe Veiculo, foram criadas duas subclasses: Carro e Moto. Essas classes herdam os atributos da classe base e sobrescrevem o método descricao(), retornando uma descrição específica para cada tipo de veículo.

Para demonstrar o conceito de polimorfismo, foi criada a função imprimirDescricao(veiculo), que recebe como parâmetro qualquer objeto que seja uma instância de Veiculo ou de suas subclasses. Essa função chama o método descricao() do objeto recebido, permitindo que cada tipo de veículo apresente sua própria implementação do método.

---

## Como executar

```bash
# No navegador
# Abra o arquivo index.html no navegador e pressione F12 para ver o console.

# Ou com Node.js
node exercicio3.js
```

---

## Arquivos entregues

| Arquivo | Descrição |
|---------|-----------|
| `exercicio3.js` | Código principal |
| `index.html` | Arquivo HTML (se houver) |

---

## Dificuldades encontradas

> Opcional. Descreva o que foi mais difícil de implementar ou o que ficou pendente.
