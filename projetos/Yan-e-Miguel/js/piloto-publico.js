// =======================================================
// PERFIL PÚBLICO DE PILOTO - RaceHub
// Mostra dados públicos de outro piloto: garagem, inscrições,
// corridas e tempos registrados.
// =======================================================

const usuarioPerfilPublico = requireAuth(["admin", "piloto", "cliente"]);
let perfilPublicoCache = null;

document.addEventListener("DOMContentLoaded", () => {
    if(usuarioPerfilPublico){
        preencherUsuarioLogado();
        montarMenuPerfilPublico(usuarioPerfilPublico);
        carregarPerfilPublico();
    }
});

function montarMenuPerfilPublico(usuario){
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

async function carregarPerfilPublico(){
    const id = new URLSearchParams(window.location.search).get("id");

    if(!id){
        setHTML("perfilPublicoHero", `<div class="alert alert-danger">Piloto não informado.</div>`);
        return;
    }

    try{
        perfilPublicoCache = await apiGet(`/pilotos-publicos/${id}`);

        renderizarCabecalhoPublico(perfilPublicoCache);
        renderizarStatsPublicas(perfilPublicoCache);
        renderizarVeiculosPublicos(perfilPublicoCache.veiculos || []);
        renderizarInscricoesPublicas(perfilPublicoCache.inscricoes || []);
        renderizarTemposPublicos(perfilPublicoCache.tempos || []);

    }catch(erro){
        setHTML("perfilPublicoHero", `<div class="alert alert-danger">${erro.message || "Erro ao carregar perfil público."}</div>`);
        setHTML("publicVeiculosLista", "");
        setHTML("publicInscricoesLista", "");
        setHTML("publicTemposTabela", `<tr><td colspan="5">Não foi possível carregar os tempos.</td></tr>`);
    }
}

function renderizarCabecalhoPublico(dados){
    const piloto = dados.piloto;
    const stats = dados.estatisticas || {};

    document.getElementById("perfilPublicoNome").textContent = piloto.nome || "Piloto";
    document.getElementById("perfilPublicoSubtitulo").textContent = `${stats.total_tempos || 0} tempo(s), ${stats.total_veiculos || 0} veículo(s) e ${stats.total_inscricoes || 0} inscrição(ões).`;

    const avatar = piloto.foto_perfil
        ? `<div class="avatar avatar-public-profile"><img src="${piloto.foto_perfil}" alt="Foto de ${piloto.nome}"></div>`
        : `<div class="avatar avatar-public-profile">${getIniciais(piloto.nome)}</div>`;

    setHTML("perfilPublicoHero", `
        <div class="public-profile-card">
            ${avatar}
            <div>
                <h2>${piloto.nome || "Piloto"}</h2>
                <p>${piloto.email || "Sem e-mail"}</p>
                <span class="badge badge-warning">Piloto RaceHub</span>
            </div>
        </div>
    `);
}

function renderizarStatsPublicas(dados){
    const stats = dados.estatisticas || {};

    setTexto("publicTotalVeiculos", stats.total_veiculos || 0);
    setTexto("publicTotalTempos", stats.total_tempos || 0);
    setTexto("publicTotalInscricoes", stats.total_inscricoes || 0);
    setTexto("publicMelhorTempo", stats.melhor_tempo ? formatarTempo(stats.melhor_tempo) : "-");
}

function renderizarVeiculosPublicos(veiculos){
    if(!veiculos.length){
        setHTML("publicVeiculosLista", mostrarVazio("Sem veículos", "Este piloto ainda não cadastrou veículos."));
        return;
    }

    const html = veiculos.map(veiculo => `
        <div class="detail-row">
            <div class="small-avatar"><i class="bi bi-car-front"></i></div>
            <div>
                <strong>${formatarVeiculo(veiculo)}</strong>
                <p>${veiculo.potencia ? veiculo.potencia + " cv" : "Sem potência"} • ${veiculo.placa || "Sem placa"}</p>
            </div>
        </div>
    `).join("");

    setHTML("publicVeiculosLista", html);
}

function renderizarInscricoesPublicas(inscricoes){
    if(!inscricoes.length){
        setHTML("publicInscricoesLista", mostrarVazio("Sem inscrições", "Este piloto ainda não possui inscrições registradas."));
        return;
    }

    const html = inscricoes.slice(0,8).map(inscricao => `
        <div class="schedule-card" onclick="window.location.href='corrida-detalhes.html?id=${inscricao.corrida_id}'" style="cursor:pointer;">
            <div>
                <div class="schedule-hour">${formatarHora(inscricao.corrida_horario)}</div>
                <p>${formatarData(inscricao.corrida_data)}</p>
            </div>
            <div class="schedule-info">
                <strong>${inscricao.corrida || "Corrida"}</strong>
                <p>${formatarVeiculo(inscricao)} • ${formatarStatusCorrida(inscricao.corrida_status)}</p>
            </div>
        </div>
    `).join("");

    setHTML("publicInscricoesLista", html);
}

function renderizarTemposPublicos(tempos){
    if(!tempos.length){
        setHTML("publicTemposTabela", `<tr><td colspan="5">Nenhum tempo registrado.</td></tr>`);
        return;
    }

    const html = tempos.slice(0,20).map((tempo, index) => `
        <tr>
            <td><span class="table-number">${index + 1}º</span></td>
            <td>${tempo.corrida || "Corrida"}</td>
            <td>${formatarVeiculo(tempo)}</td>
            <td>${tempo.categoria_potencia || getCategoriaPotencia(tempo.potencia)}</td>
            <td><span class="table-highlight ${getClasseRanking(index)}">${formatarTempo(tempo.tempo_volta)}</span></td>
        </tr>
    `).join("");

    setHTML("publicTemposTabela", html);
}
