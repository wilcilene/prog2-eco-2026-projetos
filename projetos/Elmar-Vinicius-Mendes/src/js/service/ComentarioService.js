const ComentarioRepository = require('../repository/ComentarioRepository');


class ComentarioService {


    async comentar(post_id, usuario_id, conteudo) {
        return await ComentarioRepository.salvar(post_id, usuario_id, conteudo);
    }


    async listarPorUsuario(usuario_id, viewer_id) {
    const [posts] = await ComentarioRepository.buscarPostsComentadosPorUsuario(usuario_id, viewer_id);
    return posts;
}


    async listar(post_id) {
        const [comentarios] = await ComentarioRepository.buscarPorPost(post_id);
        return comentarios;
    }


    async contar(post_id) {
        const [[resultado]] = await ComentarioRepository.contar(post_id);
        return resultado.total;
    }
}

module.exports = new ComentarioService();
