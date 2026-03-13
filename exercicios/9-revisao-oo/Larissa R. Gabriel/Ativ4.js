//Atividade 4 – Biblioteca

class Livro{

    constructor(titulo, autor, genero){
        if(!titulo || typeof titulo !== 'string'){
            throw new Error('O título do livro deve ser uma string não vazia.');
        }
        if(!autor || typeof autor !== 'string'){
            throw new Error('O autor do livro deve ser uma string não vazia.');
        }
        if(!genero || typeof genero !== 'string'){
            throw new Error('O gênero do livro deve ser uma string não vazia.');
        }

        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;

        
    }

    descricaoLivros(){
        return `\n - Titulo: ${this.titulo} \n - Autor: ${this.autor} \n - Gênero: ${this.genero}`;
    }


}

class usuarioBiblioteca{

    constructor(nome, email, livrosEmprestados = []){
        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do usuário deve ser uma string não vazia.');
        }
        if(!email || typeof email !== 'string'){
            throw new Error('O email do usuário deve ser uma string não vazia.');
        }
        if(!livrosEmprestados || !Array.isArray(livrosEmprestados)){
            throw new Error('Os livros emprestados devem ser um array.');
        }

        this.nome = nome;
        this.email = email;
        this.livrosEmprestados = livrosEmprestados;
    }

     descricao(){
        return `Emprestimos \n - Usuario: ${this.nome} \n - Email: ${this.email} \n - Livros Emprestados: ${this.livrosEmprestados.length}`;
    }


}

class Biblioteca{

    #listaLivros; 
    #usuarios; 

    constructor(listaLivros){
        this.#listaLivros = [];
        this.#usuarios = [];
        this.adicionarListaLivros(listaLivros);
    }


    adicionarUsuario(usuario){
        if(!(usuario instanceof usuarioBiblioteca)){
            throw new Error("Usuário inválido");
        }

        this.#usuarios.push(usuario);
    }


    adicionarLivro(livro){
        if(!livro || !(livro instanceof Livro)){
            throw new Error('O livro é obrigatório e deve ser uma instância da classe Livro.');
        }
        for(let livroLista of this.#listaLivros){
            if(livroLista.titulo === livro.titulo && livroLista.autor === livro.autor){
                throw new Error('O livro já está na biblioteca.');
            }
        }
        this.#listaLivros.push(livro);
    }

    adicionarListaLivros(listaLivros){
        if(!listaLivros || !Array.isArray(listaLivros)){
            throw new Error('A lista de livros é obrigatória e deve ser um array.');
        }
        for(let livro of listaLivros){
            this.adicionarLivro(livro);//
        }
    }

    livrosEmprestados(usuario){
        if(!usuario || !(usuario instanceof usuarioBiblioteca)){
            throw new Error('O usuário é obrigatório e deve ser uma instância da classe usuarioBiblioteca.');
        }

        return usuario.livrosEmprestados;
    }

    listaEmprestimos(){
        let emprestimos = [];

        for(let usuario of this.#usuarios){
            if(usuario.livrosEmprestados.length > 0){
                emprestimos.push({
                    usuario: usuario.nome,
                    livros: usuario.livrosEmprestados
                });
            }
        }

        return emprestimos;
    }

   

}



const livros = [

    new Livro('O Senhor dos Aneis', 'JRR Tolkien', 'Fantasia'),
    new Livro('Jogos Vorazes', 'Suzanne Collins', 'Distopia'),
    new Livro('Anne de Green Gables', 'Lucy Maud Montgomery', 'Romance')

];

const biblioteca = new Biblioteca(livros);

const usuario1 = new usuarioBiblioteca('Larissa Gabriel', 'rademakerlarissa@gmail.com', [livros[0], livros[1]]);

console.log(usuario1.descricao());
console.log(biblioteca.livrosEmprestados(usuario1));
console.log(biblioteca.listaEmprestimos());



