/* ===========================================================
   RaceHub v2.0
   MAIN SCRIPT
=========================================================== */

const API_BASE = "";


/* ===========================================================
   STORAGE / USUÁRIO
=========================================================== */

function salvarUsuario(usuario){
    localStorage.setItem("racehub_usuario", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}


function getUsuarioLogado(){
    const usuarioNovo = localStorage.getItem("racehub_usuario");
    const usuarioAntigo = localStorage.getItem("usuarioLogado");

    try{
        return JSON.parse(usuarioNovo || usuarioAntigo);
    }catch{
        return null;
    }
}


function limparSessao(){
    localStorage.removeItem("racehub_usuario");
    localStorage.removeItem("usuarioLogado");
}


function logout(){
    limparSessao();
    window.location.href = "index.html";
}


/* ===========================================================
   LOGIN
=========================================================== */

async function login(event){
    if(event){
        event.preventDefault();
    }

    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const message = document.getElementById("loginMessage");

    if(!emailInput || !senhaInput){
        return;
    }

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if(message){
        message.textContent = "";
    }

    if(!email || !senha){
        if(message){
            message.textContent = "Preencha e-mail e senha.";
        }
        return;
    }

    try{
        const resposta = await fetch(`${API_BASE}/login`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                senha
            })
        });

        const dados = await resposta.json();

        if(!resposta.ok){
            throw new Error(dados.erro || "Usuário ou senha inválidos.");
        }

        salvarUsuario(dados);

        redirecionarPorTipo(dados);

    }catch(erro){
        if(message){
            message.textContent = erro.message || "Erro ao fazer login.";
        }
    }
}


function redirecionarPorTipo(usuario){
    if(!usuario || !usuario.tipo){
        window.location.href = "index.html";
        return;
    }

    if(usuario.tipo === "admin"){
        window.location.href = "admin.html";
        return;
    }

    if(usuario.tipo === "piloto"){
        window.location.href = "piloto.html";
        return;
    }

    if(usuario.tipo === "cliente"){
        window.location.href = "cliente.html";
        return;
    }

    window.location.href = "index.html";
}


/* ===========================================================
   PROTEÇÃO DE ROTAS
=========================================================== */

function requireAuth(tiposPermitidos = []){
    const usuario = getUsuarioLogado();

    if(!usuario){
        window.location.href = "index.html";
        return null;
    }

    if(tiposPermitidos.length > 0 && !tiposPermitidos.includes(usuario.tipo)){
        redirecionarPorTipo(usuario);
        return null;
    }

    return usuario;
}


function bloquearLoginSeAutenticado(){
    const usuario = getUsuarioLogado();

    if(usuario){
        redirecionarPorTipo(usuario);
    }
}


/* ===========================================================
   USUÁRIO NA INTERFACE
=========================================================== */

function getPrimeiroNome(nome){
    if(!nome){
        return "Usuário";
    }

    return nome.trim().split(" ")[0];
}


function getIniciais(nome){
    if(!nome){
        return "RH";
    }

    const partes = nome.trim().split(" ");

    if(partes.length === 1){
        return partes[0].substring(0,2).toUpperCase();
    }

    return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}


function saudacao(){
    const hora = new Date().getHours();

    if(hora < 12){
        return "Bom dia";
    }

    if(hora < 18){
        return "Boa tarde";
    }

    return "Boa noite";
}


function preencherUsuarioLogado(){
    const usuario = getUsuarioLogado();

    if(!usuario){
        return;
    }

    const nomeElements = document.querySelectorAll("[data-user-name]");
    const tipoElements = document.querySelectorAll("[data-user-role]");
    const avatarElements = document.querySelectorAll("[data-user-avatar]");
    const greetingElements = document.querySelectorAll("[data-user-greeting]");

    nomeElements.forEach(elemento => {
        elemento.textContent = usuario.nome || "Usuário";
    });

    tipoElements.forEach(elemento => {
        elemento.textContent = formatarTipoUsuario(usuario.tipo);
    });

    avatarElements.forEach(elemento => {
        // Se o usuário tiver foto de perfil salva, o avatar mostra a imagem.
        // Se não tiver, continua mostrando as iniciais do nome.
        if(usuario.foto_perfil){
            elemento.innerHTML = `<img src="${usuario.foto_perfil}" alt="Foto de perfil">`;
            elemento.classList.add("avatar-com-foto");
        }else{
            elemento.textContent = getIniciais(usuario.nome);
            elemento.classList.remove("avatar-com-foto");
        }
    });

    greetingElements.forEach(elemento => {
        elemento.textContent = `${saudacao()}, ${getPrimeiroNome(usuario.nome)}`;
    });
}


function formatarTipoUsuario(tipo){
    const tipos = {
        admin:"Admin",
        piloto:"Piloto",
        cliente:"Cliente"
    };

    return tipos[tipo] || "Usuário";
}


/* ===========================================================
   API HELPERS
=========================================================== */

async function apiGet(rota){
    const resposta = await fetch(`${API_BASE}${rota}`);

    const dados = await resposta.json();

    if(!resposta.ok){
        throw new Error(dados.erro || "Erro ao buscar dados.");
    }

    return dados;
}


async function apiPost(rota, payload){
    const resposta = await fetch(`${API_BASE}${rota}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(payload)
    });

    const dados = await resposta.json();

    if(!resposta.ok){
        throw new Error(dados.erro || "Erro ao salvar dados.");
    }

    return dados;
}

async function apiPut(rota, payload){
    const resposta = await fetch(`${API_BASE}${rota}`, {
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(payload)
    });

    const dados = await resposta.json();

    if(!resposta.ok){
        throw new Error(dados.erro || "Erro ao atualizar dados.");
    }

    return dados;
}

async function apiDelete(rota){
    const resposta = await fetch(`${API_BASE}${rota}`, {
        method:"DELETE"
    });

    let dados = {};

    try{
        dados = await resposta.json();
    }catch{
        dados = {};
    }

    if(!resposta.ok){
        throw new Error(dados.erro || "Erro ao excluir registro.");
    }

    return dados;
}


/* ===========================================================
   FORMATADORES
=========================================================== */

function formatarData(data){
    if(!data){
        return "-";
    }

    const dataObj = new Date(data);

    if(Number.isNaN(dataObj.getTime())){
        return data;
    }

    return dataObj.toLocaleDateString("pt-BR", {
        day:"2-digit",
        month:"2-digit",
        year:"numeric"
    });
}


function formatarDataCurta(data){
    if(!data){
        return "-";
    }

    const dataObj = new Date(data);

    if(Number.isNaN(dataObj.getTime())){
        return data;
    }

    return dataObj.toLocaleDateString("pt-BR", {
        day:"2-digit",
        month:"short"
    });
}


function formatarHora(hora){
    if(!hora){
        return "-";
    }

    return String(hora).substring(0,5);
}


function formatarTempo(tempo){
    if(!tempo){
        return "-";
    }

    const numero = Number(tempo);

    if(Number.isNaN(numero)){
        return tempo;
    }

    return `${numero.toFixed(3)}s`;
}


function hojeISO(){
    return new Date().toISOString().split("T")[0];
}


/* ===========================================================
   HELPERS DE TELA
=========================================================== */

function setTexto(id, valor){
    const elemento = document.getElementById(id);

    if(elemento){
        elemento.textContent = valor;
    }
}


function setHTML(id, valor){
    const elemento = document.getElementById(id);

    if(elemento){
        elemento.innerHTML = valor;
    }
}


function mostrarErro(containerId, mensagem){
    const container = document.getElementById(containerId);

    if(container){
        container.innerHTML = `
            <div class="alert alert-danger">
                ${mensagem}
            </div>
        `;
    }
}


function mostrarVazio(titulo, texto){
    return `
        <div class="empty">
            <i class="bi bi-inbox"></i>
            <h2>${titulo}</h2>
            <p>${texto}</p>
        </div>
    `;
}


/* ===========================================================
   CADASTRO DE CLIENTE
   Usado depois no cadastro.html
=========================================================== */

async function cadastrarCliente(event){
    if(event){
        event.preventDefault();
    }

    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();
    const message = document.getElementById("cadastroMessage");

    if(message){
        message.textContent = "";
    }

    if(!nome || !email || !senha){
        if(message){
            message.textContent = "Preencha todos os campos.";
        }
        return;
    }

    try{
        await apiPost("/usuarios", {
            nome,
            email,
            senha,
            tipo:"cliente"
        });

        if(message){
            message.style.color = "var(--success)";
            message.textContent = "Conta criada com sucesso. Redirecionando...";
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);

    }catch(erro){
        if(message){
            message.style.color = "var(--danger)";
            message.textContent = erro.message || "Erro ao criar conta.";
        }
    }
}


/* ===========================================================
   NAVEGAÇÃO GLOBAL / PERFIL / VEÍCULOS
   Funções executadas em todas as páginas.
   Elas deixam o sistema mais padronizado:
   - preenchem nome, cargo e avatar do usuário logado;
   - fazem o avatar abrir perfil.html;
   - adicionam links de Perfil e Veículos nas sidebars quando necessário.
=========================================================== */

function ativarAtalhoPerfil(){
    // Procura o bloco do usuário na topbar.
    const blocosUsuario = document.querySelectorAll(".dashboard-user");

    blocosUsuario.forEach(bloco => {
        // Evita registrar o mesmo evento mais de uma vez.
        if(bloco.dataset.perfilAtivado === "true"){
            return;
        }

        bloco.dataset.perfilAtivado = "true";
        bloco.style.cursor = "pointer";
        bloco.title = "Abrir meu perfil";

        // Ao clicar no nome/avatar, abre a página de perfil.
        bloco.addEventListener("click", () => {
            window.location.href = "perfil.html";
        });
    });
}


function garantirLinkSidebar(href, icone, texto){
    // Procura todos os menus laterais do sistema.
    const menus = document.querySelectorAll("nav.menu");

    menus.forEach(menu => {
        // Se o link já existe, não adiciona de novo.
        if(menu.querySelector(`a[href="${href}"]`)){
            return;
        }

        menu.insertAdjacentHTML("beforeend", `
            <a href="${href}">
                <i class="bi ${icone}"></i>
                ${texto}
            </a>
        `);
    });
}


function garantirLinksGlobaisSidebar(){
    const usuario = getUsuarioLogado();

    if(!usuario){
        return;
    }

    // Admin e piloto têm acesso ao cadastro de veículos.
    // Cliente não recebe esse link porque veículo pertence ao piloto.
    if(usuario.tipo === "admin" || usuario.tipo === "piloto"){
        garantirLinkSidebar("veiculos.html", "bi-car-front", "Veículos");
    }

    // A versão 3.0 adiciona uma área social para pilotos e clientes consultarem estatísticas públicas.
    garantirLinkSidebar("social.html", "bi-globe-americas", "Social");

    // Todo usuário logado pode acessar o próprio perfil.
    garantirLinkSidebar("perfil.html", "bi-person-circle", "Perfil");
}


function formatarVeiculo(veiculo){
    // Recebe um objeto de veículo/resultado/inscrição e devolve um nome legível.
    if(!veiculo){
        return "Sem veículo";
    }

    if(typeof veiculo === "string"){
        return veiculo.trim() || "Sem veículo";
    }

    if(veiculo.veiculo){
        return veiculo.veiculo;
    }

    if(veiculo.nome_veiculo){
        return veiculo.nome_veiculo;
    }

    const marca = veiculo.marca || veiculo.veiculo_marca || "";
    const modelo = veiculo.modelo || veiculo.veiculo_modelo || "";
    const ano = veiculo.ano || veiculo.veiculo_ano || "";

    const texto = [marca, modelo, ano]
        .filter(Boolean)
        .join(" ")
        .trim();

    return texto || "Sem veículo";
}




/* ===========================================================
   FUNÇÕES DE CATEGORIA / RANKING
=========================================================== */



function abrirPerfilPublico(pilotoId){
    // Abre o perfil público de um piloto.
    // Essa função é usada nos cards sociais e nos rankings.
    if(!pilotoId){
        rhAlert("Piloto não encontrado.");
        return;
    }

    window.location.href = `piloto-publico.html?id=${pilotoId}`;
}

function montarLinkPiloto(nome, pilotoId){
    // Devolve o HTML do nome do piloto.
    // Se houver ID, o nome fica clicável e abre o perfil público.
    const texto = nome || "Piloto";

    if(!pilotoId){
        return `<span>${texto}</span>`;
    }

    return `
        <button class="link-piloto-publico" type="button" onclick="abrirPerfilPublico(${pilotoId})">
            ${texto}
        </button>
    `;
}

function getCategoriaPotencia(potencia){
    const cv = Number(potencia || 0);

    if(!cv){
        return "Sem potência";
    }

    if(cv <= 150){
        return "Até 150 cv";
    }

    if(cv <= 250){
        return "151 a 250 cv";
    }

    if(cv <= 400){
        return "251 a 400 cv";
    }

    return "Acima de 400 cv";
}

function getClasseRanking(index){
    if(index === 0) return "tempo-ouro";
    if(index === 1) return "tempo-prata";
    if(index === 2) return "tempo-bronze";
    return "tempo-normal";
}

function formatarStatusCorrida(status){
    const mapa = {
        aberta:"Aberta",
        encerrada:"Inscrições encerradas",
        finalizada:"Finalizada",
        cancelada:"Cancelada"
    };

    return mapa[status] || "Aberta";
}


/* ===========================================================
   MODAIS GLOBAIS
   Substituem alert/confirm nas partes novas do sistema.
=========================================================== */

function criarModalRaceHub(){
    if(document.getElementById("racehubModal")){
        return;
    }

    document.body.insertAdjacentHTML("beforeend", `
        <div class="rh-modal-backdrop" id="racehubModal">
            <div class="rh-modal">
                <div class="rh-modal-icon" id="racehubModalIcon">
                    <i class="bi bi-info-circle"></i>
                </div>
                <h2 id="racehubModalTitulo">RaceHub</h2>
                <p id="racehubModalTexto">Mensagem</p>
                <div class="rh-modal-actions" id="racehubModalAcoes"></div>
            </div>
        </div>
    `);
}

function rhAlert(mensagem, titulo = "RaceHub"){
    criarModalRaceHub();

    return new Promise(resolve => {
        const modal = document.getElementById("racehubModal");
        const tituloEl = document.getElementById("racehubModalTitulo");
        const textoEl = document.getElementById("racehubModalTexto");
        const acoesEl = document.getElementById("racehubModalAcoes");

        tituloEl.textContent = titulo;
        textoEl.textContent = mensagem;
        acoesEl.innerHTML = `
            <button class="btn btn-primary" type="button" id="rhModalOk">
                <i class="bi bi-check-circle"></i>
                Entendi
            </button>
        `;

        modal.classList.add("active");

        document.getElementById("rhModalOk").onclick = () => {
            modal.classList.remove("active");
            resolve(true);
        };
    });
}

function rhConfirm(mensagem, titulo = "Confirmar ação"){
    criarModalRaceHub();

    return new Promise(resolve => {
        const modal = document.getElementById("racehubModal");
        const tituloEl = document.getElementById("racehubModalTitulo");
        const textoEl = document.getElementById("racehubModalTexto");
        const acoesEl = document.getElementById("racehubModalAcoes");

        tituloEl.textContent = titulo;
        textoEl.textContent = mensagem;
        acoesEl.innerHTML = `
            <button class="btn btn-secondary" type="button" id="rhModalCancelar">
                Cancelar
            </button>
            <button class="btn btn-primary" type="button" id="rhModalConfirmar">
                <i class="bi bi-check-circle"></i>
                Confirmar
            </button>
        `;

        modal.classList.add("active");

        document.getElementById("rhModalCancelar").onclick = () => {
            modal.classList.remove("active");
            resolve(false);
        };

        document.getElementById("rhModalConfirmar").onclick = () => {
            modal.classList.remove("active");
            resolve(true);
        };
    });
}

function exportarTabelaCSV(idTabela, nomeArquivo = "racehub_export.csv"){
    const tabela = document.getElementById(idTabela);

    if(!tabela){
        rhAlert("Tabela não encontrada para exportação.");
        return;
    }

    const linhas = Array.from(tabela.querySelectorAll("tr"));
    const csv = linhas.map(linha => {
        return Array.from(linha.querySelectorAll("th,td"))
            .map(celula => `"${celula.innerText.replace(/"/g, '""').trim()}"`)
            .join(";");
    }).join("\n");

    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = nomeArquivo;
    link.click();

    URL.revokeObjectURL(url);
}



/* ===========================================================
   NOTIFICAÇÕES INTERNAS
   Cria um pequeno painel informativo nas páginas logadas.
=========================================================== */

async function carregarNotificacoesGlobais(){
    const usuario = getUsuarioLogado();
    const pageHeader = document.querySelector(".page-header");

    if(!usuario || !pageHeader || document.getElementById("notificacoesRaceHub")){
        return;
    }

    try{
        const notificacoes = await apiGet(`/usuarios/${usuario.id}/notificacoes`);

        if(!Array.isArray(notificacoes) || notificacoes.length === 0){
            return;
        }

        pageHeader.insertAdjacentHTML("afterend", `
            <section class="racehub-notifications" id="notificacoesRaceHub">
                <div>
                    <strong><i class="bi bi-bell"></i> Central RaceHub</strong>
                    <p>${notificacoes.slice(0,3).join(" • ")}</p>
                </div>
            </section>
        `);
    }catch{
        // Notificação é recurso complementar. Se falhar, a página segue funcionando.
    }
}

/* ===========================================================
   INIT GLOBAL
   Executa ações comuns depois que o HTML carregou.
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    preencherUsuarioLogado();
    ativarAtalhoPerfil();

    // Algumas páginas montam o menu pelo próprio arquivo JS depois que o script global roda.
    // Por isso chamamos a função mais de uma vez com pequenos atrasos.
    // Assim os links globais, como Social e Perfil, não somem quando uma página recria a sidebar.
    garantirLinksGlobaisSidebar();
    setTimeout(garantirLinksGlobaisSidebar, 50);
    setTimeout(garantirLinksGlobaisSidebar, 250);
    setTimeout(garantirLinksGlobaisSidebar, 700);

    carregarNotificacoesGlobais();
});
