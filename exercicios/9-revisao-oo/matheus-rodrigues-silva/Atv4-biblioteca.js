class Livro{
    constructor(nome, autor, genero){
        
        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do item deve ser uma string não vazia.');
        }

        if(!autor || typeof autor !== 'string'){
            throw new Error('O autor do item deve ser uma string não vazia.');
        }

        if(!genero || typeof genero !== 'string'){
            throw new Error('O genero do item deve ser uma string não vazia.');
        }

        this.nome = nome;
        this.autor = autor;
        this.genero = genero;
    }
}

class  UsuarioBiblioteca{
    #livros;
    
    constructor(nome, email){

        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do estudante deve ser uma string não vazia.');
        }

        if(!email || typeof email !== 'string'){
            throw new Error('O e-mail do estudante deve ser uma string não vazia.');
        }

        this.nome = nome;
        this.email = email;
        this.#livros = [];
    }

    adicionar_livro(livro){
        if(!livro || !(livro instanceof Livro)){
            throw new Error('O livro deve ser uma instacia da classe Livro não vazia.');
        }

        for(let livro_lista of this.#livros){
            if (livro.nome === livro_lista.nome){
                throw new Error('O livro já está sendo emprestado para este usuário');
            }
        }

        this.#livros.push(livro)
    }

    listar_livros(){
        console.log(this.#livros)
    }
}


// Exemplo de uso

livro1 = new Livro("Homem aranha", "Stan-lee", "Ação");
livro2 = new Livro("Sousou no Frieren", "Kanehito Yamada", "fantasia");

usuario = new UsuarioBiblioteca("Pedro", "pedro@gmail.com");

usuario.adicionar_livro(livro1);
usuario.adicionar_livro(livro2);

usuario.listar_livros()