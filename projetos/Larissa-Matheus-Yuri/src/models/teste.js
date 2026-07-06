import pool from '../db/connection.js';

async function testarBanco() {

    try {

        const resposta = await pool.query('SELECT NOW()');

        console.log('Banco conectado!');
        console.log(resposta.rows);

    } catch (erro) {

        console.log('Erro ao conectar no banco');
        console.log(erro);

    }
}

testarBanco();