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

const carro = new Carro("Volkswagen", "Golf", 2017);
const moto = new Moto("Yamaha", "MT-07", 2025);

imprimirDescricao(carro);
imprimirDescricao(moto);