

class CarrinhoDeCompras {
  constructor() {
    this.itens = [];
  }

  adicionarItem(descricao, preco, quantidade) {
    if (quantidade <= 0 || preco <= 0) {
      console.log("Quantidade e preço devem ser positivos.");
      return;
    }
    this.itens.push({ descricao, preco, quantidade });
  }

  removerItem(descricao) {
   
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].descricao === descricao) {
        this.itens.splice(i, 1);
        return;
      }
    }
    console.log("Item não encontrado.");
  }

  calcularTotal() {
    let total = 0;
    for (let item of this.itens) {
      total += item.preco * item.quantidade;
    }
    return total;
  }

  listarItens() {
    if (this.itens.length === 0) {
      console.log("Carrinho vazio.");
    } else {
      for (let item of this.itens) {
        console.log(item.descricao + " - R$" + item.preco.toFixed(2) + " x " + item.quantidade);
      }
    }
  }
}

