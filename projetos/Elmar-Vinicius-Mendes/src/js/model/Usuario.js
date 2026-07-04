class Usuario {
    constructor(id, nome, telefone, username, email, genero, senha) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.username = username;
        this.email = email;
        this.genero = genero;
        this.senha = senha;
    }
}

module.exports = Usuario;
