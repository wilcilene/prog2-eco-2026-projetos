const MensagemServiceInstance = require('../service/MensagemService');


class MensagemController {


    async enviar(req, res) {
    try {
        const { remetente_id, destinatario_id, conteudo } = req.body;
        const [resultado] = await MensagemServiceInstance.enviar(remetente_id, destinatario_id, conteudo);
        res.json({ msg: 'Mensagem enviada', id: resultado.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao enviar mensagem' });
      }
    }

    async conversa(req, res) {
        try {
            const { id } = req.params;
            const { meu_id } = req.query;
            const mensagens = await MensagemServiceInstance.conversa(meu_id, id);
            res.json(mensagens);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar conversa' });
        }
    }

    async listarConversas(req, res) {
        try {
            const { id } = req.params;
            const conversas = await MensagemServiceInstance.listarConversas(id);
            res.json(conversas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao listar conversas' });
        }
    }
}

module.exports = new MensagemController();
