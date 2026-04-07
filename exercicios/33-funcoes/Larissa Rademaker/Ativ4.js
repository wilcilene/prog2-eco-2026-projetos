/*
Crie uma função criarSaudacao que receba um idioma ("pt", "en" ou "es") e retorne uma função que, ao receber um nome, exiba a saudação no idioma correto. Exemplo:

const saudarEmPortugues = criarSaudacao("pt");
const saudarEmIngles    = criarSaudacao("en");

saudarEmPortugues("Ana");  // Olá, Ana!
saudarEmIngles("Ana");     // Hello, Ana!
*/

function criarSaudacao(idioma) {
    if (idioma === "pt") {
        return function(nome) {
            console.log(`Olá, ${nome}!`);
        };
    } else if (idioma === "en") {
        return function(nome) {
            console.log(`Hello, ${nome}!`);
        };
    } else if (idioma === "es") {
        return function(nome) {
            console.log(`Hola, ${nome}!`);
        };
    }
}

const saudarEmPortugues = criarSaudacao("pt");
const saudarEmIngles = criarSaudacao("en");

saudarEmPortugues("Larissa"); 
saudarEmIngles("Larissa");   