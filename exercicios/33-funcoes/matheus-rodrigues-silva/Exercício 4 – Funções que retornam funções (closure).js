/*

Crie uma função criarSaudacao que receba um idioma ("pt", "en" ou "es") e retorne uma função que, ao receber um nome, exiba a saudação no idioma correto. Exemplo:

const saudarEmPortugues = criarSaudacao("pt");
const saudarEmIngles    = criarSaudacao("en");

saudarEmPortugues("Ana");  // Olá, Ana!
saudarEmIngles("Ana");     // Hello, Ana!

*/

function criarSaudacao(idioma){

    return function(nome){
        switch (idioma) {
            case "pt":
                
                console.log(`Olá, ${nome}`);
                break;

            case "en":

                console.log(`Hello, ${nome}`);
                break;
            case "es":

                console.log(`Hola, ${nome}`);
                break;
            default:
                console.log("Idioma inválido, escolha entre 'pt', 'en' ou 'es'");
                break;
        }
    }
}


const saudarPortugues = criarSaudacao("pt");
const saudarIngles = criarSaudacao("en");
const saudarEspanhol = criarSaudacao("es");
const saudarAlemao = criarSaudacao("al");


saudarPortugues("Ana");
saudarIngles("Ana");
saudarEspanhol("Ana");
saudarAlemao("Ana");