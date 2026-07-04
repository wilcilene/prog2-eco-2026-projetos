const botaoPostar   = document.getElementById("btn-postar");
const botaoAnexar   = document.getElementById("btn-anexar");
const textarea      = document.getElementById("itexto");
const publicacoes   = document.querySelector(".publicacoes");
const inputImagem   = document.getElementById("input-imagem");
const previewImagem = document.getElementById("preview-imagem");

const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
let imagemSelecionada = "";

const avatarCriar = document.querySelector(".Avatar");
if (avatarCriar) {
    if (usuarioLogado?.foto_perfil) {
        avatarCriar.style.backgroundImage    = `url(${usuarioLogado.foto_perfil})`;
        avatarCriar.style.backgroundSize     = "cover";
        avatarCriar.style.backgroundPosition = "center";
        avatarCriar.innerHTML = "";
    } else {
        avatarCriar.innerHTML = `<i class="fa-solid fa-user-astronaut"></i>`;
    }
}

function tempoRelativo(dataStr) {
    const agora = new Date();
    const data  = new Date(dataStr);
    const diff  = Math.floor((agora - data) / 1000);

    if (diff < 60)         return "agora";
    if (diff < 3600)       return `${Math.floor(diff / 60)}min`;
    if (diff < 86400)      return `${Math.floor(diff / 3600)}h`;
    if (diff < 86400 * 7)  return `${Math.floor(diff / 86400)}d`;
    if (diff < 86400 * 30) return `${Math.floor(diff / (86400 * 7))}sem`;

    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function badgeVerificado(verificado) {
    if (!verificado) return "";
    return `<i class="fa-solid fa-circle-check badge-verificado" title="Verificado"></i>`;
}

botaoAnexar.addEventListener("click", () => inputImagem.click());

inputImagem.addEventListener("change", () => {
    const arquivo = inputImagem.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = (e) => {
        imagemSelecionada = e.target.result;
        previewImagem.innerHTML = `<img src="${imagemSelecionada}">`;
    };
    leitor.readAsDataURL(arquivo);
});

botaoPostar.addEventListener("click", async () => {
    if (textarea.value.trim() === "" && imagemSelecionada === "") return;
    if (!usuarioLogado) { window.location.href = "/index.html"; return; }

    botaoPostar.textContent = "...";
    botaoPostar.disabled    = true;

    try {
        const resposta = await fetch("/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuarioLogado.id,
                conteudo:   textarea.value,
                imagem:     imagemSelecionada || null
            })
        });

        if (resposta.ok) {
            textarea.value          = "";
            imagemSelecionada       = "";
            inputImagem.value       = "";
            previewImagem.innerHTML = "";
            document.activeElement.blur();
            carregarPosts();
        }
    } catch (erro) {
        console.error("Erro ao postar:", erro);
    } finally {
        botaoPostar.textContent = "Postar";
        botaoPostar.disabled    = false;
    }
});

async function carregarPosts() {
    try {
        const viewerId = usuarioLogado?.id || 0;
        const resposta = await fetch(`/posts?viewer_id=${viewerId}`);
        const posts    = await resposta.json();

        publicacoes.innerHTML = "";
        _postCardIndex = 0;

        if (posts.length === 0) {
            publicacoes.innerHTML = `
                <li class="feed-vazio">
                    <i class="fa-solid fa-satellite-dish"></i>
                    <p>Nenhuma transmissão ainda.<br>Seja o primeiro a postar.</p>
                </li>`;
            return;
        }

        posts.forEach(renderizarPost);
    } catch (erro) {
        console.error("Erro ao carregar posts:", erro);
    }
}

let _postCardIndex = 0;

function renderizarPost(post) {
    const cardId = `card-${++_postCardIndex}`;

    const item = document.createElement("li");
    item.classList.add("post");
    item.dataset.cardId = cardId;
    item.dataset.postId = post.id;

    const labelRepost = post.repostado_por
        ? `<div class="repost-label">
               <i class="fa-solid fa-retweet"></i>
               <span>${post.repostado_por.startsWith("@") ? post.repostado_por : "@" + post.repostado_por} repostou</span>
           </div>`
        : "";

    const tempo    = tempoRelativo(post.criado_em);
    const username = post.username.startsWith("@") ? post.username : `@${post.username}`;
    const badge    = badgeVerificado(post.verificado);

    const jaCurtiu   = parseInt(post.ja_curtiu)   > 0;
    const jaRepostou = parseInt(post.ja_repostou) > 0;

    const ehDono = usuarioLogado && String(post.usuario_id) === String(usuarioLogado.id);
    const menuHtml = ehDono
        ? `<div class="post-menu-wrap">
               <button class="btn-post-menu" title="Opções">
                   <i class="fa-solid fa-ellipsis"></i>
               </button>
               <div class="post-dropdown">
                   <button class="btn-deletar">
                       <i class="fa-solid fa-trash"></i> Excluir post
                   </button>
               </div>
           </div>`
        : "";

    const avatarStyle = post.foto_perfil
        ? `background-image:url(${post.foto_perfil});background-size:cover;background-position:center;`
        : "";
    const avatarIcon = post.foto_perfil ? "" : `<i class="fa-solid fa-user-astronaut"></i>`;

    item.innerHTML = `
        ${labelRepost}
        ${menuHtml}
        <div class="post-avatar link-perfil" data-uid="${post.usuario_id}" style="${avatarStyle}">${avatarIcon}</div>
        <div class="post-topo">
            <h3 class="post-usuario link-perfil" data-uid="${post.usuario_id}">
                ${username} ${badge}
            </h3>
            <span class="post-tempo" title="${new Date(post.criado_em).toLocaleString("pt-BR")}">${tempo}</span>
        </div>
        <div class="post-conteudo">${post.conteudo}</div>
        ${post.imagem ? `<img src="${post.imagem}" class="post-imagem">` : ""}

        <div class="post-acoes">
            <button class="icone-btn btn-like ${jaCurtiu ? 'curtido' : ''}" data-id="${post.id}" title="Curtir">
                <i class="fa-regular fa-heart"></i>
                <span class="contagem-likes-txt">${post.total_likes || 0}</span>
            </button>
            <button class="icone-btn btn-comentar" data-id="${post.id}" data-card="${cardId}" title="Comentar">
                <i class="fa-regular fa-comment"></i>
                <span class="contagem-comentarios-txt">${post.total_comentarios || 0}</span>
            </button>
            <button class="icone-btn btn-repost ${jaRepostou ? 'repostado' : ''}" data-id="${post.id}" title="Repostar">
                <i class="fa-solid fa-retweet"></i>
                <span class="contagem-reposts-txt">${post.total_reposts || 0}</span>
            </button>
        </div>

        <div class="secao-comentarios" data-card="${cardId}" style="display:none;">
            <div class="comentario-input-area">
                <div class="comentario-avatar">${usuarioLogado?.foto_perfil ? "" : '<i class="fa-solid fa-user-astronaut"></i>'}</div>
                <input type="text" class="input-comentario" placeholder="Escreva um comentário..." data-post-id="${post.id}">
                <button class="btn-enviar-comentario" data-post-id="${post.id}">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
            <ul class="lista-comentarios"></ul>
        </div>
    `;

    if (usuarioLogado?.foto_perfil) {
        const ca = item.querySelector(".comentario-avatar");
        ca.style.backgroundImage    = `url(${usuarioLogado.foto_perfil})`;
        ca.style.backgroundSize     = "cover";
        ca.style.backgroundPosition = "center";
        ca.innerHTML = "";
    }

    if (jaRepostou) {
        const btnRepostEl = item.querySelector(".btn-repost");
        btnRepostEl.querySelector("i").style.color                     = "var(--neon-ciano)";
        btnRepostEl.querySelector(".contagem-reposts-txt").style.color = "var(--neon-ciano)";
    }

    item.querySelectorAll(".post-avatar, .link-perfil").forEach(el => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
            window.location.href = `perfil.html?id=${el.dataset.uid}`;
        });
    });

    item.querySelector(".btn-like").addEventListener("click",     toggleLike);
    item.querySelector(".btn-comentar").addEventListener("click", toggleComentarios);
    item.querySelector(".btn-repost").addEventListener("click",   toggleRepost);

    if (ehDono) {
        const btnMenu   = item.querySelector(".btn-post-menu");
        const dropdown  = item.querySelector(".post-dropdown");
        const btnDelete = item.querySelector(".btn-deletar");

        btnMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("aberto");
        });

        btnDelete.addEventListener("click", () => deletarPost(post.id, item));
        document.addEventListener("click", () => dropdown.classList.remove("aberto"), { once: true });
    }

    const inputComentario     = item.querySelector(".input-comentario");
    const btnEnviarComentario = item.querySelector(".btn-enviar-comentario");
    btnEnviarComentario.addEventListener("click", () => enviarComentario(post.id, inputComentario, item));
    inputComentario.addEventListener("keydown", (e) => {
        if (e.key === "Enter") enviarComentario(post.id, inputComentario, item);
    });

    publicacoes.appendChild(item);
}

async function deletarPost(post_id, itemEl) {
    if (!confirm("Excluir esta transmissão?")) return;

    try {
        const resposta = await fetch(`/posts/${post_id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioLogado.id })
        });

        if (resposta.ok) {
            itemEl.style.transition = "opacity 0.3s, transform 0.3s";
            itemEl.style.opacity    = "0";
            itemEl.style.transform  = "scale(0.97)";
            setTimeout(() => itemEl.remove(), 300);
        }
    } catch (erro) {
        console.error("Erro ao deletar:", erro);
    }
}

async function toggleLike(e) {
    if (!usuarioLogado) return;
    const btn      = e.currentTarget;
    const post_id  = btn.dataset.id;
    const span     = btn.querySelector(".contagem-likes-txt");
    const jaCurtiu = btn.classList.contains("curtido");

    try {
        const resposta = await fetch("/likes", {
            method: jaCurtiu ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id, usuario_id: usuarioLogado.id })
        });

        if (!resposta.ok) throw new Error('Falha ao atualizar like');

        const { total } = await resposta.json();
        if (span) span.textContent = total;

        if (jaCurtiu) {
            btn.classList.remove("curtido");
        } else {
            btn.classList.add("curtido");
        }

    } catch (erro) {
        console.error("Erro ao curtir:", erro);
    }
}

async function toggleComentarios(e) {
    const btn      = e.currentTarget;
    const post_id  = btn.dataset.id;
    const cardId   = btn.dataset.card;
    const postCard = btn.closest(".post");
    const secao    = postCard.querySelector(`.secao-comentarios[data-card="${cardId}"]`);

    if (!secao) return;

    const aberta = secao.style.display === "block";
    const icon   = btn.querySelector("i");
    const span   = btn.querySelector(".contagem-comentarios-txt");

    if (aberta) {
        secao.style.display = "none";
        btn.classList.remove("comentario-ativo");
        if (icon) icon.style.color = "";
        if (span) span.style.color = "";
        return;
    }

    secao.style.display = "block";
    btn.classList.add("comentario-ativo");
    if (icon) icon.style.color = "var(--neon-ciano)";
    if (span) span.style.color = "var(--neon-ciano)";

    await carregarComentarios(post_id, secao);
    secao.querySelector(".input-comentario")?.focus();
}

async function carregarComentarios(post_id, secao) {
    try {
        const resposta    = await fetch(`/comentarios/${post_id}`);
        const comentarios = await resposta.json();
        const lista       = secao.querySelector(".lista-comentarios");
        lista.innerHTML   = "";

        comentarios.forEach(c => {
            const username    = c.username.startsWith("@") ? c.username : `@${c.username}`;
            const avatarStyle = c.foto_perfil
                ? `background-image:url(${c.foto_perfil});background-size:cover;background-position:center;`
                : "";
            const avatarIcon = c.foto_perfil ? "" : `<i class="fa-solid fa-user-astronaut"></i>`;

            const item = document.createElement("li");
            item.classList.add("comentario-item");
            item.innerHTML = `
                <div class="comentario-avatar-mini link-perfil" data-uid="${c.usuario_id}" style="${avatarStyle}">${avatarIcon}</div>
                <div class="comentario-corpo">
                    <span class="comentario-usuario link-perfil" data-uid="${c.usuario_id}" style="cursor:pointer;">${username}</span>
                    <span class="comentario-texto">${c.conteudo}</span>
                </div>
            `;

            item.querySelectorAll(".link-perfil").forEach(el => {
                el.addEventListener("click", () => {
                    window.location.href = `perfil.html?id=${el.dataset.uid}`;
                });
            });

            lista.appendChild(item);
        });
    } catch (erro) { console.error("Erro ao carregar comentários:", erro); }
}

async function enviarComentario(post_id, input, postCard) {
    const conteudo = input.value.trim();
    if (!conteudo || !usuarioLogado) return;

    try {
        const resposta = await fetch("/comentarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id, usuario_id: usuarioLogado.id, conteudo })
        });
        const { total } = await resposta.json();

        const contador = postCard.querySelector(".contagem-comentarios-txt");
        if (contador) contador.textContent = total;
        input.value = "";

        const username    = usuarioLogado.username.startsWith("@") ? usuarioLogado.username : `@${usuarioLogado.username}`;
        const lista       = postCard.querySelector(".lista-comentarios");
        const item        = document.createElement("li");
        item.classList.add("comentario-item");

        const avatarStyle = usuarioLogado.foto_perfil
            ? `background-image:url(${usuarioLogado.foto_perfil});background-size:cover;background-position:center;`
            : "";
        const avatarIcon = usuarioLogado.foto_perfil ? "" : `<i class="fa-solid fa-user-astronaut"></i>`;

        item.innerHTML = `
            <div class="comentario-avatar-mini" style="${avatarStyle}">${avatarIcon}</div>
            <div class="comentario-corpo">
                <span class="comentario-usuario">${username}</span>
                <span class="comentario-texto">${conteudo}</span>
            </div>
        `;
        lista.appendChild(item);
        lista.scrollTop = lista.scrollHeight;
    } catch (erro) { console.error("Erro ao comentar:", erro); }
}

async function toggleRepost(e) {
    if (!usuarioLogado) return;
    const btn        = e.currentTarget;
    const post_id    = btn.dataset.id;
    const icon       = btn.querySelector("i");
    const span       = btn.querySelector(".contagem-reposts-txt");
    const jaRepostou = btn.classList.contains("repostado");

    try {
        const resposta = await fetch("/reposts", {
            method: jaRepostou ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id, usuario_id: usuarioLogado.id })
        });

        if (!resposta.ok) throw new Error('Falha ao atualizar repost');

        const { total } = await resposta.json();
        if (span) span.textContent = total;

        if (jaRepostou) {
            btn.classList.remove("repostado");
            if (icon) icon.style.color = "";
            if (span) span.style.color = "";
        } else {
            btn.classList.add("repostado");
            if (icon) icon.style.color = "var(--neon-ciano)";
            if (span) span.style.color = "var(--neon-ciano)";
        }
    } catch (erro) {
        console.error("Erro ao repostar:", erro);
    }
}

carregarPosts();