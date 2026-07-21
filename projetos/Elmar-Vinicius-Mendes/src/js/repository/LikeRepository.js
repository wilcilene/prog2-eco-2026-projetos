const db = require('../../db/connection');


class LikeRepository {

    curtir(post_id, usuario_id) {
        const sql = 'INSERT IGNORE INTO likes (post_id, usuario_id) VALUES (?, ?)';
        return db.promise().query(sql, [post_id, usuario_id]);
    }

    descurtir(post_id, usuario_id) {
        const sql = 'DELETE FROM likes WHERE post_id = ? AND usuario_id = ?';
        return db.promise().query(sql, [post_id, usuario_id]);
    }

    contar(post_id) {
        const sql = 'SELECT COUNT(*) AS total FROM likes WHERE post_id = ?';
        return db.promise().query(sql, [post_id]);
    }

    jaLikeu(post_id, usuario_id) {
        const sql = 'SELECT id FROM likes WHERE post_id = ? AND usuario_id = ?';
        return db.promise().query(sql, [post_id, usuario_id]);
    }
}

module.exports = new LikeRepository();
