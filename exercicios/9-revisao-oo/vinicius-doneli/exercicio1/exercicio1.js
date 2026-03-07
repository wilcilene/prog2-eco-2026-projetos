class Curso {
    constructor(nome, cargaHoraria) {
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do curso é obrigatório.");
        }

        if (!Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
            throw new Error("A carga horária deve ser um número inteiro positivo.");
        }

        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
    }
}

class Turma {
    constructor(curso) {
        if (!(curso instanceof Curso)) {
            throw new Error("A turma deve estar vinculada a um curso válido.");
        }

        this.curso = curso;
        this.estudantes = [];
    }

adicionarEstudante(nome, matricula) {
        if (!nome || nome.trim() === "") {
            throw new Error("Nome do estudante é obrigatório.");
        }

        if (!matricula || matricula.trim() === "") {
            throw new Error("Matrícula é obrigatória.");
        }

        const duplicado = this.estudantes.find(
            estudante => estudante.matricula === matricula
        );

        if (duplicado) {
            throw new Error("Já existe um estudante com essa matrícula.");
        }

        this.estudantes.push({
            nome: nome,
            matricula: matricula
        });
    }

    listarEstudantes() {
        return this.estudantes;
    }
}

//Uso das classes:
const ECO = new Curso("Engenharia de Computação", 3600);

const turma1 = new Turma(ECO);

turma1.adicionarEstudante("Vinicius", "0001");
turma1.adicionarEstudante("Joana", "0002");
turma1.adicionarEstudante("Daniel", "0003");

console.log(ECO);
console.log(turma1.listarEstudantes());
