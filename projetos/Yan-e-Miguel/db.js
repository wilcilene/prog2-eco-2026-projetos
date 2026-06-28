// db.js
// Configuração da conexão com o banco de dados MySQL usando mysql2/promise.
// O pool de conexões é recomendado para aplicações web, pois gerencia múltiplas conexões de forma eficiente.

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "racehub",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
