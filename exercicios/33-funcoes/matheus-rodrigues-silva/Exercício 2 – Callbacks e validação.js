/*
Crie uma função processarIdade que receba um número e um callback. A função deve:

Lançar um erro se a idade for negativa ou maior que 120.
Chamar o callback com a idade se for válida.
Teste passando callbacks diferentes: um que exibe se a pessoa é maior de idade, outro que calcula o ano de nascimento aproximado.
*/

function processarIdade(idade, maiorDeIdade, anoNascimento){
    if(idade < 0 || idade > 120){
        throw new Error("A idade nao pode ser negativa nem maior que 120");
    }

    maiorDeIdade(idade);
    anoNascimento(idade)
}

function maiorDeIdade(idade){
    if(idade >= 10){
        console.log("Você é maior de idade");
    }
}

function anoNascimento(idade){
    const anoAtual = new Date().getFullYear();
    const nascimento = anoAtual - idade;

    console.log(`Você nasceu em ${nascimento} ou em ${nascimento-1}`);
}


processarIdade(20, maiorDeIdade, anoNascimento)