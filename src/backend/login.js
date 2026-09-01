const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db.js");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // verificar se usuário existe
    const [rows] = await pool.query("SELECT * FROM users WHERE emailOrPhone = ?", [emailOrPhone]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const user = rows[0];

    // comparar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    // gerar token JWT com id e role
    const token = jwt.sign(
      { id: user.id, role: user.accountType }, // payload
      "segredo_super_seguranca",               // mesmo secret do middleware
      { expiresIn: "24h" }
    );

    // resposta com token e dados do usuário
    return res.json({
      message: "Login realizado com sucesso!",
      token,
      id: user.id,
      role: user.accountType, // "estudante" ou "preparatorio"
      user: { id: user.id, name: user.name, emailOrPhone: user.emailOrPhone }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro no servidor." });
  }
});

module.exports = router;
