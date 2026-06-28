// =======================================================
// PÁGINA DE CORRIDAS - RaceHub
//
// Este arquivo controla:
// - layout da página conforme admin, piloto ou cliente;
// - cadastro, edição e exclusão de corridas pelo admin;
// - inscrição do piloto em corridas;
// - escolha do veículo na inscrição;
// - listagem de inscritos por corrida.
// =======================================================

const usuarioCorridas = requireAuth(["admin", "piloto", "cliente"]);

let corridasCache = [];
let inscricoesCorridasCache = [];
let veiculosPilotoCorridasCache = [];
let corridaEditandoId = null;

if(usuarioCorridas){
    configurarLayoutPorPerfil(usuarioCorridas);
    carregarCorridas();
}


// =======================================================
// LAYOUT POR PERFIL
// =======================================================

function configurarLayoutPorPerfil(usuario){
    preencherUsuarioLogado();

    const menu = document.getElementById("sidebarMenu");
    const subtitle = document.getElementById("sidebarSubtitle");
    const areaAdmin = document.getElementById("areaAdminCorridas");
    const btnNovaCorrida = document.getElementById("btnNovaCorrida");

    if(usuario.tipo === "admin"){
        subtitle.textContent = "Admin Control Center";

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

            <a href="corridas.html" class="active">
                <i class="bi bi-flag"></i>
                Corridas
            </a>

            <a href="tempos.html">
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

        areaAdmin.style.display = "grid";
        btnNovaCorrida.style.display = "inline-flex";
        return;
    }

    if(usuario.tipo === "piloto"){
        subtitle.textContent = "Pilot Performance Center";

        menu.innerHTML = `
            <a href="piloto.html">
                <i class="bi bi-speedometer2"></i>
                Dashboard
            </a>

            <a href="veiculos.html">
                <i class="bi bi-car-front"></i>
                Meus veículos
            </a>

            <a href="corridas.html" class="active">
                <i class="bi bi-flag"></i>
                Corridas
            </a>

            <a href="tempos.html">
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

        areaAdmin.style.display = "none";
        btnNovaCorrida.style.display = "none";
        return;
    }

    subtitle.textContent = "Client Experience Center";

    menu.innerHTML = `
        <a href="cliente.html">
            <i class="bi bi-grid-1x2-fill"></i>
            Dashboard
        </a>

        <a href="agenda.html">
            <i class="bi bi-calendar-plus"></i>
            Reservar pista
        </a>

        <a href="corridas.html" class="active">
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
    btnNovaCorrida.style.display = "none";
}


// =======================================================
// CARREGAR CORRIDAS / INSCRIÇÕES / VEÍCULOS
// =======================================================

async function carregarCorridas(){
    try{
        // Piloto precisa carregar seus veículos para escolher na inscrição.
        const rotaVeiculosPiloto = usuarioCorridas.tipo === "piloto"
            ? `/pilotos/${usuarioCorridas.id}/veiculos`
            : null;

        const [corridas, inscricoes, veiculos] = await Promise.all([
            apiGet("/corridas"),
            buscarComFallbackCorridas("/inscricoes-corridas"),
            rotaVeiculosPiloto ? buscarComFallbackCorridas(rotaVeiculosPiloto) : Promise.resolve([])
        ]);

        corridasCache = Array.isArray(corridas) ? corridas : [];
        inscricoesCorridasCache = Array.isArray(inscricoes) ? inscricoes : [];
        veiculosPilotoCorridasCache = Array.isArray(veiculos) ? veiculos : [];

        // Ordena a lista colocando primeiro a próxima corrida mais atual.
        // Corridas futuras aparecem da mais próxima para a mais distante.
        // Corridas já finalizadas descem para o final da tabela.
        corridasCache.sort(ordenarCorridasPorAtualidade);

        renderizarCorridas(corridasCache);
        preencherResumoCorridas(corridasCache);

    }catch(erro){
        console.error(erro);

        setHTML("listaCorridas", `
            <tr>
                <td colspan="7">
                    <div class="alert alert-danger">
                        Não foi possível carregar as corridas.
                    </div>
                </td>
            </tr>
        `);
    }
}

async function buscarComFallbackCorridas(rota){
    try{
        const dados = await apiGet(rota);
        return Array.isArray(dados) ? dados : [];
    }catch{
        return [];
    }
}


// =======================================================
// CADASTRAR / EDITAR CORRIDA
// =======================================================

async function cadastrarCorrida(event){
    event.preventDefault();

    const nome = document.getElementById("nomeCorrida").value.trim();
    const data = document.getElementById("dataCorrida").value;
    const horario = document.getElementById("horarioCorrida").value;
    const status = document.getElementById("statusCorrida")?.value || "aberta";
    const limiteInscritos = Number(document.getElementById("limiteInscritosCorrida")?.value || 20);
    const message = document.getElementById("corridaMessage");

    message.style.color = "var(--danger)";
    message.textContent = "";

    if(!nome || !data || !horario){
        message.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    const payload = {
        nome,
        data,
        horario,
        status,
        limite_inscritos: limiteInscritos || 20,
        pista_id:1
    };

    try{
        if(corridaEditandoId){
            await apiPut(`/corridas/${corridaEditandoId}`, payload);
            message.style.color = "var(--success)";
            message.textContent = "Corrida atualizada com sucesso.";
            cancelarEdicaoCorrida(false);
        }else{
            await apiPost("/corridas", payload);
            message.style.color = "var(--success)";
            message.textContent = "Corrida cadastrada com sucesso.";
            event.target.reset();
        }

        await carregarCorridas();

    }catch(erro){
        message.style.color = "var(--danger)";
        message.textContent = erro.message || "Erro ao salvar corrida.";
    }
}


// =======================================================
// RENDERIZAR TABELA
// =======================================================

function renderizarCorridas(corridas){
    if(!corridas || corridas.length === 0){
        setHTML("listaCorridas", `
            <tr>
                <td colspan="7">
                    ${mostrarVazio(
                        "Nenhuma corrida cadastrada",
                        "Quando eventos forem cadastrados, eles aparecerão nesta tabela."
                    )}
                </td>
            </tr>
        `);
        return;
    }

    const html = corridas.map(corrida => {
        const status = getStatusCorrida(corrida);
        const inscritos = getInscritosDaCorrida(corrida.id);
        const totalInscritos = Number(corrida.total_inscritos ?? inscritos.length);
        const limiteInscritos = Number(corrida.limite_inscritos || 20);

        // Mostra os 3 primeiros inscritos e o carro escolhido por eles.
        const nomesInscritos = inscritos.length > 0
            ? inscritos.slice(0,3).map(item => `${item.piloto} (${formatarVeiculo(item)})`).join(", ")
            : "Nenhum piloto inscrito";

        const inscritoAtual = usuarioCorridas.tipo === "piloto" && pilotoEstaInscrito(corrida.id);

        const botoesAdmin = usuarioCorridas.tipo === "admin" ? `
            <button class="action-btn action-edit" title="Editar corrida" onclick="editarCorrida(${corrida.id})">
                <i class="bi bi-pencil-square"></i>
            </button>

            <button class="action-btn action-danger" title="Excluir corrida" onclick="excluirCorrida(${corrida.id})">
                <i class="bi bi-trash"></i>
            </button>
        ` : "";

        const botaoPiloto = usuarioCorridas.tipo === "piloto"
            ? montarAcaoInscricaoPiloto(corrida, inscritoAtual)
            : "";

        return `
            <tr>
                <td><span class="table-number">#${corrida.id}</span></td>

                <td>
                    <strong style="color:white;">${corrida.nome || "-"}</strong>
                    <p style="margin-top:4px;">${corrida.pista || "RaceHub Track"}</p>
                </td>

                <td>${formatarData(corrida.data)}</td>
                <td>${formatarHora(corrida.horario)}</td>
                <td>${status}</td>

                <td>
                    <strong style="color:white;">${totalInscritos}/${limiteInscritos}</strong>
                    <p style="margin-top:4px;">${nomesInscritos}</p>
                </td>

                <td>
                    <div class="table-actions table-actions-wrap">
                        <button class="action-btn" title="Visualizar corrida" onclick="window.location.href='corrida-detalhes.html?id=${corrida.id}'">
                            <i class="bi bi-eye"></i>
                        </button>

                        ${botoesAdmin}
                        ${botaoPiloto}
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    setHTML("listaCorridas", html);
}


function montarAcaoInscricaoPiloto(corrida, inscritoAtual){
    const corridaId = corrida.id;

    // Corrida finalizada/cancelada não permite nova inscrição nem cancelamento.
    if(corridaFinalizada(corrida) || corrida.status === "finalizada" || corrida.status === "cancelada"){
        return `
            <button class="action-btn action-disabled" title="Corrida finalizada" disabled>
                <i class="bi bi-lock"></i>
            </button>
        `;
    }

    if(corrida.status === "encerrada"){
        return `
            <button class="action-btn action-disabled" title="Inscrições encerradas" disabled>
                <i class="bi bi-lock-fill"></i>
            </button>
        `;
    }

    const totalInscritos = Number(corrida.total_inscritos || getInscritosDaCorrida(corrida.id).length);
    const limiteInscritos = Number(corrida.limite_inscritos || 20);

    if(!inscritoAtual && totalInscritos >= limiteInscritos){
        return `
            <button class="action-btn action-disabled" title="Limite de inscritos atingido" disabled>
                <i class="bi bi-people-fill"></i>
            </button>
        `;
    }

    if(inscritoAtual){
        return `
            <button class="action-btn action-danger" title="Cancelar inscrição" onclick="cancelarInscricaoCorrida(${corridaId})">
                <i class="bi bi-x-circle"></i>
            </button>
        `;
    }

    if(veiculosPilotoCorridasCache.length === 0){
        return `
            <button class="action-btn action-warning" title="Cadastrar veículo" onclick="window.location.href='veiculos.html'">
                <i class="bi bi-car-front"></i>
            </button>
        `;
    }

    return `
        <select class="input select-veiculo-inscricao" id="veiculoInscricao${corridaId}" title="Escolha o veículo">
            <option value="">Veículo</option>
            ${veiculosPilotoCorridasCache.map(veiculo => `
                <option value="${veiculo.id}">${formatarVeiculo(veiculo)}</option>
            `).join("")}
        </select>

        <button class="action-btn action-success" title="Inscrever-se" onclick="inscreverCorrida(${corridaId})">
            <i class="bi bi-check-circle"></i>
        </button>
    `;
}


// =======================================================
// STATUS / FILTRO / RESUMO
// =======================================================

function getStatusCorrida(corrida){
    if(!corrida.data){
        return `<span class="status status-warning">Sem data</span>`;
    }

    if(corrida.status === "cancelada"){
        return `<span class="status status-danger">Cancelada</span>`;
    }

    if(corrida.status === "finalizada" || corridaFinalizada(corrida)){
        return `<span class="status status-warning">Finalizada</span>`;
    }

    if(corrida.status === "encerrada"){
        return `<span class="status status-warning">Inscrições encerradas</span>`;
    }

    const total = Number(corrida.total_inscritos || getInscritosDaCorrida(corrida.id).length);
    const limite = Number(corrida.limite_inscritos || 20);

    if(total >= limite){
        return `<span class="status status-warning">Lotada</span>`;
    }

    const hoje = hojeISO();
    const dataCorrida = normalizarDataInput(corrida.data);

    if(dataCorrida === hoje){
        return `<span class="status status-success">Hoje</span>`;
    }

    return `<span class="status status-success">Aberta</span>`;
}

function getDataHoraCorrida(corrida){
    const data = normalizarDataInput(corrida.data);
    const horario = corrida.horario ? String(corrida.horario).substring(0,5) : "00:00";

    if(!data){
        return new Date("1900-01-01T00:00:00");
    }

    return new Date(`${data}T${horario}:00`);
}

function corridaFinalizada(corrida){
    return getDataHoraCorrida(corrida) < new Date();
}

function ordenarCorridasPorAtualidade(a,b){
    const agora = new Date();
    const dataA = getDataHoraCorrida(a);
    const dataB = getDataHoraCorrida(b);
    const aFinalizada = dataA < agora;
    const bFinalizada = dataB < agora;

    if(aFinalizada && !bFinalizada) return 1;
    if(!aFinalizada && bFinalizada) return -1;

    if(!aFinalizada && !bFinalizada){
        return dataA - dataB;
    }

    // Entre corridas finalizadas, mostra primeiro a mais recente.
    return dataB - dataA;
}

function filtrarCorridas(){
    const termo = document.getElementById("buscaCorrida").value.toLowerCase().trim();

    if(!termo){
        renderizarCorridas(corridasCache);
        return;
    }

    const filtradas = corridasCache.filter(corrida => {
        const campos = [corrida.nome, corrida.data, corrida.horario]
            .map(campo => String(campo || "").toLowerCase());

        return campos.some(campo => campo.includes(termo));
    });

    renderizarCorridas(filtradas);
}

function preencherResumoCorridas(corridas){
    const hoje = hojeISO();
    const agora = new Date();

    const corridasHoje = corridas.filter(corrida => String(corrida.data).startsWith(hoje));

    const corridasFuturas = corridas
        .filter(corrida => corrida.data && new Date(corrida.data) >= agora)
        .sort((a,b) => new Date(a.data) - new Date(b.data));

    const proxima = corridasFuturas[0];

    setTexto("totalCorridasPagina", corridas.length);
    setTexto("corridasHojePagina", corridasHoje.length);
    setTexto("corridasFuturasPagina", corridasFuturas.length);
    setTexto("proximaCorridaPagina", proxima ? formatarDataCurta(proxima.data) : "-");
}


// =======================================================
// EDIÇÃO / EXCLUSÃO DE CORRIDA
// =======================================================

function focarFormularioCorrida(){
    const form = document.getElementById("formCorridaBox");
    const input = document.getElementById("nomeCorrida");

    if(form){
        form.scrollIntoView({ behavior:"smooth", block:"center" });
    }

    setTimeout(() => {
        if(input) input.focus();
    }, 450);
}

function normalizarDataInput(data){
    if(!data) return "";

    if(typeof data === "string"){
        return data.substring(0,10);
    }

    const dataObj = new Date(data);

    if(Number.isNaN(dataObj.getTime())) return "";

    const ano = dataObj.getFullYear();
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const dia = String(dataObj.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function editarCorrida(id){
    const corrida = corridasCache.find(item => Number(item.id) === Number(id));

    if(!corrida){
        alert("Corrida não encontrada.");
        return;
    }

    corridaEditandoId = id;

    document.getElementById("nomeCorrida").value = corrida.nome || "";
    document.getElementById("dataCorrida").value = normalizarDataInput(corrida.data);
    document.getElementById("horarioCorrida").value = formatarHora(corrida.horario);
    document.getElementById("statusCorrida").value = corrida.status || "aberta";
    document.getElementById("limiteInscritosCorrida").value = corrida.limite_inscritos || 20;

    document.getElementById("tituloFormCorrida").textContent = `Editando corrida #${id}`;
    document.getElementById("textoSalvarCorrida").textContent = "Salvar alterações";
    document.getElementById("btnCancelarEdicaoCorrida").style.display = "inline-flex";

    const message = document.getElementById("corridaMessage");
    message.style.color = "var(--gold)";
    message.textContent = "Modo edição ativo.";

    focarFormularioCorrida();
}

function cancelarEdicaoCorrida(limparMensagem = true){
    corridaEditandoId = null;

    document.getElementById("tituloFormCorrida").textContent = "Cadastrar corrida";
    document.getElementById("textoSalvarCorrida").textContent = "Cadastrar corrida";
    document.getElementById("btnCancelarEdicaoCorrida").style.display = "none";

    document.getElementById("nomeCorrida").value = "";
    document.getElementById("dataCorrida").value = "";
    document.getElementById("horarioCorrida").value = "";
    document.getElementById("statusCorrida").value = "aberta";
    document.getElementById("limiteInscritosCorrida").value = 20;

    if(limparMensagem){
        document.getElementById("corridaMessage").textContent = "";
    }
}

async function excluirCorrida(id){
    if(usuarioCorridas.tipo !== "admin"){
        alert("Apenas administradores podem excluir corridas.");
        return;
    }

    const corrida = corridasCache.find(item => Number(item.id) === Number(id));
    const nome = corrida ? corrida.nome : "Corrida";
    const confirmar = await rhConfirm(`Deseja realmente excluir a corrida "${nome}"?`);

    if(!confirmar) return;

    apiDelete(`/corridas/${id}`)
        .then(() => carregarCorridas())
        .catch(erro => rhAlert(erro.message || "Erro ao excluir corrida."));
}


// =======================================================
// INSCRIÇÃO DE PILOTO EM CORRIDA
// =======================================================

function getInscritosDaCorrida(corridaId){
    return inscricoesCorridasCache.filter(inscricao =>
        Number(inscricao.corrida_id) === Number(corridaId)
    );
}

function pilotoEstaInscrito(corridaId){
    const usuario = getUsuarioLogado();

    if(!usuario) return false;

    return inscricoesCorridasCache.some(inscricao =>
        Number(inscricao.corrida_id) === Number(corridaId) &&
        Number(inscricao.piloto_id) === Number(usuario.id)
    );
}

async function inscreverCorrida(corridaId){
    const usuario = getUsuarioLogado();

    if(!usuario || usuario.tipo !== "piloto"){
        rhAlert("Apenas pilotos podem se inscrever em corridas.");
        return;
    }

    const selectVeiculo = document.getElementById(`veiculoInscricao${corridaId}`);
    const veiculoId = selectVeiculo ? selectVeiculo.value : "";

    if(!veiculoId){
        rhAlert("Selecione o veículo que será usado na corrida.");
        return;
    }

    try{
        await apiPost(`/corridas/${corridaId}/inscrever`, {
            piloto_id: usuario.id,
            veiculo_id: Number(veiculoId)
        });

        await carregarCorridas();

    }catch(erro){
        rhAlert(erro.message || "Erro ao se inscrever na corrida.");
    }
}

async function cancelarInscricaoCorrida(corridaId){
    const usuario = getUsuarioLogado();

    if(!usuario || usuario.tipo !== "piloto"){
        rhAlert("Apenas pilotos podem cancelar inscrição.");
        return;
    }

    const corrida = corridasCache.find(item => Number(item.id) === Number(corridaId));

    if(corrida && corridaFinalizada(corrida)){
        rhAlert("Não é possível cancelar inscrição de uma corrida finalizada.");
        return;
    }

    const confirmar = await rhConfirm("Deseja cancelar sua inscrição nesta corrida?");

    if(!confirmar) return;

    try{
        await apiDelete(`/corridas/${corridaId}/inscrever/${usuario.id}`);
        await carregarCorridas();
    }catch(erro){
        rhAlert(erro.message || "Erro ao cancelar inscrição.");
    }
}

function visualizarCorrida(id){
    const corrida = corridasCache.find(item => Number(item.id) === Number(id));

    if(!corrida) return;

    const inscritos = getInscritosDaCorrida(id);

    const listaInscritos = inscritos.length > 0
        ? inscritos.map(item => `- ${item.piloto} | ${formatarVeiculo(item)}`).join("\n")
        : "Nenhum piloto inscrito.";

    alert(
        `Corrida: ${corrida.nome || "-"}\n` +
        `Data: ${formatarData(corrida.data)}\n` +
        `Horário: ${formatarHora(corrida.horario)}\n` +
        `Pista: ${corrida.pista || "RaceHub Track"}\n\n` +
        `Inscritos:\n${listaInscritos}`
    );
}
