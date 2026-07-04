require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const NotificacaoController = require('./src/js/controller/NotificacaoController');
const PostController        = require('./src/js/controller/PostController');
const UsuarioController     = require('./src/js/controller/UsuarioController');
const LikeController        = require('./src/js/controller/LikeController');
const MensagemController    = require('./src/js/controller/MensagemController');
const SeguidorController    = require('./src/js/controller/SeguidorController');
const ComentarioController  = require('./src/js/controller/ComentarioController');
const RepostController      = require('./src/js/controller/RepostController');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/usuarios/cadastro',      (req, res) => UsuarioController.cadastrar(req, res));
app.post('/usuarios/login',         (req, res) => UsuarioController.login(req, res));
app.get('/usuarios/buscar',         (req, res) => UsuarioController.buscar(req, res));
app.get('/usuarios/:id',            (req, res) => UsuarioController.buscarPorId(req, res));
app.put('/usuarios/:id/foto',       (req, res) => UsuarioController.atualizarFoto(req, res));

app.post('/posts',                  (req, res) => PostController.criar(req, res));
app.delete('/posts/:id',            (req, res) => PostController.deletar(req, res));
app.get('/posts',                   (req, res) => PostController.listar(req, res));
app.get('/posts/usuario/:id',       (req, res) => PostController.listarPorUsuario(req, res));
app.get('/posts/curtidos/:id',      (req, res) => PostController.listarCurtidos(req, res));
app.get('/posts/comentados/:id',    (req, res) => PostController.listarComentados(req, res));

app.post('/likes',                  (req, res) => LikeController.curtir(req, res));
app.delete('/likes',                (req, res) => LikeController.descurtir(req, res));
app.get('/likes/:post_id',          (req, res) => LikeController.contar(req, res));

app.post('/comentarios',            (req, res) => ComentarioController.comentar(req, res));
app.get('/comentarios/:post_id',    (req, res) => ComentarioController.listar(req, res));

app.post('/reposts',                (req, res) => RepostController.repostar(req, res));
app.delete('/reposts',              (req, res) => RepostController.desfazer(req, res));

app.get('/seguidores/checar',           (req, res) => SeguidorController.checar(req, res));
app.get('/seguidores/:id/seguidores',   (req, res) => SeguidorController.listarSeguidores(req, res));
app.get('/seguidores/:id/seguindo',     (req, res) => SeguidorController.listarSeguindo(req, res));
app.get('/seguidores/:id',              (req, res) => SeguidorController.contar(req, res));
app.post('/seguidores',                 (req, res) => SeguidorController.seguir(req, res));
app.delete('/seguidores',               (req, res) => SeguidorController.desseguir(req, res));

app.get('/mensagens/conversas/:id', (req, res) => MensagemController.listarConversas(req, res));
app.post('/mensagens',              (req, res) => MensagemController.enviar(req, res));
app.get('/mensagens/:id',           (req, res) => MensagemController.conversa(req, res));

app.get('/notificacoes/:usuario_id',            (req, res) => NotificacaoController.listar(req, res));
app.get('/notificacoes/:usuario_id/nao-lidas',  (req, res) => NotificacaoController.contarNaoLidas(req, res));
app.put('/notificacoes/:usuario_id/lidas',      (req, res) => NotificacaoController.marcarLidas(req, res));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Zerion rodando em http://localhost:${PORT}`));

module.exports = app;