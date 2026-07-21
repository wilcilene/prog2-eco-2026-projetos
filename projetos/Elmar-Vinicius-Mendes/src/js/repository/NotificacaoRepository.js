const db = require('../../db/connection');


class NotificacaoRepository {

    criar(usuario_id, ator_id, tipo, post_id = null) {
        if (String(usuario_id) === String(ator_id)) return Promise.resolve();
        const sql = `
            INSERT INTO notificacoes (usuario_id, ator_id, tipo, post_id)
            VALUES (?, ?, ?, ?)
        `;
        return db.promise().query(sql, [usuario_id, ator_id, tipo, post_id]);
    }

    deletar(usuario_id, ator_id, tipo, post_id = null) {
        const sql = `
            DELETE FROM notificacoes
            WHERE usuario_id = ? AND ator_id = ? AND tipo = ? AND (post_id = ? OR post_id IS NULL)
        `;
        return db.promise().query(sql, [usuario_id, ator_id, tipo, post_id]);
    }

    listarPorUsuario(usuario_id) {
        const sql = `
            SELECT
                notificacoes.id,
                notificacoes.tipo,
                notificacoes.post_id,
                notificacoes.lida,
                notificacoes.criado_em,
                usuarios.id        AS ator_id,
                usuarios.username  AS ator_username,
                usuarios.foto_perfil AS ator_foto,
                usuarios.verificado  AS ator_verificado
            FROM notificacoes
            JOIN usuarios ON notificacoes.ator_id = usuarios.id
            WHERE notificacoes.usuario_id = ?
            ORDER BY notificacoes.criado_em DESC
            LIMIT 50
        `;
        return db.promise().query(sql, [usuario_id]);
    }

    contarNaoLidas(usuario_id) {
        const sql = `
            SELECT COUNT(*) AS total
            FROM notificacoes
            WHERE usuario_id = ? AND lida = 0
        `;
        return db.promise().query(sql, [usuario_id]);
    }

    marcarTodasLidas(usuario_id) {
        const sql = `
            UPDATE notificacoes SET lida = 1
            WHERE usuario_id = ?
        `;
        return db.promise().query(sql, [usuario_id]);
    }

    buscarDonoDoPosto(post_id) {
        const sql = 'SELECT usuario_id FROM posts WHERE id = ?';
        return db.promise().query(sql, [post_id]);
    }
}

module.exports = new NotificacaoRepository();
