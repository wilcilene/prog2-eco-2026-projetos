const UsuarioService = require('../service/UsuarioService');

class UsuarioController {

    async cadastrar(req, res) {
        try {
            const { nome, telefone, username, email, genero, senha } = req.body;
            await UsuarioService.cadastrar(nome, telefone, username, email, genero, senha);
            res.json({ msg: 'Cadastrado com sucesso' });
        } catch (error) {
            console.error(error);

            if (error.code === 'ER_DUP_ENTRY') {
                if (error.sqlMessage?.includes('email')) {
                    return res.status(409).json({ msg: 'Este e-mail já está cadastrado.' });
                }
                if (error.sqlMessage?.includes('username')) {
                    return res.status(409).json({ msg: 'Este nome de usuário já está em uso.' });
                }
                return res.status(409).json({ msg: 'Dados já cadastrados.' });
            }

            res.status(500).json({ msg: 'Erro ao cadastrar' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await UsuarioService.login(email, senha);
            if (!usuario) return res.status(401).json({ msg: 'Email ou senha inválidos' });
            res.json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro no servidor' });
        }
    }

    async buscar(req, res) {
        try {
            const { termo } = req.query;
            const usuarios = await UsuarioService.buscar(termo || '');
            res.json(usuarios);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro na busca' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioService.buscarPorId(id);
            if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado' });
            res.json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar usuário' });
        }
    }

    async atualizarFoto(req, res) {
        try {
            const { id } = req.params;
            const { foto } = req.body;
            await UsuarioService.atualizarFoto(id, foto);
            res.json({ msg: 'Foto atualizada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao atualizar foto' });
        }
    }
}

module.exports = new UsuarioController();