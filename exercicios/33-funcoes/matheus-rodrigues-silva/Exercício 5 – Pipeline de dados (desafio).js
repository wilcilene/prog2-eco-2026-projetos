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
    {nome: "Ana", nota: 8, turma: "ECO"},
    {nome: "Bruno", nota: 5, turma: "ECA"},
    {nome: "Maria", nota: 7, turma: "TI"},
    {nome: "Carlos", nota: 9, turma: "TI"},
    {nome: "Pedro", nota: 6, turma: "ECA"},
    {nome: "Julia", nota: 4, turma: "ECO"},
    {nome: "Matheus", nota: 10, turma: "ECO"},
];

aprovados_ECO = estudantes
.filter(estudante => estudante.turma === "ECO")
.filter(estudante => estudante.nota >= 6)
.map(estudante => estudante.nome)
.reduce((stringFinal, estudante, index, array) => { 
    const separador = index === array.length - 1 ? "." : ",";
    return stringFinal + ` ${estudante}${separador}`;
}, `Aprovados da turma ECO:`)

console.log(aprovados_ECO)
