// =======================================================
// SOCIAL RACEHUB - Versão 3.0
// Esta página funciona como uma pequena rede social técnica.
// Ela mostra estatísticas públicas dos pilotos cadastrados.
// =======================================================

const usuarioSocial = requireAuth(["admin", "piloto", "cliente"]);
let pilotosSociaisCache = [];

document.addEventListener("DOMContentLoaded", () => {
    if(usuarioSocial){
        preencherUsuarioLogado();
        montarMenuSocial(usuarioSocial);
        carregarPilotosSociais();
    }
});

function montarMenuSocial(usuario){
    const menu = document.getElementById("sidebarMenu");
    if(!menu) return;

    if(usuario.tipo === "admin"){
        menu.innerHTML = `
            <a href="admin.html"><i class="bi bi-grid-1x2-fill"></i>Dashboard</a>
            <a href="corridas.html"><i class="bi bi-flag"></i>Corridas</a>
            <a href="tempos.html"><i class="bi bi-stopwatch"></i>Tempos</a>
            <a href="relatorios.html"><i class="bi bi-bar-chart"></i>Relatórios</a>
            <a href="social.html" class="active"><i class="bi bi-globe-americas"></i>Social</a>
            <a href="perfil.html"><i class="bi bi-person-circle"></i>Perfil</a>
        `;
        return;
    }

    if(usuario.tipo === "piloto"){
        menu.innerHTML = `
            <a href="piloto.html"><i class="bi bi-speedometer2"></i>Dashboard</a>
            <a href="veiculos.html"><i class="bi bi-car-front"></i>Meus veículos</a>
            <a href="corridas.html"><i class="bi bi-flag"></i>Corridas</a>
            <a href="tempos.html"><i class="bi bi-stopwatch"></i>Meus tempos</a>
            <a href="social.html" class="active"><i class="bi bi-globe-americas"></i>Social</a>
            <a href="perfil.html"><i class="bi bi-person-circle"></i>Perfil</a>
        `;
        return;
    }

    menu.innerHTML = `
        <a href="cliente.html"><i class="bi bi-grid-1x2-fill"></i>Dashboard</a>
        <a href="agenda.html"><i class="bi bi-calendar-plus"></i>Reservar pista</a>
        <a href="corridas.html"><i class="bi bi-flag"></i>Corridas</a>
        <a href="relatorios.html"><i class="bi bi-bar-chart"></i>Resultados</a>
        <a href="social.html" class="active"><i class="bi bi-globe-americas"></i>Social</a>
        <a href="perfil.html"><i class="bi bi-person-circle"></i>Perfil</a>
    `;
}

async function carregarPilotosSociais(){
    try{
        const pilotos = await apiGet("/pilotos-publicos");
        pilotosSociaisCache = Array.isArray(pilotos) ? pilotos : [];
        renderizarPilotosSociais(pilotosSociaisCache);
    }catch(erro){
        setHTML("listaPilotosSociais", `<div class="alert alert-danger">${erro.message || "Erro ao carregar pilotos."}</div>`);
    }
}

function renderizarPilotosSociais(pilotos){
    if(!pilotos || pilotos.length === 0){
        setHTML("listaPilotosSociais", mostrarVazio("Nenhum piloto encontrado", "Quando pilotos forem cadastrados, eles aparecerão aqui."));
        return;
    }

    const html = pilotos.map(piloto => {
        const avatar = piloto.foto_perfil
            ? `<div class="avatar avatar-social"><img src="${piloto.foto_perfil}" alt="Foto de ${piloto.nome}"></div>`
            : `<div class="avatar avatar-social">${getIniciais(piloto.nome)}</div>`;

        return `
            <article class="social-card social-card-click" onclick="abrirPerfilPublico(${piloto.id})" title="Abrir perfil público">
                ${avatar}
                <h2>${piloto.nome}</h2>
                <p>${piloto.email || "Sem e-mail"}</p>

                <div class="social-stats">
                    <div><strong>${piloto.total_veiculos || 0}</strong><span>Veículos</span></div>
                    <div><strong>${piloto.total_inscricoes || 0}</strong><span>Inscrições</span></div>
                    <div><strong>${piloto.total_tempos || 0}</strong><span>Tempos</span></div>
                </div>

                <div class="social-best-time">
                    Melhor volta: <strong>${piloto.melhor_tempo ? formatarTempo(piloto.melhor_tempo) : "-"}</strong>
                </div>
            </article>
        `;
    }).join("");

    setHTML("listaPilotosSociais", html);
}

function filtrarPilotosSociais(){
    const termo = document.getElementById("buscaSocial").value.toLowerCase().trim();

    if(!termo){
        renderizarPilotosSociais(pilotosSociaisCache);
        return;
    }

    const filtrados = pilotosSociaisCache.filter(piloto => {
        return String(piloto.nome || "").toLowerCase().includes(termo) ||
               String(piloto.email || "").toLowerCase().includes(termo);
    });

    renderizarPilotosSociais(filtrados);
}
