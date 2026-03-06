class Livro {
    constructor(titulo, autor) {
        this.titulo = titulo;
        this.autor = autor;
        this.emprestado = false;
    }

    descricao() {
        return `${this.titulo} - ${this.autor}`;
    }
}

class UsuarioBiblioteca {
    #livrosEmprestados = [];

    constructor(nome) {
        this.nome = nome;
    }

    emprestarLivro(livro) {

        if (livro.emprestado) {
            console.log("Livro já está emprestado.");
            return;
        }

        const jaPossui = this.#livrosEmprestados.some(
            l => l.titulo === livro.titulo
        );

        if (jaPossui) {
            console.log("Você já pegou esse livro.");
            return;
        }

        this.#livrosEmprestados.push(livro);
        livro.emprestado = true;

        console.log(`${this.nome} pegou o livro "${livro.titulo}"`);
    }

    listarEmprestimos() {
        console.log(`Livros emprestados para ${this.nome}:`);

        if (this.#livrosEmprestados.length === 0) {
            console.log("Nenhum livro emprestado.");
            return;
        }

        this.#livrosEmprestados.forEach(livro => {
            console.log("- " + livro.descricao());
        });
    }
}