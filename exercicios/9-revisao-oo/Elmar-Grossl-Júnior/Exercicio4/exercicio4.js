class Livro {
    constructor(titulo, autor) {
        this.titulo = titulo;
        this.autor = autor;
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

        const jaEmprestado = this.#livrosEmprestados.some(
            l => l.titulo === livro.titulo
        );

        if (jaEmprestado) {
            console.log(`O livro "${livro.titulo}" já foi emprestado para ${this.nome}`);
            return;
        }

        this.#livrosEmprestados.push(livro);
        console.log(`${this.nome} pegou emprestado "${livro.titulo}"`);
    }

    listarLivros() {
        return this.#livrosEmprestados;
    }
}

class Biblioteca {

    constructor() {
        this.usuarios = [];
    }

    adicionarUsuario(usuario) {
        this.usuarios.push(usuario);
    }

    listarEmprestimos() {
        console.log("Empréstimos ativos:");

        for (let usuario of this.usuarios) {
            const livros = usuario.listarLivros();

            for (let livro of livros) {
                console.log(`${usuario.nome} → ${livro.descricao()}`);
            }
        }
    }
}

const livro1 = new Livro("Game Engine Architecture", "Jason Gregory");
const livro2 = new Livro("But How Do It Know?", "J. Clark Scott");

const usuario1 = new UsuarioBiblioteca("Pedro");

const biblioteca = new Biblioteca();

biblioteca.adicionarUsuario(usuario1);

usuario1.emprestarLivro(livro1);
usuario1.emprestarLivro(livro2);

usuario1.emprestarLivro(livro1);

biblioteca.listarEmprestimos();