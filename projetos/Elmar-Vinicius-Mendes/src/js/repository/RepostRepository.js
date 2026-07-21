const db = require('../../db/connection');


class RepostRepository {

    repostar(post_id, usuario_id) {
        const sql = 'INSERT IGNORE INTO reposts (post_id, usuario_id) VALUES (?, ?)';
        return db.promise().query(sql, [post_id, usuario_id]);
    }

    desfazerRepost(post_id, usuario_id) {
        const sql = 'DELETE FROM reposts WHERE post_id = ? AND usuario_id = ?';
        return db.promise().query(sql, [post_id, usuario_id]);
    }

    checar(post_id, usuario_id) {
        const sql = 'SELECT id FROM reposts WHERE post_id = ? AND usuario_id = ?';
        return db.promise().query(sql, [post_id, usuario_id]);
    }

    contar(post_id) {
        const sql = 'SELECT COUNT(*) AS total FROM reposts WHERE post_id = ?';
        return db.promise().query(sql, [post_id]);
    }

    buscarPorUsuario(usuario_id) {
        const sql = `
            SELECT
                posts.id,
                posts.usuario_id,
                posts.conteudo,
                posts.imagem,
                posts.criado_em,
                usuarios.username,
                usuarios.foto_perfil,
                reposts.criado_em AS repostado_em,
                repostador.username AS repostado_por,
                (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS total_likes,
                (SELECT COUNT(*) FROM comentarios WHERE comentarios.post_id = posts.id) AS total_comentarios,
                (SELECT COUNT(*) FROM reposts r2 WHERE r2.post_id = posts.id) AS total_reposts
            FROM reposts
            JOIN posts ON reposts.post_id = posts.id
            JOIN usuarios ON posts.usuario_id = usuarios.id
            JOIN usuarios AS repostador ON reposts.usuario_id = repostador.id
            WHERE reposts.usuario_id = ?
            ORDER BY reposts.criado_em DESC
        `;
        return db.promise().query(sql, [usuario_id]);
    }
}

module.exports = new RepostRepository();