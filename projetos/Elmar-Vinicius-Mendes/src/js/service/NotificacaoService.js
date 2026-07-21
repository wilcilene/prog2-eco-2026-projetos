const NotificacaoRepository = require('../repository/NotificacaoRepository');


class NotificacaoService {


    async criar(usuario_id, ator_id, tipo, post_id = null) {
        return await NotificacaoRepository.criar(usuario_id, ator_id, tipo, post_id);
    }


    async deletar(usuario_id, ator_id, tipo, post_id = null) {
        return await NotificacaoRepository.deletar(usuario_id, ator_id, tipo, post_id);
    }


    async listar(usuario_id) {
        const [notifs] = await NotificacaoRepository.listarPorUsuario(usuario_id);
        return notifs;
    }


    async contarNaoLidas(usuario_id) {
        const [[resultado]] = await NotificacaoRepository.contarNaoLidas(usuario_id);
        return resultado.total;
    }


    async marcarTodasLidas(usuario_id) {
        return await NotificacaoRepository.marcarTodasLidas(usuario_id);
    }


    async buscarDonoDoPosto(post_id) {
        const [[post]] = await NotificacaoRepository.buscarDonoDoPosto(post_id);
        return post ? post.usuario_id : null;
    }
}

module.exports = new NotificacaoService();