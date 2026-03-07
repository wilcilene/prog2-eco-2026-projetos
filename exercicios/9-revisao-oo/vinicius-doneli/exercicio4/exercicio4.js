class Livro {
    constructor(titulo, autor) {
        if (!titulo || titulo.trim() === "") {
            throw new Error("Título do livro é obrigatório.");
        }

        if (!autor || autor.trim() === "") {
            throw new Error("Autor do livro é obrigatório.");
        }

        this.titulo = titulo;
        this.autor = autor;
    }
}

class UsuarioBiblioteca {
    #livrosEmprestados;

    constructor(nome) {
        if (!nome || nome.trim() === "") {
            throw new Error("Nome do usuário é obrigatório.");
        }

        this.nome = nome;
        this.#livrosEmprestados = [];
    }

    emprestarLivro(livro) {
        if (!(livro instanceof Livro)) {
            throw new Error("Livro inválido.");
        }

        const jaEmprestado = this.#livrosEmprestados.find(
            l => l.titulo === livro.titulo
        );

        if (jaEmprestado) {
            throw new Error("Este livro já foi emprestado para este usuário.");
        }

        this.#livrosEmprestados.push(livro);
    }

    devolverLivro(titulo) {
        const index = this.#livrosEmprestados.findIndex(
            l => l.titulo === titulo
        );

        if (index === -1) {
            throw new Error("Livro não encontrado na lista de empréstimos.");
        }

        this.#livrosEmprestados.splice(index, 1);
    }

    listarEmprestimosAtivos() {
        return this.#livrosEmprestados.map(livro => ({
            titulo: livro.titulo,
            autor: livro.autor
        }));
    }
}
const livro1 = new Livro("Mob dick", "Herman Melville");
const livro2 = new Livro("Robbin Hood", "Louis Rhead");

const usuario = new UsuarioBiblioteca("Vinicius");

usuario.emprestarLivro(livro1);
usuario.emprestarLivro(livro2);

console.log(usuario.listarEmprestimosAtivos());

usuario.devolverLivro("Mob dick");

console.log(usuario.listarEmprestimosAtivos());