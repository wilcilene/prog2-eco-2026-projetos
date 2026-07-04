const db = require('../../db/connection');


class ComentarioRepository {

    salvar(post_id, usuario_id, conteudo) {
        const sql = 'INSERT INTO comentarios (post_id, usuario_id, conteudo) VALUES (?, ?, ?)';
        return db.promise().query(sql, [post_id, usuario_id, conteudo]);
    }

    buscarPorPost(post_id) {
    const sql = `
        SELECT
            comentarios.id,
            comentarios.conteudo,
            comentarios.criado_em,
            comentarios.usuario_id,
            usuarios.username,
            usuarios.foto_perfil
        FROM comentarios
        JOIN usuarios ON comentarios.usuario_id = usuarios.id
        WHERE comentarios.post_id = ?
        ORDER BY comentarios.criado_em ASC
    `;
    return db.promise().query(sql, [post_id]);
}

    contar(post_id) {
        const sql = 'SELECT COUNT(*) AS total FROM comentarios WHERE post_id = ?';
        return db.promise().query(sql, [post_id]);
    }
}

module.exports = new ComentarioRepository();
