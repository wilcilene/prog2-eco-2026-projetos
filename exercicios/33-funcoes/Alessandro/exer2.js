/*Crie uma função processarIdade que receba um número e um callback. A função deve:

    Lançar um erro se a idade for negativa ou maior que 120.
    Chamar o callback com a idade se for válida.

Teste passando callbacks diferentes: um que exibe se a pessoa é maior de idade, outro que calcula o ano de nascimento aproximado. */


function processarIdade(idade, callback1,callback2){

    if(idade < 1 || idade > 120){

        throw new Error("Idade Inválida!!!");
    }
    callback1(idade);
    callback2(idade);

}

function analisaIdade(idade){

 if(idade > 18){

    console.log("Maior de Idade!!!");
 } else {

    console.log("Menor de Idade");
 }


}

function estimaAno(idade){


return console.log("Seu ano de nascimento estimado é: " ,2026 - idade);
}


processarIdade(20, analisaIdade, estimaAno);
