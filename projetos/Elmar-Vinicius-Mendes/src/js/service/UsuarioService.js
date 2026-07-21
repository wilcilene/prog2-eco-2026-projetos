const bcrypt           = require('bcrypt');
const UsuarioRepository = require('../repository/UsuarioRepository');
const Usuario           = require('../model/Usuario');

const SALT_ROUNDS = 12;

class UsuarioService {

    async cadastrar(nome, telefone, username, email, genero, senha) {
        const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
        const usuario   = new Usuario(null, nome, telefone, username, email, genero, senhaHash);
        return await UsuarioRepository.salvar(usuario);
    }


    async login(email, senha) {
        const [usuarios] = await UsuarioRepository.buscarPorEmail(email);
        if (usuarios.length === 0) return null;

        const usuario = usuarios[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return null;

        const { senha: _, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
    }

    async buscar(termo) {
        const [usuarios] = await UsuarioRepository.buscarPorUsername(termo);
        return usuarios;
    }

    async buscarPorId(id) {
        const [usuarios] = await UsuarioRepository.buscarPorId(id);
        return usuarios[0] || null;
    }


    async atualizarFoto(id, foto) {
        return await UsuarioRepository.atualizarFoto(id, foto);
    }
}

module.exports = new UsuarioService();