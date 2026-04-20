
const estudantes = [
	{ nome: "Ana", nota: 8, turma: "ECO" },
	{ nome: "Maria", nota: 7, turma: "ECO" },
	{ nome: "Pedro", nota: 6.5, turma: "ECO" },
	{ nome: "João", nota: 5, turma: "ECO" },
	{ nome: "Lucas", nota: 9, turma: "INF" },
	{ nome: "Carla", nota: 6, turma: "ECO" },
	{ nome: "Bruna", nota: 4, turma: "ECO" }
];

const aprovadosECO = estudantes
	.filter(e => e.turma === "ECO")
	.filter(e => e.nota >= 6)
	.map(e => e.nome)
	.reduce((str, nome, idx, arr) => {
		if (idx === 0) {
			return `Aprovados da turma ECO: ${nome}`;
		} else {
			return `${str}, ${nome}`;
		}
	}, "");

console.log(aprovadosECO);