// logica de puxar as infromações do banco de dados do usuario
import pool from '../db/connection.js';

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

export async function findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);

    const query = `
        SELECT 
            id_user,
            username,
            password,
            maximum_score
        FROM users
        WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))
    `;
    const values = [normalizedEmail];

    const result = await pool.query(query, values);

    return result.rows[0];
}

export async function createUser(username, email, password) {
    const normalizedEmail = normalizeEmail(email);

    const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id_user, username, maximum_score
    `;
    const values = [username.trim(), normalizedEmail, password];

    const result = await pool.query(query, values);

    return result.rows[0];
}

export async function getTopPlayers() {

    const query = `
        SELECT 
            username,
            maximum_score
        FROM users
        ORDER BY maximum_score DESC
        LIMIT 10
    `;
    
    const result = await pool.query(query);

    return result.rows;
}

export async function saveScore(id, score) {

    const query = `
        UPDATE users
        SET maximum_score = $2
        WHERE id_user = $1
    `;
    const values = [id, score];

    await pool.query(query, values);
}