class Item{
    constructor(nome, preco, quantidade){
        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do item deve ser uma string não vazia.');
        }
        if(!preco || typeof preco !== 'number' || preco <= 0){
            throw new Error('O preço deve ser um número positivo.');
        }
        if(!quantidade || typeof quantidade !== 'number' || quantidade <= 0){
            throw new Error('A quantidade deve ser um número positivo.');
        }

        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }
}

class CarrinhoDeCompras{
    #itens;
    
    constructor(){
        this.#itens = [];
    }

    adicionarItem(item){
        if(!item || !(item instanceof Item)){
            throw new Error('O item é obrigatório e deve ser uma instância da classe Item.');
        }

        this.#itens.push(item);
    }

    removerItem(nome){
        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do item a ser removido deve ser uma string não vazia.');
        }

        for(let item of this.#itens){
            if(item.nome === nome){
                this.#itens.splice(this.#itens.indexOf(item), 1);
                return;
            }
        }
        throw new Error('Item não encontrado no carrinho.');
    }

    calcularTotal(){
        let total = 0;
        for(let item of this.#itens){
            total += item.preco * item.quantidade;
        }
        return total;
    }

    listarItens(){
        return this.#itens
    }
}

// Exemplo de uso
const carrinho = new CarrinhoDeCompras();
const item1 = new Item('Camiseta', 50, 2);
const item2 = new Item('Calça', 100, 1);
carrinho.adicionarItem(item1);
carrinho.adicionarItem(item2);
console.log(carrinho.listarItens());
console.log('Total: R$' + carrinho.calcularTotal());
carrinho.removerItem('Camiseta');
console.log(carrinho.listarItens());
console.log('Total: R$' + carrinho.calcularTotal());