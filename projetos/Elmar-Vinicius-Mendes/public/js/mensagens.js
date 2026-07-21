const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
let destinatarioAtivo    = null;
let intervaloAtualizacao = null;
let intervaloLista       = null;
let ultimaMensagemId     = 0;

let elListaConversas, elTelaChat, elChatMensagens,
    elInputMensagem, elBtnEnviar, elBtnVoltar, elChatNome, elChatAvatar,
    elHeaderMensagens;

document.addEventListener("DOMContentLoaded", () => {

    elListaConversas  = document.getElementById("lista-conversas");
    elTelaChat        = document.getElementById("tela-chat");
    elChatMensagens   = document.getElementById("chat-mensagens");
    elInputMensagem   = document.getElementById("input-mensagem");
    elBtnEnviar       = document.getElementById("btn-enviar");
    elBtnVoltar       = document.getElementById("btn-voltar");
    elChatNome        = document.getElementById("chat-nome-usuario");
    elChatAvatar      = document.getElementById("chat-avatar");
    elHeaderMensagens = document.getElementById("header-mensagens");

    elBtnEnviar.addEventListener("click", enviarMensagem);
    elBtnVoltar.addEventListener("click", voltarLista);
    elInputMensagem.addEventListener("keydown", (e) => {
        if (e.key === "Enter") enviarMensagem();
    });

    const params   = new URLSearchParams(window.location.search);
    const idDireto = params.get("id");

    if (idDireto) {
        abrirChatPorId(idDireto);
    } else {
        carregarConversas();
        iniciarAtualizacaoLista();
    }
});

async function abrirChatPorId(id) {
    try {
        const resposta = await fetch(`/usuarios/${id}`);
        const usuario  = await resposta.json();
        const username = usuario.username.startsWith("@")
            ? usuario.username.slice(1)
            : usuario.username;
        abrirChat(id, username, usuario.foto_perfil);
    } catch (erro) {
        console.error("Erro ao abrir chat:", erro);
        carregarConversas();
    }
}

async function carregarConversas() {
    if (!usuarioLogado) return;

    try {
        const resposta  = await fetch(`/mensagens/conversas/${usuarioLogado.id}`);
        const conversas = await resposta.json();

        const lista = document.querySelector(".conversas");
        lista.innerHTML = "";

        if (conversas.length === 0) {
            lista.innerHTML = `<li style="color:#9d94b8;text-align:center;padding:2rem;font-size:0.8rem;">Nenhuma conversa ainda</li>`;
            return;
        }

        conversas.forEach(c => {
            const username = c.username.startsWith("@") ? c.username.slice(1) : c.username;
            const item = document.createElement("li");
            item.classList.add("conversa-item");
            item.innerHTML = `
                <div class="conversa-avatar" style="${c.foto_perfil ? `background-image:url(${c.foto_perfil});background-size:cover;background-position:center;` : ''}"></div>
                <div class="conversa-info">
                    <div class="conversa-topo">
                        <span class="conversa-nome">@${username}</span>
                        <span class="conversa-tempo">${formatarTempo(c.criado_em)}</span>
                    </div>
                    <span class="conversa-preview">${c.ultima_mensagem}</span>
                </div>
            `;
            item.addEventListener("click", () => abrirChat(c.id, username, c.foto_perfil));
            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao carregar conversas:", erro);
    }
}

function iniciarAtualizacaoLista() {
    pararAtualizacaoLista();
    intervaloLista = setInterval(() => {
        if (!destinatarioAtivo) carregarConversas();
    }, 5000);
}

function pararAtualizacaoLista() {
    if (intervaloLista) {
        clearInterval(intervaloLista);
        intervaloLista = null;
    }
}

async function abrirChat(id, username, fotoPerfil) {
    pararAtualizacaoLista();
    pararAtualizacaoChat();

    destinatarioAtivo = id;
    ultimaMensagemId  = 0;

    if (elHeaderMensagens && window.innerWidth < 1024) {
        elHeaderMensagens.style.display = "none";
    }
    elTelaChat.style.top = "0";

    elListaConversas.style.display = "none";
    elTelaChat.style.display       = "flex";
    elChatNome.textContent         = "@" + username;

    if (fotoPerfil) {
        elChatAvatar.style.backgroundImage    = `url(${fotoPerfil})`;
        elChatAvatar.style.backgroundSize     = "cover";
        elChatAvatar.style.backgroundPosition = "center";
    } else {
        elChatAvatar.style.backgroundImage = "";
    }

    await carregarMensagens(true);
    iniciarAtualizacaoChat();
    elInputMensagem.focus();
}

async function carregarMensagens(limpar = false) {
    if (!destinatarioAtivo || !usuarioLogado) return;

    try {
        const resposta  = await fetch(`/mensagens/${destinatarioAtivo}?meu_id=${usuarioLogado.id}`);
        const mensagens = await resposta.json();

        if (limpar) elChatMensagens.innerHTML = "";

        mensagens.forEach(m => {
            if (m.id > ultimaMensagemId) {
                const tipo = String(m.remetente_id) === String(usuarioLogado.id) ? "enviada" : "recebida";
                adicionarMensagemNaTela(m.conteudo, tipo);
                ultimaMensagemId = m.id;
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar mensagens:", erro);
    }
}

function iniciarAtualizacaoChat() {
    pararAtualizacaoChat();
    intervaloAtualizacao = setInterval(async () => {
        if (!destinatarioAtivo) return;

        try {
            const resposta  = await fetch(`/mensagens/${destinatarioAtivo}?meu_id=${usuarioLogado.id}`);
            const mensagens = await resposta.json();

            let temNova = false;
            mensagens.forEach(m => {
                if (m.id > ultimaMensagemId) {
                    const tipo = String(m.remetente_id) === String(usuarioLogado.id) ? "enviada" : "recebida";
                    adicionarMensagemNaTela(m.conteudo, tipo);
                    ultimaMensagemId = m.id;
                    temNova = true;
                }
            });

            if (temNova) carregarConversas();

        } catch (erro) {
        }
    }, 2000);
}

function pararAtualizacaoChat() {
    if (intervaloAtualizacao) {
        clearInterval(intervaloAtualizacao);
        intervaloAtualizacao = null;
    }
}

async function enviarMensagem() {
    const texto = elInputMensagem.value.trim();
    if (texto === "" || !destinatarioAtivo || !usuarioLogado) return;

    elInputMensagem.value = "";
    elInputMensagem.focus();

    try {
        const resposta = await fetch("/mensagens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                remetente_id:    usuarioLogado.id,
                destinatario_id: destinatarioAtivo,
                conteudo:        texto
            })
        });

        if (!resposta.ok) throw new Error('Falha ao enviar mensagem');

        const dados = await resposta.json();
        if (dados?.id) ultimaMensagemId = dados.id;

        adicionarMensagemNaTela(texto, "enviada");
        carregarConversas();

    } catch (erro) {
        console.error("Erro ao enviar:", erro);
        elInputMensagem.value = texto;
    }
}

function adicionarMensagemNaTela(texto, tipo) {
    const item = document.createElement("li");
    item.classList.add("msg-item", tipo === "enviada" ? "msg-enviada" : "msg-recebida");
    item.textContent = texto;
    elChatMensagens.appendChild(item);
    elChatMensagens.scrollTop = elChatMensagens.scrollHeight;
}


function voltarLista() {
    pararAtualizacaoChat();
    destinatarioAtivo = null;
    ultimaMensagemId  = 0;

    if (elHeaderMensagens && window.innerWidth < 1024) {
        elHeaderMensagens.style.display = "flex";
    }
    elTelaChat.style.top = "55px";

    elTelaChat.style.display       = "none";
    elListaConversas.style.display = "block";
    history.replaceState(null, "", "mensagens.html");
    carregarConversas();
    iniciarAtualizacaoLista();
}

function formatarTempo(data) {
    const diff = Math.floor((new Date() - new Date(data)) / 60000);
    if (diff < 1)    return "agora";
    if (diff < 60)   return `${diff}min`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
}

window.addEventListener("beforeunload", () => {
    pararAtualizacaoChat();
    pararAtualizacaoLista();
});