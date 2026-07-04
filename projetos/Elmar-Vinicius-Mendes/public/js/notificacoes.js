const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

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

function infoNotificacao(tipo, atorUsername) {
    const nome = atorUsername.startsWith("@") ? atorUsername : `@${atorUsername}`;
    switch (tipo) {
        case "like":
            return {
                icone: "fa-solid fa-heart",
                cor:   "#fa709a",
                texto: `${nome} curtiu seu post`
            };
        case "repost":
            return {
                icone: "fa-solid fa-retweet",
                cor:   "var(--neon-ciano)",
                texto: `${nome} repostou seu post`
            };
        case "comentario":
            return {
                icone: "fa-solid fa-comment",
                cor:   "var(--neon-ciano)",
                texto: `${nome} comentou no seu post`
            };
        case "seguidor":
            return {
                icone: "fa-solid fa-user-plus",
                cor:   "#a78bfa",
                texto: `${nome} começou a te seguir`
            };
        default:
            return {
                icone: "fa-solid fa-bell",
                cor:   "var(--txt-poeira)",
                texto: `${nome} interagiu com você`
            };
    }
}

async function carregarNotificacoes() {
    if (!usuarioLogado) return;

    const lista = document.getElementById("lista-notificacoes");
    if (!lista) return;

    try {
        const resposta = await fetch(`/notificacoes/${usuarioLogado.id}`);
        const notifs   = await resposta.json();

        await fetch(`/notificacoes/${usuarioLogado.id}/lidas`, {
            method: "PUT"
        });

        atualizarBadge(0);

        lista.innerHTML = "";

        if (notifs.length === 0) {
            lista.innerHTML = `
                <li class="feed-vazio">
                    <i class="fa-solid fa-bell-slash"></i>
                    <p>Nenhuma notificação ainda.</p>
                </li>`;
            return;
        }

        notifs.forEach(n => {
            const info  = infoNotificacao(n.tipo, n.ator_username);
            const tempo = tempoRelativo(n.criado_em);

            const avatarStyle = n.ator_foto
                ? `background-image:url(${n.ator_foto});background-size:cover;background-position:center;`
                : "";
            const avatarIcon = n.ator_foto ? "" : `<i class="fa-solid fa-user-astronaut"></i>`;

            const badge = n.ator_verificado
                ? `<i class="fa-solid fa-circle-check badge-verificado" title="Verificado"></i>`
                : "";

            const item = document.createElement("li");
            item.classList.add("notif-item");
            if (!n.lida) item.classList.add("notif-nova");

            item.style.cursor = "pointer";
            item.addEventListener("click", () => {
                if (n.tipo === "seguidor") {
                    window.location.href = `perfil.html?id=${n.ator_id}`;
                } else if (n.post_id) {
                    window.location.href = `perfil.html?id=${n.ator_id}`;
                }
            });

            item.innerHTML = `
                <div class="notif-avatar" style="${avatarStyle}">${avatarIcon}</div>
                <div class="notif-info">
                    <p class="notif-texto">
                        <strong>${n.ator_username.startsWith("@") ? n.ator_username : "@" + n.ator_username}</strong>
                        ${badge}
                        ${tipoTexto(n.tipo)}
                    </p>
                    <span class="notif-tempo">${tempo}</span>
                </div>
                <i class="${info.icone} notif-icone" style="color:${info.cor};"></i>
            `;

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao carregar notificações:", erro);
    }
}

function tipoTexto(tipo) {
    switch (tipo) {
        case "like":      return "curtiu seu post";
        case "repost":    return "repostou seu post";
        case "comentario": return "comentou no seu post";
        case "seguidor":  return "começou a te seguir";
        default:          return "interagiu com você";
    }
}

function atualizarBadge(total) {
    document.querySelectorAll(".badge-notif").forEach(el => {
        el.textContent = total > 0 ? (total > 9 ? "9+" : total) : "";
        el.style.display = total > 0 ? "flex" : "none";
    });
}

async function carregarBadge() {
    if (!usuarioLogado) return;
    try {
        const resposta = await fetch(`/notificacoes/${usuarioLogado.id}/nao-lidas`);
        const { total } = await resposta.json();
        atualizarBadge(total);
    } catch (erro) {
        console.error("Erro ao carregar badge:", erro);
    }
}

carregarNotificacoes();
