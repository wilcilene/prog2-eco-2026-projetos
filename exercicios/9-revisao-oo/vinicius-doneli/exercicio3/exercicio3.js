class Veiculo {
    constructor(marca, modelo, ano) {
        if (!marca || marca.trim() === "") {
            throw new Error("Marca é obrigatória.");
        }

        if (!modelo || modelo.trim() === "") {
            throw new Error("Modelo é obrigatório.");
        }

        if (!Number.isInteger(ano) || ano <= 0) {
            throw new Error("Ano inválido.");
        }

        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }

    descricao() {
        return `Veículo: ${this.marca} ${this.modelo} (${this.ano})`;
    }
}

class Carro extends Veiculo {
    descricao() {
        return `Carro: ${this.marca} ${this.modelo} - Ano ${this.ano}`;
    }
}

class Moto extends Veiculo {
    descricao() {
        return `Moto: ${this.marca} ${this.modelo} - Ano ${this.ano}`;
    }
}

function imprimirDescricao(veiculo) {
    if (!(veiculo instanceof Veiculo)) {
        throw new Error("O objeto deve ser um Veiculo ou uma de suas subclasses.");
    }

    console.log(veiculo.descricao());
}

const carro1 = new Carro("Honda", "Civic", 2024);
const moto1 = new Moto("Honda", "Shadow 600", 2003);

imprimirDescricao(carro1);
imprimirDescricao(moto1);