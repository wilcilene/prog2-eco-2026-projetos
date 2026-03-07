class Curso {
    constructor(nome, cargaHoraria) {
        this.setNome(nome);
        this.setCargaHoraria(cargaHoraria);
    }

    setNome(nome) {
        if (!nome || nome.trim() === "") {
            throw new Error("Nome do curso inválido.");
        }

        this.nome = nome;
    }

    setCargaHoraria(cargaHoraria) {
        if (typeof cargaHoraria !== "number" || cargaHoraria <= 0) {
            throw new Error("Carga horária deve ser um número positivo.");
        }

        this.cargaHoraria = cargaHoraria;
    }

    getNome() {
        return this.nome;
    }

    getCargaHoraria() {
        return this.cargaHoraria;
    }
}

const curso1 = new Curso("Engenharia da Computação", 3600);
const curso2 = new Curso("Engenharia Civil", 1200);

console.log("Curso 1:");
console.log(curso1.getNome(), "-", curso1.getCargaHoraria(), "horas");

console.log("Curso 2:");
console.log(curso2.getNome(), "-", curso2.getCargaHoraria(), "horas");