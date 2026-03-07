class CarrinhoDeCompras {
    #itens; // atributo privado (encapsulamento)

    constructor() {
        this.#itens = [];
    }

    adicionarItem(descricao, preco, quantidade) {
        if (!descricao || descricao.trim() === "") {
            throw new Error("A descrição do item é obrigatória.");
        }

        if (preco <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            throw new Error("A quantidade deve ser um número inteiro positivo.");
        }

        this.#itens.push({
            descricao: descricao,
            preco: preco,
            quantidade: quantidade
        });
    }

    removerItem(descricao) {
        const index = this.#itens.findIndex(item => item.descricao === descricao);

        if (index === -1) {
            throw new Error("Item não encontrado no carrinho.");
        }

        this.#itens.splice(index, 1);
    }

    calcularTotal() {
        return this.#itens.reduce((total, item) => {
            return total + item.preco * item.quantidade;
        }, 0);
    }

    listarItens() {
        return this.#itens.map(item => ({
            descricao: item.descricao,
            preco: item.preco,
            quantidade: item.quantidade
        }));
    }
}
const carrinho = new CarrinhoDeCompras();

carrinho.adicionarItem("Mouse", 50, 2);
carrinho.adicionarItem("Teclado", 120, 1);
carrinho.adicionarItem("Notebook", 4200, 1);

console.log(carrinho.listarItens());

console.log("Total:", carrinho.calcularTotal());

carrinho.removerItem("Mouse");

console.log(carrinho.listarItens());