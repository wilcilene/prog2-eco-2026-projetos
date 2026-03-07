// Carrinho de compras com encapsulamento e validações

class CarrinhoDeCompras {
    // campo privado (ES2022) para manter os itens ocultos
    #itens = [];

    // não há parâmetros no construtor, mas poderíamos inicializar com itens
    constructor() {}

    // método auxiliar para validar item
    #validarItem(descricao, preco, quantidade) {
        if (typeof descricao !== 'string' || descricao.trim().length === 0) {
            throw new Error('Descrição inválida');
        }
        if (typeof preco !== 'number' || preco < 0) {
            throw new Error('Preço deve ser um número não negativo');
        }
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            throw new Error('Quantidade deve ser inteiro positivo');
        }
    }

    adicionarItem(descricao, preco, quantidade = 1) {
        this.#validarItem(descricao, preco, quantidade);
        // procuramos se já existe item com mesma descrição
        const existente = this.#itens.find(i => i.descricao === descricao);
        if (existente) { 
            existente.quantidade += quantidade;
        } else {
            this.#itens.push({ descricao, preco, quantidade });
        }
    }

    removerItem(descricao, quantidade = 1) {
        if (typeof descricao !== 'string' || descricao.trim().length === 0) {
            throw new Error('Descrição inválida');
        }
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            throw new Error('Quantidade deve ser inteiro positivo');
        }

        const idx = this.#itens.findIndex(i => i.descricao === descricao);
        if (idx === -1) {
            throw new Error('Item não encontrado no carrinho');
        }

        const item = this.#itens[idx];
        if (quantidade >= item.quantidade) {
            // remove totalmente
            this.#itens.splice(idx, 1);
        } else {
            item.quantidade -= quantidade;
        }
    }

    calcularTotal() {
        return this.#itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
    }

    listarItens() {
        // retorna cópia para que não se acesse diretamente
        return this.#itens.map(i => ({ ...i }));
    }
}


const carrinho = new CarrinhoDeCompras();
carrinho.adicionarItem('Caneta', 2.5, 3);
carrinho.adicionarItem('Caderno', 15, 1);
console.log(carrinho.listarItens());
console.log('Total', carrinho.calcularTotal());

