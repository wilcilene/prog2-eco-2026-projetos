const RepostRepository = require('../repository/RepostRepository');

class RepostService {


    async repostar(post_id, usuario_id) {
        return await RepostRepository.repostar(post_id, usuario_id);
    }


    async desfazer(post_id, usuario_id) {
        return await RepostRepository.desfazerRepost(post_id, usuario_id);
    }

    async checar(post_id, usuario_id) {
        const [rows] = await RepostRepository.checar(post_id, usuario_id);
        return rows.length > 0;
    }

    async contar(post_id) {
        const [[res]] = await RepostRepository.contar(post_id);
        return res.total;
    }
}

module.exports = new RepostService();