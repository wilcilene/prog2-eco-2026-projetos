/*
Crie uma função processarIdade que receba um número e um callback. A função deve:

Lançar um erro se a idade for negativa ou maior que 120.
Chamar o callback com a idade se for válida.
Teste passando callbacks diferentes: um que exibe se a pessoa é maior de idade, outro que calcula o ano de nascimento aproximado.
*/

function processarIdade(nome, idade, callback, callback2) {
    console.log("Dados de " + nome + ": " + idade + " anos.");
    if (idade < 0 || idade > 120)
        throw new Error("Idade inválida: deve ser entre 0 e 120.");
    callback(idade);
    callback2(idade);

}

//callback maioridade

function maior (idade) {
    if (idade >= 18) {
        console.log("A pessoa é maior de idade.");
    } else {
        console.log("A pessoa não é maior de idade.");
    }
}

//callback ano de nascimento

function ano(idade) {
    const anoAtual = new Date().getFullYear();
    const anoNascimento = anoAtual - idade;
    console.log(`O ano de nascimento aproximado é: ${anoNascimento}`);
}

processarIdade("Maria", 21, maior, ano);
processarIdade("Josie", 45, maior, ano);
processarIdade("Lais", 10, maior, ano);