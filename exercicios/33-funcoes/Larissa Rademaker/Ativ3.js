/*
Dado o array de produtos abaixo, resolva cada item usando o método indicado:

const produtos = [
  { nome: "Mouse",    preco: 80,  estoque: 5  },
  { nome: "Teclado",  preco: 150, estoque: 0  },
  { nome: "Monitor",  preco: 900, estoque: 2  },
  { nome: "Headset",  preco: 200, estoque: 8  },
  { nome: "Webcam",   preco: 120, estoque: 0  },
];
filter: retorne apenas os produtos com estoque maior que zero.
map: aplique 10% de desconto em todos os preços e retorne um novo array com nome e novo preço.
reduce: calcule o valor total do estoque (preco × estoque) de todos os produtos.
Desafio: usando encadeamento, calcule o valor total apenas dos produtos disponíveis em estoque.

*/

const produtos = [
  { nome: "Mouse",    preco: 80,  estoque: 5  },
  { nome: "Teclado",  preco: 150, estoque: 0  },
  { nome: "Monitor",  preco: 900, estoque: 2  },
  { nome: "Headset",  preco: 200, estoque: 8  },
  { nome: "Webcam",   preco: 120, estoque: 0  },
];

stockfiltro = produtos.filter(produto => produto.estoque > 0);


Mapa = produtos.map(produto => {
        return {
            nome: produto.nome,
            preco: produto.preco * 0.9
        }
    });


Reduce = produtos.reduce((total, produto) => {
        return total + (produto.preco * produto.estoque);
    }, 0);


Desafio = produtos.filter(produto => produto.estoque > 0).reduce((total, produto) => {
            return total + (produto.preco * produto.estoque);
        }, 0);


console.log("Produtos com estoque maior que zero:");
console.log(stockfiltro);
console.log("Produtos com desconto de 10%:");
console.log(Mapa);
console.log("Valor total do estoque:");
console.log(Reduce);
console.log("Valor total dos produtos disponíveis em estoque:");
console.log(Desafio);