# Exercício – Aula 01 – [Exercicio5]

## Estudante

- **Nome:** Vinicius dos Santos Doneli
- **Matrícula:** 2022002382

---

## Descrição da solução

> Descreva brevemente o que você implementou, as classes criadas e as decisões que tomou.

Inicialmente foi criada a classe mãe Pagamento, responsável por representar as informações gerais de um pagamento, contendo o atributo valor e o método processar(). Esse método é definido na classe base para ser sobrescrito pelas subclasses, garantindo que cada tipo de pagamento implemente seu próprio comportamento.

A partir dessa classe foram criadas três subclasses: PagamentoCartao, PagamentoPix e PagamentoBoleto. Cada uma delas herda as características da classe Pagamento e implementa sua própria versão do método processar(), retornando uma mensagem específica que representa o processamento daquele tipo de pagamento.

A classe PagamentoCartao recebe o número do cartão, a classe PagamentoPix recebe a chave PIX, e a classe PagamentoBoleto recebe o código de barras do boleto. Em cada caso foram adicionadas validações para garantir que as informações necessárias sejam informadas corretamente.

Para demonstrar o conceito de polimorfismo, foi implementada a função pagar(pagamento), que recebe como parâmetro qualquer objeto pertencente à hierarquia de Pagamento. Essa função chama o método processar() do objeto recebido, permitindo que diferentes tipos de pagamento executem sua própria lógica utilizando a mesma interface.
---

## Como executar

```bash
# No navegador
# Abra o arquivo index.html no navegador e pressione F12 para ver o console.

# Ou com Node.js
node exercicio5.js
```

---

## Arquivos entregues

| Arquivo | Descrição |
|---------|-----------|
| `exercicio5.js` | Código principal |
| `index.html` | Arquivo HTML (se houver) |

---

## Dificuldades encontradas

> Opcional. Descreva o que foi mais difícil de implementar ou o que ficou pendente.
