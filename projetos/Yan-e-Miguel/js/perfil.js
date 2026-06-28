// =======================================================
// PÁGINA DE PERFIL - RaceHub
// Este arquivo controla a exibição e atualização
// dos dados pessoais do usuário logado.
// =======================================================


// Permite acesso para qualquer usuário logado.
// Admin, piloto e cliente podem acessar o próprio perfil.
const usuarioPerfil = requireAuth();


// Guarda os dados atualizados do perfil.
let perfilAtual = null;

// Guarda os veículos pertencentes ao usuário logado.
// Normalmente essa lista será usada quando o usuário for piloto.
let veiculosPerfilCache = [];

// Guarda temporariamente a nova foto escolhida antes de salvar.
let fotoPerfilSelecionada = null;


// Quando a página terminar de carregar, inicia o perfil.
document.addEventListener("DOMContentLoaded", () => {
    if(usuarioPerfil){
        preencherUsuarioLogado();
        configurarEventosPerfil();
        montarMenuPerfil();
        carregarPerfil();
    }
});


// =======================================================
// CONFIGURAR EVENTOS DA PÁGINA
// =======================================================

function configurarEventosPerfil(){

    // Captura o formulário de perfil.
    const formPerfil = document.getElementById("formPerfil");

    // Quando o formulário for enviado, chama a função salvarPerfil.
    if(formPerfil){
        formPerfil.addEventListener("submit", salvarPerfil);
    }

    // Botão para restaurar os dados originais no formulário.
    const btnResetPerfil = document.getElementById("btnResetPerfil");

    if(btnResetPerfil){
        btnResetPerfil.addEventListener("click", preencherFormularioPerfil);
    }

    // Botão para voltar ao painel correto conforme o tipo do usuário.
    const btnVoltarPainel = document.getElementById("btnVoltarPainel");

    if(btnVoltarPainel){
        btnVoltarPainel.addEventListener("click", () => {
            window.location.href = getPaginaInicialPorTipo(usuarioPerfil.tipo);
        });
    }

    const inputFoto = document.getElementById("perfilFoto");

    if(inputFoto){
        inputFoto.addEventListener("change", converterFotoPerfil);
    }

}


// =======================================================
// MONTAR MENU CONFORME O TIPO DE USUÁRIO
// =======================================================

function montarMenuPerfil(){

    const menu = document.getElementById("menuPerfil");

    if(!menu){
        return;
    }

    // Menu base: todo usuário tem acesso ao perfil.
    let html = `
        <a href="perfil.html" class="active">
            <i class="bi bi-person-circle"></i>
            Perfil
        </a>
    `;

    // Se for admin, mostra atalhos administrativos.
    if(usuarioPerfil.tipo === "admin"){
        html += `
            <a href="admin.html">
                <i class="bi bi-grid-1x2-fill"></i>
                Dashboard
            </a>

            <a href="usuarios.html">
                <i class="bi bi-people"></i>
                Usuários
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

            <a href="tempos.html">
                <i class="bi bi-stopwatch"></i>
                Tempos
            </a>

            <a href="relatorios.html">
                <i class="bi bi-bar-chart"></i>
                Relatórios
            </a>
        `;
    }

    // Se for piloto, mostra atalhos voltados ao piloto.
    if(usuarioPerfil.tipo === "piloto"){
        html += `
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

            <a href="tempos.html">
                <i class="bi bi-stopwatch"></i>
                Tempos
            </a>

            <a href="relatorios.html">
                <i class="bi bi-bar-chart"></i>
                Relatórios
            </a>
        `;
    }

    // Se for cliente, mostra atalhos voltados ao cliente.
    if(usuarioPerfil.tipo === "cliente"){
        html += `
            <a href="cliente.html">
                <i class="bi bi-house"></i>
                Dashboard
            </a>

            <a href="agenda.html">
                <i class="bi bi-calendar-plus"></i>
                Agendar pista
            </a>

            <a href="corridas.html">
                <i class="bi bi-flag"></i>
                Corridas
            </a>
        `;
    }

    menu.innerHTML = html;

}


// =======================================================
// CARREGAR PERFIL DO BANCO
// =======================================================

async function carregarPerfil(){

    const message = document.getElementById("perfilMessage");

    try{

        // Busca os dados atualizados no backend.
        const usuario = await apiGet(`/usuarios/${usuarioPerfil.id}`);

        perfilAtual = usuario;

        // Busca os veículos vinculados ao usuário.
        // Se ele não for piloto ou não tiver carro, a API apenas retorna uma lista vazia.
        veiculosPerfilCache = await buscarVeiculosPerfil(usuario.id);

        // Atualiza os dados salvos no localStorage.
        salvarUsuario(usuario);

        // Preenche dados visuais, formulário, topbar e lista de veículos.
        preencherUsuarioLogado();
        preencherResumoPerfil();
        preencherFormularioPerfil();
        renderizarVeiculosPerfil();

    }catch(erro){

        console.error(erro);

        if(message){
            message.style.color = "var(--danger)";
            message.textContent = erro.message || "Erro ao carregar perfil.";
        }

    }

}


// =======================================================
// PREENCHER FORMULÁRIO
// =======================================================

function preencherFormularioPerfil(){

    if(!perfilAtual){
        return;
    }

    // Preenche os campos do formulário com os dados atuais.
    document.getElementById("perfilNome").value = perfilAtual.nome || "";
    document.getElementById("perfilEmail").value = perfilAtual.email || "";

    // Campo de senha sempre fica vazio por segurança.
    document.getElementById("perfilSenha").value = "";
    document.getElementById("perfilConfirmarSenha").value = "";
    if(document.getElementById("perfilFoto")){
        document.getElementById("perfilFoto").value = "";
    }
    fotoPerfilSelecionada = null;

    const emailInput = document.getElementById("perfilEmail");
    const emailAviso = document.getElementById("perfilEmailAviso");

    // Administradores fixos não podem alterar e-mail.
    if(isAdminFixoPerfil(perfilAtual)){
        emailInput.readOnly = true;
        emailInput.style.opacity = ".65";

        if(emailAviso){
            emailAviso.style.display = "block";
        }
    }else{
        emailInput.readOnly = false;
        emailInput.style.opacity = "1";

        if(emailAviso){
            emailAviso.style.display = "none";
        }
    }

}


// =======================================================
// PREENCHER RESUMO VISUAL DO PERFIL
// =======================================================

function preencherResumoPerfil(){

    if(!perfilAtual){
        return;
    }

    const iniciais = getIniciais(perfilAtual.nome);

    // Card lateral. Se tiver foto, mostra imagem; senão mostra iniciais.
    const avatar = document.getElementById("perfilAvatar");
    if(avatar){
        if(perfilAtual.foto_perfil){
            avatar.innerHTML = `<img src="${perfilAtual.foto_perfil}" alt="Foto de perfil">`;
            avatar.classList.add("avatar-com-foto");
        }else{
            avatar.textContent = iniciais;
            avatar.classList.remove("avatar-com-foto");
        }
    }
    setTexto("perfilNomeAtual", perfilAtual.nome || "Usuário");
    setTexto("perfilEmailAtual", perfilAtual.email || "-");

    // Cards de cima.
    // O primeiro card agora mostra quantos veículos o usuário possui.
    setTexto("perfilTotalVeiculos", veiculosPerfilCache.length);
    setTexto("perfilTipo", formatarTipoUsuario(perfilAtual.tipo));
    setTexto("perfilCriadoEm", formatarDataCurta(perfilAtual.criado_em));

    // Preenche a lista pequena de veículos dentro do card superior.
    setHTML("perfilMiniListaVeiculos", montarMiniListaVeiculosPerfil());

    // Badge do tipo.
    const badge = document.getElementById("perfilBadgeTipo");

    if(badge){
        badge.outerHTML = getBadgePerfil(perfilAtual.tipo);
    }

}


// =======================================================
// VEÍCULOS NO PERFIL
// =======================================================

async function buscarVeiculosPerfil(usuarioId){

    try{
        const veiculos = await apiGet(`/pilotos/${usuarioId}/veiculos`);
        return Array.isArray(veiculos) ? veiculos : [];
    }catch{
        // Se a rota falhar ou o usuário não tiver veículos, mantém a página funcionando.
        return [];
    }

}

function montarMiniListaVeiculosPerfil(){

    if(veiculosPerfilCache.length === 0){
        return "Nenhum veículo cadastrado.";
    }

    // Mostra no card apenas os 2 primeiros veículos para não poluir o layout.
    const miniLista = veiculosPerfilCache
        .slice(0, 2)
        .map(veiculo => `<span>${formatarVeiculo(veiculo)}</span>`)
        .join("");

    const restante = veiculosPerfilCache.length > 2
        ? `<small>+${veiculosPerfilCache.length - 2} outro(s)</small>`
        : "";

    return miniLista + restante;

}

function renderizarVeiculosPerfil(){

    if(veiculosPerfilCache.length === 0){
        setHTML("perfilListaVeiculos", `
            <div class="perfil-veiculo-vazio">
                Nenhum veículo cadastrado para este usuário.
            </div>
        `);
        return;
    }

    const html = veiculosPerfilCache.map(veiculo => `
        <div class="perfil-veiculo-item">
            <div>
                <strong>${formatarVeiculo(veiculo)}</strong>
                <p>${veiculo.placa || "Sem placa"} ${veiculo.cor ? "• " + veiculo.cor : ""}</p>
            </div>

            <i class="bi bi-car-front"></i>
        </div>
    `).join("");

    setHTML("perfilListaVeiculos", html);

}




// =======================================================
// FOTO DE PERFIL
// =======================================================

function converterFotoPerfil(event){
    const arquivo = event.target.files[0];

    if(!arquivo){
        fotoPerfilSelecionada = null;
        return;
    }

    if(!arquivo.type.startsWith("image/")){
        rhAlert("Selecione um arquivo de imagem válido.");
        event.target.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
        fotoPerfilSelecionada = leitor.result;

        const avatar = document.getElementById("perfilAvatar");
        if(avatar){
            avatar.innerHTML = `<img src="${fotoPerfilSelecionada}" alt="Foto de perfil">`;
            avatar.classList.add("avatar-com-foto");
        }
    };

    leitor.readAsDataURL(arquivo);
}

// =======================================================
// SALVAR ALTERAÇÕES DO PERFIL
// =======================================================

async function salvarPerfil(event){

    event.preventDefault();

    const nome = document.getElementById("perfilNome").value.trim();
    const email = document.getElementById("perfilEmail").value.trim();
    const senha = document.getElementById("perfilSenha").value.trim();
    const confirmarSenha = document.getElementById("perfilConfirmarSenha").value.trim();
    const message = document.getElementById("perfilMessage");

    message.style.color = "var(--danger)";
    message.textContent = "";

    // Valida nome e e-mail.
    if(!nome || !email){
        message.textContent = "Preencha nome e e-mail.";
        return;
    }

    // Se o usuário digitou uma senha, exige confirmação igual.
    if(senha || confirmarSenha){

        if(senha.length < 3){
            message.textContent = "A nova senha precisa ter pelo menos 3 caracteres.";
            return;
        }

        if(senha !== confirmarSenha){
            message.textContent = "As senhas não conferem.";
            return;
        }

    }

    const payload = {
        nome,
        email
    };

    if(fotoPerfilSelecionada){
        payload.foto_perfil = fotoPerfilSelecionada;
    }

    // Só envia senha se o usuário realmente quiser trocar.
    if(senha){
        payload.senha = senha;
    }

    try{

        // Atualiza o perfil no backend.
        const usuarioAtualizado = await apiPut(`/usuarios/${perfilAtual.id}/perfil`, payload);

        // Mantém informações que podem não voltar completas da API.
        perfilAtual = {
            ...perfilAtual,
            ...usuarioAtualizado
        };

        // Atualiza o usuário salvo no navegador.
        salvarUsuario(perfilAtual);

        // Atualiza visualmente a página.
        preencherUsuarioLogado();
        preencherResumoPerfil();
        preencherFormularioPerfil();

        message.style.color = "var(--success)";
        message.textContent = "Perfil atualizado com sucesso.";

    }catch(erro){

        message.style.color = "var(--danger)";
        message.textContent = erro.message || "Erro ao atualizar perfil.";

    }

}


// =======================================================
// DESCOBRIR PÁGINA INICIAL PELO TIPO
// =======================================================

function getPaginaInicialPorTipo(tipo){

    if(tipo === "admin"){
        return "admin.html";
    }

    if(tipo === "piloto"){
        return "piloto.html";
    }

    if(tipo === "cliente"){
        return "cliente.html";
    }

    return "index.html";

}


// =======================================================
// BADGE DO PERFIL
// =======================================================

function getBadgePerfil(tipo){

    if(tipo === "admin"){
        return `<span id="perfilBadgeTipo" class="badge badge-danger">Admin</span>`;
    }

    if(tipo === "piloto"){
        return `<span id="perfilBadgeTipo" class="badge badge-warning">Piloto</span>`;
    }

    return `<span id="perfilBadgeTipo" class="badge badge-success">Cliente</span>`;

}


// =======================================================
// VERIFICAR ADMINISTRADOR FIXO
// =======================================================

function isAdminFixoPerfil(usuario){

    if(!usuario){
        return false;
    }

    const emailsAdminsFixos = [
        "yanaugustoscholze@gmail.com",
        "miguel@racehub.com"
    ];

    return (
        Number(usuario.id) === 1 ||
        Number(usuario.id) === 2 ||
        emailsAdminsFixos.includes(usuario.email)
    );

}