const mysql = require('mysql2/promise');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kieza_db',
  charset: 'utf8mb4'
});

// 🔹 Força a sessão para UTF-8
(async () => {
  const conn = await pool.getConnection();
  await conn.query("SET NAMES utf8mb4");
  await conn.query("SET CHARACTER SET utf8mb4");
  await conn.query("SET character_set_connection=utf8mb4");
  conn.release();
})();

module.exports = pool;
