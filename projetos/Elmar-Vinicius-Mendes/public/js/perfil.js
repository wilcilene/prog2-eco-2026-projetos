const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
const params        = new URLSearchParams(window.location.search);
const perfilId      = params.get("id") || usuarioLogado?.id;
const ehMeuPerfil   = String(perfilId) === String(usuarioLogado?.id);

const fotoPerfil  = document.getElementById("foto-perfil");
const inputImagem = document.getElementById("input-imagem");
const btnFoto     = document.getElementById("btn_fotoperfil");
const btnSeguir   = document.getElementById("btnSeguir");
const btnMensagem = document.getElementById("btnMensagem");
const listaPosts  = document.getElementById("lista-posts");

let _perfilCardIndex = 0;
let abaAtiva = "posts";

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

function setContador(id, numero) {
    const el = document.getElementById(id);
    if (!el) return;
    const span = el.querySelector(".numero");
    if (span) span.textContent = numero;
}

const btnVoltar = document.getElementById("btn-voltar-perfil");
if (btnVoltar) {
    btnVoltar.style.display = "flex";
    btnVoltar.addEventListener("click", () => history.back());
}

async function carregarPerfil() {
    try {
        const resUser = await fetch(`/usuarios/${perfilId}`);
        const usuario = await resUser.json();

        const username = usuario.username.startsWith("@") ? usuario.username : `@${usuario.username}`;
        const badge    = badgeVerificado(usuario.verificado);

        const elUsername = document.getElementById("username-perfil");
        elUsername.innerHTML = `${username} ${badge}`;

        document.getElementById("nome-perfil").textContent = usuario.nome || "";
        document.title = `${username} — Zerion`;

        const sidebarUsername = document.getElementById("sidebar-username");
        const sidebarCriado   = document.getElementById("sidebar-criado");
        if (sidebarUsername) sidebarUsername.innerHTML = `${username} ${badge}`;
        if (sidebarCriado && usuario.criado_em) {
            const data = new Date(usuario.criado_em).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
            sidebarCriado.textContent = `Entrou em ${data}`;
        }

        if (usuario.foto_perfil) {
            fotoPerfil.style.backgroundImage    = `url(${usuario.foto_perfil})`;
            fotoPerfil.style.backgroundSize     = "cover";
            fotoPerfil.style.backgroundPosition = "center";
            fotoPerfil.innerHTML = "";
        } else {
            fotoPerfil.innerHTML = `<i class="fa-solid fa-user-astronaut"></i>`;
        }

        const resSeg   = await fetch(`/seguidores/${perfilId}`);
        const contagem = await resSeg.json();
        setContador("contagem-seguindo",   contagem.seguindo);
        setContador("contagem-seguidores", contagem.seguidores);

        const sidebarContagem = document.getElementById("sidebar-contagem");
        if (sidebarContagem) sidebarContagem.textContent = `${contagem.seguidores} seguidores · ${contagem.seguindo} seguindo`;

        document.getElementById("contagem-seguidores")?.addEventListener("click", () => abrirModalSeguidores("seguidores"));
        document.getElementById("contagem-seguindo")?.addEventListener("click",   () => abrirModalSeguidores("seguindo"));

        if (ehMeuPerfil) {
            btnSeguir.style.display     = "none";
            btnMensagem.style.display   = "none";
            btnFoto.style.cursor        = "pointer";
        } else {
            if (usuario.is_ia) {
                btnMensagem.style.display = "none";
            } else {
                btnMensagem.style.display = "inline-flex";
            }
            btnSeguir.style.display     = "inline-flex";
            btnFoto.style.pointerEvents = "none";
            btnFoto.style.cursor        = "default";

            if (usuarioLogado) {
                const resCheck     = await fetch(`/seguidores/checar?seguidor_id=${usuarioLogado.id}&seguindo_id=${perfilId}`);
                const { seguindo } = await resCheck.json();
                if (seguindo) {
                    btnSeguir.classList.add("seguindo");
                    btnSeguir.innerHTML = '<i class="fa-solid fa-check"></i> Seguindo';
                }
            }
        }

        await carregarAba("posts");

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
    }
}

async function abrirModalSeguidores(tipo) {
    document.getElementById("modal-seguidores")?.remove();

    const modal = document.createElement("div");
    modal.id = "modal-seguidores";
    modal.innerHTML = `
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal-box">
                <div class="modal-header">
                    <span class="modal-titulo">${tipo === "seguidores" ? "Seguidores" : "Seguindo"}</span>
                    <button class="modal-fechar" id="modal-fechar"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <ul class="modal-lista" id="modal-lista">
                    <li class="modal-loading">Carregando...</li>
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("modal-fechar").addEventListener("click", () => modal.remove());
    document.getElementById("modal-overlay").addEventListener("click", (e) => {
        if (e.target.id === "modal-overlay") modal.remove();
    });

    try {
        const res      = await fetch(`/seguidores/${perfilId}/${tipo}`);
        const usuarios = await res.json();
        const lista    = document.getElementById("modal-lista");
        lista.innerHTML = "";

        if (usuarios.length === 0) {
            lista.innerHTML = `<li class="modal-vazio">Nenhum usuário ainda.</li>`;
            return;
        }

        usuarios.forEach(u => {
            const username    = u.username.startsWith("@") ? u.username : `@${u.username}`;
            const avatarStyle = u.foto_perfil
                ? `background-image:url(${u.foto_perfil});background-size:cover;background-position:center;`
                : "";
            const avatarIcon = u.foto_perfil ? "" : `<i class="fa-solid fa-user-astronaut"></i>`;
            const badge      = u.verificado ? `<i class="fa-solid fa-circle-check badge-verificado"></i>` : "";

            const item = document.createElement("li");
            item.classList.add("modal-item");
            item.style.cursor = "pointer";
            item.innerHTML = `
                <div class="modal-avatar" style="${avatarStyle}">${avatarIcon}</div>
                <div class="modal-info">
                    <span class="modal-nome">${username} ${badge}</span>
                    <span class="modal-sub">${u.nome || ""}</span>
                </div>
                <i class="fa-solid fa-chevron-right" style="color:var(--txt-poeira);font-size:0.75rem;"></i>
            `;
            item.addEventListener("click", () => {
                window.location.href = `perfil.html?id=${u.id}`;
            });
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error("Erro ao carregar lista:", erro);
    }
}

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("ativa"));
        btn.classList.add("ativa");
        carregarAba(btn.dataset.tab);
    });
});

async function carregarAba(tab) {
    abaAtiva = tab;
    listaPosts.innerHTML = "";
    _perfilCardIndex = 0;

    listaPosts.innerHTML = `
        <li style="width:100%;text-align:center;padding:2rem;color:var(--txt-poeira);font-size:0.8rem;">
            <i class="fa-solid fa-circle-notch fa-spin" style="margin-bottom:0.5rem;display:block;font-size:1.5rem;color:var(--neon-ciano);opacity:0.5;"></i>
            Carregando...
        </li>`;

    if (tab === "posts")       await carregarPosts();
    if (tab === "comentarios") await carregarComentados();
    if (tab === "likes")       await carregarLikes();
}

async function carregarPosts() {
    try {
        const viewerId = usuarioLogado?.id || 0;
        const resPosts = await fetch(`/posts/usuario/${perfilId}?viewer_id=${viewerId}`);
        const posts    = await resPosts.json();

        setContador("contagem-posts", posts.length);
        listaPosts.innerHTML = "";
        _perfilCardIndex = 0;

        if (posts.length === 0) {
            listaPosts.innerHTML = `
                <li class="feed-vazio">
                    <i class="fa-solid fa-satellite-dish"></i>
                    <p>Nenhuma transmissão ainda.</p>
                </li>`;
            return;
        }

        posts.forEach(p => renderizarPost(p, "posts"));
    } catch (erro) {
        console.error("Erro ao carregar posts:", erro);
        mostrarErroAba();
    }
}

async function carregarLikes() {
    try {
        const viewerId = usuarioLogado?.id || 0;
        const res   = await fetch(`/posts/curtidos/${perfilId}?viewer_id=${viewerId}`);
        const posts = await res.json();

        listaPosts.innerHTML = "";
        _perfilCardIndex = 0;

        if (posts.length === 0) {
            listaPosts.innerHTML = `
                <li class="feed-vazio">
                    <i class="fa-solid fa-heart" style="color:#fa709a;"></i>
                    <p>${ehMeuPerfil ? "Você ainda não curtiu nenhum post." : "Nenhum post curtido ainda."}</p>
                </li>`;
            return;
        }

        posts.forEach(p => renderizarPost(p, "likes"));
    } catch (erro) {
        console.error("Erro ao carregar likes:", erro);
        mostrarErroAba();
    }
}

async function carregarComentados() {
    try {
        const viewerId = usuarioLogado?.id || 0;
        const res   = await fetch(`/posts/comentados/${perfilId}?viewer_id=${viewerId}`);
        const posts = await res.json();

        listaPosts.innerHTML = "";
        _perfilCardIndex = 0;

        if (posts.length === 0) {
            listaPosts.innerHTML = `
                <li class="feed-vazio">
                    <i class="fa-regular fa-comment" style="color:var(--neon-ciano);"></i>
                    <p>${ehMeuPerfil ? "Você ainda não comentou em nenhum post." : "Nenhum comentário ainda."}</p>
                </li>`;
            return;
        }

        posts.forEach(p => renderizarPost(p, "comentarios"));
    } catch (erro) {
        console.error("Erro ao carregar comentários:", erro);
        mostrarErroAba();
    }
}

function mostrarErroAba() {
    listaPosts.innerHTML = `
        <li class="feed-vazio">
            <i class="fa-solid fa-triangle-exclamation" style="color:#ff4d6d;"></i>
            <p>Erro ao carregar. Tente novamente.</p>
        </li>`;
}

function renderizarPost(post, origem) {
    const cardId = `perfil-card-${++_perfilCardIndex}`;

    const item = document.createElement("li");
    item.classList.add("post");
    item.dataset.cardId = cardId;
    item.dataset.postId = post.id;

    const tempo    = tempoRelativo(post.criado_em);
    const username = post.username.startsWith("@") ? post.username : `@${post.username}`;
    const badge    = badgeVerificado(post.verificado);

    const jaCurtiu   = parseInt(post.ja_curtiu)   > 0;
    const jaRepostou = parseInt(post.ja_repostou) > 0;

    const labelRepost = post.repostado_por
        ? `<div class="repost-label">
               <i class="fa-solid fa-retweet"></i>
               <span>${post.repostado_por.startsWith("@") ? post.repostado_por : "@" + post.repostado_por} repostou</span>
           </div>`
        : "";

    let labelOrigem = "";
    if (origem === "likes") {
        labelOrigem = `
            <div class="repost-label">
                <i class="fa-solid fa-heart" style="color:#fa709a;"></i>
                <span style="color:var(--txt-poeira);">curtido</span>
            </div>`;
    } else if (origem === "comentarios") {
        labelOrigem = `
            <div class="repost-label">
                <i class="fa-regular fa-comment" style="color:var(--neon-ciano);"></i>
                <span style="color:var(--txt-poeira);">comentado</span>
            </div>`;
    }

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
        ${labelOrigem}
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
            <button class="icone-btn btn-like ${jaCurtiu ? 'curtido' : ''}" data-id="${post.id}">
                <i class="${jaCurtiu ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                <span class="contagem-likes-txt">${post.total_likes || 0}</span>
            </button>
            <button class="icone-btn btn-comentar" data-id="${post.id}" data-card="${cardId}">
                <i class="fa-regular fa-comment"></i>
                <span class="contagem-comentarios-txt">${post.total_comentarios || 0}</span>
            </button>
            <button class="icone-btn btn-repost ${jaRepostou ? 'repostado' : ''}" data-id="${post.id}">
                <i class="fa-solid fa-retweet"></i>
                <span class="contagem-reposts-txt">${post.total_reposts || 0}</span>
            </button>
        </div>

        <div class="secao-comentarios" data-card="${cardId}" style="display:none;">
            <div class="comentario-input-area">
                <div class="comentario-avatar">${usuarioLogado?.foto_perfil ? "" : '<i class="fa-solid fa-user-astronaut"></i>'}</div>
                <input type="text" class="input-comentario" placeholder="Escreva um comentário...">
                <button class="btn-enviar-comentario"><i class="fa-solid fa-paper-plane"></i></button>
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

    const btnLikeEl   = item.querySelector(".btn-like");
    const btnRepostEl = item.querySelector(".btn-repost");

    if (jaCurtiu) {
        btnLikeEl.classList.add("curtido");
        btnLikeEl.querySelector("i").className   = "fa-solid fa-heart";
        btnLikeEl.querySelector("i").style.setProperty("color", "#fa709a", "important");
        btnLikeEl.querySelector(".contagem-likes-txt").style.setProperty("color", "#fa709a", "important");
    }
    if (jaRepostou) {
        btnRepostEl.classList.add("repostado");
        btnRepostEl.querySelector("i").style.setProperty("color", "var(--neon-ciano)", "important");
        btnRepostEl.querySelector(".contagem-reposts-txt").style.setProperty("color", "var(--neon-ciano)", "important");
    }

    item.querySelectorAll(".link-perfil").forEach(el => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
            window.location.href = `perfil.html?id=${el.dataset.uid}`;
        });
    });

    listaPosts.appendChild(item);

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
            setTimeout(() => {
                itemEl.remove();
                if (abaAtiva === "posts") {
                    const total = listaPosts.querySelectorAll(".post").length;
                    setContador("contagem-posts", total);
                }
            }, 300);
        }
    } catch (erro) { console.error("Erro ao deletar:", erro); }
}

async function toggleLike(e) {
    if (!usuarioLogado) return;
    const btn      = e.currentTarget;
    const post_id  = btn.dataset.id;
    const icon     = btn.querySelector("i, svg");
    const span     = btn.querySelector(".contagem-likes-txt");
    const jaCurtiu = btn.classList.contains("curtido");

    try {
        const res = await fetch("/likes", {
            method:  jaCurtiu ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ post_id, usuario_id: usuarioLogado.id })
        });

        if (!res.ok) throw new Error('Falha ao atualizar like');

        const { total } = await res.json();
        if (span) span.textContent = total;

        if (jaCurtiu) {
            btn.classList.remove("curtido");
            if (icon) {
                icon.className = "fa-regular fa-heart";
                icon.style.setProperty("color", "", "important");
            }
            if (span) span.style.setProperty("color", "", "important");
        } else {
            btn.classList.add("curtido");
            if (icon) {
                icon.className = "fa-solid fa-heart";
                icon.style.setProperty("color", "#fa709a", "important");
            }
            if (span) span.style.setProperty("color", "#fa709a", "important");
        }
    } catch (erro) { console.error(erro); }
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

    await carregarComentariosCard(post_id, secao);
    secao.querySelector(".input-comentario")?.focus();
}

async function carregarComentariosCard(post_id, secao) {
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
    } catch (erro) { console.error(erro); }
}

async function enviarComentario(post_id, input, postCard) {
    const conteudo = input.value.trim();
    if (!conteudo || !usuarioLogado) return;

    try {
        const resposta = await fetch("/comentarios", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ post_id, usuario_id: usuarioLogado.id, conteudo })
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
    } catch (erro) { console.error(erro); }
}

async function toggleRepost(e) {
    if (!usuarioLogado) return;
    const btn        = e.currentTarget;
    const post_id    = btn.dataset.id;
    const icon       = btn.querySelector("i, svg");
    const span       = btn.querySelector(".contagem-reposts-txt");
    const jaRepostou = btn.classList.contains("repostado");

    try {
        const resposta = await fetch("/reposts", {
            method:  jaRepostou ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ post_id, usuario_id: usuarioLogado.id })
        });

        if (!resposta.ok) throw new Error('Falha ao atualizar repost');

        const { total } = await resposta.json();
        if (span) span.textContent = total;

        if (jaRepostou) {
            btn.classList.remove("repostado");
            if (icon) icon.style.setProperty("color", "", "important");
            if (span) span.style.setProperty("color", "", "important");
        } else {
            btn.classList.add("repostado");
            if (icon) icon.style.setProperty("color", "var(--neon-ciano)", "important");
            if (span) span.style.setProperty("color", "var(--neon-ciano)", "important");
        }
    } catch (erro) { console.error(erro); }
}

btnSeguir.addEventListener("click", async () => {
    if (!usuarioLogado) return;
    const seguindo = btnSeguir.classList.contains("seguindo");
    try {
        await fetch("/seguidores", {
            method:  seguindo ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ seguidor_id: usuarioLogado.id, seguindo_id: perfilId })
        });
        if (seguindo) { btnSeguir.classList.remove("seguindo"); btnSeguir.textContent = "Seguir"; }
        else { btnSeguir.classList.add("seguindo"); btnSeguir.innerHTML = '<i class="fa-solid fa-check"></i> Seguindo'; }

        const resSeg   = await fetch(`/seguidores/${perfilId}`);
        const contagem = await resSeg.json();
        setContador("contagem-seguidores", contagem.seguidores);

        const sidebarContagem = document.getElementById("sidebar-contagem");
        if (sidebarContagem) sidebarContagem.textContent = `${contagem.seguidores} seguidores · ${contagem.seguindo} seguindo`;
    } catch (erro) { console.error(erro); }
});

btnMensagem.addEventListener("click", () => { window.location.href = `mensagens.html?id=${perfilId}`; });

if (ehMeuPerfil) {
    btnFoto.addEventListener("click", () => inputImagem.click());
    inputImagem.addEventListener("change", async () => {
        const arquivo = inputImagem.files[0];
        if (!arquivo) return;
        const leitor  = new FileReader();
        leitor.onload = async (e) => {
            const base64 = e.target.result;
            fotoPerfil.style.backgroundImage    = `url(${base64})`;
            fotoPerfil.style.backgroundSize     = "cover";
            fotoPerfil.style.backgroundPosition = "center";
            fotoPerfil.innerHTML = "";
            try {
                await fetch(`/usuarios/${usuarioLogado.id}/foto`, {
                    method: "PUT", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ foto: base64 })
                });
                usuarioLogado.foto_perfil = base64;
                localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            } catch (erro) { console.error(erro); }
        };
        leitor.readAsDataURL(arquivo);
    });
}

carregarPerfil();