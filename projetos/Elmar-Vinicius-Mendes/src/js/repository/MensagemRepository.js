const db     = require('../../db/connection');
const crypto = require('crypto');


const ALGORITMO = 'aes-256-cbc';
const CHAVE     = crypto.scryptSync(
    process.env.MSG_SECRET || 'zerion_chave_padrao_32_bytes_aqui',
    'zerion_salt',
    32
);

function criptografar(texto) {
    const iv         = crypto.randomBytes(16);
    const cipher     = crypto.createCipheriv(ALGORITMO, CHAVE, iv);
    const criptograf = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + criptograf.toString('hex');
}

function descriptografar(textoEncriptado) {
    try {
        const [ivHex, conteudoHex] = textoEncriptado.split(':');
        const iv       = Buffer.from(ivHex, 'hex');
        const conteudo = Buffer.from(conteudoHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITMO, CHAVE, iv);
        return Buffer.concat([decipher.update(conteudo), decipher.final()]).toString('utf8');
    } catch {
        return textoEncriptado;
    }
}


class MensagemRepository {

    enviar(remetente_id, destinatario_id, conteudo) {
        const sql = 'INSERT INTO mensagens (remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?)';
        return db.promise().query(sql, [remetente_id, destinatario_id, conteudo]);
    }


    async buscarConversa(usuario1_id, usuario2_id) {
        const sql = `
            SELECT mensagens.*, usuarios.username AS remetente_username
            FROM mensagens
            JOIN usuarios ON mensagens.remetente_id = usuarios.id
            WHERE (remetente_id = ? AND destinatario_id = ?)
               OR (remetente_id = ? AND destinatario_id = ?)
            ORDER BY criado_em ASC
        `;
        return db.promise().query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id]);
    }


    async listarConversas(usuario_id) {
        const sql = `
            SELECT
                u.id,
                u.username,
                u.foto_perfil,
                m.conteudo AS ultima_mensagem,
                m.criado_em
            FROM mensagens m
            JOIN usuarios u ON u.id = IF(m.remetente_id = ?, m.destinatario_id, m.remetente_id)
            WHERE m.id IN (
                SELECT MAX(m2.id)
                FROM mensagens m2
                WHERE m2.remetente_id = ? OR m2.destinatario_id = ?
                GROUP BY
                    LEAST(m2.remetente_id, m2.destinatario_id),
                    GREATEST(m2.remetente_id, m2.destinatario_id)
            )
            AND (m.remetente_id = ? OR m.destinatario_id = ?)
            ORDER BY m.criado_em DESC
        `;
        return db.promise().query(sql, [usuario_id, usuario_id, usuario_id, usuario_id, usuario_id]);
    }
}

module.exports = new MensagemRepository();