// =======================================================
// DETALHES DA CORRIDA - Versão 3.0
// Esta página mostra um evento específico com inscritos,
// veículos utilizados e ranking daquela corrida.
// =======================================================

const usuarioCorridaDetalhes = requireAuth(["admin", "piloto", "cliente"]);
let dadosCorridaDetalhes = null;

document.addEventListener("DOMContentLoaded", () => {
    if(usuarioCorridaDetalhes){
        preencherUsuarioLogado();
        montarMenuDetalhes(usuarioCorridaDetalhes);
        carregarDetalhesCorrida();
    }
});

function montarMenuDetalhes(usuario){
    const menu = document.getElementById("sidebarMenu");
    if(!menu) return;

    if(usuario.tipo === "admin"){
        menu.innerHTML = `
            <a href="admin.html"><i class="bi bi-grid-1x2-fill"></i>Dashboard</a>
            <a href="corridas.html" class="active"><i class="bi bi-flag"></i>Corridas</a>
            <a href="tempos.html"><i class="bi bi-stopwatch"></i>Tempos</a>
            <a href="relatorios.html"><i class="bi bi-bar-chart"></i>Relatórios</a>
            <a href="perfil.html"><i class="bi bi-person-circle"></i>Perfil</a>
        `;
        return;
    }

    if(usuario.tipo === "piloto"){
        menu.innerHTML = `
            <a href="piloto.html"><i class="bi bi-speedometer2"></i>Dashboard</a>
            <a href="veiculos.html"><i class="bi bi-car-front"></i>Meus veículos</a>
            <a href="corridas.html" class="active"><i class="bi bi-flag"></i>Corridas</a>
            <a href="tempos.html"><i class="bi bi-stopwatch"></i>Meus tempos</a>
            <a href="social.html"><i class="bi bi-globe-americas"></i>Social</a>
            <a href="perfil.html"><i class="bi bi-person-circle"></i>Perfil</a>
        `;
        return;
    }

    menu.innerHTML = `
        <a href="cliente.html"><i class="bi bi-grid-1x2-fill"></i>Dashboard</a>
        <a href="corridas.html" class="active"><i class="bi bi-flag"></i>Corridas</a>
        <a href="relatorios.html"><i class="bi bi-bar-chart"></i>Resultados</a>
        <a href="social.html"><i class="bi bi-globe-americas"></i>Social</a>
        <a href="perfil.html"><i class="bi bi-person-circle"></i>Perfil</a>
    `;
}

function getIdCorridaUrl(){
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function carregarDetalhesCorrida(){
    const id = getIdCorridaUrl();

    if(!id){
        await rhAlert("Corrida não informada.");
        window.location.href = "corridas.html";
        return;
    }

    try{
        dadosCorridaDetalhes = await apiGet(`/corridas/${id}/detalhes`);
        preencherCabecalhoCorrida(dadosCorridaDetalhes.corrida);
        renderizarInscritosDetalhes(dadosCorridaDetalhes.inscritos);
        renderizarRankingDetalhes(dadosCorridaDetalhes.ranking);
    }catch(erro){
        setHTML("listaInscritosDetalhes", `<div class="alert alert-danger">${erro.message}</div>`);
        setHTML("rankingCorridaDetalhes", `<div class="alert alert-danger">${erro.message}</div>`);
    }
}

function preencherCabecalhoCorrida(corrida){
    setTexto("tituloCorridaDetalhes", corrida.nome || "Corrida");
    setTexto("subtituloCorridaDetalhes", `${corrida.pista || "RaceHub Track"} • ${formatarStatusCorrida(corrida.status)}`);
    setTexto("detalheData", formatarDataCurta(corrida.data));
    setTexto("detalheHorario", formatarHora(corrida.horario));
    setTexto("detalheInscritos", `${corrida.total_inscritos || 0}/${corrida.limite_inscritos || 20}`);
    setTexto("detalheStatus", formatarStatusCorrida(corrida.status));
}

function renderizarInscritosDetalhes(inscritos){
    if(!inscritos || inscritos.length === 0){
        setHTML("listaInscritosDetalhes", mostrarVazio("Sem inscritos", "Nenhum piloto se inscreveu nessa corrida."));
        return;
    }

    const html = inscritos.map(item => `
        <div class="detail-row">
            <div class="avatar small-avatar">${item.foto_perfil ? `<img src="${item.foto_perfil}">` : getIniciais(item.piloto)}</div>
            <div>
                <strong>${item.piloto}</strong>
                <p>${formatarVeiculo(item)} ${item.veiculo_potencia ? `• ${item.veiculo_potencia} cv` : ""}</p>
            </div>
        </div>
    `).join("");

    setHTML("listaInscritosDetalhes", html);
}

function renderizarRankingDetalhes(ranking){
    if(!ranking || ranking.length === 0){
        setHTML("rankingCorridaDetalhes", mostrarVazio("Sem tempos", "Os tempos dessa corrida ainda não foram registrados."));
        return;
    }

    const html = ranking.slice(0, 10).map((item, index) => `
        <div class="ranking-item">
            <div class="ranking-left">
                <div class="position">${index + 1}</div>
                <div>
                    <div class="pilot-name">${item.piloto}</div>
                    <p>${formatarVeiculo(item)}</p>
                </div>
            </div>
            <div class="best-time ${getClasseRanking(index)}">${formatarTempo(item.tempo_volta)}</div>
        </div>
    `).join("");

    setHTML("rankingCorridaDetalhes", html);
}
