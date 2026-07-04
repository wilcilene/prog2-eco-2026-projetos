const PostRepository = require('../repository/PostRepository');
const Post           = require('../model/Post');

 
class PostService {

 
    async criar(usuario_id, conteudo, imagem) {
        const post = new Post(null, usuario_id, conteudo, imagem);
        return await PostRepository.salvar(post);
    }

 
    async deletar(post_id, usuario_id) {
        return await PostRepository.deletar(post_id, usuario_id);
    }

 
    async listarTodos(usuario_id) {
        const [posts] = await PostRepository.buscarTodos(usuario_id);
        return posts;
    }

 
    async listarPorUsuario(usuario_id, viewer_id) {
        const [posts] = await PostRepository.buscarPorUsuario(usuario_id, viewer_id);
        return posts;
    }

    
    async listarCurtidosPorUsuario(usuario_id, viewer_id) {
        const [posts] = await PostRepository.buscarCurtidosPorUsuario(usuario_id, viewer_id);
        return posts;
    }

 
    async listarComentadosPorUsuario(usuario_id, viewer_id) {
        const [posts] = await PostRepository.buscarComentadosPorUsuario(usuario_id, viewer_id);
        return posts;
    }
}
 
module.exports = new PostService();