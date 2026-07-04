const MensagemRepository = require('../repository/MensagemRepository');


class MensagemService {


    async enviar(remetente_id, destinatario_id, conteudo) {
        return await MensagemRepository.enviar(remetente_id, destinatario_id, conteudo);
    }


    async conversa(usuario1_id, usuario2_id) {
        const [msgs] = await MensagemRepository.buscarConversa(usuario1_id, usuario2_id);
        return msgs;
    }


    async listarConversas(usuario_id) {
        const [conversas] = await MensagemRepository.listarConversas(usuario_id);
        return conversas;
    }
}

module.exports = new MensagemService();