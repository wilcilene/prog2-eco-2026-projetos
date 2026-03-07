class Veiculo {
    constructor(marca, modelo, ano, cor) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
    }

    descricao() {
        return `Veiculo: ${this.marca} ${this.modelo} ${this.ano} ${this.cor}`;
    }
}

class Carro extends Veiculo {
    constructor(marca, modelo, ano, cor) {
        super(marca, modelo, ano, cor);
    }

    descricao() {
        return `Carro: ${this.marca} ${this.modelo} ${this.ano} ${this.cor}`;  // propriedades do objeto, é executada quando chama o descrição
    }
}

class Moto extends Veiculo {
    constructor(marca, modelo, ano, cor) {
        super(marca, modelo, ano, cor);
    }

    descricao() {
        return `Moto: ${this.marca} ${this.modelo} ${this.ano} ${this.cor}`;
    }
}

// polimorfismo 
function imprimirDescricao(veiculo) {
    console.log(veiculo.descricao());
}

// mostra no terminal
const veiculo = new Veiculo('Generico - ', 'SJID - ', 2020, ' - Azul');
const carro = new Carro('Toyota - ', 'Yaris - ', 2022, '- Cinza');
const moto = new Moto('Wolks - ', 'Gol - ', 2013, '- Vermelha');

imprimirDescricao(veiculo);
imprimirDescricao(carro);
imprimirDescricao(moto);
