const produtos = [
  { nome: "Mouse",    preco: 80,  estoque: 5  },
  { nome: "Teclado",  preco: 150, estoque: 0  },
  { nome: "Monitor",  preco: 900, estoque: 2  },
  { nome: "Headset",  preco: 200, estoque: 8  },
  { nome: "Webcam",   preco: 120, estoque: 0  },
];

function filtrarProdutosEmEstoque(produtos) {
  const itens = produtos.filter(p => p.estoque > 0);
  console.log("Produtos com mais de 0 itens em estoque:", itens);
}

function aplicarDesconto(produtos) {
  const produtosComDesconto = produtos.map(p => ({
    ...p,
    preco: p.preco * 0.9
  }));
  console.log("Produtos com desconto:", produtosComDesconto);
}



function calcularValorTotalEstoque(produtos) {
  const valorTotal = produtos.reduce((total, produto) => {
    return total + (produto.preco * produto.estoque);
  }, 0);
  console.log("Valor total do estoque:", valorTotal);
}


filtrarProdutosEmEstoque(produtos);
aplicarDesconto(produtos);
calcularValorTotalEstoque(produtos);