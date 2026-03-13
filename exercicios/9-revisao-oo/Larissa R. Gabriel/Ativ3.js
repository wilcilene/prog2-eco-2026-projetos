//Atividade 3 – Herança e polimorfismo com veículos

class Veiculo {

    constructor(marca, modelo, ano){
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;

    }

    descricao(){
        return `Dados do Veículo' \n '- Marca: ${this.marca}' \n '- Modelo: ${this.modelo}' \n '- Ano: ${this.ano}`;
    }

}

class Carro extends Veiculo{

    constructor(marca, modelo, ano, portas){
        super(marca, modelo, ano); 
        this.portas = portas;

    }

    descricao(){
        return `Dados do Carro \n - Marca: ${this.marca} \n - Modelo: ${this.modelo} \n - Ano: ${this.ano} \n - Portas: ${this.portas}`;
    }
}

class Moto extends Veiculo{

    constructor(marca, modelo, ano, cilindradas){
        super(marca, modelo, ano);
        this.cilindradas = cilindradas;

    }

    descricao(){
        return `Dados da Moto \n - Marca: ${this.marca} \n - Modelo: ${this.modelo} \n - Ano: ${this.ano} \n - Cilindradas: ${this.cilindradas}`;
    }

}

const carro1 = new Carro("Toyota", "Corolla", 2020, 4);
const moto1 = new Moto("Honda", "CB500", 2019, 500);

console.log(carro1.descricao());
console.log(moto1.descricao());