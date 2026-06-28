// =======================================================
// PÁGINA DE VEÍCULOS - RaceHub
//
// Este arquivo controla:
// - cadastro de veículos;
// - edição de veículos;
// - exclusão de veículos;
// - listagem por perfil;
// - busca na tabela;
// - cards de resumo.
// =======================================================

// Apenas admin e piloto podem acessar a página de veículos.
const usuarioVeiculos = requireAuth(["admin", "piloto"]);

// Cache local dos veículos carregados da API.
let veiculosCache = [];

// Cache local dos pilotos, usado quando admin cadastra carro para outro piloto.
let pilotosCacheVeiculos = [];

// Guarda o ID do veículo em edição.
// Se for null, o formulário está no modo cadastro.
let veiculoEditandoId = null;

// Inicializa a página assim que o HTML termina de carregar.
document.addEventListener("DOMContentLoaded", () => {
    if(usuarioVeiculos){
        preencherUsuarioLogado();
        configurarLayoutVeiculos(usuarioVeiculos);
        carregarVeiculos();
    }
});


// =======================================================
// MENU / LAYOUT POR PERFIL
// =======================================================

function configurarLayoutVeiculos(usuario){
    const menu = document.getElementById("sidebarMenu");
    const subtitle = document.getElementById("sidebarSubtitle");
    const subtituloPagina = document.getElementById("subtituloVeiculos");

    if(!menu){
        return;
    }

    // Admin vê atalhos administrativos.
    if(usuario.tipo === "admin"){
        subtitle.textContent = "Admin Garage Center";

        menu.innerHTML = `
            <a href="admin.html">
                <i class="bi bi-grid-1x2-fill"></i>
                Dashboard
            </a>

            <a href="pilotos.html">
                <i class="bi bi-person-badge"></i>
                Pilotos
            </a>

            <a href="veiculos.html" class="active">
                <i class="bi bi-car-front"></i>
                Veículos
            </a>

            <a href="corridas.html">
                <i class="bi bi-flag"></i>
                Corridas
            </a>

            <a href="tempos.html">
                <i class="bi bi-stopwatch"></i>
                Tempos
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

        if(subtituloPagina){
            subtituloPagina.textContent = "Gerencie os veículos cadastrados por todos os pilotos.";
        }

        return;
    }

    // Piloto vê somente a própria garagem.
    subtitle.textContent = "Pilot Garage";

    menu.innerHTML = `
        <a href="piloto.html">
            <i class="bi bi-speedometer2"></i>
            Dashboard
        </a>

        <a href="veiculos.html" class="active">
            <i class="bi bi-car-front"></i>
            Meus veículos
        </a>

        <a href="corridas.html">
            <i class="bi bi-flag"></i>
            Corridas
        </a>

        <a href="tempos.html">
            <i class="bi bi-stopwatch"></i>
            Meus tempos
        </a>

        <a href="perfil.html">
            <i class="bi bi-person-circle"></i>
            Perfil
        </a>
    `;

    if(subtituloPagina){
        subtituloPagina.textContent = "Cadastre seus carros para escolher na inscrição das corridas.";
    }
}


// =======================================================
// CARREGAR DADOS
// =======================================================

async function carregarVeiculos(){
    try{
        // Admin precisa carregar todos os pilotos para escolher o dono do veículo.
        // Piloto usa apenas o próprio ID.
        const rotaVeiculos = usuarioVeiculos.tipo === "piloto"
            ? `/pilotos/${usuarioVeiculos.id}/veiculos`
            : "/veiculos";

        const [veiculos, pilotos] = await Promise.all([
            apiGet(rotaVeiculos),
            usuarioVeiculos.tipo === "admin" ? apiGet("/pilotos") : Promise.resolve([usuarioVeiculos])
        ]);

        veiculosCache = Array.isArray(veiculos) ? veiculos : [];
        pilotosCacheVeiculos = Array.isArray(pilotos) ? pilotos : [];

        preencherSelectPilotosVeiculo();
        renderizarVeiculos(veiculosCache);
        preencherResumoVeiculos(veiculosCache);

    }catch(erro){
        console.error(erro);

        setHTML("listaVeiculos", `
            <tr>
                <td colspan="7">
                    <div class="alert alert-danger">
                        Não foi possível carregar os veículos.
                    </div>
                </td>
            </tr>
        `);
    }
}


function preencherSelectPilotosVeiculo(){
    const select = document.getElementById("pilotoVeiculo");
    const grupo = document.getElementById("grupoPilotoVeiculo");

    if(!select){
        return;
    }

    // Piloto logado não escolhe dono: o veículo já é dele.
    if(usuarioVeiculos.tipo === "piloto"){
        select.innerHTML = `
            <option value="${usuarioVeiculos.id}" selected>
                ${usuarioVeiculos.nome}
            </option>
        `;

        if(grupo){
            grupo.style.display = "none";
        }

        return;
    }

    // Admin pode escolher para qual piloto o carro será cadastrado.
    select.innerHTML = `
        <option value="">Selecione um piloto</option>
        ${pilotosCacheVeiculos.map(piloto => `
            <option value="${piloto.id}">
                ${piloto.nome} - ${piloto.email || "sem e-mail"}
            </option>
        `).join("")}
    `;
}


// =======================================================
// SALVAR VEÍCULO
// =======================================================

async function salvarVeiculo(event){
    event.preventDefault();

    const pilotoId = document.getElementById("pilotoVeiculo").value;
    const marca = document.getElementById("marcaVeiculo").value.trim();
    const modelo = document.getElementById("modeloVeiculo").value.trim();
    const ano = document.getElementById("anoVeiculo").value;
    const placa = document.getElementById("placaVeiculo").value.trim().toUpperCase();
    const cor = document.getElementById("corVeiculo").value.trim();
    const potencia = document.getElementById("potenciaVeiculo")?.value;
    const observacoes = document.getElementById("obsVeiculo").value.trim();
    const message = document.getElementById("veiculoMessage");

    message.style.color = "var(--danger)";
    message.textContent = "";

    if(!pilotoId || !marca || !modelo){
        message.textContent = "Informe piloto, marca e modelo.";
        return;
    }

    const payload = {
        piloto_id:Number(pilotoId),
        marca,
        modelo,
        ano: ano ? Number(ano) : null,
        placa: placa || null,
        cor: cor || null,
        potencia: potencia ? Number(potencia) : null,
        observacoes: observacoes || null
    };

    try{
        if(veiculoEditandoId){
            await apiPut(`/veiculos/${veiculoEditandoId}`, payload);

            message.style.color = "var(--success)";
            message.textContent = "Veículo atualizado com sucesso.";

            cancelarEdicaoVeiculo(false);
        }else{
            await apiPost("/veiculos", payload);

            message.style.color = "var(--success)";
            message.textContent = "Veículo cadastrado com sucesso.";

            event.target.reset();
            preencherSelectPilotosVeiculo();
        }

        await carregarVeiculos();

    }catch(erro){
        message.style.color = "var(--danger)";
        message.textContent = erro.message || "Erro ao salvar veículo.";
    }
}


// =======================================================
// RENDERIZAR TABELA
// =======================================================

function renderizarVeiculos(veiculos){
    if(!veiculos || veiculos.length === 0){
        setHTML("listaVeiculos", `
            <tr>
                <td colspan="7">
                    ${mostrarVazio(
                        "Nenhum veículo cadastrado",
                        "Cadastre um veículo para usá-lo nas inscrições e resultados."
                    )}
                </td>
            </tr>
        `);

        return;
    }

    const html = veiculos.map(veiculo => `
        <tr>
            <td>
                <span class="table-number">#${veiculo.id}</span>
            </td>

            <td>
                <strong style="color:white;">${formatarVeiculo(veiculo)}</strong>
                <p style="margin-top:4px;">${veiculo.ano || "Ano não informado"}</p>
            </td>

            <td>${veiculo.piloto || usuarioVeiculos.nome || "Piloto"}</td>

            <td>${veiculo.placa || "-"}</td>

            <td>${veiculo.cor || "-"}</td>

            <td>
                <strong style="color:white;">${veiculo.potencia ? `${veiculo.potencia} cv` : "-"}</strong>
                <p style="margin-top:4px;">${veiculo.categoria_potencia || getCategoriaPotencia(veiculo.potencia)}</p>
            </td>

            <td>${veiculo.observacoes || "-"}</td>

            <td>
                <div class="table-actions">
                    <button class="action-btn" title="Visualizar veículo" onclick="visualizarVeiculo(${veiculo.id})">
                        <i class="bi bi-eye"></i>
                    </button>

                    <button class="action-btn action-edit" title="Editar veículo" onclick="editarVeiculo(${veiculo.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button class="action-btn action-danger" title="Excluir veículo" onclick="excluirVeiculo(${veiculo.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    setHTML("listaVeiculos", html);
}


// =======================================================
// EDITAR / CANCELAR / EXCLUIR
// =======================================================

function editarVeiculo(id){
    const veiculo = veiculosCache.find(item => Number(item.id) === Number(id));

    if(!veiculo){
        rhAlert("Veículo não encontrado.");
        return;
    }

    veiculoEditandoId = id;

    document.getElementById("pilotoVeiculo").value = veiculo.piloto_id || usuarioVeiculos.id;
    document.getElementById("marcaVeiculo").value = veiculo.marca || "";
    document.getElementById("modeloVeiculo").value = veiculo.modelo || "";
    document.getElementById("anoVeiculo").value = veiculo.ano || "";
    document.getElementById("placaVeiculo").value = veiculo.placa || "";
    document.getElementById("corVeiculo").value = veiculo.cor || "";
    document.getElementById("potenciaVeiculo").value = veiculo.potencia || "";
    document.getElementById("obsVeiculo").value = veiculo.observacoes || "";

    document.getElementById("tituloFormVeiculo").textContent = `Editando veículo #${id}`;
    document.getElementById("textoSalvarVeiculo").textContent = "Salvar alterações";
    document.getElementById("btnCancelarEdicaoVeiculo").style.display = "inline-flex";

    const message = document.getElementById("veiculoMessage");
    message.style.color = "var(--gold)";
    message.textContent = "Modo edição ativo.";

    focarFormularioVeiculo();
}


function cancelarEdicaoVeiculo(limparMensagem = true){
    veiculoEditandoId = null;

    document.getElementById("tituloFormVeiculo").textContent = "Cadastrar veículo";
    document.getElementById("textoSalvarVeiculo").textContent = "Cadastrar veículo";
    document.getElementById("btnCancelarEdicaoVeiculo").style.display = "none";

    document.getElementById("marcaVeiculo").value = "";
    document.getElementById("modeloVeiculo").value = "";
    document.getElementById("anoVeiculo").value = "";
    document.getElementById("placaVeiculo").value = "";
    document.getElementById("corVeiculo").value = "";
    document.getElementById("potenciaVeiculo").value = "";
    document.getElementById("obsVeiculo").value = "";

    preencherSelectPilotosVeiculo();

    if(limparMensagem){
        document.getElementById("veiculoMessage").textContent = "";
    }
}


async function excluirVeiculo(id){
    const veiculo = veiculosCache.find(item => Number(item.id) === Number(id));

    if(!veiculo){
        rhAlert("Veículo não encontrado.");
        return;
    }

    const confirmar = await rhConfirm(`Deseja realmente excluir o veículo "${formatarVeiculo(veiculo)}"?`);

    if(!confirmar){
        return;
    }

    try{
        await apiDelete(`/veiculos/${id}`);
        await carregarVeiculos();
    }catch(erro){
        rhAlert(erro.message || "Erro ao excluir veículo.");
    }
}


// =======================================================
// BUSCA / RESUMO / VISUALIZAÇÃO
// =======================================================

function filtrarVeiculos(){
    const termo = document.getElementById("buscaVeiculo").value.toLowerCase().trim();

    if(!termo){
        renderizarVeiculos(veiculosCache);
        return;
    }

    const filtrados = veiculosCache.filter(veiculo => {
        const campos = [
            veiculo.id,
            formatarVeiculo(veiculo),
            veiculo.piloto,
            veiculo.placa,
            veiculo.cor,
            veiculo.observacoes
        ].map(campo => String(campo || "").toLowerCase());

        return campos.some(campo => campo.includes(termo));
    });

    renderizarVeiculos(filtrados);
}


function preencherResumoVeiculos(veiculos){
    const pilotosUnicos = new Set(
        veiculos
            .filter(veiculo => veiculo.piloto_id)
            .map(veiculo => Number(veiculo.piloto_id))
    );

    const ultimo = veiculos.length > 0 ? veiculos[veiculos.length - 1] : null;

    setTexto("totalVeiculosPagina", veiculos.length);
    setTexto("totalPilotosComVeiculo", pilotosUnicos.size);
    setTexto("ultimoVeiculoPagina", ultimo ? formatarDataCurta(ultimo.criado_em) : "-");
}


// =======================================================
// VISUALIZAR VEÍCULO
// Abre um modal personalizado com os dados completos do carro.
// Substitui o alert() padrão do navegador.
// =======================================================

function visualizarVeiculo(id){

    const veiculo = veiculosCache.find(item => Number(item.id) === Number(id));

    if(!veiculo){
        rhAlert("Veículo não encontrado.");
        return;
    }

    abrirModalVeiculo(veiculo);

}


// =======================================================
// MODAL DE DETALHES DO VEÍCULO
// Cria o modal dinamicamente no HTML.
// =======================================================

function abrirModalVeiculo(veiculo){

    fecharModalVeiculo();

    const tituloVeiculo = `${veiculo.marca || ""} ${veiculo.modelo || ""}`.trim() || "Veículo";
    const anoVeiculo = veiculo.ano || "-";
    const placaVeiculo = veiculo.placa || "-";
    const corVeiculo = veiculo.cor || "-";
    const pilotoVeiculo = veiculo.piloto || veiculo.nome_piloto || "Não vinculado";
    const potenciaVeiculo = veiculo.potencia ? `${veiculo.potencia} cv` : "Não informada";
    const observacoesVeiculo = veiculo.observacoes || "Nenhuma observação cadastrada.";

    const html = `
        <div class="rh-modal-overlay vehicle-modal-overlay" id="modalVeiculoDetalhes" onclick="fecharModalVeiculoAoClicarFora(event)">
            
            <div class="rh-modal vehicle-modal">

                <div class="vehicle-modal-header">

                    <div>
                        <span class="vehicle-modal-kicker">Veículo #${veiculo.id}</span>
                        <h2>${escapeHTML(tituloVeiculo)}</h2>
                        <p>${escapeHTML(anoVeiculo)} • ${escapeHTML(potenciaVeiculo)}</p>
                    </div>

                    <button class="vehicle-modal-close" onclick="fecharModalVeiculo()">
                        <i class="bi bi-x-lg"></i>
                    </button>

                </div>

                <div class="vehicle-modal-body">

                    <div class="vehicle-hero-icon">
                        <i class="bi bi-car-front-fill"></i>
                    </div>

                    <div class="vehicle-info-grid">

                        <div class="vehicle-info-card">
                            <span>Piloto</span>
                            <strong>${escapeHTML(pilotoVeiculo)}</strong>
                        </div>

                        <div class="vehicle-info-card">
                            <span>Placa</span>
                            <strong>${escapeHTML(placaVeiculo)}</strong>
                        </div>

                        <div class="vehicle-info-card">
                            <span>Cor</span>
                            <strong>${escapeHTML(corVeiculo)}</strong>
                        </div>

                        <div class="vehicle-info-card">
                            <span>Potência</span>
                            <strong>${escapeHTML(potenciaVeiculo)}</strong>
                        </div>

                    </div>

                    <div class="vehicle-observations">
                        <span>Observações</span>
                        <p>${escapeHTML(observacoesVeiculo)}</p>
                    </div>

                </div>

                <div class="vehicle-modal-footer">
                    <button class="btn btn-secondary" onclick="fecharModalVeiculo()">
                        <i class="bi bi-x-circle"></i>
                        Fechar
                    </button>
                </div>

            </div>

        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

}


// =======================================================
// FECHAR MODAL DO VEÍCULO
// Remove o modal da tela.
// =======================================================

function fecharModalVeiculo(){

    const modal = document.getElementById("modalVeiculoDetalhes");

    if(modal){
        modal.remove();
    }

}


// =======================================================
// FECHAR AO CLICAR FORA
// Só fecha se o clique for no fundo escuro.
// =======================================================

function fecharModalVeiculoAoClicarFora(event){

    if(event.target.id === "modalVeiculoDetalhes"){
        fecharModalVeiculo();
    }

}


// =======================================================
// PROTEÇÃO DE TEXTO
// Evita quebrar o HTML caso algum campo tenha caracteres especiais.
// =======================================================

function escapeHTML(valor){

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// Fecha o modal ao apertar ESC.
document.addEventListener("keydown", (event) => {
    if(event.key === "Escape"){
        fecharModalVeiculo();
    }
});


function focarFormularioVeiculo(){
    const form = document.getElementById("formVeiculoBox");
    const input = document.getElementById("marcaVeiculo");

    if(form){
        form.scrollIntoView({
            behavior:"smooth",
            block:"center"
        });
    }

    setTimeout(() => {
        if(input){
            input.focus();
        }
    }, 450);
}
