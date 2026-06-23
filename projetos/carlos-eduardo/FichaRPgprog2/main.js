// =========================
// CAMPANHAS
// =========================
const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "login.html";
}
let campanhas = [];

// =========================
// CARREGAR CAMPANHAS
// =========================

async function carregarCampanhas() {

    const usuario_id =
        localStorage.getItem("usuarioId");

    try {

        const resposta =
    await fetch(
        "http://localhost:3000/campanhas",
        {
            headers: {
                Authorization: token
            }
        }
    );
        campanhas =
            await resposta.json();

        renderizarCampanhas();

    } catch (erro) {

        console.error(erro);

    }
}

// =========================
// CRIAR CAMPANHA
// =========================

async function criarCampanha() {

    const input =
        document.getElementById("nomeCampanha");

    const nome =
        input.value.trim();

    if (nome === "") {

        alert("Digite um nome para a campanha");

        return;
    }

    try {

       await fetch(
    "http://localhost:3000/campanhas",
    {
        method: "POST",

        headers: {
            "Content-Type":
                "application/json",

            Authorization:
                token
        },

        body: JSON.stringify({
            nome: nome
        })
    }
);

        input.value = "";

        carregarCampanhas();

    } catch (erro) {

        console.error(
            "Erro ao criar campanha:",
            erro
        );

    }
}

// =========================
// EXCLUIR CAMPANHA
// =========================

async function excluirCampanha(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta campanha?"
    );

    if (!confirmar) return;

    try {

        await fetch(
            `http://localhost:3000/campanhas/${id}`,
            {
                method: "DELETE"
            }
        );

        carregarCampanhas();

    } catch (erro) {

        console.error(
            "Erro ao excluir campanha:",
            erro
        );

    }
}

// =========================
// RENDERIZAR CAMPANHAS
// =========================

function renderizarCampanhas() {

    const lista =
        document.getElementById(
            "listaCampanhas"
        );

    lista.innerHTML = "";

    campanhas.forEach(campanha => {

        lista.innerHTML += `
            <div class="card">

                <h2>${campanha.nome}</h2>

                <button
                    onclick="abrirCampanha(${campanha.id})">
                    Abrir Campanha
                </button>

                <button
                    class="botao-excluir"
                    onclick="excluirCampanha(${campanha.id})">
                    🗑 Excluir
                </button>

            </div>
        `;
    });
}

// =========================
// ABRIR CAMPANHA
// =========================

function abrirCampanha(id) {

    localStorage.setItem(
        "campanhaAtual",
        id
    );

    window.location.href =
        "campanha.html";
}

// =========================
// INICIAR
// =========================

carregarCampanhas();
function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    window.location.href =
        "login.html";
}