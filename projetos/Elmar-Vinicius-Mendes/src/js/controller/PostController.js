const PostService = require('../service/PostService');
 
class PostController {
 
 
    async criar(req, res) {
        try {
            const { usuario_id, conteudo, imagem } = req.body;
            await PostService.criar(usuario_id, conteudo, imagem);
            res.json({ msg: 'Post criado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao criar post' });
        }
    }

 
    async deletar(req, res) {
        try {
            const { id }         = req.params;
            const { usuario_id } = req.body;
            await PostService.deletar(id, usuario_id);
            res.json({ msg: 'Post excluído' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao excluir post' });
        }
    }

 
    async listar(req, res) {
        try {
            const viewer_id = req.query.viewer_id || 0;
            const posts     = await PostService.listarTodos(viewer_id);
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar posts' });
        }
    }

 
    async listarPorUsuario(req, res) {
        try {
            const { id }    = req.params;
            const viewer_id = req.query.viewer_id || 0;
            const posts     = await PostService.listarPorUsuario(id, viewer_id);
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar posts do usuário' });
        }
    }

    
    async listarCurtidos(req, res) {
        try {
            const { id }    = req.params;
            const viewer_id = req.query.viewer_id || 0;
            const posts     = await PostService.listarCurtidosPorUsuario(id, viewer_id);
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar posts curtidos' });
        }
    }

 
    async listarComentados(req, res) {
        try {
            const { id }    = req.params;
            const viewer_id = req.query.viewer_id || 0;
            const posts     = await PostService.listarComentadosPorUsuario(id, viewer_id);
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Erro ao buscar posts comentados' });
        }
    }
}
 
module.exports = new PostController();