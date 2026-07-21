const SeguidorServiceInstance = require('../service/SeguidorService');
const NotificacaoServiceS     = require('../service/NotificacaoService');


class SeguidorController {


    async seguir(req, res) {
        try {
            const { seguidor_id, seguindo_id } = req.body;
            await SeguidorServiceInstance.seguir(seguidor_id, seguindo_id);

            await NotificacaoServiceS.criar(seguindo_id, seguidor_id, 'seguidor', null);

            res.json({ msg: 'Seguindo' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao seguir' });
        }
    }


    async listarSeguidores(req, res) {
    try {
        const { id }      = req.params;
        const seguidores  = await SeguidorServiceInstance.listarSeguidores(id);
        res.json(seguidores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao listar seguidores' });
    }
}

 
async listarSeguindo(req, res) {
    try {
        const { id }    = req.params;
        const seguindo  = await SeguidorServiceInstance.listarSeguindo(id);
        res.json(seguindo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao listar seguindo' });
    }
}


    async desseguir(req, res) {
        try {
            const { seguidor_id, seguindo_id } = req.body;
            await SeguidorServiceInstance.desseguir(seguidor_id, seguindo_id);

            await NotificacaoServiceS.deletar(seguindo_id, seguidor_id, 'seguidor', null);

            res.json({ msg: 'Deixou de seguir' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao desseguir' });
        }
    }


    async contar(req, res) {
        try {
            const { id } = req.params;
            const contagem = await SeguidorServiceInstance.contar(id);
            res.json(contagem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao contar seguidores' });
        }
    }


    async checar(req, res) {
        try {
            const { seguidor_id, seguindo_id } = req.query;
            const seguindo = await SeguidorServiceInstance.checar(seguidor_id, seguindo_id);
            res.json({ seguindo });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao checar' });
        }
    }
}

module.exports = new SeguidorController();