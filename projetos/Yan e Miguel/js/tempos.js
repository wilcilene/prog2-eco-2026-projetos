// =======================================================
// PÁGINA DE TEMPOS - RaceHub
//
// Este arquivo controla:
// - visualização do ranking;
// - registro de tempos pelo admin;
// - seleção de corrida, piloto e veículo;
// - filtro de resultados por perfil.
// =======================================================

const usuarioTempos = requireAuth(["admin", "piloto", "cliente"]);

let resultadosCache = [];
let resultadosVisiveisCache = [];
let pilotosCacheTempos = [];
let corridasCacheTempos = [];
let veiculosCacheTempos = [];

if(usuarioTempos){
    configurarLayoutTempos(usuarioTempos);
    carregarTelaTempos(usuarioTempos);
}


// =======================================================
// LAYOUT POR PERFIL
// =======================================================

function configurarLayoutTempos(usuario){
    preencherUsuarioLogado();

    const menu = document.getElementById("sidebarMenu");
    const subtitle = document.getElementById("sidebarSubtitle");
    const areaAdmin = document.getElementById("areaAdminTempos");
    const btnNovoTempo = document.getElementById("btnNovoTempo");

    if(usuario.tipo === "admin"){
        subtitle.textContent = "Admin Timing Center";

        menu.innerHTML = `
            <a href="admin.html">
                <i class="bi bi-grid-1x2-fill"></i>
                Dashboard
            </a>

            <a href="pilotos.html">
                <i class="bi bi-person-badge"></i>
                Pilotos
            </a>

            <a href="veiculos.html">
                <i class="bi bi-car-front"></i>
                Veículos
            </a>

            <a href="reservas-admin.html">
                <i class="bi bi-calendar-check"></i>
                Reservas
            </a>

            <a href="corridas.html">
                <i class="bi bi-flag"></i>
                Corridas
            </a>

            <a href="tempos.html" class="active">
                <i class="bi bi-stopwatch"></i>
                Tempos
            </a>

            <a href="relatorios.html">
                <i class="bi bi-bar-chart"></i>
                Relatórios
            </a>

            <a href="usuarios.html">
                <i class="bi bi-people"></i>
                Usuários
            </a>

            <a href="perfil.html">
                <i class="bi bi-person-circle"></i>
                Perfil
            </a>
        `;

        if(areaAdmin) areaAdmin.style.display = "grid";
        if(btnNovoTempo) btnNovoTempo.style.display = "inline-flex";
        return;
    }

    if(usuario.tipo === "piloto"){
        subtitle.textContent = "Pilot Performance Center";

        document.getElementById("tituloTempos").textContent = "Meus tempos";
        document.getElementById("subtituloTempos").textContent = "Acompanhe seus tempos, evolução e posição no ranking.";
        document.getElementById("labelTotalTempos").textContent = "Meus registros";
        document.getElementById("tituloTabelaTempos").textContent = "Meus tempos registrados";
        document.getElementById("tituloWidgetTempos").textContent = "Meus últimos tempos";
        document.getElementById("subtituloWidgetTempos").textContent = "Seus registros mais recentes.";

        menu.innerHTML = `
            <a href="piloto.html">
                <i class="bi bi-speedometer2"></i>
                Dashboard
            </a>

            <a href="veiculos.html">
                <i class="bi bi-car-front"></i>
                Meus veículos
            </a>

            <a href="corridas.html">
                <i class="bi bi-flag"></i>
                Corridas
            </a>

            <a href="tempos.html" class="active">
                <i class="bi bi-stopwatch"></i>
                Meus tempos
            </a>

            <a href="relatorios.html">
                <i class="bi bi-bar-chart"></i>
                Ranking
            </a>

            <a href="perfil.html">
                <i class="bi bi-person-circle"></i>
                Perfil
            </a>
        `;

        if(areaAdmin) areaAdmin.style.display = "none";
        if(btnNovoTempo) btnNovoTempo.style.display = "none";
        return;
    }

    subtitle.textContent = "Client Experience Center";
    document.getElementById("tituloTempos").textContent = "Resultados";
    document.getElementById("subtituloTempos").textContent = "Consulte tempos e rankings registrados na pista.";

    menu.innerHTML = `
        <a href="cliente.html">
            <i class="bi bi-grid-1x2-fill"></i>
            Dashboard
        </a>

        <a href="agenda.html">
            <i class="bi bi-calendar-plus"></i>
            Reservar pista
        </a>

        <a href="corridas.html">
            <i class="bi bi-flag"></i>
            Corridas
        </a>

        <a href="relatorios.html">
            <i class="bi bi-bar-chart"></i>
            Resultados
        </a>

        <a href="perfil.html">
            <i class="bi bi-person-circle"></i>
            Perfil
        </a>
    `;

    areaAdmin.style.display = "none";
    btnNovoTempo.style.display = "none";
}


// =======================================================
// CARREGAR DADOS
// =======================================================

async function carregarTelaTempos(usuario){
    try{
        const [resultados, pilotos, corridas, veiculos] = await Promise.all([
            buscarComFallbackTempos("/resultados"),
            buscarComFallbackTempos("/pilotos"),
            buscarComFallbackTempos("/corridas"),
            buscarComFallbackTempos("/veiculos")
        ]);

        resultadosCache = Array.isArray(resultados) ? resultados : [];
        pilotosCacheTempos = Array.isArray(pilotos) ? pilotos : [];
        corridasCacheTempos = Array.isArray(corridas) ? corridas : [];
        veiculosCacheTempos = Array.isArray(veiculos) ? veiculos : [];

        prepararSelectsAdmin();

        resultadosVisiveisCache = usuario.tipo === "piloto"
            ? filtrarResultadosDoUsuario(resultadosCache, usuario)
            : resultadosCache;

        resultadosVisiveisCache = ordenarPorTempo(resultadosVisiveisCache);

        renderizarTempos(resultadosVisiveisCache);
        preencherCardsTempos(resultadosVisiveisCache, resultadosCache);
        preencherTopRanking(resultadosCache, usuario);
        preencherUltimosRegistros(resultadosVisiveisCache);

    }catch(erro){
        console.error(erro);

        setHTML("listaTempos", `
            <tr>
                <td colspan="7">
                    <div class="alert alert-danger">
                        Não foi possível carregar os tempos.
                    </div>
                </td>
            </tr>
        `);
    }
}

async function buscarComFallbackTempos(rota){
    try{
        return await apiGet(rota);
    }catch{
        return [];
    }
}


// =======================================================
// SELECTS DO FORMULÁRIO ADMIN
// =======================================================

function prepararSelectsAdmin(){
    const selectPiloto = document.getElementById("pilotoResultado");
    const selectCorrida = document.getElementById("corridaResultado");
    const selectVeiculo = document.getElementById("veiculoResultado");

    if(!selectPiloto || !selectCorrida || !selectVeiculo){
        return;
    }

    selectPiloto.innerHTML = `
        <option value="">Selecione um piloto</option>
        ${pilotosCacheTempos.map(piloto => `
            <option value="${piloto.id}">
                ${piloto.nome} - ${piloto.email || "sem e-mail"}
            </option>
        `).join("")}
    `;

    selectCorrida.innerHTML = `
        <option value="">Selecione uma corrida</option>
        ${corridasCacheTempos.map(corrida => `
            <option value="${corrida.id}">
                ${corrida.nome} - ${formatarData(corrida.data)}
            </option>
        `).join("")}
    `;

    // Quando o admin troca o piloto, o select de veículos é recalculado.
    selectPiloto.onchange = () => preencherSelectVeiculosDoPiloto(selectPiloto.value);

    preencherSelectVeiculosDoPiloto(selectPiloto.value);
}

function preencherSelectVeiculosDoPiloto(pilotoId){
    const selectVeiculo = document.getElementById("veiculoResultado");

    if(!selectVeiculo){
        return;
    }

    if(!pilotoId){
        selectVeiculo.innerHTML = `<option value="">Selecione primeiro o piloto</option>`;
        return;
    }

    const veiculos = veiculosCacheTempos.filter(veiculo =>
        Number(veiculo.piloto_id) === Number(pilotoId)
    );

    if(veiculos.length === 0){
        selectVeiculo.innerHTML = `<option value="">Piloto sem veículo cadastrado</option>`;
        return;
    }

    selectVeiculo.innerHTML = `
        <option value="">Selecione um veículo</option>
        ${veiculos.map(veiculo => `
            <option value="${veiculo.id}">${formatarVeiculo(veiculo)} ${veiculo.potencia ? `• ${veiculo.potencia} cv` : ""}</option>
        `).join("")}
    `;
}


// =======================================================
// CADASTRAR RESULTADO
// =======================================================

async function cadastrarResultado(event){
    event.preventDefault();

    const corridaId = document.getElementById("corridaResultado").value;
    const pilotoId = document.getElementById("pilotoResultado").value;
    const veiculoId = document.getElementById("veiculoResultado").value;
    const tempoVolta = document.getElementById("tempoVolta").value;
    const message = document.getElementById("resultadoMessage");

    message.style.color = "var(--danger)";
    message.textContent = "";

    if(!corridaId || !pilotoId || !veiculoId || !tempoVolta){
        message.textContent = "Selecione corrida, piloto, veículo e informe o tempo.";
        return;
    }

    if(Number(tempoVolta) <= 0){
        message.textContent = "O tempo precisa ser maior que zero.";
        return;
    }

    try{
        await apiPost("/resultados", {
            corrida_id:Number(corridaId),
            piloto_id:Number(pilotoId),
            veiculo_id:Number(veiculoId),
            tempo_volta:Number(tempoVolta)
        });

        message.style.color = "var(--success)";
        message.textContent = "Tempo registrado com sucesso.";

        event.target.reset();
        preencherSelectVeiculosDoPiloto("");

        await carregarTelaTempos(usuarioTempos);

    }catch(erro){
        message.style.color = "var(--danger)";
        message.textContent = erro.message || "Erro ao registrar tempo.";
    }
}


// =======================================================
// ORGANIZAÇÃO / FILTRO DE RESULTADOS
// =======================================================

function ordenarPorTempo(resultados){
    return resultados
        .filter(resultado => resultado.tempo_volta)
        .slice()
        .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta));
}

function filtrarResultadosDoUsuario(resultados, usuario){
    return resultados.filter(resultado => {
        const mesmoId = Number(resultado.piloto_id) === Number(usuario.id);

        const nomeResultado = String(resultado.piloto || resultado.nome_piloto || "").toLowerCase().trim();
        const nomeUsuario = String(usuario.nome || "").toLowerCase().trim();
        const mesmoNome = nomeResultado && nomeResultado === nomeUsuario;

        const mesmoEmail = String(resultado.email || resultado.email_piloto || "")
            .toLowerCase()
            .trim() === String(usuario.email || "")
            .toLowerCase()
            .trim();

        return mesmoId || mesmoNome || mesmoEmail;
    });
}


// =======================================================
// RENDERIZAR TABELA
// =======================================================

function renderizarTempos(resultados){
    if(!resultados || resultados.length === 0){
        setHTML("listaTempos", `
            <tr>
                <td colspan="7">
                    ${mostrarVazio(
                        "Nenhum tempo registrado",
                        "Quando os resultados forem lançados, eles aparecerão nesta tabela."
                    )}
                </td>
            </tr>
        `);
        return;
    }

    const html = resultados.map((resultado, index) => {
        const piloto = getNomePilotoResultado(resultado);
        const corrida = getNomeCorridaResultado(resultado);
        const veiculo = formatarVeiculo(resultado);

        return `
            <tr>
                <td><span class="table-number">${index + 1}º</span></td>

                <td>
                    <strong style="color:white;">${montarLinkPiloto(piloto, resultado.piloto_id)}</strong>
                </td>

                <td>${veiculo}</td>

                <td>${corrida}</td>

                <td>
                    <span class="table-highlight">${formatarTempo(resultado.tempo_volta)}</span>
                </td>

                <td>#${resultado.id || "-"}</td>

                <td>
                    <div class="table-actions">
                        <button class="action-btn" title="Visualizar resultado" onclick="visualizarResultado(${resultado.id || 0})">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    setHTML("listaTempos", html);
}


// =======================================================
// CARDS / RANKING / ÚLTIMOS REGISTROS
// =======================================================

function preencherCardsTempos(resultadosVisiveis, todosResultados){
    const tempos = resultadosVisiveis
        .map(resultado => Number(resultado.tempo_volta))
        .filter(tempo => !Number.isNaN(tempo));

    const rankingGeral = ordenarPorTempo(todosResultados);
    const lider = rankingGeral[0];

    setTexto("totalTemposPagina", resultadosVisiveis.length);

    if(tempos.length === 0){
        setTexto("melhorTempoPagina", "-");
        setTexto("mediaTempoPagina", "-");
        setTexto("liderRankingPagina", lider ? getNomePilotoResultado(lider).split(" ")[0] : "-");
        return;
    }

    const melhor = Math.min(...tempos);
    const media = tempos.reduce((total, tempo) => total + tempo, 0) / tempos.length;

    setTexto("melhorTempoPagina", formatarTempo(melhor));
    setTexto("mediaTempoPagina", formatarTempo(media));
    setTexto("liderRankingPagina", lider ? getNomePilotoResultado(lider).split(" ")[0] : "-");
}

function preencherTopRanking(todosResultados, usuario){
    const ranking = ordenarPorTempo(todosResultados).slice(0,5);

    if(ranking.length === 0){
        setHTML("topRankingTempos", mostrarVazio(
            "Ranking vazio",
            "Ainda não existem tempos registrados no sistema."
        ));
        return;
    }

    const html = `
        <div class="ranking-list">
            ${ranking.map((resultado, index) => {
                const nomePiloto = getNomePilotoResultado(resultado);
                const destaque = usuario.tipo === "piloto" &&
                    nomePiloto.toLowerCase().trim() === String(usuario.nome || "").toLowerCase().trim();

                return `
                    <div class="ranking-item" style="${destaque ? "border:1px solid var(--primary);" : ""}">
                        <div class="ranking-left">
                            <div class="position">${index + 1}</div>

                            <div>
                                <div class="pilot-name">${montarLinkPiloto(nomePiloto, resultado.piloto_id)}</div>
                                <p>${getNomeCorridaResultado(resultado)} • ${formatarVeiculo(resultado)}</p>
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

    setHTML("topRankingTempos", html);
}

function preencherUltimosRegistros(resultados){
    const ultimos = resultados.slice().reverse().slice(0,5);

    if(ultimos.length === 0){
        setHTML("ultimosRegistrosTempos", mostrarVazio(
            "Sem registros",
            "Nenhum tempo disponível para este perfil."
        ));
        return;
    }

    const html = ultimos.map(resultado => `
        <div class="schedule-card">
            <div>
                <div class="schedule-hour">${formatarTempo(resultado.tempo_volta)}</div>
                <p>${getNomeCorridaResultado(resultado)}</p>
            </div>

            <div class="schedule-info">
                <strong>${montarLinkPiloto(getNomePilotoResultado(resultado), resultado.piloto_id)}</strong>
                <p>${formatarVeiculo(resultado)}</p>
            </div>
        </div>
    `).join("");

    setHTML("ultimosRegistrosTempos", html);
}


// =======================================================
// BUSCA / NOMES / AÇÕES
// =======================================================

function filtrarTempos(){
    const termo = document.getElementById("buscaTempo").value.toLowerCase().trim();

    if(!termo){
        renderizarTempos(resultadosVisiveisCache);
        return;
    }

    const filtrados = resultadosVisiveisCache.filter(resultado => {
        const campos = [
            resultado.id,
            getNomePilotoResultado(resultado),
            getNomeCorridaResultado(resultado),
            formatarVeiculo(resultado),
            resultado.tempo_volta
        ].map(campo => String(campo || "").toLowerCase());

        return campos.some(campo => campo.includes(termo));
    });

    renderizarTempos(filtrados);
}

function getNomePilotoResultado(resultado){
    if(resultado.piloto) return resultado.piloto;
    if(resultado.nome_piloto) return resultado.nome_piloto;

    const piloto = pilotosCacheTempos.find(item =>
        Number(item.id) === Number(resultado.piloto_id)
    );

    return piloto ? piloto.nome : "Piloto";
}

function getNomeCorridaResultado(resultado){
    if(resultado.corrida) return resultado.corrida;
    if(resultado.nome_corrida) return resultado.nome_corrida;

    const corrida = corridasCacheTempos.find(item =>
        Number(item.id) === Number(resultado.corrida_id)
    );

    return corrida ? corrida.nome : "Corrida";
}

function focarFormularioTempo(){
    const form = document.getElementById("formTempoBox");
    const input = document.getElementById("corridaResultado");

    if(form){
        form.scrollIntoView({ behavior:"smooth", block:"center" });
    }

    setTimeout(() => {
        if(input) input.focus();
    }, 450);
}

function calcularPosicaoResultado(resultado){
    // Calcula a posição automaticamente comparando todos os tempos.
    // O menor tempo fica em 1º, o segundo menor em 2º, e assim por diante.
    const ranking = ordenarPorTempo(resultadosCache);
    const index = ranking.findIndex(item => Number(item.id) === Number(resultado.id));
    return index >= 0 ? index + 1 : "-";
}

function visualizarResultado(id){
    const resultado = resultadosCache.find(item => Number(item.id) === Number(id));

    if(!resultado) return;

    alert(
        `Resultado #${resultado.id || "-"}\n` +
        `Piloto: ${getNomePilotoResultado(resultado)}\n` +
        `Veículo: ${formatarVeiculo(resultado)}\n` +
        `Corrida: ${getNomeCorridaResultado(resultado)}\n` +
        `Tempo: ${formatarTempo(resultado.tempo_volta)}\n` +
        `Posição calculada: ${calcularPosicaoResultado(resultado)}º`
    );
}
