//Crie dois botões: “Tema claro” e “Tema escuro”. Ao clicar em cada um, altere o backgroundColor do body e a cor do texto usando querySelector e eventos.

//Use document.querySelector("body") para pegar o body.

//No evento de clique dos botões, altere style.backgroundColor e style.color.

const body = document.querySelector("body");
const titulo = document.querySelector("h1")
const botaoClaro = document.querySelector("#botao-claro");
const botaoEscuro = document.querySelector("#botao-escuro");

botaoClaro.addEventListener("click", () => {
    body.style.background = "#ffffff"
    titulo.style.color = "#000000ff"
});

botaoEscuro.addEventListener("click", () => {
    body.style.background = "#000000ff"
    titulo.style.color = "#ffffff"
});

