const input = document.querySelector("#input");
const btnAdicionar = document.querySelector("#btn-adicionar");
const listaItens = document.querySelector("#lista");
const lErro = document.querySelector("#erro-lista");
const qntd = document.querySelector("#qntd")
var cont =0;

const compras = [];

function atualizarLista() {
  let html = "";

  for (const item of compras) {
    html += "<li>" + item + "</li>";
  }

  cont++;
  listaItens.innerHTML = html;
  qntd.innerHTML="Quantidade de items: " + cont;
}

function adicionarTarefa() {
  const texto = input.value.trim();

  if (texto === "") {
    lErro.textContent = "Digite um item antes de tentar adicionar.";
    return;
  }

  lErro.textContent = ""; // limpa mensagem de erro
  compras.push(texto);
  input.value = "";
  atualizarLista();
}

btnAdicionar.addEventListener("click", adicionarTarefa);

input.addEventListener("keyup", (evento) => {
  if (evento.key === "Enter") {
    adicionarTarefa();
  }
});
