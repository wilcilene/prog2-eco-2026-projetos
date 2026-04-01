class Curso{
    constructor(nome, cargaHoraria){
        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do curso deve ser uma string não vazia.');
        }
        if(!cargaHoraria || typeof cargaHoraria !== 'number' || cargaHoraria <= 0){
            throw new Error('A carga horária deve ser um número positivo.');
        }

        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
    }
}

class Estudante{
    constructor(nome, matricula){
        if(!nome || typeof nome !== 'string'){
            throw new Error('O nome do estudante deve ser uma string não vazia.');
        }
        if(!matricula || typeof matricula !== 'number' || matricula.toString().length !== 7 || matricula <= 0){
            throw new Error('A matrícula deve ser um número positivo com 7 dígitos.');
        }

        this.nome = nome;
        this.matricula = matricula;
    }
}

class Turma{
    
    constructor(curso, estudantes = []){
        if(!curso || !(curso instanceof Curso)){
            throw new Error('O curso é obrigatório e deve ser uma instância da classe Curso.');
        }
        this.curso = curso;
        this.lista_estudantes = [];
        this.adicionarlistaEstudantes(estudantes);
    }

    adicionarEstudante(estudante){
        if(!estudante || !(estudante instanceof Estudante)){
            throw new Error('O estudante é obrigatório e deve ser uma instância da classe Estudante.');
        }
        
        for(let estudanteLista of this.lista_estudantes){
            if(estudanteLista.matricula === estudante.matricula){
                throw new Error('O estudante já está matriculado nesta turma ou a matrícula está duplicada.');
            }
        }
        this.lista_estudantes.push(estudante);
    }

    adicionarlistaEstudantes(estudantes){
        if(!estudantes || !Array.isArray(estudantes)){
            throw new Error('A lista de estudantes é obrigatória e deve ser um array.');
        }
        for(let estudante of estudantes){
            this.adicionarEstudante(estudante);
        }
    }
}


// Exemplo de uso
try {
    const curso1 = new Curso('Matemática', 60);
    const estudante1 = new Estudante('João', 1234577);
    const estudante2 = new Estudante('Maria', 2345678);
    const turma1 = new Turma(curso1, [estudante1, estudante2]);

    console.log(turma1);
}catch (error) {
    console.error(error.message);
}

