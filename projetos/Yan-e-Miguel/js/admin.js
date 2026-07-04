const usuarioAdmin = requireAuth(["admin"]);

    if(usuarioAdmin){
        carregarDashboardAdmin();
    }

    async function carregarDashboardAdmin(){
        try{
            preencherUsuarioLogado();

            const [pilotos, reservas, corridas, resultados] = await Promise.all([
                buscarComFallback("/pilotos"),
                buscarComFallback("/reservas"),
                buscarComFallback("/corridas"),
                buscarComFallback("/resultados")
            ]);

            preencherCardsPrincipais(pilotos, reservas, corridas, resultados);
            preencherAgendaHoje(reservas);
            preencherRankingTempos(resultados);
            preencherResumoOperacional(pilotos, reservas, corridas, resultados);
            ativarCardsResumo();

        }catch(erro){
            console.error("Erro dashboard admin:", erro);

            setHTML("agendaHoje", `
                <div class="alert alert-danger">
                    Não foi possível carregar a agenda de hoje.
                </div>
            `);

            setHTML("rankingTempos", `
                <div class="alert alert-danger">
                    Não foi possível carregar o ranking de tempos.
                </div>
            `);
        }
    }

    async function buscarComFallback(rota){
        try{
            const dados = await apiGet(rota);
            return Array.isArray(dados) ? dados : [];
        }catch(erro){
            console.warn(`Falha ao buscar ${rota}:`, erro);
            return [];
        }
    }

    function getDataChave(data){
        if(!data){
            return "";
        }

        if(typeof data === "string"){
            return data.substring(0,10);
        }

        const dataObj = new Date(data);

        if(Number.isNaN(dataObj.getTime())){
            return "";
        }

        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
        const dia = String(dataObj.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }

    function getDataHoraRegistro(item){
        const data = getDataChave(item.data);

        const horario = item.horario
            ? String(item.horario).substring(0,5)
            : "00:00";

        return new Date(`${data}T${horario}:00`);
    }

    function preencherCardsPrincipais(pilotos, reservas, corridas, resultados){
        setTexto("totalPilotos", pilotos.length);
        setTexto("totalReservas", reservas.length);
        setTexto("totalCorridas", corridas.length);

        const melhorResultado = resultados
            .filter(resultado => resultado.tempo_volta)
            .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta))[0];

        setTexto(
            "melhorVolta",
            melhorResultado ? formatarTempo(melhorResultado.tempo_volta) : "-"
        );
    }

    function preencherAgendaHoje(reservas){
        const hoje = hojeISO();

        const reservasHoje = reservas
            .filter(reserva => getDataChave(reserva.data) === hoje)
            .sort((a,b) => String(a.horario || "").localeCompare(String(b.horario || "")));

        if(reservasHoje.length === 0){
            setHTML("agendaHoje", `
                <div class="empty">
                    <i class="bi bi-calendar-x"></i>
                    <h2>Nenhuma reserva hoje</h2>
                    <p>A pista ainda não possui reservas registradas para hoje.</p>
                    <a href="reservas-admin.html" class="btn btn-primary" style="margin-top:22px;">
                        <i class="bi bi-calendar-plus"></i>
                        Criar reserva
                    </a>
                </div>
            `);

            return;
        }

        const html = reservasHoje.map(reserva => {
            const cliente = reserva.usuario 
                || reserva.cliente 
                || reserva.nome 
                || reserva.nome_usuario 
                || "Cliente não vinculado";

            return `
                <div class="schedule-card click" onclick="window.location.href='reservas-admin.html'">
                    <div>
                        <div class="schedule-hour">${formatarHora(reserva.horario)}</div>
                        <p>${formatarData(reserva.data)}</p>
                    </div>

                    <div class="schedule-info">
                        <strong>${cliente}</strong>
                        <p>${reserva.pista || "RaceHub Track"}</p>
                    </div>
                </div>
            `;
        }).join("");

        setHTML("agendaHoje", html);
    }

    function preencherRankingTempos(resultados){
        // Monta o ranking do dashboard do admin.
        // A regra é simples: menor tempo fica em primeiro.
        // O slice(0,5) garante que apareçam no máximo 5 registros.
        const ranking = resultados
            .filter(resultado => resultado.tempo_volta)
            .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta))
            .slice(0,5);

        if(ranking.length === 0){
            setHTML("rankingTempos", `
                <div class="empty">
                    <i class="bi bi-stopwatch"></i>
                    <h2>Sem tempos registrados</h2>
                    <p>Quando os tempos forem lançados, o ranking aparecerá aqui.</p>
                    <a href="tempos.html" class="btn btn-primary" style="margin-top:22px;">
                        <i class="bi bi-plus-circle"></i>
                        Registrar tempo
                    </a>
                </div>
            `);

            return;
        }

        const html = `
            <div class="ranking-list ranking-admin-dashboard">
                ${ranking.map((resultado, index) => {
                    const piloto = resultado.piloto 
                        || resultado.nome_piloto 
                        || "Piloto";

                    const corrida = resultado.corrida 
                        || resultado.nome_corrida 
                        || "Corrida";

                    // Define a cor do tempo conforme a posição.
                    // 1º dourado, 2º prateado, 3º bronze, 4º/5º branco.
                    const classeMedalha = getClasseMedalhaRanking(index);

                    return `
                        <div class="ranking-item click" onclick="window.location.href='tempos.html'">
                            <div class="ranking-left">
                                <div class="position">${index + 1}</div>

                                <div>
                                    <div class="pilot-name">${piloto}</div>
                                    <p>${corrida}</p>
                                </div>
                            </div>

                            <div class="best-time ${classeMedalha}">
                                ${formatarTempo(resultado.tempo_volta)}
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;

        setHTML("rankingTempos", html);
    }


    function getClasseMedalhaRanking(index){
        // Retorna a classe CSS usada para colorir o tempo no ranking do admin.
        if(index === 0) return "ranking-time-gold";
        if(index === 1) return "ranking-time-silver";
        if(index === 2) return "ranking-time-bronze";

        return "ranking-time-white";
    }


    function preencherResumoOperacional(pilotos, reservas, corridas, resultados){
        const hoje = hojeISO();
        const agora = new Date();

        const reservasHoje = reservas.filter(reserva => 
            getDataChave(reserva.data) === hoje
        );

        const corridasFuturas = corridas.filter(corrida => {
            if(!corrida.data){
                return false;
            }

            return getDataHoraRegistro(corrida) >= agora;
        });

        const temposRegistrados = resultados.filter(resultado => 
            resultado.tempo_volta
        );

        setTexto("reservasHoje", reservasHoje.length);
        setTexto("corridasSemana", corridasFuturas.length);
        setTexto("temposRegistrados", temposRegistrados.length);
        setTexto("pilotosAtivos", pilotos.length);
    }

    function ativarCardsResumo(){
        const reservasHojeCard = document.getElementById("reservasHoje")?.closest(".stat-box");
        const corridasCard = document.getElementById("corridasSemana")?.closest(".stat-box");
        const temposCard = document.getElementById("temposRegistrados")?.closest(".stat-box");
        const pilotosCard = document.getElementById("pilotosAtivos")?.closest(".stat-box");

        configurarCardResumo(reservasHojeCard, "reservas-admin.html");
        configurarCardResumo(corridasCard, "corridas.html");
        configurarCardResumo(temposCard, "tempos.html");
        configurarCardResumo(pilotosCard, "pilotos.html");
    }

    function configurarCardResumo(card, destino){
        if(!card){
            return;
        }

        card.classList.add("click");
        card.style.cursor = "pointer";

        card.onclick = () => {
            window.location.href = destino;
        };
    }