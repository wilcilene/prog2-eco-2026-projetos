// Classe representando um livro
class Livro {
    constructor(titulo, autor) {
        this.titulo = titulo;
        this.autor = autor;
    }

    toString() {
        return `${this.titulo} por ${this.autor}`;
    }
}

// Classe representando um usuário da biblioteca
class UsuarioBiblioteca {
    constructor(nome) {
        this.nome = nome;
    }

    toString() {
        return this.nome;
    }
}

// Classe para controlar empréstimos (biblioteca)
class GerenciadorEmprestimos {
    // mapa de usuário para conjunto de livros emprestados
    #loans = new Map();

    emprestar(livro, usuario) {
        let livrosDoUsuario = this.#loans.get(usuario);
        if (!livrosDoUsuario) {
            livrosDoUsuario = new Set();
            this.#loans.set(usuario, livrosDoUsuario);
        }

        if (livrosDoUsuario.has(livro)) {
            console.log(`${usuario} já possui ${livro} emprestado.`);
            return false;
        }

        livrosDoUsuario.add(livro);
        console.log(`Empréstimo: ${livro} -> ${usuario}`);
        return true;
    }

    devolver(livro, usuario) {
        const livrosDoUsuario = this.#loans.get(usuario);
        if (!livrosDoUsuario || !livrosDoUsuario.has(livro)) {
            console.log(`${usuario} não está com ${livro}.`);
            return false;
        }
        livrosDoUsuario.delete(livro);
        console.log(`Devolução: ${livro} <- ${usuario}`);
        if (livrosDoUsuario.size === 0) {
            this.#loans.delete(usuario);
        }
        return true;
    }

    listarEmprestimos() {
        console.log('Empréstimos ativos:');
        for (const [usuario, livros] of this.#loans.entries()) {
            for (const livro of livros) {
                console.log(`- ${livro} -> ${usuario}`);
            }
        }
    }
}

// Demonstração
const livro1 = new Livro('1984', 'George Orwell');
const livro2 = new Livro('Brás Cubas', 'Machado de Assis');
const usuario1 = new UsuarioBiblioteca('Alice');
const usuario2 = new UsuarioBiblioteca('Bob');

const biblioteca = new GerenciadorEmprestimos();

biblioteca.emprestar(livro1, usuario1); // deve ok
biblioteca.emprestar(livro1, usuario1); // repetição
biblioteca.emprestar(livro2, usuario1);
biblioteca.emprestar(livro1, usuario2);

biblioteca.listarEmprestimos();

biblioteca.devolver(livro1, usuario1);
biblioteca.devolver(livro2, usuario1);

biblioteca.listarEmprestimos();