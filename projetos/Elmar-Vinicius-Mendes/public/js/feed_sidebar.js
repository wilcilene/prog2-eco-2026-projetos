async function carregarSugestoesSidebar() {
    const container  = document.getElementById("sugestoes-sidebar");
    if (!container) return;
    if (window.innerWidth < 1024) return;

    const user = JSON.parse(localStorage.getItem("usuario"));

    try {
        const resposta = await fetch("/usuarios/buscar?termo=");
        const usuarios = await resposta.json();

        const sugestoes = usuarios
            .filter(u => !user || String(u.id) !== String(user.id))
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        container.innerHTML = "";

        if (sugestoes.length === 0) {
            container.innerHTML = `<p style="color:var(--txt-poeira);font-size:0.75rem;padding:0.5rem 0;">Nenhuma sugestão ainda</p>`;
            return;
        }

        const checks = await Promise.all(
            sugestoes.map(async u => {
                if (!user) return false;
                try {
                    const res = await fetch(`/seguidores/checar?seguidor_id=${user.id}&seguindo_id=${u.id}`);
                    const { seguindo } = await res.json();
                    return seguindo;
                } catch { return false; }
            })
        );

        sugestoes.forEach((u, i) => {
            const username   = u.username.startsWith("@") ? u.username : `@${u.username}`;
            const jaSeguindo = checks[i];

            const item = document.createElement("div");
            item.classList.add("sugestao-item");
            item.innerHTML = `
                <div class="sugestao-avatar" style="${u.foto_perfil ? `background-image:url(${u.foto_perfil});background-size:cover;background-position:center;` : ''}"></div>
                <div class="sugestao-info">
                    <span class="sugestao-nome">${username}</span>
                    <span class="sugestao-sub">${u.nome}</span>
                </div>
                <button class="btn-seguir-sugestao ${jaSeguindo ? 'seguindo' : ''}" data-id="${u.id}">
                    ${jaSeguindo ? '<i class="fa-solid fa-check"></i>' : 'Seguir'}
                </button>
            `;

            if (jaSeguindo) {
                const btn = item.querySelector(".btn-seguir-sugestao");
                btn.style.backgroundColor = "var(--neon-ciano)";
                btn.style.color           = "rgb(6,2,20)";
            }

            item.querySelector(".sugestao-info").style.cursor = "pointer";
            item.querySelector(".sugestao-info").addEventListener("click", () => {
                window.location.href = `perfil.html?id=${u.id}`;
            });
            item.querySelector(".sugestao-avatar").style.cursor = "pointer";
            item.querySelector(".sugestao-avatar").addEventListener("click", () => {
                window.location.href = `perfil.html?id=${u.id}`;
            });

            const btn = item.querySelector(".btn-seguir-sugestao");
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                if (!user) return;
                const seguindo = btn.classList.contains("seguindo");

                try {
                    await fetch("/seguidores", {
                        method: seguindo ? "DELETE" : "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ seguidor_id: user.id, seguindo_id: u.id })
                    });

                    if (seguindo) {
                        btn.classList.remove("seguindo");
                        btn.textContent           = "Seguir";
                        btn.style.backgroundColor = "transparent";
                        btn.style.color           = "var(--neon-ciano)";
                    } else {
                        btn.classList.add("seguindo");
                        btn.innerHTML             = '<i class="fa-solid fa-check"></i>';
                        btn.style.backgroundColor = "var(--neon-ciano)";
                        btn.style.color           = "rgb(6,2,20)";
                    }
                } catch (erro) {
                    console.error("Erro ao seguir:", erro);
                }
            });

            container.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao carregar sugestões:", erro);
    }
}

carregarSugestoesSidebar();