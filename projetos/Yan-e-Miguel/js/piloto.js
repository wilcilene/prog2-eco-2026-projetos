// =======================================================
// DASHBOARD DO PILOTO - RaceHub
//
// Este arquivo monta a tela principal do piloto:
// - cards de desempenho;
// - últimos tempos;
// - ranking geral;
// - próximas corridas;
// - inscrição em corrida escolhendo veículo.
// =======================================================

const usuarioPiloto = requireAuth(["piloto"]);

let corridasPilotoCache = [];
let inscricoesPilotoCache = [];
let veiculosPilotoCache = [];

// Guarda todos os resultados do sistema.
// É usado para calcular a posição real do piloto no ranking geral.
let resultadosPilotoCache = [];

if(usuarioPiloto){
    carregarDashboardPiloto(usuarioPiloto);
}


// =======================================================
// CARREGAMENTO DO DASHBOARD
// =======================================================

async function carregarDashboardPiloto(usuario){
    try{
        preencherUsuarioLogado();

        const [resultados, corridas, inscricoes, veiculos] = await Promise.all([
            buscarComFallback("/resultados"),
            buscarComFallback("/corridas"),
            buscarComFallback("/inscricoes-corridas"),
            buscarComFallback(`/pilotos/${usuario.id}/veiculos`)
        ]);

        resultadosPilotoCache = Array.isArray(resultados) ? resultados : [];
        corridasPilotoCache = Array.isArray(corridas) ? corridas : [];
        inscricoesPilotoCache = Array.isArray(inscricoes) ? inscricoes : [];
        veiculosPilotoCache = Array.isArray(veiculos) ? veiculos : [];

        const meusResultados = filtrarResultadosDoPiloto(resultadosPilotoCache, usuario);

        preencherCardsPiloto(meusResultados, resultadosPilotoCache);
        preencherUltimosTempos(meusResultados);
        preencherRankingGeral(resultadosPilotoCache, usuario);
        preencherCorridasFuturas(corridasPilotoCache, inscricoesPilotoCache, veiculosPilotoCache, usuario);
        preencherResumoPiloto(meusResultados, corridasPilotoCache);

    }catch(erro){
        console.error(erro);

        setHTML("ultimosTemposPiloto", `<div class="alert alert-danger">Não foi possível carregar seus tempos.</div>`);
        setHTML("rankingGeralPiloto", `<div class="alert alert-danger">Não foi possível carregar o ranking.</div>`);
        setHTML("corridasFuturasPiloto", `<div class="alert alert-danger">Não foi possível carregar as corridas.</div>`);
    }
}

async function buscarComFallback(rota){
    try{
        return await apiGet(rota);
    }catch{
        return [];
    }
}


// =======================================================
// FILTRO DE RESULTADOS DO PILOTO
// =======================================================

function filtrarResultadosDoPiloto(resultados, usuario){
    return resultados.filter(resultado => {
        const mesmoId = Number(resultado.piloto_id) === Number(usuario.id);

        const mesmoNome = String(resultado.piloto || resultado.nome_piloto || "")
            .toLowerCase()
            .trim() === String(usuario.nome || "")
            .toLowerCase()
            .trim();

        const mesmoEmail = String(resultado.email || resultado.email_piloto || "")
            .toLowerCase()
            .trim() === String(usuario.email || "")
            .toLowerCase()
            .trim();

        return mesmoId || mesmoNome || mesmoEmail;
    });
}


// =======================================================
// CARDS PRINCIPAIS
// =======================================================

function preencherCardsPiloto(meusResultados, todosResultados){
    const temposValidos = meusResultados
        .filter(resultado => resultado.tempo_volta)
        .map(resultado => Number(resultado.tempo_volta))
        .filter(tempo => !Number.isNaN(tempo));

    if(temposValidos.length === 0){
        setTexto("melhorTempoPiloto", "-");
        setTexto("mediaTempoPiloto", "-");
        setTexto("posicaoRanking", "-");
        setTexto("totalCorridasPiloto", "0");
        return;
    }

    const melhorTempo = Math.min(...temposValidos);
    const mediaTempo = temposValidos.reduce((total, tempo) => total + tempo, 0) / temposValidos.length;

    const rankingOrdenado = todosResultados
        .filter(resultado => resultado.tempo_volta)
        .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta));

    const melhorResultadoPiloto = meusResultados
        .filter(resultado => resultado.tempo_volta)
        .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta))[0];

    const posicao = rankingOrdenado.findIndex(resultado =>
        Number(resultado.tempo_volta) === Number(melhorResultadoPiloto.tempo_volta)
    ) + 1;

    setTexto("melhorTempoPiloto", formatarTempo(melhorTempo));
    setTexto("mediaTempoPiloto", formatarTempo(mediaTempo));
    setTexto("posicaoRanking", posicao > 0 ? `${posicao}º` : "-");
    setTexto("totalCorridasPiloto", meusResultados.length);
}


// =======================================================
// ÚLTIMOS TEMPOS
// =======================================================

function preencherUltimosTempos(meusResultados){
    const ultimos = meusResultados
        .filter(resultado => resultado.tempo_volta)
        .slice()
        .reverse()
        .slice(0,5);

    if(ultimos.length === 0){
        setHTML("ultimosTemposPiloto", mostrarVazio(
            "Nenhum tempo registrado",
            "Quando seus tempos forem cadastrados, eles aparecerão aqui."
        ));
        return;
    }

    const html = ultimos.map(resultado => `
        <div class="schedule-card">
            <div>
                <div class="schedule-hour">${formatarTempo(resultado.tempo_volta)}</div>
                <p>${resultado.corrida || resultado.nome_corrida || "Corrida"}</p>
            </div>

            <div class="schedule-info">
                <strong>${formatarVeiculo(resultado)}</strong>
                <p>Posição calculada pelo ranking geral</p>
            </div>
        </div>
    `).join("");

    setHTML("ultimosTemposPiloto", html);
}


// =======================================================
// RANKING GERAL
// =======================================================

function preencherRankingGeral(resultados, usuario){
    const ranking = resultados
        .filter(resultado => resultado.tempo_volta)
        .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta))
        .slice(0,5);

    if(ranking.length === 0){
        setHTML("rankingGeralPiloto", mostrarVazio(
            "Ranking vazio",
            "Ainda não existem tempos registrados no sistema."
        ));
        return;
    }

    const html = `
        <div class="ranking-list">
            ${ranking.map((resultado, index) => {
                const nomePiloto = resultado.piloto || resultado.nome_piloto || "Piloto";
                const destaque = String(nomePiloto).toLowerCase().trim() === String(usuario.nome).toLowerCase().trim();

                return `
                    <div class="ranking-item" style="${destaque ? "border:1px solid var(--primary);" : ""}">
                        <div class="ranking-left">
                            <div class="position">${index + 1}</div>

                            <div>
                                <div class="pilot-name">${nomePiloto}</div>
                                <p>${resultado.corrida || resultado.nome_corrida || "Corrida"} • ${formatarVeiculo(resultado)}</p>
                            </div>
                        </div>

                        <div class="best-time">
                            ${formatarTempo(resultado.tempo_volta)}
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `;

    setHTML("rankingGeralPiloto", html);
}


// =======================================================
// PRÓXIMAS CORRIDAS COM INSCRIÇÃO
// =======================================================

function getDataHoraCorridaPiloto(corrida){
    const data = typeof corrida.data === "string"
        ? corrida.data.substring(0,10)
        : new Date(corrida.data).toISOString().substring(0,10);

    const horario = corrida.horario ? String(corrida.horario).substring(0,5) : "00:00";
    return new Date(`${data}T${horario}:00`);
}

function preencherCorridasFuturas(corridas, inscricoes, veiculos, usuario){
    const agora = new Date();

    const futuras = corridas
        .filter(corrida => corrida.data && getDataHoraCorridaPiloto(corrida) >= agora)
        .sort((a,b) => getDataHoraCorridaPiloto(a) - getDataHoraCorridaPiloto(b))
        .slice(0,5);

    if(futuras.length === 0){
        setHTML("corridasFuturasPiloto", mostrarVazio(
            "Nenhuma corrida futura",
            "Quando novas corridas forem cadastradas, elas aparecerão aqui."
        ));
        return;
    }

    const html = futuras.map(corrida => {
        const inscrito = inscricoes.some(inscricao =>
            Number(inscricao.corrida_id) === Number(corrida.id) &&
            Number(inscricao.piloto_id) === Number(usuario.id)
        );

        const inscricao = inscricoes.find(item =>
            Number(item.corrida_id) === Number(corrida.id) &&
            Number(item.piloto_id) === Number(usuario.id)
        );

        return `
            <div class="schedule-card corrida-inscricao-card">
                <div>
                    <div class="schedule-hour">${formatarHora(corrida.horario)}</div>
                    <p>${formatarData(corrida.data)}</p>
                </div>

                <div class="schedule-info">
                    <strong>${corrida.nome || "Corrida"}</strong>
                    <p>${corrida.pista || "RaceHub Track"}</p>

                    ${inscrito ? `
                        <p class="vehicle-muted">Inscrito com: ${formatarVeiculo(inscricao)}</p>
                        <button class="btn btn-secondary btn-inscricao-corrida" onclick="cancelarInscricaoDashboard(${corrida.id})">
                            <i class="bi bi-x-circle"></i>
                            Cancelar inscrição
                        </button>
                    ` : montarControleInscricaoDashboard(corrida.id, veiculos)}
                </div>
            </div>
        `;
    }).join("");

    setHTML("corridasFuturasPiloto", html);
}

function montarControleInscricaoDashboard(corridaId, veiculos){
    if(!veiculos || veiculos.length === 0){
        return `
            <button class="btn btn-primary btn-inscricao-corrida" onclick="window.location.href='veiculos.html'">
                <i class="bi bi-car-front"></i>
                Cadastrar veículo
            </button>
        `;
    }

    return `
        <select class="input select-veiculo-dashboard" id="veiculoDashboard${corridaId}">
            <option value="">Escolha o veículo</option>
            ${veiculos.map(veiculo => `
                <option value="${veiculo.id}">${formatarVeiculo(veiculo)}</option>
            `).join("")}
        </select>

        <button class="btn btn-primary btn-inscricao-corrida" onclick="inscreverCorridaDashboard(${corridaId})">
            <i class="bi bi-check-circle"></i>
            Inscrever-se
        </button>
    `;
}

async function inscreverCorridaDashboard(corridaId){
    const usuario = getUsuarioLogado();
    const select = document.getElementById(`veiculoDashboard${corridaId}`);
    const veiculoId = select ? select.value : "";

    if(!usuario || usuario.tipo !== "piloto"){
        alert("Apenas pilotos podem se inscrever em corridas.");
        return;
    }

    if(!veiculoId){
        alert("Selecione o veículo que será usado na corrida.");
        return;
    }

    try{
        await apiPost(`/corridas/${corridaId}/inscrever`, {
            piloto_id: usuario.id,
            veiculo_id: Number(veiculoId)
        });

        await carregarDashboardPiloto(usuario);

    }catch(erro){
        alert(erro.message || "Erro ao se inscrever na corrida.");
    }
}

async function cancelarInscricaoDashboard(corridaId){
    const usuario = getUsuarioLogado();

    if(!usuario || usuario.tipo !== "piloto"){
        alert("Apenas pilotos podem cancelar inscrição.");
        return;
    }

    const confirmar = confirm("Deseja cancelar sua inscrição nesta corrida?");

    if(!confirmar) return;

    try{
        await apiDelete(`/corridas/${corridaId}/inscrever/${usuario.id}`);
        await carregarDashboardPiloto(usuario);
    }catch(erro){
        alert(erro.message || "Erro ao cancelar inscrição.");
    }
}


// =======================================================
// RESUMO TÉCNICO
// =======================================================

function preencherResumoPiloto(meusResultados, corridas){
    const temposValidos = meusResultados.filter(resultado => resultado.tempo_volta);

    const ultimoTempo = temposValidos.length > 0
        ? temposValidos[temposValidos.length - 1]
        : null;

    const corridasFuturas = corridas.filter(corrida =>
        corrida.data && getDataHoraCorridaPiloto(corrida) >= new Date()
    );

    setTexto("totalTemposPiloto", temposValidos.length);
    setTexto("tempoMaisRecente", ultimoTempo ? formatarTempo(ultimoTempo.tempo_volta) : "-");
    setTexto("melhorClassificacao", calcularPosicaoPilotoNoRanking(meusResultados));
    setTexto("corridasDisponiveis", corridasFuturas.length);
}

function calcularPosicaoPilotoNoRanking(meusResultados){
    // Calcula a melhor posição do piloto automaticamente pelo menor tempo.
    const rankingGeral = resultadosPilotoCache
        .filter(resultado => resultado.tempo_volta)
        .slice()
        .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta));

    const melhorDoPiloto = meusResultados
        .filter(resultado => resultado.tempo_volta)
        .slice()
        .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta))[0];

    if(!melhorDoPiloto){
        return "-";
    }

    const index = rankingGeral.findIndex(resultado => Number(resultado.id) === Number(melhorDoPiloto.id));
    return index >= 0 ? `${index + 1}º` : "-";
}
