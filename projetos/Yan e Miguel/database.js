// database.js
// Camada de comunicação com a API (server.js + MySQL).
// Antes esse arquivo salvava tudo no localStorage do navegador.
// Agora cada função faz uma requisição fetch() pro backend.

const API_URL = "http://localhost:3000";

// ---------- AUTENTICAÇÃO ----------

async function autenticarUsuario(email, senha) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao fazer login");
  }

  return dados; // objeto do usuário (sem a senha)
}

async function cadastrarUsuario(usuario) {
  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao cadastrar");
  }

  return dados;
}

// ---------- PILOTOS ----------

async function obterPilotos() {
  const resposta = await fetch(`${API_URL}/pilotos`);
  return resposta.json();
}

async function cadastrarPiloto(piloto) {
  const resposta = await fetch(`${API_URL}/pilotos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(piloto),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao cadastrar piloto");
  }

  return dados;
}

async function excluirPiloto(id) {
  await fetch(`${API_URL}/pilotos/${id}`, { method: "DELETE" });
}

// ---------- CORRIDAS ----------

async function obterCorridas() {
  const resposta = await fetch(`${API_URL}/corridas`);
  return resposta.json();
}

async function criarCorrida(corrida) {
  const resposta = await fetch(`${API_URL}/corridas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corrida),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao criar corrida");
  }

  return dados;
}

// ---------- RESERVAS ----------

async function obterReservas() {
  const resposta = await fetch(`${API_URL}/reservas`);
  return resposta.json();
}

async function criarReserva(reserva) {
  const resposta = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao criar reserva");
  }

  return dados;
}

// ---------- RESULTADOS / TEMPOS DE VOLTA ----------

async function obterResultados() {
  const resposta = await fetch(`${API_URL}/resultados`);
  return resposta.json();
}

async function registrarResultado(resultado) {
  const resposta = await fetch(`${API_URL}/resultados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultado),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro ao registrar tempo");
  }

  return dados;
}
