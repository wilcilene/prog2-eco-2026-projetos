// Classe base Veiculo
class Veiculo {
    constructor(marca, modelo, ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }

    descricao() {
        return `${this.marca} ${this.modelo} (${this.ano})`;
    }
}

// Classe Carro que herda de Veiculo
class Carro extends Veiculo {
    descricao() {
        return `Carro: ${super.descricao()}`;
    }
}

// Classe Moto que herda de Veiculo
class Moto extends Veiculo {
    descricao() {
        return `Moto: ${super.descricao()}`;
    }
}

// Função que demonstra polimorfismo
function imprimirDescricao(veiculo) {
    console.log(veiculo.descricao());
}

// Demonstração
const veiculo = new Veiculo("Generica", "Modelo X", 2020);
const carro = new Carro("Toyota", "Corolla", 2021);
const moto = new Moto("Honda", "CB300", 2019);

imprimirDescricao(veiculo); // Deve imprimir: Generica Modelo X (2020)
imprimirDescricao(carro);   // Deve imprimir: Carro: Toyota Corolla (2021)
imprimirDescricao(moto);    // Deve imprimir: Moto: Honda CB300 (2019)