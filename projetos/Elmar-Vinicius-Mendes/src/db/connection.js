require("dotenv").config();

const mysql = require('mysql2');

const db = process.env.DATABASE_URL 
    ? mysql.createConnection(process.env.DATABASE_URL)
    : mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });

module.exports = db;