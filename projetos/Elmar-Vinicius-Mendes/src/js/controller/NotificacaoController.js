const NotificacaoServiceInstance = require('../service/NotificacaoService');


class NotificacaoController {


    async listar(req, res) {
        try {
            const { usuario_id } = req.params;
            const notifs = await NotificacaoServiceInstance.listar(usuario_id);
            res.json(notifs);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao listar notificações' });
        }
    }

    async contarNaoLidas(req, res) {
        try {
            const { usuario_id } = req.params;
            const total = await NotificacaoServiceInstance.contarNaoLidas(usuario_id);
            res.json({ total });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao contar notificações' });
        }
    }


    async marcarLidas(req, res) {
        try {
            const { usuario_id } = req.params;
            await NotificacaoServiceInstance.marcarTodasLidas(usuario_id);
            res.json({ msg: 'Notificações marcadas como lidas' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao marcar notificações' });
        }
    }
}

module.exports = new NotificacaoController();
