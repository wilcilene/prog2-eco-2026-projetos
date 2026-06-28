// =====================================================
// server.js
// API do RaceHub - Node.js + Express + MySQL
//
// Este arquivo é o backend do sistema.
// Ele recebe as requisições do frontend, consulta/altera o banco MySQL
// e devolve respostas em JSON para as páginas HTML.
// =====================================================


// =====================================================
// IMPORTAÇÃO DAS BIBLIOTECAS
// =====================================================

// Express cria o servidor HTTP e as rotas da API.
const express = require("express");

// CORS evita bloqueios do navegador em requisições entre frontend e backend.
const cors = require("cors");

// Bcrypt criptografa senhas antes de salvar no banco.
const bcrypt = require("bcrypt");

// Path ajuda a montar caminhos de arquivos de forma segura.
const path = require("path");

// Pool de conexão com o MySQL configurado no arquivo db.js.
const pool = require("./db");


// =====================================================
// CONFIGURAÇÕES INICIAIS
// =====================================================

const app = express();
const SALT_ROUNDS = 10;
const PORT = 3000;

// Permite requisições vindas do frontend.
app.use(cors());

// Permite receber JSON no corpo das requisições.
app.use(express.json({ limit:"10mb" }));

// Serve arquivos estáticos da pasta raiz, como HTML, CSS e JS.
app.use(express.static(__dirname));


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

// Verifica se o usuário é um administrador fixo.
// Eles são protegidos para evitar que o sistema fique sem conta admin.
function isAdminFixo(usuario) {
    if (!usuario) return false;

    const emailsAdminsFixos = [
        "yanaugustoscholze@gmail.com",
        "miguel@racehub.com"
    ];

    return (
        Number(usuario.id) === 1 ||
        Number(usuario.id) === 2 ||
        emailsAdminsFixos.includes(usuario.email)
    );
}

// Valida os tipos de usuários aceitos pelo sistema.
function tipoUsuarioValido(tipo) {
    return ["admin", "piloto", "cliente"].includes(tipo);
}

// Valida os status aceitos para uma corrida.
// A versão 3.0 usa status para controlar inscrições e finalização.
function statusCorridaValido(status) {
    return ["aberta", "encerrada", "finalizada", "cancelada"].includes(status);
}

// Classifica um veículo por faixa de potência.
// Essa categoria é usada nos rankings por potência.
function categoriaPotencia(potencia) {
    const cv = Number(potencia || 0);

    if (!cv) return "Sem potência";
    if (cv <= 150) return "Até 150 cv";
    if (cv <= 250) return "151 a 250 cv";
    if (cv <= 400) return "251 a 400 cv";
    return "Acima de 400 cv";
}

// Monta um texto padrão para veículo.
// É usado quando a API precisa devolver uma informação visual do carro.
function montarNomeVeiculo(veiculo) {
    if (!veiculo) return "Sem veículo";

    const partes = [veiculo.marca, veiculo.modelo, veiculo.ano]
        .filter(Boolean)
        .map(valor => String(valor).trim());

    return partes.length > 0 ? partes.join(" ") : "Veículo";
}

// Verifica se uma corrida já passou com base na data e no horário.
// Essa função é usada para impedir inscrição ou cancelamento após a finalização.
function corridaEstaFinalizada(corrida) {
    if (!corrida || !corrida.data) return false;

    const data = corrida.data instanceof Date
        ? corrida.data.toISOString().substring(0, 10)
        : String(corrida.data).substring(0, 10);

    const horario = corrida.horario
        ? String(corrida.horario).substring(0, 5)
        : "00:00";

    return new Date(`${data}T${horario}:00`) < new Date();
}



// =====================================================
// MIGRAÇÃO AUTOMÁTICA DO BANCO
// =====================================================
// Esta parte foi adicionada porque o projeto pode estar rodando
// em bancos que já existiam antes da versão com veículos.
//
// Exemplo do problema:
// - o banco antigo já tinha resultados cadastrados;
// - depois o sistema passou a usar veiculo_id;
// - se a coluna veiculo_id não existir, a rota /resultados quebra;
// - se a tabela veiculos existir, mas faltar marca/modelo/ano, o JOIN também quebra.
//
// Por isso, ao iniciar o servidor, o sistema confere a estrutura
// e cria/adiciona apenas o que estiver faltando, sem apagar dados.
// =====================================================

// Verifica se uma tabela existe no banco atual.
async function tabelaExiste(nomeTabela) {
    const [linhas] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
        `,
        [nomeTabela]
    );

    return Number(linhas[0].total) > 0;
}

// Verifica se uma coluna existe em determinada tabela.
async function colunaExiste(nomeTabela, nomeColuna) {
    const [linhas] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND COLUMN_NAME = ?
        `,
        [nomeTabela, nomeColuna]
    );

    return Number(linhas[0].total) > 0;
}

// Adiciona uma coluna apenas se ela ainda não existir.
// Isso evita erro quando o script roda mais de uma vez.
async function adicionarColunaSeFaltar(nomeTabela, nomeColuna, sqlAlter) {
    const existe = await colunaExiste(nomeTabela, nomeColuna);

    if (!existe) {
        await pool.query(sqlAlter);
        console.log(`✔ Coluna criada: ${nomeTabela}.${nomeColuna}`);
    }
}

// Garante que a tabela de inscrições exista.
// Ela liga corrida + piloto + veículo escolhido para participar.
async function garantirTabelaInscricoesCorridas() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS corridas_inscricoes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            corrida_id INT NOT NULL,
            piloto_id INT NOT NULL,
            veiculo_id INT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            UNIQUE KEY uq_corrida_piloto (corrida_id, piloto_id)
        )
    `);

    await adicionarColunaSeFaltar(
        "corridas_inscricoes",
        "veiculo_id",
        "ALTER TABLE corridas_inscricoes ADD COLUMN veiculo_id INT NULL AFTER piloto_id"
    );
}

// Garante que a tabela de veículos exista e tenha as colunas esperadas.
// Algumas versões antigas do projeto já tinham uma tabela veiculos,
// então aqui não apagamos nada: só adicionamos o que estiver faltando.
async function garantirTabelaVeiculos() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS veiculos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            piloto_id INT NULL,
            marca VARCHAR(60) NULL,
            modelo VARCHAR(80) NULL,
            ano INT NULL,
            placa VARCHAR(20) NULL,
            cor VARCHAR(40) NULL,
            potencia INT NULL,
            observacoes VARCHAR(255) NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await adicionarColunaSeFaltar(
        "veiculos",
        "piloto_id",
        "ALTER TABLE veiculos ADD COLUMN piloto_id INT NULL AFTER id"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "marca",
        "ALTER TABLE veiculos ADD COLUMN marca VARCHAR(60) NULL AFTER piloto_id"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "modelo",
        "ALTER TABLE veiculos ADD COLUMN modelo VARCHAR(80) NULL AFTER marca"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "ano",
        "ALTER TABLE veiculos ADD COLUMN ano INT NULL AFTER modelo"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "placa",
        "ALTER TABLE veiculos ADD COLUMN placa VARCHAR(20) NULL AFTER ano"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "cor",
        "ALTER TABLE veiculos ADD COLUMN cor VARCHAR(40) NULL AFTER placa"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "potencia",
        "ALTER TABLE veiculos ADD COLUMN potencia INT NULL AFTER cor"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "observacoes",
        "ALTER TABLE veiculos ADD COLUMN observacoes VARCHAR(255) NULL AFTER potencia"
    );

    await adicionarColunaSeFaltar(
        "veiculos",
        "criado_em",
        "ALTER TABLE veiculos ADD COLUMN criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER observacoes"
    );
}



// Garante campos extras dos usuários usados pela versão 3.0.
// foto_perfil guarda uma imagem em Base64 ou URL.
async function garantirColunasUsuarioV30() {
    const existeUsuarios = await tabelaExiste("usuarios");
    if (!existeUsuarios) return;

    await adicionarColunaSeFaltar(
        "usuarios",
        "foto_perfil",
        "ALTER TABLE usuarios ADD COLUMN foto_perfil LONGTEXT NULL AFTER tipo"
    );
}

// Garante campos extras de corrida: status e limite de inscritos.
async function garantirColunasCorridasV30() {
    const existeCorridas = await tabelaExiste("corridas");
    if (!existeCorridas) return;

    await adicionarColunaSeFaltar(
        "corridas",
        "status",
        "ALTER TABLE corridas ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'aberta' AFTER horario"
    );

    await adicionarColunaSeFaltar(
        "corridas",
        "limite_inscritos",
        "ALTER TABLE corridas ADD COLUMN limite_inscritos INT NOT NULL DEFAULT 20 AFTER status"
    );
}

// Garante que resultados tenha veiculo_id.
// Essa coluna é NULL para registros antigos, assim os tempos antigos continuam aparecendo.
async function garantirColunaVeiculoEmResultados() {
    const existeTabelaResultados = await tabelaExiste("resultados");

    if (!existeTabelaResultados) {
        return;
    }

    await adicionarColunaSeFaltar(
        "resultados",
        "veiculo_id",
        "ALTER TABLE resultados ADD COLUMN veiculo_id INT NULL AFTER piloto_id"
    );
}

// Função principal da migração automática.
// Ela é executada antes do servidor começar a escutar a porta 3000.
async function garantirEstruturaBanco() {
    try {
        await garantirColunasUsuarioV30();
        await garantirTabelaVeiculos();
        await garantirTabelaInscricoesCorridas();
        await garantirColunasCorridasV30();
        await garantirColunaVeiculoEmResultados();

        console.log("✔ Estrutura do banco verificada.");

    } catch (erro) {
        console.error("Erro ao verificar estrutura do banco:", erro);
    }
}


// =====================================================
// ROTA PRINCIPAL
// =====================================================

// Ao acessar http://localhost:3000, o backend abre a tela de login.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// =====================================================
// AUTENTICAÇÃO
// =====================================================

// Login do sistema.
// Recebe e-mail e senha, confere no banco e devolve o usuário sem a senha.
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Preencha e-mail e senha" });
        }

        const [rows] = await pool.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ erro: "Usuário ou senha inválidos" });
        }

        const usuario = rows[0];
        let senhaCorreta = false;

        // Compatibilidade com usuários antigos que possam estar com senha em texto puro.
        if (usuario.senha === senha) {
            senhaCorreta = true;
        } else {
            senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        }

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Usuário ou senha inválidos" });
        }

        // Nunca envia a senha para o frontend.
        delete usuario.senha;

        res.json(usuario);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
});


// =====================================================
// USUÁRIOS
// =====================================================

// Lista todos os usuários cadastrados.
app.get("/usuarios", async (req, res) => {
    try {
        const [usuarios] = await pool.query(`
            SELECT id, nome, email, tipo, foto_perfil, criado_em
            FROM usuarios
            ORDER BY id ASC
        `);

        res.json(usuarios);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao listar usuários" });
    }
});

// Busca um usuário específico pelo ID.
// Usado pela página perfil.html para carregar os dados atualizados.
app.get("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [usuarios] = await pool.query(
            `
            SELECT id, nome, email, tipo, foto_perfil, criado_em
            FROM usuarios
            WHERE id = ?
            `,
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        res.json(usuarios[0]);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
});

// Cria usuário novo: admin, piloto ou cliente.
app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        if (!tipoUsuarioValido(tipo)) {
            return res.status(400).json({ erro: "Tipo de usuário inválido" });
        }

        const [existentes] = await pool.query(
            "SELECT id FROM usuarios WHERE email = ?",
            [email]
        );

        if (existentes.length > 0) {
            return res.status(409).json({ erro: "Email já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

        const [resultado] = await pool.query(
            `
            INSERT INTO usuarios (nome, email, senha, tipo)
            VALUES (?, ?, ?, ?)
            `,
            [nome, email, senhaHash, tipo]
        );

        res.status(201).json({
            id: resultado.insertId,
            nome,
            email,
            tipo
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});

// Edição completa feita pelo admin.
// Permite alterar nome, e-mail, tipo e senha opcional.
app.put("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, tipo, senha } = req.body;

        if (!nome || !email || !tipo) {
            return res.status(400).json({ erro: "Preencha nome, e-mail e tipo" });
        }

        if (!tipoUsuarioValido(tipo)) {
            return res.status(400).json({ erro: "Tipo de usuário inválido" });
        }

        const [usuarios] = await pool.query(
            "SELECT id, nome, email, tipo FROM usuarios WHERE id = ?",
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const usuarioAtual = usuarios[0];

        if (isAdminFixo(usuarioAtual)) {
            return res.status(403).json({ erro: "Administradores fixos não podem ser editados" });
        }

        const [emailExistente] = await pool.query(
            "SELECT id FROM usuarios WHERE email = ? AND id <> ?",
            [email, id]
        );

        if (emailExistente.length > 0) {
            return res.status(409).json({ erro: "Este e-mail já está sendo usado por outro usuário" });
        }

        if (senha && senha.trim() !== "") {
            const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

            await pool.query(
                `
                UPDATE usuarios
                SET nome = ?, email = ?, tipo = ?, senha = ?
                WHERE id = ?
                `,
                [nome, email, tipo, senhaHash, id]
            );
        } else {
            await pool.query(
                `
                UPDATE usuarios
                SET nome = ?, email = ?, tipo = ?
                WHERE id = ?
                `,
                [nome, email, tipo, id]
            );
        }

        res.json({ id: Number(id), nome, email, tipo });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
});

// Altera somente o tipo de usuário.
// Usado no select rápido da tabela de usuários.
app.put("/usuarios/:id/tipo", async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo } = req.body;

        if (!tipo || !tipoUsuarioValido(tipo)) {
            return res.status(400).json({ erro: "Tipo de usuário inválido" });
        }

        const [usuarios] = await pool.query(
            "SELECT id, nome, email, tipo FROM usuarios WHERE id = ?",
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const usuario = usuarios[0];

        if (isAdminFixo(usuario)) {
            return res.status(403).json({ erro: "Administradores fixos não podem ter o tipo alterado" });
        }

        await pool.query(
            "UPDATE usuarios SET tipo = ? WHERE id = ?",
            [tipo, id]
        );

        res.json({
            id: Number(id),
            nome: usuario.nome,
            email: usuario.email,
            tipo
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao alterar tipo de usuário" });
    }
});

// Atualiza o próprio perfil.
// Aqui não se altera o tipo de conta; apenas nome, e-mail e senha.
app.put("/usuarios/:id/perfil", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, foto_perfil } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ erro: "Preencha nome e e-mail" });
        }

        const [usuarios] = await pool.query(
            "SELECT id, nome, email, tipo, foto_perfil FROM usuarios WHERE id = ?",
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const usuarioAtual = usuarios[0];

        if (isAdminFixo(usuarioAtual) && email !== usuarioAtual.email) {
            return res.status(403).json({ erro: "Administradores fixos não podem alterar o e-mail pelo perfil" });
        }

        const [emailExistente] = await pool.query(
            "SELECT id FROM usuarios WHERE email = ? AND id <> ?",
            [email, id]
        );

        if (emailExistente.length > 0) {
            return res.status(409).json({ erro: "Este e-mail já está sendo usado por outro usuário" });
        }

        if (senha && senha.trim() !== "") {
            const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

            await pool.query(
                "UPDATE usuarios SET nome = ?, email = ?, senha = ?, foto_perfil = COALESCE(?, foto_perfil) WHERE id = ?",
                [nome, email, senhaHash, foto_perfil || null, id]
            );
        } else {
            await pool.query(
                "UPDATE usuarios SET nome = ?, email = ?, foto_perfil = COALESCE(?, foto_perfil) WHERE id = ?",
                [nome, email, foto_perfil || null, id]
            );
        }

        res.json({
            id: Number(id),
            nome,
            email,
            tipo: usuarioAtual.tipo,
            foto_perfil: foto_perfil || usuarioAtual.foto_perfil || null
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar perfil" });
    }
});

// Exclui um usuário.
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [usuarios] = await pool.query(
            "SELECT id, email, tipo FROM usuarios WHERE id = ?",
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const usuario = usuarios[0];

        if (isAdminFixo(usuario)) {
            return res.status(403).json({ erro: "Administradores fixos não podem ser excluídos" });
        }

        await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

        res.json({ mensagem: "Usuário excluído com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir usuário" });
    }
});


// =====================================================
// PILOTOS
// =====================================================

// Lista todos os usuários do tipo piloto.
app.get("/pilotos", async (req, res) => {
    try {
        const [pilotos] = await pool.query(`
            SELECT id, nome, email, criado_em
            FROM usuarios
            WHERE tipo = "piloto"
            ORDER BY id ASC
        `);

        res.json(pilotos);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar pilotos" });
    }
});

// Cria piloto diretamente pela página de pilotos.
app.post("/pilotos", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        const [existentes] = await pool.query(
            "SELECT id FROM usuarios WHERE email = ?",
            [email]
        );

        if (existentes.length > 0) {
            return res.status(409).json({ erro: "Email já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

        const [resultado] = await pool.query(
            `
            INSERT INTO usuarios (nome, email, senha, tipo)
            VALUES (?, ?, ?, "piloto")
            `,
            [nome, email, senhaHash]
        );

        res.status(201).json({
            id: resultado.insertId,
            nome,
            email,
            tipo: "piloto"
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar piloto" });
    }
});

// Exclui piloto pelo ID.
app.delete("/pilotos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            `DELETE FROM usuarios WHERE id = ? AND tipo = "piloto"`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Piloto não encontrado" });
        }

        res.json({ mensagem: "Piloto excluído com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir piloto" });
    }
});


// =====================================================
// VEÍCULOS
// =====================================================
// Veículos pertencem a pilotos.
// Um piloto pode ter vários carros cadastrados.
// Na inscrição de corrida e no registro de tempo, o carro é selecionado.
// =====================================================

// Lista veículos.
// Aceita filtro opcional: /veiculos?piloto_id=3
app.get("/veiculos", async (req, res) => {
    try {
        const { piloto_id } = req.query;

        const parametros = [];
        let filtro = "";

        if (piloto_id) {
            filtro = "WHERE v.piloto_id = ?";
            parametros.push(piloto_id);
        }

        const [veiculos] = await pool.query(
            `
            SELECT 
                v.id,
                v.piloto_id,
                v.marca,
                v.modelo,
                v.ano,
                v.placa,
                v.cor,
                v.potencia,
                v.observacoes,
                v.criado_em,
                u.nome AS piloto,
                u.email AS email_piloto
            FROM veiculos v
            JOIN usuarios u ON u.id = v.piloto_id
            ${filtro}
            ORDER BY u.nome ASC, v.marca ASC, v.modelo ASC
            `,
            parametros
        );

        res.json(veiculos.map(veiculo => ({
            ...veiculo,
            categoria_potencia: categoriaPotencia(veiculo.potencia),
            nome_veiculo: montarNomeVeiculo(veiculo)
        })));

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar veículos" });
    }
});

// Atalho para listar somente os veículos de um piloto.
app.get("/pilotos/:id/veiculos", async (req, res) => {
    try {
        const { id } = req.params;

        const [veiculos] = await pool.query(
            `
            SELECT 
                v.id,
                v.piloto_id,
                v.marca,
                v.modelo,
                v.ano,
                v.placa,
                v.cor,
                v.potencia,
                v.observacoes,
                v.criado_em,
                u.nome AS piloto,
                u.email AS email_piloto
            FROM veiculos v
            JOIN usuarios u ON u.id = v.piloto_id
            WHERE v.piloto_id = ?
            ORDER BY v.marca ASC, v.modelo ASC
            `,
            [id]
        );

        res.json(veiculos.map(veiculo => ({
            ...veiculo,
            categoria_potencia: categoriaPotencia(veiculo.potencia),
            nome_veiculo: montarNomeVeiculo(veiculo)
        })));

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar veículos do piloto" });
    }
});

// Cadastra veículo para um piloto.
app.post("/veiculos", async (req, res) => {
    try {
        const { piloto_id, marca, modelo, ano, placa, cor, potencia, observacoes } = req.body;

        if (!piloto_id || !marca || !modelo) {
            return res.status(400).json({ erro: "Informe piloto, marca e modelo" });
        }

        // Garante que o dono do veículo é realmente piloto.
        const [pilotos] = await pool.query(
            `SELECT id FROM usuarios WHERE id = ? AND tipo = "piloto"`,
            [piloto_id]
        );

        if (pilotos.length === 0) {
            return res.status(404).json({ erro: "Piloto não encontrado" });
        }

        const [resultado] = await pool.query(
            `
            INSERT INTO veiculos
            (piloto_id, marca, modelo, ano, placa, cor, potencia, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                piloto_id,
                marca,
                modelo,
                ano || null,
                placa || null,
                cor || null,
                potencia || null,
                observacoes || null
            ]
        );

        res.status(201).json({
            id: resultado.insertId,
            piloto_id: Number(piloto_id),
            marca,
            modelo,
            ano: ano || null,
            placa: placa || null,
            cor: cor || null,
            potencia: potencia || null,
            categoria_potencia: categoriaPotencia(potencia),
            observacoes: observacoes || null
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cadastrar veículo" });
    }
});

// Edita veículo cadastrado.
app.put("/veiculos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { piloto_id, marca, modelo, ano, placa, cor, potencia, observacoes } = req.body;

        if (!piloto_id || !marca || !modelo) {
            return res.status(400).json({ erro: "Informe piloto, marca e modelo" });
        }

        const [veiculos] = await pool.query(
            "SELECT id FROM veiculos WHERE id = ?",
            [id]
        );

        if (veiculos.length === 0) {
            return res.status(404).json({ erro: "Veículo não encontrado" });
        }

        const [pilotos] = await pool.query(
            `SELECT id FROM usuarios WHERE id = ? AND tipo = "piloto"`,
            [piloto_id]
        );

        if (pilotos.length === 0) {
            return res.status(404).json({ erro: "Piloto não encontrado" });
        }

        await pool.query(
            `
            UPDATE veiculos
            SET piloto_id = ?, marca = ?, modelo = ?, ano = ?, placa = ?, cor = ?, potencia = ?, observacoes = ?
            WHERE id = ?
            `,
            [
                piloto_id,
                marca,
                modelo,
                ano || null,
                placa || null,
                cor || null,
                potencia || null,
                observacoes || null,
                id
            ]
        );

        res.json({
            id: Number(id),
            piloto_id: Number(piloto_id),
            marca,
            modelo,
            ano: ano || null,
            placa: placa || null,
            cor: cor || null,
            potencia: potencia || null,
            categoria_potencia: categoriaPotencia(potencia),
            observacoes: observacoes || null
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar veículo" });
    }
});

// Exclui veículo.
// O banco bloqueia/exclui vínculos conforme as FKs configuradas.
app.delete("/veiculos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            "DELETE FROM veiculos WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Veículo não encontrado" });
        }

        res.json({ mensagem: "Veículo excluído com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir veículo" });
    }
});


// =====================================================
// CORRIDAS
// =====================================================

// Lista corridas cadastradas.
app.get("/corridas", async (req, res) => {
    try {
        const [corridas] = await pool.query(`
            SELECT 
                c.id,
                c.nome,
                c.data,
                c.horario,
                c.status,
                c.limite_inscritos,
                c.pista_id,
                p.nome AS pista,
                COUNT(ci.id) AS total_inscritos
            FROM corridas c
            LEFT JOIN pistas p ON p.id = c.pista_id
            LEFT JOIN corridas_inscricoes ci ON ci.corrida_id = c.id
            GROUP BY c.id, c.nome, c.data, c.horario, c.status, c.limite_inscritos, c.pista_id, p.nome
            ORDER BY c.data ASC, c.horario ASC
        `);

        res.json(corridas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar corridas" });
    }
});

// Cria corrida.
app.post("/corridas", async (req, res) => {
    try {
        const { nome, data, horario, pista_id, status, limite_inscritos } = req.body;

        if (!nome || !data || !horario) {
            return res.status(400).json({ erro: "Preencha nome, data e horário da corrida" });
        }

        const [resultado] = await pool.query(
            `
            INSERT INTO corridas (nome, data, horario, status, limite_inscritos, pista_id)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [nome, data, horario, statusCorridaValido(status) ? status : "aberta", Number(limite_inscritos) || 20, pista_id || 1]
        );

        res.status(201).json({
            id: resultado.insertId,
            nome,
            data,
            horario,
            status: statusCorridaValido(status) ? status : "aberta",
            limite_inscritos: Number(limite_inscritos) || 20,
            pista_id: pista_id || 1
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao criar corrida" });
    }
});

// Edita corrida.
app.put("/corridas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, data, horario, pista_id, status, limite_inscritos } = req.body;

        if (!nome || !data || !horario) {
            return res.status(400).json({ erro: "Preencha nome, data e horário da corrida" });
        }

        const [corridas] = await pool.query(
            "SELECT id FROM corridas WHERE id = ?",
            [id]
        );

        if (corridas.length === 0) {
            return res.status(404).json({ erro: "Corrida não encontrada" });
        }

        await pool.query(
            `
            UPDATE corridas
            SET nome = ?, data = ?, horario = ?, status = ?, limite_inscritos = ?, pista_id = ?
            WHERE id = ?
            `,
            [nome, data, horario, statusCorridaValido(status) ? status : "aberta", Number(limite_inscritos) || 20, pista_id || 1, id]
        );

        res.json({
            id: Number(id),
            nome,
            data,
            horario,
            status: statusCorridaValido(status) ? status : "aberta",
            limite_inscritos: Number(limite_inscritos) || 20,
            pista_id: pista_id || 1
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar corrida" });
    }
});

// Exclui corrida.
app.delete("/corridas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            "DELETE FROM corridas WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Corrida não encontrada" });
        }

        res.json({ mensagem: "Corrida excluída com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir corrida" });
    }
});


// =====================================================
// INSCRIÇÕES EM CORRIDAS
// =====================================================
// Uma inscrição liga: corrida + piloto + veículo.
// Assim o piloto escolhe com qual carro vai participar do evento.
// =====================================================

// Lista todas as inscrições.
app.get("/inscricoes-corridas", async (req, res) => {
    try {
        const [inscricoes] = await pool.query(`
            SELECT 
                ci.id,
                ci.corrida_id,
                ci.piloto_id,
                ci.veiculo_id,
                ci.criado_em,
                u.nome AS piloto,
                u.email AS email_piloto,
                c.nome AS corrida,
                c.status AS corrida_status,
                c.limite_inscritos,
                v.marca AS veiculo_marca,
                v.modelo AS veiculo_modelo,
                v.ano AS veiculo_ano,
                v.placa AS veiculo_placa,
                v.potencia AS veiculo_potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM corridas_inscricoes ci
            JOIN usuarios u ON u.id = ci.piloto_id
            JOIN corridas c ON c.id = ci.corrida_id
            LEFT JOIN veiculos v ON v.id = ci.veiculo_id
            ORDER BY ci.criado_em DESC
        `);

        res.json(inscricoes);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar inscrições" });
    }
});

// Lista inscritos de uma corrida específica.
app.get("/corridas/:id/inscritos", async (req, res) => {
    try {
        const { id } = req.params;

        const [inscritos] = await pool.query(`
            SELECT 
                ci.id,
                ci.corrida_id,
                ci.piloto_id,
                ci.veiculo_id,
                ci.criado_em,
                u.nome AS piloto,
                u.email AS email_piloto,
                v.marca AS veiculo_marca,
                v.modelo AS veiculo_modelo,
                v.ano AS veiculo_ano,
                v.placa AS veiculo_placa,
                v.potencia AS veiculo_potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM corridas_inscricoes ci
            JOIN usuarios u ON u.id = ci.piloto_id
            LEFT JOIN veiculos v ON v.id = ci.veiculo_id
            WHERE ci.corrida_id = ?
            ORDER BY u.nome ASC
        `, [id]);

        res.json(inscritos);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar inscritos da corrida" });
    }
});

// Inscreve piloto em corrida com um veículo selecionado.
app.post("/corridas/:id/inscrever", async (req, res) => {
    try {
        const { id } = req.params;
        const { piloto_id, veiculo_id } = req.body;

        if (!piloto_id || !veiculo_id) {
            return res.status(400).json({ erro: "Informe piloto e veículo" });
        }

        const [corridas] = await pool.query(
            `
            SELECT c.id, c.data, c.horario, c.status, c.limite_inscritos, COUNT(ci.id) AS total_inscritos
            FROM corridas c
            LEFT JOIN corridas_inscricoes ci ON ci.corrida_id = c.id
            WHERE c.id = ?
            GROUP BY c.id, c.data, c.horario, c.status, c.limite_inscritos
            `,
            [id]
        );

        if (corridas.length === 0) {
            return res.status(404).json({ erro: "Corrida não encontrada" });
        }

        if (corridaEstaFinalizada(corridas[0]) || corridas[0].status === "finalizada") {
            return res.status(400).json({ erro: "Não é possível se inscrever em uma corrida finalizada" });
        }

        if (corridas[0].status === "encerrada" || corridas[0].status === "cancelada") {
            return res.status(400).json({ erro: "Esta corrida não está aberta para inscrições" });
        }

        if (Number(corridas[0].total_inscritos) >= Number(corridas[0].limite_inscritos || 20)) {
            return res.status(409).json({ erro: "Limite de inscritos atingido para esta corrida" });
        }

        const [pilotos] = await pool.query(
            `SELECT id FROM usuarios WHERE id = ? AND tipo = "piloto"`,
            [piloto_id]
        );

        if (pilotos.length === 0) {
            return res.status(403).json({ erro: "Apenas pilotos podem se inscrever em corridas" });
        }

        // Confere se o veículo pertence ao piloto selecionado.
        const [veiculos] = await pool.query(
            "SELECT id FROM veiculos WHERE id = ? AND piloto_id = ?",
            [veiculo_id, piloto_id]
        );

        if (veiculos.length === 0) {
            return res.status(400).json({ erro: "O veículo selecionado não pertence ao piloto" });
        }

        const [resultado] = await pool.query(
            `
            INSERT INTO corridas_inscricoes (corrida_id, piloto_id, veiculo_id)
            VALUES (?, ?, ?)
            `,
            [id, piloto_id, veiculo_id]
        );

        res.status(201).json({
            id: resultado.insertId,
            corrida_id: Number(id),
            piloto_id: Number(piloto_id),
            veiculo_id: Number(veiculo_id)
        });

    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ erro: "Piloto já inscrito nesta corrida" });
        }

        console.error(erro);
        res.status(500).json({ erro: "Erro ao realizar inscrição" });
    }
});

// Cancela inscrição de um piloto em uma corrida.
app.delete("/corridas/:id/inscrever/:piloto_id", async (req, res) => {
    try {
        const { id, piloto_id } = req.params;

        const [corridas] = await pool.query(
            `
            SELECT c.id, c.data, c.horario, c.status, c.limite_inscritos, COUNT(ci.id) AS total_inscritos
            FROM corridas c
            LEFT JOIN corridas_inscricoes ci ON ci.corrida_id = c.id
            WHERE c.id = ?
            GROUP BY c.id, c.data, c.horario, c.status, c.limite_inscritos
            `,
            [id]
        );

        if (corridas.length === 0) {
            return res.status(404).json({ erro: "Corrida não encontrada" });
        }

        if (corridaEstaFinalizada(corridas[0]) || corridas[0].status === "finalizada") {
            return res.status(400).json({ erro: "Não é possível cancelar inscrição de uma corrida finalizada" });
        }

        if (corridas[0].status === "cancelada") {
            return res.status(400).json({ erro: "Não é possível cancelar inscrição de uma corrida cancelada" });
        }

        const [resultado] = await pool.query(
            `
            DELETE FROM corridas_inscricoes
            WHERE corrida_id = ? AND piloto_id = ?
            `,
            [id, piloto_id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Inscrição não encontrada" });
        }

        res.json({ mensagem: "Inscrição cancelada com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao cancelar inscrição" });
    }
});


// =====================================================
// RESERVAS
// =====================================================

// Lista reservas.
app.get("/reservas", async (req, res) => {
    try {
        const [reservas] = await pool.query(`
            SELECT 
                r.id,
                r.usuario_id,
                r.data,
                r.horario,
                r.criado_em,
                u.nome AS usuario,
                u.nome AS cliente,
                u.email AS email_cliente,
                "RaceHub Track" AS pista
            FROM reservas r
            LEFT JOIN usuarios u ON u.id = r.usuario_id
            ORDER BY r.data ASC, r.horario ASC
        `);

        res.json(reservas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar reservas" });
    }
});

// Cria reserva.
app.post("/reservas", async (req, res) => {
    try {
        const { usuario_id, data, horario } = req.body;

        if (!data || !horario) {
            return res.status(400).json({ erro: "Selecione data e horário" });
        }

        const [conflito] = await pool.query(
            "SELECT id FROM reservas WHERE data = ? AND horario = ?",
            [data, horario]
        );

        if (conflito.length > 0) {
            return res.status(409).json({ erro: "Este horário já está reservado" });
        }

        const [resultado] = await pool.query(
            "INSERT INTO reservas (usuario_id, data, horario) VALUES (?, ?, ?)",
            [usuario_id || null, data, horario]
        );

        res.status(201).json({
            id: resultado.insertId,
            usuario_id: usuario_id || null,
            data,
            horario
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao criar reserva" });
    }
});

// Edita reserva.
app.put("/reservas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, data, horario } = req.body;

        if (!data || !horario) {
            return res.status(400).json({ erro: "Selecione data e horário" });
        }

        const [reservas] = await pool.query(
            "SELECT id FROM reservas WHERE id = ?",
            [id]
        );

        if (reservas.length === 0) {
            return res.status(404).json({ erro: "Reserva não encontrada" });
        }

        const [conflito] = await pool.query(
            "SELECT id FROM reservas WHERE data = ? AND horario = ? AND id <> ?",
            [data, horario, id]
        );

        if (conflito.length > 0) {
            return res.status(409).json({ erro: "Este horário já está reservado" });
        }

        await pool.query(
            "UPDATE reservas SET usuario_id = ?, data = ?, horario = ? WHERE id = ?",
            [usuario_id || null, data, horario, id]
        );

        res.json({
            id: Number(id),
            usuario_id: usuario_id || null,
            data,
            horario
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar reserva" });
    }
});

// Exclui reserva.
app.delete("/reservas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            "DELETE FROM reservas WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Reserva não encontrada" });
        }

        res.json({ mensagem: "Reserva excluída com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir reserva" });
    }
});


// =====================================================
// RESULTADOS / TEMPOS
// =====================================================
// Cada resultado agora pode ser vinculado a um veículo.
// Isso permite saber não só quem pilotou, mas com qual carro.
// =====================================================

// Lista resultados com dados de piloto, corrida e veículo.
app.get("/resultados", async (req, res) => {
    try {
        const [resultados] = await pool.query(`
            SELECT 
                r.id,
                r.corrida_id,
                r.piloto_id,
                r.veiculo_id,
                r.tempo_volta,
                r.classificacao,
                u.nome AS piloto,
                u.email AS email_piloto,
                c.nome AS corrida,
                c.data AS data_corrida,
                c.horario AS horario_corrida,
                v.marca AS veiculo_marca,
                v.modelo AS veiculo_modelo,
                v.ano AS veiculo_ano,
                v.placa AS veiculo_placa,
                v.potencia AS veiculo_potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM resultados r
            LEFT JOIN usuarios u ON u.id = r.piloto_id
            LEFT JOIN corridas c ON c.id = r.corrida_id
            LEFT JOIN veiculos v ON v.id = r.veiculo_id
            ORDER BY r.tempo_volta ASC
        `);

        res.json(resultados);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar resultados" });
    }
});

// Registra tempo de volta.
app.post("/resultados", async (req, res) => {
    try {
        const { piloto_id, corrida_id, veiculo_id, tempo_volta } = req.body;

        if (!piloto_id || !corrida_id || !veiculo_id || !tempo_volta) {
            return res.status(400).json({ erro: "Preencha corrida, piloto, veículo e tempo de volta" });
        }

        if (Number(tempo_volta) <= 0) {
            return res.status(400).json({ erro: "O tempo de volta precisa ser maior que zero" });
        }

        const [pilotos] = await pool.query(
            `SELECT id FROM usuarios WHERE id = ? AND tipo = "piloto"`,
            [piloto_id]
        );

        if (pilotos.length === 0) {
            return res.status(404).json({ erro: "Piloto não encontrado" });
        }

        const [corridas] = await pool.query(
            "SELECT id FROM corridas WHERE id = ?",
            [corrida_id]
        );

        if (corridas.length === 0) {
            return res.status(404).json({ erro: "Corrida não encontrada" });
        }

        const [veiculos] = await pool.query(
            "SELECT id FROM veiculos WHERE id = ? AND piloto_id = ?",
            [veiculo_id, piloto_id]
        );

        if (veiculos.length === 0) {
            return res.status(400).json({ erro: "O veículo selecionado não pertence ao piloto" });
        }

        const [resultado] = await pool.query(
            `
            INSERT INTO resultados
            (corrida_id, piloto_id, veiculo_id, tempo_volta)
            VALUES (?, ?, ?, ?)
            `,
            [
                corrida_id,
                piloto_id,
                veiculo_id,
                tempo_volta
            ]
        );

        res.status(201).json({
            id: resultado.insertId,
            piloto_id,
            corrida_id,
            veiculo_id,
            tempo_volta
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao registrar resultado" });
    }
});

// Exclui resultado.
app.delete("/resultados/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            "DELETE FROM resultados WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Resultado não encontrado" });
        }

        res.json({ mensagem: "Resultado excluído com sucesso" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao excluir resultado" });
    }
});




// =====================================================
// RANKINGS E DADOS SOCIAIS - VERSÃO 3.0
// =====================================================

// Ranking com o melhor tempo de cada veículo.
app.get("/rankings/veiculos", async (req, res) => {
    try {
        const [linhas] = await pool.query(`
            SELECT
                v.id AS veiculo_id,
                v.marca,
                v.modelo,
                v.ano,
                v.potencia,
                u.id AS piloto_id,
                u.nome AS piloto,
                MIN(r.tempo_volta) AS melhor_tempo,
                COUNT(r.id) AS total_tempos
            FROM resultados r
            JOIN veiculos v ON v.id = r.veiculo_id
            JOIN usuarios u ON u.id = v.piloto_id
            WHERE r.tempo_volta IS NOT NULL
            GROUP BY v.id, v.marca, v.modelo, v.ano, v.potencia, u.id, u.nome
            ORDER BY melhor_tempo ASC
            LIMIT 10
        `);

        res.json(linhas.map(item => ({
            ...item,
            veiculo: montarNomeVeiculo(item),
            categoria_potencia: categoriaPotencia(item.potencia)
        })));

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro:"Erro ao buscar ranking por veículo" });
    }
});

// Ranking separado por faixa de potência.
app.get("/rankings/potencia", async (req, res) => {
    try {
        const [resultados] = await pool.query(`
            SELECT
                r.id,
                r.tempo_volta,
                u.nome AS piloto,
                v.id AS veiculo_id,
                v.marca,
                v.modelo,
                v.ano,
                v.potencia,
                c.nome AS corrida
            FROM resultados r
            JOIN usuarios u ON u.id = r.piloto_id
            JOIN veiculos v ON v.id = r.veiculo_id
            LEFT JOIN corridas c ON c.id = r.corrida_id
            WHERE r.tempo_volta IS NOT NULL
            ORDER BY r.tempo_volta ASC
        `);

        const grupos = {};

        resultados.forEach(resultado => {
            const categoria = categoriaPotencia(resultado.potencia);
            if (!grupos[categoria]) grupos[categoria] = [];

            grupos[categoria].push({
                ...resultado,
                veiculo: montarNomeVeiculo(resultado),
                categoria_potencia: categoria
            });
        });

        res.json(grupos);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro:"Erro ao buscar ranking por potência" });
    }
});

// Feed social dos pilotos: mostra estatísticas públicas de cada piloto.
// Esta rota foi reforçada na v3.0.1 para funcionar mesmo quando o banco veio de versões antigas.
// Em vez de depender de vários JOINs diretos, ela usa subconsultas seguras e só usa colunas que existem.
app.get("/pilotos-publicos", async (req, res) => {
    try {
        // Confere se recursos opcionais existem no banco atual.
        // Isso evita erro caso o banco antigo ainda não tenha foto_perfil ou alguma tabela nova.
        const temFotoPerfil = await colunaExiste("usuarios", "foto_perfil");
        const temTabelaVeiculos = await tabelaExiste("veiculos");
        const temPilotoIdVeiculo = temTabelaVeiculos && await colunaExiste("veiculos", "piloto_id");
        const temTabelaInscricoes = await tabelaExiste("corridas_inscricoes");
        const temTabelaResultados = await tabelaExiste("resultados");

        // Monta os campos dinamicamente.
        // Se uma tabela/coluna não existir, retorna 0 ou NULL em vez de quebrar a página Social.
        const campoFoto = temFotoPerfil
            ? "u.foto_perfil AS foto_perfil"
            : "NULL AS foto_perfil";

        const campoTotalVeiculos = temTabelaVeiculos && temPilotoIdVeiculo
            ? `(SELECT COUNT(*) FROM veiculos v WHERE v.piloto_id = u.id) AS total_veiculos`
            : `0 AS total_veiculos`;

        const campoTotalInscricoes = temTabelaInscricoes
            ? `(SELECT COUNT(*) FROM corridas_inscricoes ci WHERE ci.piloto_id = u.id) AS total_inscricoes`
            : `0 AS total_inscricoes`;

        const campoTotalTempos = temTabelaResultados
            ? `(SELECT COUNT(*) FROM resultados r WHERE r.piloto_id = u.id) AS total_tempos`
            : `0 AS total_tempos`;

        const campoMelhorTempo = temTabelaResultados
            ? `(SELECT MIN(r.tempo_volta) FROM resultados r WHERE r.piloto_id = u.id) AS melhor_tempo`
            : `NULL AS melhor_tempo`;

        const [pilotos] = await pool.query(`
            SELECT
                u.id,
                u.nome,
                u.email,
                ${campoFoto},
                ${campoTotalVeiculos},
                ${campoTotalInscricoes},
                ${campoTotalTempos},
                ${campoMelhorTempo}
            FROM usuarios u
            WHERE u.tipo = "piloto"
            ORDER BY melhor_tempo IS NULL, melhor_tempo ASC, u.nome ASC
        `);

        res.json(pilotos);

    } catch (erro) {
        console.error("Erro na rota /pilotos-publicos:", erro);
        res.status(500).json({ erro:"Erro ao buscar pilotos públicos" });
    }
});


// Perfil público completo de um piloto.
// Usado pela página piloto-publico.html para mostrar carros, tempos e corridas do piloto.
app.get("/pilotos-publicos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [pilotos] = await pool.query(`
            SELECT id, nome, email, foto_perfil, tipo, criado_em
            FROM usuarios
            WHERE id = ? AND tipo = "piloto"
        `, [id]);

        if (pilotos.length === 0) {
            return res.status(404).json({ erro:"Piloto não encontrado" });
        }

        const piloto = pilotos[0];

        const [veiculos] = await pool.query(`
            SELECT id, piloto_id, marca, modelo, ano, placa, cor, potencia, observacoes, criado_em
            FROM veiculos
            WHERE piloto_id = ?
            ORDER BY id ASC
        `, [id]);

        const [tempos] = await pool.query(`
            SELECT
                r.id,
                r.corrida_id,
                r.piloto_id,
                r.veiculo_id,
                r.tempo_volta,
                c.nome AS corrida,
                c.data AS corrida_data,
                c.horario AS corrida_horario,
                c.status AS corrida_status,
                v.marca,
                v.modelo,
                v.ano,
                v.placa,
                v.cor,
                v.potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM resultados r
            LEFT JOIN corridas c ON c.id = r.corrida_id
            LEFT JOIN veiculos v ON v.id = r.veiculo_id
            WHERE r.piloto_id = ?
            ORDER BY r.tempo_volta ASC
        `, [id]);

        const [inscricoes] = await pool.query(`
            SELECT
                ci.id,
                ci.corrida_id,
                ci.piloto_id,
                ci.veiculo_id,
                ci.criado_em,
                c.nome AS corrida,
                c.data AS corrida_data,
                c.horario AS corrida_horario,
                c.status AS corrida_status,
                v.marca,
                v.modelo,
                v.ano,
                v.placa,
                v.cor,
                v.potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM corridas_inscricoes ci
            LEFT JOIN corridas c ON c.id = ci.corrida_id
            LEFT JOIN veiculos v ON v.id = ci.veiculo_id
            WHERE ci.piloto_id = ?
            ORDER BY c.data DESC, c.horario DESC
        `, [id]);

        const melhorTempo = tempos.length > 0 ? tempos[0].tempo_volta : null;

        res.json({
            piloto,
            veiculos: veiculos.map(veiculo => ({
                ...veiculo,
                veiculo: montarNomeVeiculo(veiculo),
                nome_veiculo: montarNomeVeiculo(veiculo),
                categoria_potencia: categoriaPotencia(veiculo.potencia)
            })),
            tempos: tempos.map(tempo => ({
                ...tempo,
                categoria_potencia: categoriaPotencia(tempo.potencia),
                nome_veiculo: montarNomeVeiculo(tempo)
            })),
            inscricoes: inscricoes.map(inscricao => ({
                ...inscricao,
                categoria_potencia: categoriaPotencia(inscricao.potencia),
                nome_veiculo: montarNomeVeiculo(inscricao)
            })),
            estatisticas:{
                total_veiculos: veiculos.length,
                total_tempos: tempos.length,
                total_inscricoes: inscricoes.length,
                melhor_tempo: melhorTempo
            }
        });

    } catch (erro) {
        console.error("Erro na rota /pilotos-publicos/:id:", erro);
        res.status(500).json({ erro:"Erro ao buscar perfil público do piloto" });
    }
});

// Dados completos de uma corrida para a página corrida-detalhes.html.
app.get("/corridas/:id/detalhes", async (req, res) => {
    try {
        const { id } = req.params;

        const [corridas] = await pool.query(`
            SELECT
                c.id, c.nome, c.data, c.horario, c.status, c.limite_inscritos, c.pista_id,
                p.nome AS pista,
                COUNT(DISTINCT ci.id) AS total_inscritos
            FROM corridas c
            LEFT JOIN pistas p ON p.id = c.pista_id
            LEFT JOIN corridas_inscricoes ci ON ci.corrida_id = c.id
            WHERE c.id = ?
            GROUP BY c.id, c.nome, c.data, c.horario, c.status, c.limite_inscritos, c.pista_id, p.nome
        `, [id]);

        if (corridas.length === 0) {
            return res.status(404).json({ erro:"Corrida não encontrada" });
        }

        const [inscritos] = await pool.query(`
            SELECT
                ci.id, ci.piloto_id, ci.veiculo_id, ci.criado_em,
                u.nome AS piloto,
                u.email AS email_piloto,
                u.foto_perfil,
                v.marca AS veiculo_marca,
                v.modelo AS veiculo_modelo,
                v.ano AS veiculo_ano,
                v.potencia AS veiculo_potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM corridas_inscricoes ci
            JOIN usuarios u ON u.id = ci.piloto_id
            LEFT JOIN veiculos v ON v.id = ci.veiculo_id
            WHERE ci.corrida_id = ?
            ORDER BY u.nome ASC
        `, [id]);

        const [ranking] = await pool.query(`
            SELECT
                r.id, r.tempo_volta, r.piloto_id, r.veiculo_id,
                u.nome AS piloto,
                v.marca AS veiculo_marca,
                v.modelo AS veiculo_modelo,
                v.ano AS veiculo_ano,
                v.potencia AS veiculo_potencia,
                CONCAT_WS(' ', v.marca, v.modelo, v.ano) AS veiculo
            FROM resultados r
            JOIN usuarios u ON u.id = r.piloto_id
            LEFT JOIN veiculos v ON v.id = r.veiculo_id
            WHERE r.corrida_id = ?
            ORDER BY r.tempo_volta ASC
        `, [id]);

        res.json({ corrida:corridas[0], inscritos, ranking });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro:"Erro ao buscar detalhes da corrida" });
    }
});

// Notificações simples para os dashboards.
app.get("/usuarios/:id/notificacoes", async (req, res) => {
    try {
        const { id } = req.params;

        const [usuarios] = await pool.query("SELECT id, tipo FROM usuarios WHERE id = ?", [id]);
        if (usuarios.length === 0) return res.status(404).json({ erro:"Usuário não encontrado" });

        const usuario = usuarios[0];
        const notificacoes = [];

        if (usuario.tipo === "admin") {
            const [[corridas]] = await pool.query("SELECT COUNT(*) AS total FROM corridas WHERE data >= CURDATE()");
            const [[inscricoes]] = await pool.query("SELECT COUNT(*) AS total FROM corridas_inscricoes");
            notificacoes.push(`Existem ${corridas.total} corridas futuras cadastradas.`);
            notificacoes.push(`O sistema possui ${inscricoes.total} inscrições em corridas.`);
        } else if (usuario.tipo === "piloto") {
            const [[veiculos]] = await pool.query("SELECT COUNT(*) AS total FROM veiculos WHERE piloto_id = ?", [id]);
            const [[inscricoes]] = await pool.query("SELECT COUNT(*) AS total FROM corridas_inscricoes WHERE piloto_id = ?", [id]);
            const [[melhor]] = await pool.query("SELECT MIN(tempo_volta) AS tempo FROM resultados WHERE piloto_id = ?", [id]);
            notificacoes.push(`Você possui ${veiculos.total} veículo(s) cadastrado(s).`);
            notificacoes.push(`Você está inscrito em ${inscricoes.total} corrida(s).`);
            if (melhor.tempo) notificacoes.push(`Sua melhor volta é ${Number(melhor.tempo).toFixed(3)}s.`);
        }

        res.json(notificacoes);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro:"Erro ao buscar notificações" });
    }
});


// =====================================================
// PISTAS
// =====================================================

app.get("/pistas", async (req, res) => {
    try {
        const [pistas] = await pool.query(`
            SELECT id, nome, localizacao, comprimento
            FROM pistas
            ORDER BY id ASC
        `);

        res.json(pistas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar pistas" });
    }
});


// =====================================================
// ADMINS PADRÃO
// =====================================================

// Garante que existam dois administradores principais.
// Se eles já existirem, não são recriados.
async function criarAdminsPadrao() {
    try {
        const admins = [
            {
                nome: "Admin Yan",
                email: "yanaugustoscholze@gmail.com",
                senha: "yan"
            },
            {
                nome: "Admin Miguel",
                email: "miguel@racehub.com",
                senha: "miguel"
            }
        ];

        for (const admin of admins) {
            const [existentes] = await pool.query(
                "SELECT id FROM usuarios WHERE email = ?",
                [admin.email]
            );

            if (existentes.length === 0) {
                // Se o administrador fixo ainda não existe, cria a conta padrão.
                const senhaHash = await bcrypt.hash(admin.senha, SALT_ROUNDS);

                await pool.query(
                    `
                    INSERT INTO usuarios (nome, email, senha, tipo)
                    VALUES (?, ?, ?, "admin")
                    `,
                    [admin.nome, admin.email, senhaHash]
                );
            } else {
                // Se o administrador já existe, apenas garante que o nome exibido fique padronizado.
                // Isso altera "Administrador Yan" para "Admin Yan" sem trocar e-mail ou senha.
                await pool.query(
                    `
                    UPDATE usuarios
                    SET nome = ?, tipo = "admin"
                    WHERE email = ?
                    `,
                    [admin.nome, admin.email]
                );
            }
        }

        console.log("✔ Administradores padrão verificados.");

    } catch (erro) {
        console.error("Erro ao criar administradores padrão:", erro);
    }
}


// =====================================================
// START SERVER
// =====================================================

// Primeiro o sistema verifica a estrutura do banco.
// Depois cria/verifica os administradores padrão.
// Só então o servidor é iniciado na porta 3000.
async function iniciarServidor() {
    await garantirEstruturaBanco();
    await criarAdminsPadrao();

    app.listen(PORT, () => {
        console.log("====================================");
        console.log("🏁 RaceHub iniciado com sucesso!");
        console.log(`🌐 http://localhost:${PORT}`);
        console.log("====================================");
    });
}

iniciarServidor();
