const usuarioReservasAdmin = requireAuth(["admin"]);

let reservasCache = [];
let usuariosCacheReserva = [];
let reservaEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
    if(usuarioReservasAdmin){
        preencherUsuarioLogado();
        carregarReservasAdmin();
    }
});

async function carregarReservasAdmin(){

    try{

        const [reservas, usuarios] = await Promise.all([
            apiGet("/reservas"),
            apiGet("/usuarios")
        ]);

        reservasCache = Array.isArray(reservas) ? reservas : [];
        usuariosCacheReserva = Array.isArray(usuarios) ? usuarios : [];

        preencherSelectUsuariosReserva(usuariosCacheReserva);
        renderizarReservasAdmin(reservasCache);
        preencherResumoReservas(reservasCache);

    }catch(erro){

        console.error("Erro ao carregar reservas:", erro);

        setHTML("listaReservasAdmin", `
            <tr>
                <td colspan="6">
                    <div class="alert alert-danger">
                        Não foi possível carregar as reservas.
                    </div>
                </td>
            </tr>
        `);

    }

}

function preencherSelectUsuariosReserva(usuarios){

    const select = document.getElementById("usuarioReserva");

    if(!select){
        return;
    }

    const clientes = usuarios.filter(usuario => 
        usuario.tipo === "cliente" || usuario.tipo === "piloto"
    );

    select.innerHTML = `
        <option value="">Cliente não vinculado</option>
        ${clientes.map(usuario => `
            <option value="${usuario.id}">
                ${usuario.nome} - ${formatarTipoUsuario(usuario.tipo)}
            </option>
        `).join("")}
    `;

}

function renderizarReservasAdmin(reservas){

    if(!reservas || reservas.length === 0){

        setHTML("listaReservasAdmin", `
            <tr>
                <td colspan="6">
                    ${mostrarVazio(
                        "Nenhuma reserva cadastrada",
                        "Quando reservas forem criadas, elas aparecerão aqui."
                    )}
                </td>
            </tr>
        `);

        return;

    }

    const html = reservas.map(reserva => {

        const cliente = reserva.usuario 
            || reserva.cliente 
            || reserva.nome_usuario 
            || "Cliente não vinculado";

        return `
            <tr>
                <td>
                    <span class="table-number">#${reserva.id}</span>
                </td>

                <td>
                    <strong style="color:white;">${cliente}</strong>
                    <p style="margin-top:4px;">${reserva.email_cliente || ""}</p>
                </td>

                <td>${formatarData(reserva.data)}</td>

                <td>${formatarHora(reserva.horario)}</td>

                <td>
                    <span class="badge badge-success">
                        Confirmada
                    </span>
                </td>

                <td>
                    <div class="table-actions">

                        <button 
                            class="action-btn" 
                            title="Visualizar reserva"
                            onclick="visualizarReserva(${reserva.id})"
                        >
                            <i class="bi bi-eye"></i>
                        </button>

                        <button 
                            class="action-btn action-edit" 
                            title="Editar reserva"
                            onclick="editarReserva(${reserva.id})"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </button>

                        <button 
                            class="action-btn action-danger" 
                            title="Excluir reserva"
                            onclick="excluirReserva(${reserva.id})"
                        >
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>
                </td>
            </tr>
        `;

    }).join("");

    setHTML("listaReservasAdmin", html);

}

async function cadastrarReservaAdmin(event){

    event.preventDefault();

    const usuarioId = document.getElementById("usuarioReserva").value.trim();
    const data = document.getElementById("dataReserva").value;
    const horario = document.getElementById("horarioReserva").value;
    const message = document.getElementById("reservaMessage");

    message.style.color = "var(--danger)";
    message.textContent = "";

    if(!data || !horario){
        message.textContent = "Preencha data e horário.";
        return;
    }

    const payload = {
        usuario_id: usuarioId ? Number(usuarioId) : null,
        data,
        horario
    };

    try{

        if(reservaEditandoId){

            await apiPut(`/reservas/${reservaEditandoId}`, payload);

            message.style.color = "var(--success)";
            message.textContent = "Reserva atualizada com sucesso.";

            cancelarEdicaoReserva(false);

        }else{

            await apiPost("/reservas", payload);

            message.style.color = "var(--success)";
            message.textContent = "Reserva cadastrada com sucesso.";

            event.target.reset();

        }

        await carregarReservasAdmin();

    }catch(erro){

        message.style.color = "var(--danger)";
        message.textContent = erro.message || "Erro ao salvar reserva.";

    }

}

function visualizarReserva(id){

    const reserva = reservasCache.find(item => Number(item.id) === Number(id));

    if(!reserva){
        alert("Reserva não encontrada.");
        return;
    }

    const cliente = reserva.usuario 
        || reserva.cliente 
        || reserva.nome_usuario 
        || "Cliente não vinculado";

    alert(
        `Reserva #${reserva.id}\n\n` +
        `Cliente: ${cliente}\n` +
        `Data: ${formatarData(reserva.data)}\n` +
        `Horário: ${formatarHora(reserva.horario)}\n` +
        `Pista: ${reserva.pista || "RaceHub Track"}`
    );

}

function normalizarDataInputReserva(data){

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

function editarReserva(id){

    const reserva = reservasCache.find(item => Number(item.id) === Number(id));

    if(!reserva){
        alert("Reserva não encontrada.");
        return;
    }

    reservaEditandoId = id;

    document.getElementById("usuarioReserva").value = reserva.usuario_id || "";
    document.getElementById("dataReserva").value = normalizarDataInputReserva(reserva.data);
    document.getElementById("horarioReserva").value = formatarHora(reserva.horario);

    document.getElementById("tituloFormReserva").textContent = `Editando reserva #${id}`;
    document.getElementById("textoSalvarReserva").textContent = "Salvar alterações";
    document.getElementById("btnCancelarEdicaoReserva").style.display = "inline-flex";

    const message = document.getElementById("reservaMessage");
    message.style.color = "var(--gold)";
    message.textContent = "Modo edição ativo.";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

function cancelarEdicaoReserva(limparMensagem = true){

    reservaEditandoId = null;

    document.getElementById("tituloFormReserva").textContent = "Cadastrar reserva";
    document.getElementById("textoSalvarReserva").textContent = "Cadastrar reserva";
    document.getElementById("btnCancelarEdicaoReserva").style.display = "none";

    document.getElementById("usuarioReserva").value = "";
    document.getElementById("dataReserva").value = "";
    document.getElementById("horarioReserva").value = "";

    if(limparMensagem){
        document.getElementById("reservaMessage").textContent = "";
    }

}

async function excluirReserva(id){

    const confirmar = confirm(`Deseja realmente excluir a reserva #${id}?`);

    if(!confirmar){
        return;
    }

    try{

        await apiDelete(`/reservas/${id}`);
        await carregarReservasAdmin();

    }catch(erro){

        alert(erro.message || "Erro ao excluir reserva.");

    }

}

function preencherResumoReservas(reservas){

    const hoje = hojeISO();

    const reservasHoje = reservas.filter(reserva => {
        const dataReserva = typeof reserva.data === "string"
            ? reserva.data.substring(0,10)
            : normalizarDataInputReserva(reserva.data);

        return dataReserva === hoje;
    });

    const agora = new Date();

    const reservasFuturas = reservas.filter(reserva => {
        const dataReserva = typeof reserva.data === "string"
            ? reserva.data.substring(0,10)
            : normalizarDataInputReserva(reserva.data);

        const horarioReserva = reserva.horario
            ? String(reserva.horario).substring(0,5)
            : "00:00";

        const dataHoraReserva = new Date(`${dataReserva}T${horarioReserva}:00`);

        return dataHoraReserva >= agora;
    });

    const clientesUnicos = new Set(
        reservas
            .filter(reserva => reserva.usuario_id)
            .map(reserva => reserva.usuario_id)
    );

    preencherValorResumo([
        "totalReservasAdmin",
        "totalReservas",
        "reservasTotal"
    ], reservas.length);

    preencherValorResumo([
        "reservasHojeAdmin",
        "reservasHoje",
        "totalReservasHoje"
    ], reservasHoje.length);

    preencherValorResumo([
        "reservasFuturasAdmin",
        "reservasFuturas",
        "proximasReservas"
    ], reservasFuturas.length);

    preencherValorResumo([
        "clientesReservasAdmin",
        "clientesReservas",
        "clientesComReserva"
    ], clientesUnicos.size);

}


function preencherValorResumo(ids, valor){

    ids.forEach(id => {
        const elemento = document.getElementById(id);

        if(elemento){
            elemento.textContent = valor;
        }
    });

}
