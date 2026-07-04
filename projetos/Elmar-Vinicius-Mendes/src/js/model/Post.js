class Post {
    constructor(id, usuario_id, conteudo, imagem) {
        this.id = id;
        this.usuario_id = usuario_id;
        this.conteudo = conteudo;
        this.imagem = imagem;
    }
}

module.exports = Post;