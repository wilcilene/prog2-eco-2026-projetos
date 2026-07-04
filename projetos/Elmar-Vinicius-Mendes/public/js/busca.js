const usuarioLogado   = JSON.parse(localStorage.getItem("usuario"));

const inputBusca      = document.getElementById("input-busca");
const btnLimpar       = document.getElementById("btn-limpar");
const secaoSugestoes  = document.getElementById("secao-sugestoes");
const secaoResultados = document.getElementById("secao-resultados");
const listaResultados = document.getElementById("lista-resultados");
const labelResultados = document.getElementById("label-resultados");
const semResultados   = document.getElementById("sem-resultados");


inputBusca.addEventListener("input", async () => {
    const termo = inputBusca.value.trim();

    if (termo === "") {
        limparBusca();
        return;
    }

    btnLimpar.style.display       = "flex";
    secaoSugestoes.style.display  = "none";
    secaoResultados.style.display = "block";

    try {
        const resposta = await fetch(`/usuarios/buscar?termo=${encodeURIComponent(termo)}`);
        const usuarios = await resposta.json();

        listaResultados.innerHTML = "";

        if (usuarios.length === 0) {
            semResultados.style.display = "block";
            labelResultados.textContent = "";
            return;
        }

        semResultados.style.display = "none";
        labelResultados.textContent = `${usuarios.length} resultado(s)`;
        usuarios.forEach(u => renderizarUsuario(u, listaResultados));

    } catch (erro) {
        console.error("Erro na busca:", erro);
    }
});


function renderizarUsuario(u, container) {
    const nomeExibido = u.username.startsWith("@") ? u.username : `@${u.username}`;

    const item = document.createElement("li");
    item.classList.add("usuario-item");
    item.style.cursor = "pointer";
    item.innerHTML = `
        <div class="usuario-avatar" style="${u.foto_perfil ? `background-image:url(${u.foto_perfil});background-size:cover;background-position:center;` : ''}"></div>
        <div class="usuario-info">
            <span class="usuario-nome">${nomeExibido}</span>
            <span class="usuario-sub">${u.nome}</span>
        </div>
        <i class="fa-solid fa-chevron-right" style="color:var(--txt-poeira);font-size:0.75rem;flex-shrink:0;"></i>
    `;

    item.addEventListener("click", () => {
        window.location.href = `perfil.html?id=${u.id}`;
    });

    container.appendChild(item);
}


function limparBusca() {
    inputBusca.value              = "";
    btnLimpar.style.display       = "none";
    secaoSugestoes.style.display  = "block";
    secaoResultados.style.display = "none";
}

btnLimpar.addEventListener("click", limparBusca);

async function carregarSugestoes() {
    try {
        const resposta = await fetch("/usuarios/buscar?termo=");
        const usuarios = await resposta.json();

        let lista = secaoSugestoes.querySelector(".lista-usuarios");
        if (!lista) {
            lista = document.createElement("ul");
            lista.className = "lista-usuarios";
            secaoSugestoes.appendChild(lista);
        }
        lista.innerHTML = "";

        usuarios
            .filter(u => !usuarioLogado || String(u.id) !== String(usuarioLogado.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .forEach(u => renderizarUsuario(u, lista));

    } catch (erro) {
        console.error("Erro ao carregar sugestões:", erro);
    }
}

carregarSugestoes();
