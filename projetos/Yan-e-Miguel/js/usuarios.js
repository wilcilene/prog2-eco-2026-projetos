// =======================================================
// PÁGINA DE USUÁRIOS - RaceHub
// Este arquivo controla cadastro, edição, exclusão,
// listagem, busca e resumo dos usuários.
// =======================================================


// Verifica se o usuário logado é administrador.
// Se não for admin, o requireAuth bloqueia o acesso.
const usuarioAdmin = requireAuth(["admin"]);


// Guarda todos os usuários carregados do banco.
// Isso evita ter que buscar no banco toda vez que for filtrar, editar ou visualizar.
let usuariosCache = [];


// Guarda o ID do usuário que está sendo editado.
// Quando for null, o formulário está no modo cadastro.
let usuarioEditandoId = null;


// Quando a página termina de carregar, busca os usuários no banco.
document.addEventListener("DOMContentLoaded", () => {
    if(usuarioAdmin){
        preencherUsuarioLogado();
        carregarUsuarios();
    }
});


// =======================================================
// BUSCAR USUÁRIOS NO BANCO
// =======================================================

async function carregarUsuarios(){

    try{

        // Atualiza os dados do usuário logado no topo da tela.
        preencherUsuarioLogado();

        // Faz uma requisição GET para a rota /usuarios no backend.
        const usuarios = await apiGet("/usuarios");

        // Garante que usuariosCache sempre será um array.
        usuariosCache = Array.isArray(usuarios) ? usuarios : [];

        // Renderiza a tabela com os usuários carregados.
        renderizarUsuarios(usuariosCache);

        // Atualiza os cards de resumo da página.
        preencherResumoUsuarios(usuariosCache);

    }catch(erro){

        console.error(erro);

        // Caso dê erro na API, mostra uma mensagem dentro da tabela.
        setHTML("listaUsuarios", `
            <tr>
                <td colspan="7">
                    <div class="alert alert-danger">
                        Não foi possível carregar os usuários. Verifique se a rota GET /usuarios existe no server.js.
                    </div>
                </td>
            </tr>
        `);

    }

}


// =======================================================
// CADASTRAR OU EDITAR USUÁRIO
// =======================================================

async function salvarUsuarioAdmin(event){

    // Impede o formulário de recarregar a página.
    event.preventDefault();

    // Captura os valores digitados no formulário.
    const nome = document.getElementById("nomeUsuario").value.trim();
    const email = document.getElementById("emailUsuario").value.trim();
    const senha = document.getElementById("senhaUsuario").value.trim();
    const tipo = document.getElementById("tipoUsuario").value;
    const message = document.getElementById("usuarioMessage");

    // Limpa mensagem anterior.
    message.style.color = "var(--danger)";
    message.textContent = "";

    // Validação básica dos campos obrigatórios.
    if(!nome || !email || !tipo){
        message.textContent = "Preencha nome, e-mail e tipo.";
        return;
    }

    // Quando está cadastrando um novo usuário, a senha é obrigatória.
    if(!usuarioEditandoId && !senha){
        message.textContent = "Preencha a senha do novo usuário.";
        return;
    }

    // Validação simples de tamanho da senha.
    if(senha && senha.length < 3){
        message.textContent = "A senha precisa ter pelo menos 3 caracteres.";
        return;
    }

    // Objeto enviado para o backend.
    // A senha só entra no objeto se o campo foi preenchido.
    const payload = {
        nome,
        email,
        tipo
    };

    if(senha){
        payload.senha = senha;
    }

    try{

        // Se existe usuarioEditandoId, o sistema está no modo edição.
        if(usuarioEditandoId){

            // Atualiza o usuário existente.
            await apiPut(`/usuarios/${usuarioEditandoId}`, payload);

            message.style.color = "var(--success)";
            message.textContent = "Usuário atualizado com sucesso.";

            // Sai do modo edição, mas mantém a mensagem de sucesso.
            cancelarEdicaoUsuario(false);

        }else{

            // Se não existe usuarioEditandoId, cria um novo usuário.
            await apiPost("/usuarios", {
                nome,
                email,
                senha,
                tipo
            });

            message.style.color = "var(--success)";
            message.textContent = "Usuário cadastrado com sucesso.";

            // Limpa o formulário após cadastrar.
            event.target.reset();

        }

        // Atualiza a tabela e os cards depois de salvar.
        await carregarUsuarios();

    }catch(erro){

        message.style.color = "var(--danger)";
        message.textContent = erro.message || "Erro ao salvar usuário.";

    }

}


// =======================================================
// EDITAR USUÁRIO
// =======================================================

function editarUsuario(id){

    // Procura o usuário dentro do cache local.
    const usuario = usuariosCache.find(item => Number(item.id) === Number(id));

    if(!usuario){
        alert("Usuário não encontrado.");
        return;
    }

    // Bloqueia edição dos administradores fixos.
    if(isAdminFixo(usuario)){
        alert("Administradores fixos não podem ser editados.");
        return;
    }

    // Impede o admin de alterar a própria conta enquanto está logado.
    const usuarioLogado = getUsuarioLogado();

    if(usuarioLogado && Number(usuarioLogado.id) === Number(id)){
        alert("Você não pode editar sua própria conta enquanto está logado.");
        return;
    }

    // Ativa o modo edição.
    usuarioEditandoId = id;

    // Preenche o formulário com os dados atuais do usuário.
    document.getElementById("nomeUsuario").value = usuario.nome || "";
    document.getElementById("emailUsuario").value = usuario.email || "";
    document.getElementById("senhaUsuario").value = "";
    document.getElementById("tipoUsuario").value = usuario.tipo || "cliente";

    // Altera os textos para deixar claro que está editando.
    document.getElementById("tituloFormUsuario").textContent = `Editando usuário #${id}`;
    document.getElementById("textoSalvarUsuario").textContent = "Salvar alterações";
    document.getElementById("btnCancelarEdicaoUsuario").style.display = "inline-flex";

    const message = document.getElementById("usuarioMessage");
    message.style.color = "var(--gold)";
    message.textContent = "Modo edição ativo. Deixe a senha em branco para manter a senha atual.";

    // Leva a tela até o formulário.
    focarFormularioUsuario();

}


// =======================================================
// CANCELAR EDIÇÃO
// =======================================================

function cancelarEdicaoUsuario(limparMensagem = true){

    // Volta para o modo cadastro.
    usuarioEditandoId = null;

    // Limpa todos os campos.
    document.getElementById("nomeUsuario").value = "";
    document.getElementById("emailUsuario").value = "";
    document.getElementById("senhaUsuario").value = "";
    document.getElementById("tipoUsuario").value = "cliente";

    // Restaura textos originais do formulário.
    document.getElementById("tituloFormUsuario").textContent = "Cadastrar usuário";
    document.getElementById("textoSalvarUsuario").textContent = "Cadastrar usuário";
    document.getElementById("btnCancelarEdicaoUsuario").style.display = "none";

    // Limpa a mensagem somente quando solicitado.
    if(limparMensagem){
        document.getElementById("usuarioMessage").textContent = "";
    }

}


// =======================================================
// EXCLUIR USUÁRIO
// =======================================================

async function excluirUsuario(id, nome){

    const usuario = usuariosCache.find(item => Number(item.id) === Number(id));

    if(!usuario){
        alert("Usuário não encontrado.");
        return;
    }

    // Impede a exclusão dos admins fixos.
    if(isAdminFixo(usuario)){
        alert("Este administrador é fixo e não pode ser excluído.");
        return;
    }

    // Impede o usuário logado de apagar a própria conta.
    const usuarioLogado = getUsuarioLogado();

    if(usuarioLogado && Number(usuarioLogado.id) === Number(id)){
        alert("Você não pode excluir sua própria conta enquanto está logado.");
        return;
    }

    const confirmar = confirm(`Deseja realmente excluir o usuário "${nome}"?`);

    if(!confirmar){
        return;
    }

    try{

        // Chama a rota DELETE /usuarios/:id.
        await apiDelete(`/usuarios/${id}`);

        // Recarrega a tabela após excluir.
        await carregarUsuarios();

    }catch(erro){

        alert(erro.message || "Erro ao excluir usuário.");

    }

}


// =======================================================
// ALTERAR TIPO RAPIDAMENTE PELA TABELA
// =======================================================

async function alterarTipoUsuario(id, novoTipo){

    const usuario = usuariosCache.find(item => Number(item.id) === Number(id));

    if(!usuario){
        alert("Usuário não encontrado.");
        await carregarUsuarios();
        return;
    }

    // Bloqueia alteração dos admins fixos.
    if(isAdminFixo(usuario)){
        alert("Admin fixo não pode ter o tipo alterado.");
        await carregarUsuarios();
        return;
    }

    // Impede o usuário logado de alterar a própria permissão.
    const usuarioLogado = getUsuarioLogado();

    if(usuarioLogado && Number(usuarioLogado.id) === Number(id)){
        alert("Você não pode alterar o tipo da própria conta enquanto está logado.");
        await carregarUsuarios();
        return;
    }

    const tipoAntigo = usuario.tipo;

    if(tipoAntigo === novoTipo){
        return;
    }

    const confirmar = confirm(
        `Deseja alterar "${usuario.nome}" de ${formatarTipoUsuario(tipoAntigo)} para ${formatarTipoUsuario(novoTipo)}?`
    );

    if(!confirmar){
        await carregarUsuarios();
        return;
    }

    try{

        // Usa a rota específica de alteração de tipo.
        await apiPut(`/usuarios/${id}/tipo`, {
            tipo: novoTipo
        });

        await carregarUsuarios();

    }catch(erro){

        alert(erro.message || "Erro ao alterar tipo do usuário.");

        await carregarUsuarios();

    }

}


// =======================================================
// RENDERIZAR TABELA
// =======================================================

function renderizarUsuarios(usuarios){

    if(!usuarios || usuarios.length === 0){

        setHTML("listaUsuarios", `
            <tr>
                <td colspan="7">
                    ${mostrarVazio(
                        "Nenhum usuário cadastrado",
                        "Os usuários do sistema aparecerão nesta tabela."
                    )}
                </td>
            </tr>
        `);

        return;

    }

    // Gera uma linha da tabela para cada usuário.
    const html = usuarios.map(usuario => {

        const adminFixo = isAdminFixo(usuario);

        return `
            <tr>
                <td>
                    <span class="table-number">#${usuario.id}</span>
                </td>

                <td>
                    <strong style="color:white;">${usuario.nome || "-"}</strong>
                    ${adminFixo ? `<p style="margin-top:4px;color:var(--gold);">Admin fixo</p>` : ""}
                </td>

                <td>${usuario.email || "-"}</td>

                <td>
                    ${
                        adminFixo 
                        ? badgeTipoUsuario(usuario.tipo) 
                        : `
                            <select 
                                class="input select-tipo-usuario" 
                                onchange="alterarTipoUsuario(${usuario.id}, this.value)"
                            >
                                <option value="cliente" ${usuario.tipo === "cliente" ? "selected" : ""}>Cliente</option>
                                <option value="piloto" ${usuario.tipo === "piloto" ? "selected" : ""}>Piloto</option>
                                <option value="admin" ${usuario.tipo === "admin" ? "selected" : ""}>Admin</option>
                            </select>
                        `
                    }
                </td>

                <td>
                    <span class="status status-success">Ativo</span>
                </td>

                <td>${formatarData(usuario.criado_em)}</td>

                <td>
                    <div class="table-actions">

                        <button 
                            class="action-btn" 
                            title="Visualizar usuário"
                            onclick="visualizarUsuario(${usuario.id})"
                        >
                            <i class="bi bi-eye"></i>
                        </button>

                        ${
                            adminFixo 
                            ? `
                                <span class="badge badge-warning">Protegido</span>
                            `
                            : `
                                <button 
                                    class="action-btn action-edit" 
                                    title="Editar usuário"
                                    onclick="editarUsuario(${usuario.id})"
                                >
                                    <i class="bi bi-pencil-square"></i>
                                </button>

                                <button 
                                    class="action-btn action-danger" 
                                    title="Excluir usuário"
                                    onclick="excluirUsuario(${usuario.id}, '${String(usuario.nome || "Usuário").replace(/'/g, "")}')"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>
                            `
                        }

                    </div>
                </td>
            </tr>
        `;

    }).join("");

    setHTML("listaUsuarios", html);

}


// =======================================================
// FILTRO DE BUSCA
// =======================================================

function filtrarUsuarios(){

    const termo = document.getElementById("buscaUsuario").value
        .toLowerCase()
        .trim();

    // Se o campo estiver vazio, mostra todos os usuários.
    if(!termo){
        renderizarUsuarios(usuariosCache);
        return;
    }

    // Filtra por ID, nome, e-mail ou tipo.
    const filtrados = usuariosCache.filter(usuario => {

        const campos = [
            usuario.id,
            usuario.nome,
            usuario.email,
            usuario.tipo
        ].map(campo => String(campo || "").toLowerCase());

        return campos.some(campo => campo.includes(termo));

    });

    renderizarUsuarios(filtrados);

}


// =======================================================
// CARDS DE RESUMO
// =======================================================

function preencherResumoUsuarios(usuarios){

    const admins = usuarios.filter(usuario => usuario.tipo === "admin");
    const pilotos = usuarios.filter(usuario => usuario.tipo === "piloto");
    const clientes = usuarios.filter(usuario => usuario.tipo === "cliente");

    setTexto("totalUsuariosPagina", usuarios.length);
    setTexto("totalAdminsPagina", admins.length);
    setTexto("totalPilotosUsuarios", pilotos.length);
    setTexto("totalClientesPagina", clientes.length);

}


// =======================================================
// BADGE DO TIPO DO USUÁRIO
// =======================================================

function badgeTipoUsuario(tipo){

    if(tipo === "admin"){
        return `<span class="badge badge-danger">Admin</span>`;
    }

    if(tipo === "piloto"){
        return `<span class="badge badge-warning">Piloto</span>`;
    }

    if(tipo === "cliente"){
        return `<span class="badge badge-success">Cliente</span>`;
    }

    return `<span class="badge">Usuário</span>`;

}


// =======================================================
// VERIFICAR ADMINISTRADORES FIXOS
// =======================================================

function isAdminFixo(usuarioOuId){

    // Aceita tanto um objeto usuário quanto apenas o ID.
    const id = typeof usuarioOuId === "object"
        ? Number(usuarioOuId.id)
        : Number(usuarioOuId);

    const email = typeof usuarioOuId === "object"
        ? usuarioOuId.email
        : "";

    // Estes usuários são protegidos para evitar que o sistema fique sem administrador.
    const emailsAdminsFixos = [
        "yanaugustoscholze@gmail.com",
        "miguel@racehub.com"
    ];

    return (
        id === 1 ||
        id === 2 ||
        emailsAdminsFixos.includes(email)
    );

}


// =======================================================
// FOCO NO FORMULÁRIO
// =======================================================

function focarFormularioUsuario(){

    const form = document.getElementById("formUsuarioBox");
    const input = document.getElementById("nomeUsuario");

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


// =======================================================
// VISUALIZAR USUÁRIO
// =======================================================

function visualizarUsuario(id){

    const usuario = usuariosCache.find(item => Number(item.id) === Number(id));

    if(!usuario){
        return;
    }

    alert(
        `Usuário #${usuario.id}\n` +
        `Nome: ${usuario.nome || "-"}\n` +
        `E-mail: ${usuario.email || "-"}\n` +
        `Tipo: ${formatarTipoUsuario(usuario.tipo)}\n` +
        `Criado em: ${formatarData(usuario.criado_em)}`
    );

}