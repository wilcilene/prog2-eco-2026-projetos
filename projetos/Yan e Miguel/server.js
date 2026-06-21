// server.js
// API do RaceHub - conecta no MySQL e expõe as rotas usadas pelo frontend.

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const SALT_ROUNDS = 10;

// =====================================================
// AUTENTICAÇÃO
// =====================================================

// Login: recebe email + senha, confere o hash, devolve o usuário (sem a senha)
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    const usuario = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    delete usuario.senha; // nunca devolver o hash pro frontend
    res.json(usuario);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao fazer login" });
  }
});

// Cadastro de usuário (cliente, piloto, etc.)
app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const [existentes] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );

    if (existentes.length > 0) {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, tipo],
    );

    res.status(201).json({ id: resultado.insertId, nome, email, tipo });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// =====================================================
// PILOTOS
// =====================================================

app.get("/pilotos", async (req, res) => {
  try {
    const [pilotos] = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE tipo = "piloto"',
    );
    res.json(pilotos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar pilotos" });
  }
});

// Cadastro de piloto feito pelo admin (reaproveita a mesma lógica do /usuarios)
app.post("/pilotos", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const [existentes] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );

    if (existentes.length > 0) {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const [resultado] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, "piloto")',
      [nome, email, senhaHash],
    );

    res
      .status(201)
      .json({ id: resultado.insertId, nome, email, tipo: "piloto" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao cadastrar piloto" });
  }
});

app.delete("/pilotos/:id", async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = ? AND tipo = "piloto"', [
      req.params.id,
    ]);
    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao excluir piloto" });
  }
});

// =====================================================
// CORRIDAS
// =====================================================

app.get("/corridas", async (req, res) => {
  try {
    const [corridas] = await pool.query(
      "SELECT * FROM corridas ORDER BY data DESC",
    );
    res.json(corridas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar corridas" });
  }
});

app.post("/corridas", async (req, res) => {
  try {
    const { nome, data, horario, pista_id } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Preencha o nome da corrida" });
    }

    const [resultado] = await pool.query(
      "INSERT INTO corridas (nome, data, horario, pista_id) VALUES (?, ?, ?, ?)",
      [nome, data || null, horario || null, pista_id || null],
    );

    res
      .status(201)
      .json({ id: resultado.insertId, nome, data, horario, pista_id });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar corrida" });
  }
});

// =====================================================
// RESERVAS (agenda da pista)
// =====================================================

app.get("/reservas", async (req, res) => {
  try {
    const [reservas] = await pool.query(
      "SELECT * FROM reservas ORDER BY data, horario",
    );
    res.json(reservas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar reservas" });
  }
});

app.post("/reservas", async (req, res) => {
  try {
    const { usuario_id, data, horario } = req.body;

    if (!data || !horario) {
      return res.status(400).json({ erro: "Selecione data e horário" });
    }

    const [resultado] = await pool.query(
      "INSERT INTO reservas (usuario_id, data, horario) VALUES (?, ?, ?)",
      [usuario_id || null, data, horario],
    );

    res.status(201).json({ id: resultado.insertId, usuario_id, data, horario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar reserva" });
  }
});

// =====================================================
// RESULTADOS / TEMPOS DE VOLTA
// =====================================================

// Ranking geral: junta resultados com o nome do piloto
app.get("/resultados", async (req, res) => {
  try {
    const [resultados] = await pool.query(`
      SELECT r.id, r.tempo_volta, r.classificacao, r.corrida_id, u.nome AS piloto
      FROM resultados r
      JOIN usuarios u ON u.id = r.piloto_id
      ORDER BY r.tempo_volta ASC
    `);
    res.json(resultados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar resultados" });
  }
});

app.post("/resultados", async (req, res) => {
  try {
    const { piloto_id, corrida_id, tempo_volta, classificacao } = req.body;

    if (!piloto_id || !tempo_volta) {
      return res.status(400).json({ erro: "Preencha piloto e tempo de volta" });
    }

    const [resultado] = await pool.query(
      "INSERT INTO resultados (corrida_id, piloto_id, tempo_volta, classificacao) VALUES (?, ?, ?, ?)",
      [corrida_id || null, piloto_id, tempo_volta, classificacao || null],
    );

    res.status(201).json({
      id: resultado.insertId,
      piloto_id,
      corrida_id,
      tempo_volta,
      classificacao,
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao registrar resultado" });
  }
});

app.listen(3000, () =>
  console.log("Servidor RaceHub rodando em http://localhost:3000"),
);
