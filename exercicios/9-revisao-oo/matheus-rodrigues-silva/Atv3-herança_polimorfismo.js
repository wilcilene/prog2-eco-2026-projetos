class Veiculo{
    constructor(marca, modelo, ano){
        
        if(!marca || typeof marca !== 'string'){
            throw new Error("Marca deve ser uma string não vazia");
        }

        if(!modelo || typeof modelo !== 'string'){
            throw new Error("Modelo deve ser uma string não vazia");
        }

        if(!ano || typeof ano !== 'number' || ano.toString().length !== 4){
            throw new Error("Ano deve ser um numero de 4 caracteres");
        }

        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
    }

    descricao(){
        console.log("marca:" + this.marca + "\n modelo: " + this.modelo + "\n ano:" + this.ano);
    }
}

class Carro extends Veiculo{
    constructor(marca, modelo, ano){
        super(marca, modelo, ano);
        this.rodas = 4;
    }

    descricao(){
        console.log("marca:" + this.marca + "\n modelo: " + this.modelo + "\n ano:" + this.ano + "\n rodas:" + this.rodas);
    }
}

class Moto extends Veiculo{
    constructor(marca, modelo, ano){
        super(marca, modelo, ano);
        this.rodas = 2;
    }

    descricao(){
        console.log("marca:" + this.marca + "\n modelo: " + this.modelo + "\n ano:" + this.ano + "\n rodas:" + this.rodas);
    }
}


function imprimirDescricao(veiculo){
    
    veiculo.descricao()
}



// Exemplo de uso

carro1 = new Carro("Toyota","Corolla", 2020);
moto1 = new Moto("Honda", "CB500", 2019);

imprimirDescricao(carro1);
console.log("__________________________");
imprimirDescricao(moto1);

