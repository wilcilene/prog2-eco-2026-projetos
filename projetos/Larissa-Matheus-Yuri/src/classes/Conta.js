export class Conta {

    constructor(id, nome, pontuacao = 0){

        this.id = id;
        this.nome = nome;
        this.pontuacao = pontuacao;
    }

    SetPontuacao(pontuacao){

        this.pontuacao = pontuacao;
    }
}