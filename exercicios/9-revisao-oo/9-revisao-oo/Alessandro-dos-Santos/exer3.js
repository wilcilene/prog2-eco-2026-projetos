class Veiculo {
    constructor(marca, modelo, ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }

    descricao() {
        return `Veículo: ${this.marca} ${this.modelo} (${this.ano})`;
    }
}

class Carro extends Veiculo {
    constructor(marca, modelo, ano) {
        super(marca, modelo, ano);
    }

    descricao() {
        return `Carro: ${this.marca} ${this.modelo} (${this.ano})`;
    }
}

class Moto extends Veiculo {
    constructor(marca, modelo, ano) {
        super(marca, modelo, ano);
    }

    descricao() {
        return `Moto: ${this.marca} ${this.modelo} (${this.ano})`;
    }
}

function imprimirDescricao(veiculo) {
    console.log(veiculo.descricao());
}

// Teste
let v = new Veiculo("Ford", "Ka", 2010);
let c = new Carro("Chevrolet", "Onix", 2022);
let m = new Moto("Honda", "CG", 2020);

imprimirDescricao(v);
imprimirDescricao(c);
imprimirDescricao(m);