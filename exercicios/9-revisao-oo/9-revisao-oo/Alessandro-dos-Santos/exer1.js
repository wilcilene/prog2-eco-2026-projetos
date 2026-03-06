class Curso {
  constructor(nome, carga_hora) {
    if (!nome || typeof nome !== "string") {
      throw new Error("Nome do curso inválido.");
    }
    if (typeof carga_hora !== "number" || carga_hora <= 0) {
      throw new Error("Carga horária inválida.");
    }

    this.nome = nome;
    this.carga_hora = carga_hora;
  }
}

class Estudante {
  constructor(nome, cpf, data_nasc, matricula) {
    if (!nome || !cpf || !data_nasc || !matricula) {
      throw new Error("Todos os dados do estudante são obrigatórios.");
    }

    this.nome = nome;
    this.cpf = cpf;
    this.data_nasc = data_nasc;
    this.matricula = matricula;
  }

  obterResumo() {
    return `${this.nome} - matrícula: ${this.matricula}`;
  }
}

class Turma {
  constructor(curso) {
    if (!(curso instanceof Curso)) {
      throw new Error("Turma precisa estar ligada a um curso válido.");
    }

    this.curso = curso;
    this.estudantes = [];
  }

  adicionarEstudante(estudante) {
    if (!(estudante instanceof Estudante)) {
      throw new Error("Só é possível adicionar Estudante.");
    }

    const existe = this.estudantes.some(
      e => e.matricula === estudante.matricula
    );

    if (existe) {
      throw new Error("Já existe estudante com essa matrícula.");
    }

    this.estudantes.push(estudante);
  }

  listarEstudantes() {
    console.log(`Turma do curso: ${this.curso.nome}`);
    this.estudantes.forEach(e => {
      console.log(e.obterResumo());
    });
  }
}

// TESTE
const curso1 = new Curso("Engenharia de Computação", 3600);
const turma1 = new Turma(curso1);

const aluno1 = new Estudante("Ana", "111.111.111-11", "2000-05-10", "001");
const aluno2 = new Estudante("Bruno", "222.222.222-22", "1999-03-20", "002");

turma1.adicionarEstudante(aluno1);
turma1.adicionarEstudante(aluno2);

turma1.listarEstudantes();