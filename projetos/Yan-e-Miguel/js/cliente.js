const usuarioCliente = requireAuth(["cliente"]);

        if(usuarioCliente){
            carregarDashboardCliente(usuarioCliente);
        }


        async function carregarDashboardCliente(usuario){

            try{

                preencherUsuarioLogado();

                const [reservas, corridas] = await Promise.all([
                    buscarComFallback("/reservas"),
                    buscarComFallback("/corridas")
                ]);

                const minhasReservas = filtrarReservasDoCliente(reservas, usuario);

                preencherCardsCliente(minhasReservas, corridas);

                preencherProximasReservas(minhasReservas);

                preencherHistoricoReservas(minhasReservas);

                preencherCorridasFuturasCliente(corridas);

            }catch(erro){

                console.error(erro);

                setHTML("proximasReservasCliente", `
                    <div class="alert alert-danger">
                        Não foi possível carregar suas reservas.
                    </div>
                `);

                setHTML("historicoReservasCliente", `
                    <div class="alert alert-danger">
                        Não foi possível carregar seu histórico.
                    </div>
                `);

                setHTML("corridasFuturasCliente", `
                    <div class="alert alert-danger">
                        Não foi possível carregar as corridas.
                    </div>
                `);

            }

        }


        async function buscarComFallback(rota){

            try{
                return await apiGet(rota);
            }catch{
                return [];
            }

        }


        function filtrarReservasDoCliente(reservas, usuario){

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


        function preencherCardsCliente(minhasReservas, corridas){

            const agora = new Date();

            const reservasFuturas = minhasReservas
                .filter(reserva => reserva.data && new Date(reserva.data) >= agora)
                .sort((a,b) => new Date(a.data) - new Date(b.data));

            const corridasFuturas = corridas
                .filter(corrida => corrida.data && new Date(corrida.data) >= agora);

            const proximaReserva = reservasFuturas[0];

            setTexto("totalReservasCliente", minhasReservas.length);

            setTexto(
                "proximaReservaCliente",
                proximaReserva ? formatarDataCurta(proximaReserva.data) : "-"
            );

            setTexto("corridasDisponiveisCliente", corridasFuturas.length);

            setTexto("reservasFuturasCliente", reservasFuturas.length);

        }


        function preencherProximasReservas(minhasReservas){

            const agora = new Date();

            const futuras = minhasReservas
                .filter(reserva => reserva.data && new Date(reserva.data) >= agora)
                .sort((a,b) => new Date(a.data) - new Date(b.data))
                .slice(0,5);

            if(futuras.length === 0){

                setHTML("proximasReservasCliente", mostrarVazio(
                    "Nenhuma reserva futura",
                    "Faça uma nova reserva para aparecer nesta área."
                ));

                return;

            }

            const html = futuras.map(reserva => `
                <div class="schedule-card">
                    <div>
                        <div class="schedule-hour">${formatarHora(reserva.horario)}</div>
                        <p>${formatarData(reserva.data)}</p>
                    </div>

                    <div class="schedule-info">
                        <strong>Reserva confirmada</strong>
                        <p>${reserva.pista || "RaceHub Track"}</p>
                    </div>
                </div>
            `).join("");

            setHTML("proximasReservasCliente", html);

        }


        function preencherHistoricoReservas(minhasReservas){

            const historico = minhasReservas
                .slice()
                .sort((a,b) => new Date(b.data) - new Date(a.data))
                .slice(0,6);

            if(historico.length === 0){

                setHTML("historicoReservasCliente", mostrarVazio(
                    "Sem histórico",
                    "Suas reservas registradas aparecerão aqui."
                ));

                return;

            }

            const html = historico.map(reserva => {

                const dataReserva = reserva.data ? new Date(reserva.data) : null;

                const status = dataReserva && dataReserva >= new Date()
                    ? `<span class="status status-success">Futura</span>`
                    : `<span class="status status-warning">Finalizada</span>`;

                return `
                    <div class="schedule-card">
                        <div>
                            <div class="schedule-hour">${formatarHora(reserva.horario)}</div>
                            <p>${formatarData(reserva.data)}</p>
                        </div>

                        <div class="schedule-info">
                            ${status}
                            <p style="margin-top:8px;">${reserva.pista || "RaceHub Track"}</p>
                        </div>
                    </div>
                `;

            }).join("");

            setHTML("historicoReservasCliente", html);

        }


        function preencherCorridasFuturasCliente(corridas){

            const agora = new Date();

            const futuras = corridas
                .filter(corrida => corrida.data && new Date(corrida.data) >= agora)
                .sort((a,b) => new Date(a.data) - new Date(b.data))
                .slice(0,5);

            if(futuras.length === 0){

                setHTML("corridasFuturasCliente", mostrarVazio(
                    "Nenhuma corrida futura",
                    "Quando a administração cadastrar eventos, eles aparecerão aqui."
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

            setHTML("corridasFuturasCliente", html);

        }