// Modelagem de classes conforme requisitos

class Curso {
    constructor(nome, cargaHoraria) {
        if (typeof nome !== 'string' || nome.trim().length === 0) {
            throw new Error('Nome do curso deve ser uma string não vazia');
        }
        if (typeof cargaHoraria !== 'number' || cargaHoraria <= 0) {
            throw new Error('Carga horária deve ser um número positivo');
        }
        this._nome = nome.trim();
        this._cargaHoraria = cargaHoraria;
    }

    get nome() {
        return this._nome;
    }

    get cargaHoraria() {
        return this._cargaHoraria;
    }
}

class Estudante {
    constructor(nome, matricula) {
        if (typeof nome !== 'string' || nome.trim().length === 0) {
            throw new Error('Nome do estudante deve ser uma string não vazia');
        }
        if (typeof matricula !== 'string' || matricula.trim().length === 0) {
            throw new Error('Matrícula deve ser uma string não vazia');
        }
        this._nome = nome.trim();
        this._matricula = matricula.trim();
    }

    get nome() {
        return this._nome;
    }

    get matricula() {
        return this._matricula;
    }
}

class Turma {
    constructor(curso) {
        if (!(curso instanceof Curso)) {
            throw new Error('Turma precisa estar vinculada a um curso válido');
        }
        this._curso = curso;
        this._estudantes = [];
    }

    get curso() {
        return this._curso;
    }

    get estudantes() {
        // devolve cópia para evitar mutação externa
        return [...this._estudantes];
    }

    adicionarEstudante(estudante) {
        if (!(estudante instanceof Estudante)) {
            throw new Error('Só é permitido adicionar instâncias de Estudante');
        }
        const existe = this._estudantes.some(e => e.matricula === estudante.matricula);
        if (existe) {
            throw new Error('Estudante com essa matrícula já está na turma');
        }
        this._estudantes.push(estudante);
    }

    removerEstudante(matricula) {
        const idx = this._estudantes.findIndex(e => e.matricula === matricula);
        if (idx === -1) {
            throw new Error('Estudante não encontrado na turma');
        }
        this._estudantes.splice(idx, 1);
    }
   
}


class Menu {                     // no ()
    // you can put a constructor or static/instance methods
    mostrar() {
        console.log('1. Criar curso');
        console.log('2. Criar estudante');
        console.log('3. Criar turma');
        console.log('4. Adicionar estudante à turma');
        console.log('5. Remover estudante da turma');
    }
}

// exemplo de uso:
const menu = new Menu();
menu.mostrar();