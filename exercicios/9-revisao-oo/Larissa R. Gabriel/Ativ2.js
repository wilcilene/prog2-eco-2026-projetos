//Atividade 2 - Encapsulando um carrinho de compras


class CarrinhoDeCompras {

    #lista_itens; // atributo privado

    constructor(lista_itens){
        this.#lista_itens = [];
        this.adicionarlistaItens(lista_itens);
    }

    adicionarItem(item){
        if(!item || !(item instanceof Item)){
            throw new Error('O item é obrigatório e deve ser uma instância da classe Item.');
        }

        for(let itemLista of this.#lista_itens){
            if(itemLista.descricao === item.descricao && itemLista.preco === item.preco){
                throw new Error('O item já está no carrinho de compras.');
            }
        }

        this.#lista_itens.push(item);
    }

    adicionarlistaItens(lista_itens){
        if(!lista_itens || !Array.isArray(lista_itens)){
            throw new Error('A lista de itens é obrigatória e deve ser um array.');
        }

        for(let item of lista_itens){
            this.adicionarItem(item);
        }
    }

    removerItem(descricao){
        if(!descricao || typeof descricao !== 'string'){
            throw new Error('A descrição do item a ser removido deve ser uma string não vazia.');
        }

        for(let i = 0; i < this.#lista_itens.length; i++){
            if(this.#lista_itens[i].descricao === descricao){
                this.#lista_itens.splice(i, 1);
                return;
            }
        }

        throw new Error('Item não encontrado no carrinho de compras.');
    }

    calcularTotal(){
        let total = 0;

        for(let item of this.#lista_itens){
            total += item.preco * item.quantidade;
        }

        return total;
    }

    listarItens(){
        return [...this.#lista_itens];
    }

}

class Item {

    constructor(descricao, preco, quantidade){
        this.descricao = descricao;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    toString(){
        return `Peça: ${this.descricao}, Preço: R$${this.preco.toFixed(2)}, Quantidade: ${this.quantidade}`;
    }

}

const itens = [

    new Item("Livro", 50, 1),
    new Item("Caneta", 5, 3),
    new Item("Lapiseira", 7, 1)
];

const carrinho = new CarrinhoDeCompras([]);

for (let i = 0; i < itens.length; i++) {
    carrinho.adicionarItem(itens[i]);
}

for(let item of carrinho.listarItens()){
    console.log(item.toString());
}

console.log("Total:", carrinho.calcularTotal());