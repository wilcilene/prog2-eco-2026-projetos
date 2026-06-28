const usuarioRelatorios = requireAuth(["admin", "piloto", "cliente"]);

        let resultadosRelatorioCache = [];
        let resultadosVisiveisRelatorio = [];
        let pilotosRelatorioCache = [];
        let corridasRelatorioCache = [];
        let reservasRelatorioCache = [];
        let rankingVeiculosRelatorioCache = [];
        let rankingPotenciaRelatorioCache = {};

        if(usuarioRelatorios){
            configurarLayoutRelatorios(usuarioRelatorios);
            carregarRelatorios(usuarioRelatorios);
        }


        function configurarLayoutRelatorios(usuario){

            preencherUsuarioLogado();

            const menu = document.getElementById("sidebarMenu");
            const subtitle = document.getElementById("sidebarSubtitle");

            if(usuario.tipo === "admin"){

                subtitle.textContent = "Admin Reports Center";

                menu.innerHTML = `
                    <a href="admin.html">
                        <i class="bi bi-grid-1x2-fill"></i>
                        Dashboard
                    </a>

                    <a href="pilotos.html">
                        <i class="bi bi-person-badge"></i>
                        Pilotos
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

                    <a href="relatorios.html" class="active">
                        <i class="bi bi-bar-chart"></i>
                        Relatórios
                    </a>

                    <a href="usuarios.html">
                        <i class="bi bi-people"></i>
                        Usuários
                    </a>
                `;

                return;

            }

            if(usuario.tipo === "piloto"){

                subtitle.textContent = "Pilot Reports Center";

                document.getElementById("tituloRelatorios").textContent = "Meu relatório";
                document.getElementById("subtituloRelatorios").textContent = "Resumo do seu desempenho, tempos e posição no ranking.";
                document.getElementById("labelTotalResultados").textContent = "Meus resultados";
                document.getElementById("tituloResumoOperacional").textContent = "Resumo do piloto";
                document.getElementById("subtituloResumoOperacional").textContent = "Indicadores vinculados ao seu perfil.";
                document.getElementById("labelResumoPilotos").textContent = "Meu perfil";
                document.getElementById("labelResumoReservas").textContent = "Registros";
                document.getElementById("tituloReservasRelatorio").textContent = "Histórico de desempenho";
                document.getElementById("subtituloReservasRelatorio").textContent = "Seus últimos registros de tempo.";
                document.getElementById("tituloTabelaRelatorio").textContent = "Meus resultados";

                menu.innerHTML = `
                    <a href="piloto.html">
                        <i class="bi bi-speedometer2"></i>
                        Dashboard
                    </a>

                    <a href="corridas.html">
                        <i class="bi bi-flag"></i>
                        Corridas
                    </a>

                    <a href="tempos.html">
                        <i class="bi bi-stopwatch"></i>
                        Meus tempos
                    </a>

                    <a href="relatorios.html" class="active">
                        <i class="bi bi-bar-chart"></i>
                        Ranking
                    </a>
                `;

                return;

            }

            subtitle.textContent = "Client Results Center";

            document.getElementById("tituloRelatorios").textContent = "Resultados";
            document.getElementById("subtituloRelatorios").textContent = "Acompanhe rankings, eventos e dados públicos da pista.";
            document.getElementById("tituloResumoOperacional").textContent = "Resumo da experiência";
            document.getElementById("subtituloResumoOperacional").textContent = "Dados de eventos e reservas vinculadas à sua conta.";
            document.getElementById("labelResumoPilotos").textContent = "Pilotos no ranking";
            document.getElementById("labelResumoReservas").textContent = "Minhas reservas";
            document.getElementById("tituloReservasRelatorio").textContent = "Minhas reservas";
            document.getElementById("subtituloReservasRelatorio").textContent = "Reservas vinculadas à sua conta.";

            menu.innerHTML = `
                <a href="cliente.html">
                    <i class="bi bi-grid-1x2-fill"></i>
                    Dashboard
                </a>

                <a href="agenda.html">
                    <i class="bi bi-calendar-plus"></i>
                    Reservar pista
                </a>

                <a href="corridas.html">
                    <i class="bi bi-flag"></i>
                    Corridas
                </a>

                <a href="relatorios.html" class="active">
                    <i class="bi bi-bar-chart"></i>
                    Resultados
                </a>
            `;

        }


        async function carregarRelatorios(usuario){

            try{

                const [resultados, pilotos, corridas, reservas, rankingVeiculos, rankingPotencia] = await Promise.all([
                    buscarRelatorioFallback("/resultados"),
                    buscarRelatorioFallback("/pilotos"),
                    buscarRelatorioFallback("/corridas"),
                    buscarRelatorioFallback("/reservas"),
                    buscarRelatorioFallback("/rankings/veiculos"),
                    buscarRelatorioFallback("/rankings/potencia")
                ]);

                resultadosRelatorioCache = Array.isArray(resultados) ? resultados : [];
                pilotosRelatorioCache = Array.isArray(pilotos) ? pilotos : [];
                corridasRelatorioCache = Array.isArray(corridas) ? corridas : [];
                reservasRelatorioCache = Array.isArray(reservas) ? reservas : [];
                rankingVeiculosRelatorioCache = Array.isArray(rankingVeiculos) ? rankingVeiculos : [];
                rankingPotenciaRelatorioCache = rankingPotencia || {};

                resultadosVisiveisRelatorio = usuario.tipo === "piloto"
                    ? filtrarResultadosUsuario(resultadosRelatorioCache, usuario)
                    : resultadosRelatorioCache;

                resultadosVisiveisRelatorio = ordenarResultadosRelatorio(resultadosVisiveisRelatorio);

                preencherCardsRelatorio(usuario);
                preencherRankingRelatorio(usuario);
                preencherCorridasRelatorio();
                preencherReservasRelatorio(usuario);
                preencherResumoRelatorio(usuario);
                preencherRankingVeiculosRelatorio();
                preencherRankingPotenciaRelatorio();
                renderizarTabelaRelatorio(resultadosVisiveisRelatorio);

            }catch(erro){

                console.error(erro);

                setHTML("rankingRelatorio", `
                    <div class="alert alert-danger">
                        Não foi possível carregar o ranking.
                    </div>
                `);

                setHTML("corridasRelatorio", `
                    <div class="alert alert-danger">
                        Não foi possível carregar as corridas.
                    </div>
                `);

                setHTML("reservasRelatorio", `
                    <div class="alert alert-danger">
                        Não foi possível carregar as reservas.
                    </div>
                `);

                setHTML("tabelaRelatorio", `
                    <tr>
                        <td colspan="7">
                            <div class="alert alert-danger">
                                Não foi possível carregar a tabela do relatório.
                            </div>
                        </td>
                    </tr>
                `);

            }

        }


        async function buscarRelatorioFallback(rota){

            try{
                return await apiGet(rota);
            }catch{
                return [];
            }

        }


        function ordenarResultadosRelatorio(resultados){

            return resultados
                .filter(resultado => resultado.tempo_volta)
                .slice()
                .sort((a,b) => Number(a.tempo_volta) - Number(b.tempo_volta));

        }


        function filtrarResultadosUsuario(resultados, usuario){

            return resultados.filter(resultado => {

                const mesmoId = Number(resultado.piloto_id) === Number(usuario.id);

                const mesmoNome = String(resultado.piloto || resultado.nome_piloto || "")
                    .toLowerCase()
                    .trim() === String(usuario.nome || "")
                    .toLowerCase()
                    .trim();

                const mesmoEmail = String(resultado.email || resultado.email_piloto || "")
                    .toLowerCase()
                    .trim() === String(usuario.email || "")
                    .toLowerCase()
                    .trim();

                return mesmoId || mesmoNome || mesmoEmail;

            });

        }


        function filtrarReservasUsuario(reservas, usuario){

            return reservas.filter(reserva => {

                const mesmoId = Number(reserva.usuario_id) === Number(usuario.id);

                const mesmoNome = String(reserva.usuario || reserva.cliente || reserva.nome || "")
                    .toLowerCase()
                    .trim() === String(usuario.nome || "")
                    .toLowerCase()
                    .trim();

                const mesmoEmail = String(reserva.email || reserva.email_cliente || "")
                    .toLowerCase()
                    .trim() === String(usuario.email || "")
                    .toLowerCase()
                    .trim();

                return mesmoId || mesmoNome || mesmoEmail;

            });

        }


        function preencherCardsRelatorio(usuario){

            const resultadosBase = resultadosVisiveisRelatorio;

            const rankingGeral = ordenarResultadosRelatorio(resultadosRelatorioCache);

            const tempos = resultadosBase
                .map(resultado => Number(resultado.tempo_volta))
                .filter(tempo => !Number.isNaN(tempo));

            const melhorResultado = resultadosBase[0];

            const lider = rankingGeral[0];

            setTexto("cardTotalResultados", resultadosBase.length);

            setTexto(
                "cardMelhorVolta",
                melhorResultado ? formatarTempo(melhorResultado.tempo_volta) : "-"
            );

            setTexto("cardCorridas", corridasRelatorioCache.length);

            if(usuario.tipo === "piloto"){
                setTexto("cardLider", melhorResultado ? getPosicaoPilotoNoRanking(usuario) : "-");
            }else{
                setTexto("cardLider", lider ? getNomePilotoRelatorio(lider).split(" ")[0] : "-");
            }

        }


        function preencherRankingRelatorio(usuario){

            const ranking = ordenarResultadosRelatorio(resultadosRelatorioCache).slice(0,5);

            if(ranking.length === 0){

                setHTML("rankingRelatorio", mostrarVazio(
                    "Ranking vazio",
                    "Ainda não existem tempos registrados no sistema."
                ));

                return;

            }

            const html = `
                <div class="ranking-list">
                    ${ranking.map((resultado, index) => {

                        const nomePiloto = getNomePilotoRelatorio(resultado);

                        const destaque = usuario.tipo === "piloto" &&
                            nomePiloto.toLowerCase().trim() === String(usuario.nome || "").toLowerCase().trim();

                        return `
                            <div class="ranking-item" style="${destaque ? "border:1px solid var(--primary);" : ""}">
                                <div class="ranking-left">
                                    <div class="position">${index + 1}</div>

                                    <div>
                                        <div class="pilot-name">${montarLinkPiloto(nomePiloto, resultado.piloto_id)}</div>
                                        <p>${getNomeCorridaRelatorio(resultado)}</p>
                                    </div>
                                </div>

                                <div class="best-time ${getClasseRanking(index)}">
                                    ${formatarTempo(resultado.tempo_volta)}
                                </div>
                            </div>
                        `;

                    }).join("")}
                </div>
            `;

            setHTML("rankingRelatorio", html);

        }




        function preencherRankingVeiculosRelatorio(){

            // O select permite ver o ranking geral por veículo ou filtrar por faixa de potência.
            const filtro = document.getElementById("filtroCategoriaVeiculo")?.value || "todas";

            const rankingFiltrado = rankingVeiculosRelatorioCache.filter(item => {
                const categoria = item.categoria_potencia || getCategoriaPotencia(item.potencia);
                return filtro === "todas" || categoria === filtro;
            });

            const ranking = rankingFiltrado.slice(0,5);

            if(ranking.length === 0){
                setHTML("rankingVeiculosRelatorio", mostrarVazio(
                    "Sem ranking nesta categoria",
                    "Registre tempos com veículos dessa faixa de potência para montar o ranking."
                ));
                return;
            }

            const html = `
                <div class="ranking-list">
                    ${ranking.map((item, index) => `
                        <div class="ranking-item">
                            <div class="ranking-left">
                                <div class="position">${index + 1}</div>
                                <div>
                                    <div class="pilot-name">${item.veiculo || formatarVeiculo(item)}</div>
                                    <p>${montarLinkPiloto(item.piloto, item.piloto_id)} • ${item.categoria_potencia || getCategoriaPotencia(item.potencia)}</p>
                                </div>
                            </div>
                            <div class="best-time ${getClasseRanking(index)}">${formatarTempo(item.melhor_tempo)}</div>
                        </div>
                    `).join("")}
                </div>
            `;

            setHTML("rankingVeiculosRelatorio", html);

        }


        function preencherRankingPotenciaRelatorio(){

            const categorias = Object.keys(rankingPotenciaRelatorioCache);

            if(categorias.length === 0){
                setHTML("rankingPotenciaRelatorio", mostrarVazio(
                    "Sem ranking por potência",
                    "Cadastre potência nos veículos para usar esse relatório."
                ));
                return;
            }

            const html = categorias.map(categoria => {
                const melhor = rankingPotenciaRelatorioCache[categoria][0];

                if(!melhor){
                    return "";
                }

                return `
                    <div class="ranking-item">
                        <div class="ranking-left">
                            <div class="position"><i class="bi bi-lightning-charge"></i></div>
                            <div>
                                <div class="pilot-name">${categoria}</div>
                                <p>${montarLinkPiloto(melhor.piloto, melhor.piloto_id)} • ${melhor.veiculo || formatarVeiculo(melhor)}</p>
                            </div>
                        </div>
                        <div class="best-time tempo-ouro">${formatarTempo(melhor.tempo_volta)}</div>
                    </div>
                `;
            }).join("");

            setHTML("rankingPotenciaRelatorio", `<div class="ranking-list">${html}</div>`);

        }

        function preencherCorridasRelatorio(){

            const futuras = corridasRelatorioCache
                .filter(corrida => corrida.data && new Date(corrida.data) >= new Date())
                .sort((a,b) => new Date(a.data) - new Date(b.data))
                .slice(0,6);

            if(futuras.length === 0){

                setHTML("corridasRelatorio", mostrarVazio(
                    "Nenhuma corrida futura",
                    "Quando novas corridas forem cadastradas, elas aparecerão aqui."
                ));

                return;

            }

            const html = futuras.map(corrida => `
                <div class="schedule-card">
                    <div>
                        <div class="schedule-hour">${formatarHora(corrida.horario)}</div>
                        <p>${formatarData(corrida.data)}</p>
                    </div>

                    <div class="schedule-info">
                        <strong>${corrida.nome || "Corrida"}</strong>
                        <p>${corrida.pista || "RaceHub Track"}</p>
                    </div>
                </div>
            `).join("");

            setHTML("corridasRelatorio", html);

        }


        function preencherReservasRelatorio(usuario){

            if(usuario.tipo === "piloto"){

                const ultimos = resultadosVisiveisRelatorio
                    .slice()
                    .reverse()
                    .slice(0,6);

                if(ultimos.length === 0){

                    setHTML("reservasRelatorio", mostrarVazio(
                        "Sem histórico",
                        "Seus tempos registrados aparecerão aqui."
                    ));

                    return;

                }

                const htmlPiloto = ultimos.map(resultado => `
                    <div class="schedule-card">
                        <div>
                            <div class="schedule-hour">${formatarTempo(resultado.tempo_volta)}</div>
                            <p>${getNomeCorridaRelatorio(resultado)}</p>
                        </div>

                        <div class="schedule-info">
                            <strong>Tempo registrado</strong>
                            <p>ID #${resultado.id || "-"}</p>
                        </div>
                    </div>
                `).join("");

                setHTML("reservasRelatorio", htmlPiloto);

                return;

            }

            const reservasBase = usuario.tipo === "cliente"
                ? filtrarReservasUsuario(reservasRelatorioCache, usuario)
                : reservasRelatorioCache;

            const reservasOrdenadas = reservasBase
                .slice()
                .sort((a,b) => new Date(b.data) - new Date(a.data))
                .slice(0,6);

            if(reservasOrdenadas.length === 0){

                setHTML("reservasRelatorio", mostrarVazio(
                    "Nenhuma reserva",
                    "Quando houver reservas, elas aparecerão nesta área."
                ));

                return;

            }

            const html = reservasOrdenadas.map(reserva => {

                const nome = reserva.usuario || reserva.cliente || reserva.nome || "Cliente";

                const status = reserva.data && new Date(reserva.data) >= new Date()
                    ? `<span class="status status-success">Futura</span>`
                    : `<span class="status status-warning">Finalizada</span>`;

                return `
                    <div class="schedule-card">
                        <div>
                            <div class="schedule-hour">${formatarHora(reserva.horario)}</div>
                            <p>${formatarData(reserva.data)}</p>
                        </div>

                        <div class="schedule-info">
                            <strong>${usuario.tipo === "cliente" ? "Minha reserva" : nome}</strong>
                            <p style="margin-top:8px;">${status}</p>
                        </div>
                    </div>
                `;

            }).join("");

            setHTML("reservasRelatorio", html);

        }


        function preencherResumoRelatorio(usuario){

            const resultadosBase = resultadosVisiveisRelatorio;

            const tempos = resultadosBase
                .map(resultado => Number(resultado.tempo_volta))
                .filter(tempo => !Number.isNaN(tempo));

            const media = tempos.length > 0
                ? tempos.reduce((total, tempo) => total + tempo, 0) / tempos.length
                : null;

            const corridasFuturas = corridasRelatorioCache.filter(corrida => 
                corrida.data && new Date(corrida.data) >= new Date()
            );

            if(usuario.tipo === "admin"){

                setTexto("resumoPilotos", pilotosRelatorioCache.length);
                setTexto("resumoReservas", reservasRelatorioCache.length);

            }else if(usuario.tipo === "piloto"){

                setTexto("resumoPilotos", "OK");
                setTexto("resumoReservas", resultadosBase.length);

            }else{

                const reservasCliente = filtrarReservasUsuario(reservasRelatorioCache, usuario);

                const pilotosNoRanking = new Set(
                    resultadosRelatorioCache.map(resultado => getNomePilotoRelatorio(resultado))
                );

                setTexto("resumoPilotos", pilotosNoRanking.size);
                setTexto("resumoReservas", reservasCliente.length);

            }

            setTexto("resumoMediaTempo", media ? formatarTempo(media) : "-");

            setTexto("resumoCorridasFuturas", corridasFuturas.length);

        }


        function renderizarTabelaRelatorio(resultados){

            if(!resultados || resultados.length === 0){

                setHTML("tabelaRelatorio", `
                    <tr>
                        <td colspan="6">
                            ${mostrarVazio(
                                "Nenhum resultado encontrado",
                                "Os resultados cadastrados aparecerão nesta tabela."
                            )}
                        </td>
                    </tr>
                `);

                return;

            }

            const html = resultados.map((resultado, index) => `
                <tr>
                    <td>
                        <span class="table-number">${index + 1}º</span>
                    </td>

                    <td>
                        <strong style="color:white;">${montarLinkPiloto(getNomePilotoRelatorio(resultado), resultado.piloto_id)}</strong>
                    </td>

                    <!-- Veículo usado no resultado. Vem da tabela veiculos no backend. -->
                    <td>${formatarVeiculo(resultado)}</td>

                    <td>${getNomeCorridaRelatorio(resultado)}</td>

                    <td>
                        <span class="table-highlight ${getClasseRanking(index)}">${formatarTempo(resultado.tempo_volta)}</span>
                    </td>

                    <td>#${resultado.id || "-"}</td>
                </tr>
            `).join("");

            setHTML("tabelaRelatorio", html);

        }


        function filtrarTabelaRelatorio(){

            const termo = document.getElementById("buscaRelatorio").value
                .toLowerCase()
                .trim();

            if(!termo){
                renderizarTabelaRelatorio(resultadosVisiveisRelatorio);
                return;
            }

            const filtrados = resultadosVisiveisRelatorio.filter(resultado => {

                const campos = [
                    resultado.id,
                    getNomePilotoRelatorio(resultado),
                    getNomeCorridaRelatorio(resultado),
                    formatarVeiculo(resultado),
                    resultado.tempo_volta
                ].map(campo => String(campo || "").toLowerCase());

                return campos.some(campo => campo.includes(termo));

            });

            renderizarTabelaRelatorio(filtrados);

        }


        function getNomePilotoRelatorio(resultado){

            if(resultado.piloto){
                return resultado.piloto;
            }

            if(resultado.nome_piloto){
                return resultado.nome_piloto;
            }

            const piloto = pilotosRelatorioCache.find(item =>
                Number(item.id) === Number(resultado.piloto_id)
            );

            return piloto ? piloto.nome : "Piloto";

        }


        function getNomeCorridaRelatorio(resultado){

            if(resultado.corrida){
                return resultado.corrida;
            }

            if(resultado.nome_corrida){
                return resultado.nome_corrida;
            }

            const corrida = corridasRelatorioCache.find(item =>
                Number(item.id) === Number(resultado.corrida_id)
            );

            return corrida ? corrida.nome : "Corrida";

        }


        function getPosicaoPilotoNoRanking(usuario){

            const ranking = ordenarResultadosRelatorio(resultadosRelatorioCache);

            const index = ranking.findIndex(resultado => {

                const mesmoId = Number(resultado.piloto_id) === Number(usuario.id);

                const mesmoNome = getNomePilotoRelatorio(resultado)
                    .toLowerCase()
                    .trim() === String(usuario.nome || "").toLowerCase().trim();

                return mesmoId || mesmoNome;

            });

            return index >= 0 ? `${index + 1}º` : "-";

        }