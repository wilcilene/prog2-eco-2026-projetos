class Curso {
    constructor(nome, cargaHoraria) {
        if (!nome || cargaHoraria <= 0) throw new Error('Dados invalidos');
        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
    }
}

class Estudante {
    constructor(nome, matricula) {
        if (!nome || !matricula) throw new Error('Dados invalidos');
        this.nome = nome;
        this.matricula = matricula;
    }
}

class Turma {
    constructor(curso) {
        if (!(curso instanceof Curso)) throw new Error('Curso invalido');
        this.curso = curso;
        this.estudantes = [];
    }

    adicionarEstudante(estudante) {
        if (!(estudante instanceof Estudante)) throw new Error('Estudante inválido');
        if (this.estudantes.some(e => e.matricula === estudante.matricula)) {
            throw new Error('Matricula duplicada');
        }
        this.estudantes.push(estudante);
    }

    removerEstudante(matricula) {
        this.estudantes = this.estudantes.filter(e => e.matricula !== matricula);
    }
}

// mostra no terminal
const curso = new Curso('JavaScript', 40);
const turma = new Turma(curso);
const aluno1 = new Estudante('Joao', '123');
const aluno2 = new Estudante('Maria', '456');

turma.adicionarEstudante(aluno1);
turma.adicionarEstudante(aluno2);

console.log(turma.estudantes); 
