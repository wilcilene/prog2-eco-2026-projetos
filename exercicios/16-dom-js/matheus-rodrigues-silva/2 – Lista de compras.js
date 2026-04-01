// Baseando-se na lista de tarefas, crie uma lista de compras que mostre a quantidade de itens em cima da lista.

//Use um <span> para exibir o total de itens.

//Atualize o texto do span sempre que adicionar um item, com textContent.

const spanQtdCompras = document.querySelector("#qtd-compras");
const btnAdicionarItem = document.querySelector("#btn-adicionar-item");
const inputItem = document.querySelector("#item-input")
const listaItens= document.querySelector("#lista-itens")
const strongErro = document.querySelector("#erro")
let itensNaLista = [];

function adicionarItem() {
    const item = inputItem.value.trim();

    if (item === "") {
        strongErro.textContent = "Por favor, insira um item válido.";
        return;
    }

    strongErro.textContent = "";
    itensNaLista.push(item);
    inputItem.value = "";
    atualizarLista();
    
    spanQtdCompras.textContent = itensNaLista.length;
}

function atualizarLista() {
    let html = "";

    for (const item of itensNaLista) {
        html += `<li>${item}</li>`;
    }

    listaItens.innerHTML = html;
}

btnAdicionarItem.addEventListener("click", adicionarItem);