const LikeRepository = require('../repository/LikeRepository');


class LikeService {

    async curtir(post_id, usuario_id) {
        return await LikeRepository.curtir(post_id, usuario_id);
    }


    async listarPorUsuario(usuario_id, viewer_id) {
    const [posts] = await LikeRepository.buscarPostsCurtidosPorUsuario(usuario_id, viewer_id);
    return posts;
}


    async descurtir(post_id, usuario_id) {
        return await LikeRepository.descurtir(post_id, usuario_id);
    }


    async contar(post_id) {
        const [[resultado]] = await LikeRepository.contar(post_id);
        return resultado.total;
    }


    async jaLikeu(post_id, usuario_id) {
        const [rows] = await LikeRepository.jaLikeu(post_id, usuario_id);
        return rows.length > 0;
    }
}

module.exports = new LikeService();