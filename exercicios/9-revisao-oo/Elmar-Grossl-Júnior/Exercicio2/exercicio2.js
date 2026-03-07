class CarrinhoDeCompras {

    #itens = [];

    adicionarItem(descricao, preco, quantidade) {

        if (!descricao || typeof descricao !== "string") {
            throw new Error("Descrição inválida.");
        }

        if (preco <= 0) {
            throw new Error("Preço deve ser maior que zero.");
        }

        if (quantidade <= 0) {
            throw new Error("Quantidade deve ser maior que zero.");
        }

        const itemExistente = this.#itens.find(
            item => item.descricao === descricao
        );

        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            this.#itens.push({
                descricao,
                preco,
                quantidade
            });
        }
    }

    removerItem(descricao) {

        const indice = this.#itens.findIndex(
            item => item.descricao === descricao
        );

        if (indice === -1) {
            throw new Error("Item não encontrado no carrinho.");
        }

        this.#itens.splice(indice, 1);
    }

    calcularTotal() {

        return this.#itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);

    }

    listarItens() {

        return this.#itens.map(item => ({
            descricao: item.descricao,
            preco: item.preco,
            quantidade: item.quantidade,
            subtotal: item.preco * item.quantidade
        }));

    }

}

const carrinho = new CarrinhoDeCompras();

carrinho.adicionarItem("Mouse", 300, 2);
carrinho.adicionarItem("Teclado", 400, 1);

console.log("Itens no carrinho:");
console.log(carrinho.listarItens());

console.log("Total:");
console.log(carrinho.calcularTotal());

carrinho.removerItem("Mouse");

console.log("Carrinho depois de remover Mouse:");
console.log(carrinho.listarItens());