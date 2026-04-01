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

estoque_maior_0 = produtos.filter(produto => produto['estoque'] > 0)

console.log(estoque_maior_0)

produtos_desconto = produtos.map(produto => {
    return{
        nome: produto.nome,
        preco: produto.preco - produto.preco * 0.1,
        estoque: produto.estoque
    }
})

console.log(produtos_desconto)

valor_total_estoque = produtos.reduce((total, produto) => total + (produto.preco * produto.estoque), 0)

console.log(valor_total_estoque)


//dsafiio:

const valorTotalComDesconto = produtos.filter(p => p.estoque > 0).map(p => ({ ...p, preco: p.preco * 0.9 })).reduce((total, p) => total + (p.preco * p.estoque), 0); 

console.log(valorTotalComDesconto); 