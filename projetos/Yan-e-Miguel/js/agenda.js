const usuarioAgenda = requireAuth(["cliente"]);

        let reservasAgendaCache = [];

        if(usuarioAgenda){
            iniciarAgenda(usuarioAgenda);
        }


        async function iniciarAgenda(usuario){

            try{

                preencherUsuarioLogado();

                const hoje = hojeISO();

                document.getElementById("dataAgenda").min = hoje;
                document.getElementById("dataAgenda").value = hoje;

                await carregarReservasAgenda();

                atualizarDisponibilidadeDia();

                preencherMinhasReservasAgenda(usuario);

                preencherResumoAgenda(usuario);

            }catch(erro){

                console.error(erro);

                setHTML("minhasProximasReservas", `
                    <div class="alert alert-danger">
                        Não foi possível carregar suas reservas.
                    </div>
                `);

            }

        }


        async function carregarReservasAgenda(){

            const reservas = await apiGet("/reservas");

            reservasAgendaCache = Array.isArray(reservas) ? reservas : [];

        }


        async function criarReservaCliente(event){

            event.preventDefault();

            const usuario = getUsuarioLogado();

            const data = document.getElementById("dataAgenda").value;
            const horario = document.getElementById("horarioAgenda").value;
            const message = document.getElementById("agendaMessage");

            message.style.color = "var(--danger)";
            message.textContent = "";

            if(!usuario){
                window.location.href = "index.html";
                return;
            }

            if(!data || !horario){
                message.textContent = "Preencha data e horário.";
                return;
            }

            if(data < hojeISO()){
                message.textContent = "Não é possível reservar uma data passada.";
                return;
            }

            const conflito = reservasAgendaCache.some(reserva => {
                const mesmaData = String(reserva.data).substring(0,10) === data;
                const mesmoHorario = formatarHora(reserva.horario) === formatarHora(horario);

                return mesmaData && mesmoHorario;
            });

            if(conflito){
                message.textContent = "Este horário já está reservado. Escolha outro horário.";
                return;
            }

            try{

                await apiPost("/reservas", {
                    usuario_id: usuario.id,
                    data,
                    horario
                });

                message.style.color = "var(--success)";
                message.textContent = "Reserva criada com sucesso.";

                document.getElementById("horarioAgenda").value = "";

                await carregarReservasAgenda();

                atualizarDisponibilidadeDia();

                preencherMinhasReservasAgenda(usuario);

                preencherResumoAgenda(usuario);

            }catch(erro){

                message.style.color = "var(--danger)";
                message.textContent = erro.message || "Erro ao criar reserva.";

            }

        }


        function atualizarDisponibilidadeDia(){

            const dataSelecionada = document.getElementById("dataAgenda").value;

            if(!dataSelecionada){

                setHTML("disponibilidadeDia", `
                    <div class="alert alert-warning">
                        Selecione uma data para visualizar a disponibilidade.
                    </div>
                `);

                return;

            }

            const reservasDoDia = reservasAgendaCache
                .filter(reserva => String(reserva.data).substring(0,10) === dataSelecionada)
                .sort((a,b) => String(a.horario).localeCompare(String(b.horario)));

            setTexto("horariosOcupadosDia", reservasDoDia.length);

            if(reservasDoDia.length === 0){

                setHTML("disponibilidadeDia", mostrarVazio(
                    "Dia livre",
                    "Ainda não existem reservas registradas para esta data."
                ));

                return;

            }

            const html = reservasDoDia.map(reserva => `
                <div class="schedule-card">
                    <div>
                        <div class="schedule-hour">${formatarHora(reserva.horario)}</div>
                        <p>${formatarData(reserva.data)}</p>
                    </div>

                    <div class="schedule-info">
                        <span class="status status-warning">Ocupado</span>
                        <p style="margin-top:8px;">${reserva.pista || "RaceHub Track"}</p>
                    </div>
                </div>
            `).join("");

            setHTML("disponibilidadeDia", html);

        }


        function filtrarReservasDoUsuario(usuario){

            return reservasAgendaCache.filter(reserva => {

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


        function preencherMinhasReservasAgenda(usuario){

            const minhasReservas = filtrarReservasDoUsuario(usuario);

            const futuras = minhasReservas
                .filter(reserva => reserva.data && new Date(reserva.data) >= new Date())
                .sort((a,b) => new Date(a.data) - new Date(b.data))
                .slice(0,5);

            if(futuras.length === 0){

                setHTML("minhasProximasReservas", mostrarVazio(
                    "Nenhuma reserva futura",
                    "Crie uma nova reserva para aparecer nesta área."
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
                        <span class="status status-success">Confirmada</span>
                        <p style="margin-top:8px;">${reserva.pista || "RaceHub Track"}</p>
                    </div>
                </div>
            `).join("");

            setHTML("minhasProximasReservas", html);

        }


        function preencherResumoAgenda(usuario){

            const minhasReservas = filtrarReservasDoUsuario(usuario);

            const futuras = minhasReservas.filter(reserva => 
                reserva.data && new Date(reserva.data) >= new Date()
            );

            const dataSelecionada = document.getElementById("dataAgenda").value;

            const reservasDoDia = reservasAgendaCache.filter(reserva =>
                String(reserva.data).substring(0,10) === dataSelecionada
            );

            setTexto("totalMinhasReservas", minhasReservas.length);

            setTexto("minhasReservasFuturas", futuras.length);

            setTexto("horariosOcupadosDia", reservasDoDia.length);

        }