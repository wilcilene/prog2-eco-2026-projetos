const campanhaId =
    localStorage.getItem("campanhaAtual");

let campanha = {

    id: campanhaId,

    nome: "Campanha",

    personagens: []

};
    

let imagemBase64 = "";

document.getElementById(
    "nomeCampanhaTitulo"
).innerText =
    "Campanha";

let personagemEditando = null;

async function carregarPersonagens() {

    const token =
        localStorage.getItem("token");

    try {

        const resposta = await fetch(
            `http://localhost:3000/personagens/${campanhaId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const dados =
            await resposta.json();

        campanha.personagens =
            dados.map(p => ({

                ...p,

                atributos: {

                    forca: p.forca,
                    destreza: p.destreza,
                    constituicao: p.constituicao,
                    inteligencia: p.inteligencia,
                    sabedoria: p.sabedoria,
                    carisma: p.carisma

                }

            }));

        renderizarPersonagens();

    }
    catch (erro) {

        console.log(erro);

    }

}

function voltar() {
    window.location.href = "index.html";
}
document
.getElementById("imagemPersonagem")
.addEventListener("change", function(event){

    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = function(e){

        imagemBase64 = e.target.result;

    };

    reader.readAsDataURL(arquivo);

});
async function criarPersonagem() {

    const personagem = {

        imagem: imagemBase64,

        jogador: document.getElementById("jogador").value,

        personagem: document.getElementById("personagem").value,

        idade: document.getElementById("idade").value,

        altura: document.getElementById("altura").value,

        genero: document.getElementById("genero").value,

        sexualidade: document.getElementById("sexualidade").value,

        raca: document.getElementById("raca").value,

        classe: document.getElementById("classe").value,

        nivel: document.getElementById("nivel").value,

        lore: document.getElementById("lore").value,

        atributos: {

            forca: document.getElementById("forca").value,

            destreza: document.getElementById("destreza").value,

            constituicao: document.getElementById("constituicao").value,

            inteligencia: document.getElementById("inteligencia").value,

            sabedoria: document.getElementById("sabedoria").value,

            carisma: document.getElementById("carisma").value
        }
    };

    const token =
    localStorage.getItem("token");

try {

    if (personagemEditando) {

        // EDITAR PERSONAGEM

        await fetch(
            `http://localhost:3000/personagens/${personagemEditando}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization: token

                },

                body: JSON.stringify(personagem)

            }
        );

        personagemEditando = null;

    } else {

        // CRIAR PERSONAGEM

        await fetch(
            "http://localhost:3000/personagens",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization: token

                },

                body: JSON.stringify({

                    campanha_id: campanhaId,

                    ...personagem

                })

            }
        );

    }

    limparCampos();

    alterarBotaoModoCriacao();

    carregarPersonagens();

}
catch (erro) {

    console.log(
        "Erro ao salvar personagem:",
        erro
    );

}
}

function editarPersonagem(index) {

    const p = campanha.personagens[index];

    document.getElementById("jogador").value = p.jogador;

    document.getElementById("personagem").value = p.personagem;

    document.getElementById("idade").value = p.idade;

    document.getElementById("altura").value = p.altura;

    document.getElementById("genero").value = p.genero;

    document.getElementById("sexualidade").value = p.sexualidade;

    document.getElementById("raca").value = p.raca;

    document.getElementById("classe").value = p.classe;

    document.getElementById("nivel").value = p.nivel;

    document.getElementById("lore").value = p.lore;

    document.getElementById("forca").value =
        p.atributos.forca;

    document.getElementById("destreza").value =
        p.atributos.destreza;

    document.getElementById("constituicao").value =
        p.atributos.constituicao;

    document.getElementById("inteligencia").value =
        p.atributos.inteligencia;

    document.getElementById("sabedoria").value =
        p.atributos.sabedoria;

    document.getElementById("carisma").value =
        p.atributos.carisma;

    personagemEditando = p.id;

    alterarBotaoModoEdicao();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deletarPersonagem(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir?"
        );

    if (!confirmar) return;

    const token =
        localStorage.getItem("token");

    const id =
        campanha.personagens[index].id;

    try {

        await fetch(
            `http://localhost:3000/personagens/${id}`,
            {

                method: "DELETE",

                headers: {
                    Authorization: token
                }

            }
        );

        carregarPersonagens();

    }

    catch (erro) {

        console.log(erro);

    }

}
function limparCampos() {

    document.querySelectorAll("input, textarea")
        .forEach(campo => campo.value = "");
}

function alterarBotaoModoEdicao() {

    const botao = document.querySelector(".ficha button");

    botao.innerText = "Salvar Alterações";
}

function alterarBotaoModoCriacao() {

    const botao = document.querySelector(".ficha button");

    botao.innerText = "Salvar Personagem";
}

function renderizarPersonagens() {

    const lista =
        document.getElementById("listaPersonagens");

    lista.innerHTML = "";

    campanha.personagens.forEach((p, index) => {

        lista.innerHTML += `
        <div class="personagem-card">

            <img
                src="${p.imagem || ''}"
                class="foto-personagem">

            <div class="personagem-nome">
                ${p.personagem}
            </div>

            <div class="personagem-info">

                <p><strong>Jogador:</strong> ${p.jogador}</p>

                <p><strong>Idade:</strong> ${p.idade}</p>

                <p><strong>Gênero:</strong> ${p.genero}</p>

                <p><strong>Raça:</strong> ${p.raca}</p>

                <p><strong>Classe:</strong> ${p.classe}</p>

                <p><strong>Nível:</strong> ${p.nivel}</p>

                <hr>

                <p> FOR: ${p.forca}</p>

                <p> DES: ${p.destreza}</p>

                <p> CON: ${p.constituicao}</p>

                <p> INT: ${p.inteligencia}</p>

                <p> SAB: ${p.sabedoria}</p>

                <p> CAR: ${p.carisma}</p>

                <div class="acoes">

                    <button onclick="editarPersonagem(${index})">
                        Editar
                    </button>

                    <button class="botao-excluir" onclick="deletarPersonagem(${index})">
                       🗑 Excluir
                    </button>

                </div>

            </div>

        </div>
        `;
    });
}

carregarPersonagens();
function rolarDado(lados) {

    const resultado = Math.floor(Math.random() * lados) + 1;

    const resultadoDiv =
        document.getElementById("resultadoDado");

    resultadoDiv.classList.add("animar-dado");

    resultadoDiv.innerHTML = `
        d${lados}
        <br>
        ${resultado}
    `;

    setTimeout(() => {
        resultadoDiv.classList.remove("animar-dado");
    }, 200);

    adicionarHistorico(lados, resultado);
}

function adicionarHistorico(lados, resultado) {

    const historico =
        document.getElementById("historicoDados");

    const item = document.createElement("div");

    item.classList.add("item-historico");

    const horario = new Date().toLocaleTimeString();

    item.innerHTML = `
        🎲 d${lados}: <strong>${resultado}</strong>
        <small>(${horario})</small>
    `;

    historico.prepend(item);
}