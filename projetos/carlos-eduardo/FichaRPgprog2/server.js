const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());

app.use(express.json());
const db = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "rpg_user",
    password: "rpg123",
    database: "rpg_manager"
});const path = require("path");

app.use(
    express.static(
        path.join(__dirname)
    )
);
db.connect((erro) => {

    if (erro) {

        console.log("Erro:");

        console.log(erro);

        return;
    }
    

    console.log("MySQL conectado!");
});
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});
function autenticarToken(req, res, next) {

    const token =
        req.headers.authorization;

    if (!token) {

        return res.status(401).json({
            erro: "Token não enviado"
        });

    }

    try {

        const usuario =
            jwt.verify(
                token,
                "SEGREDO_RPG"
            );

        req.usuario = usuario;

        next();

    } catch {

        return res.status(403).json({
            erro: "Token inválido"
        });

    }
}
app.get(
    "/campanhas",
    autenticarToken,
    (req, res) => {

        const usuario_id =
            req.usuario.id;

    db.query(
        "SELECT * FROM campanhas WHERE usuario_id = ?",
        [usuario_id],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json(erro);
            }

            res.json(resultado);
        }
    );

});
app.post(
    "/campanhas",
    autenticarToken,
    (req, res) => {

        const { nome } =
            req.body;

        const usuario_id =
            req.usuario.id;
    db.query(
        "INSERT INTO campanhas (nome, usuario_id) VALUES (?, ?)",
        [nome, usuario_id],
        (erro, resultado) => {

            if (erro) {
                console.log(erro);
                return res.status(500).json(erro);
            }

            res.json({
                id: resultado.insertId,
                nome: nome
            });
        }
    );

});
app.delete("/campanhas/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM campanhas WHERE id = ?",
        [id],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json(erro);
            }

            res.json({
                mensagem:
                    "Campanha excluída com sucesso"
            });
        }
    );

});
app.post("/registro", async (req, res) => {

    const { nome, email, senha } = req.body;

    try {

        const senhaHash = await bcrypt.hash(senha, 10);

        db.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, senhaHash],
            (erro, resultado) => {

                if (erro) {
                    return res.status(500).json(erro);
                }

                res.json({
                    mensagem: "Usuário criado com sucesso"
                });

            }
        );

    } catch (erro) {

        res.status(500).json(erro);

    }

});
app.post("/login", (req, res) => {

    const { email, senha } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (erro, resultado) => {

            if (erro) {
                return res.status(500).json(erro);
            }

            if (resultado.length === 0) {

                return res.status(401).json({
                    erro: "Usuário não encontrado"
                });

            }

            const usuario = resultado[0];

            const senhaCorreta =
                await bcrypt.compare(
                    senha,
                    usuario.senha
                );

            if (!senhaCorreta) {

                return res.status(401).json({
                    erro: "Senha incorreta"
                });

            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    nome: usuario.nome
                },
                "SEGREDO_RPG",
                {
                    expiresIn: "7d"
                }
            );

            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome
                }
            });

        }
    );

});

app.get(
    "/personagens/:campanhaId",
    autenticarToken,
    (req, res) => {

    const campanhaId = req.params.campanhaId;

    db.query(
        "SELECT * FROM personagens WHERE campanha_id = ?",
        [campanhaId],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json(erro);
            }

            res.json(resultado);
        }
    );

});
app.post(
    "/personagens",
    autenticarToken,
    (req, res) => {
console.log(req.body);
    const {
        campanha_id,
        jogador,
        personagem,
        idade,
        altura,
        genero,
        sexualidade,
        raca,
        classe,
        nivel,
        lore,
        imagem,
        atributos
    } = req.body;
const idadeFinal =
    idade === ""
        ? null
        : Number(idade);

const nivelFinal =
    nivel === ""
        ? null
        : Number(nivel);
    db.query(
        `INSERT INTO personagens
        (
            campanha_id,
            jogador,
            personagem,
            idade,
            altura,
            genero,
            sexualidade,
            raca,
            classe,
            nivel,
            lore,
            imagem,
            forca,
            destreza,
            constituicao,
            inteligencia,
            sabedoria,
            carisma
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            campanha_id,
            jogador,
            personagem,
            idadeFinal,
            altura,
            genero,
            sexualidade,
            raca,
            classe,
            nivelFinal,
            lore,
            imagem,
            atributos.forca,
            atributos.destreza,
            atributos.constituicao,
            atributos.inteligencia,
            atributos.sabedoria,
            atributos.carisma
        ],
        (erro, resultado) => {

          if (erro) {

    console.log("ERRO AO SALVAR PERSONAGEM:");
    console.log(erro);

    return res.status(500).json({
        erro: erro.message
    });
}

            res.json({
                mensagem: "Personagem salvo!",
                id: resultado.insertId
            });

        }
    );

});
app.delete(
    "/personagens/:id",
    autenticarToken,
    (req, res) => {

        const id = req.params.id;

        db.query(
            "DELETE FROM personagens WHERE id = ?",
            [id],
            (erro) => {

                if (erro) {
                    return res.status(500).json(erro);
                }

                res.json({
                    mensagem: "Personagem excluído!"
                });

            }
        );

    }
);app.put(
    "/personagens/:id",
    autenticarToken,
    (req, res) => {

        const id = req.params.id;

        const {
            jogador,
            personagem,
            idade,
            altura,
            genero,
            sexualidade,
            raca,
            classe,
            nivel,
            lore,
            imagem,
            atributos
        } = req.body;

        const idadeFinal =
            idade === ""
                ? null
                : Number(idade);

        const nivelFinal =
            nivel === ""
                ? null
                : Number(nivel);

        db.query(
            `UPDATE personagens SET

                jogador = ?,
                personagem = ?,
                idade = ?,
                altura = ?,
                genero = ?,
                sexualidade = ?,
                raca = ?,
                classe = ?,
                nivel = ?,
                lore = ?,
                imagem = ?,

                forca = ?,
                destreza = ?,
                constituicao = ?,
                inteligencia = ?,
                sabedoria = ?,
                carisma = ?

            WHERE id = ?`,

            [
                jogador,
                personagem,

                idadeFinal,
                altura,
                genero,
                sexualidade,

                raca,
                classe,

                nivelFinal,

                lore,
                imagem,

                Number(atributos.forca),
                Number(atributos.destreza),
                Number(atributos.constituicao),
                Number(atributos.inteligencia),
                Number(atributos.sabedoria),
                Number(atributos.carisma),

                id
            ],

            (erro) => {

                if (erro) {
                    return res.status(500).json(erro);
                }

                res.json({
                    mensagem: "Personagem atualizado!"
                });

            }
        );

    }
);


app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});