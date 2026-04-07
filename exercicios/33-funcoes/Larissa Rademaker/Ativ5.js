/*
Crie um array com pelo menos 6 objetos de estudantes (nome, nota, turma). Em seguida, usando encadeamento de filter, map e reduce:

Filtre apenas os estudantes da turma "ECO".
Filtre entre esses apenas os aprovados (nota ≥ 6).
Use map para extrair só os nomes.
Use reduce para construir uma string final no formato:
"Aprovados da turma ECO: Ana, Maria, Pedro"
Dica: cada método retorna um array, então você pode chamar o próximo diretamente encadeado.
*/

const estudantes = [
    { nome: "Mariana", nota: 8, turma: "Letras" },
    { nome: "Luiza", nota: 9, turma: "Nutricao" },
    { nome: "Larissa", nota: 7, turma: "ECO" },
    { nome: "Felipe", nota: 9, turma: "ECO" },
    { nome: "Matheus", nota: 10, turma: "ECO" },
    { nome: "Vini", nota: 7, turma: "ECO" }
];

const aprovadosECO = estudantes.filter(estudante => estudante.turma === "ECO")
    .filter(estudante => estudante.nota >= 6)
    .map(estudante => estudante.nome)
    .reduce((acumulador, nome, i) => {
        if (i === 0) {
            return `Aprovados da turma ECO: ${nome}`;
        } else {
            return `${acumulador}, ${nome}`;
        }
    }, "");

console.log(aprovadosECO);




