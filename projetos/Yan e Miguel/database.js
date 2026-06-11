
function obterUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function obterReservas() {
    return JSON.parse(localStorage.getItem("reservas")) || [];
}

function salvarReservas(reservas) {
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

function obterCorridas() {
    return JSON.parse(localStorage.getItem("corridas")) || [];
}

function salvarCorridas(corridas) {
    localStorage.setItem("corridas", JSON.stringify(corridas));
}

function obterTempos() {
    return JSON.parse(localStorage.getItem("tempos")) || [];
}

function salvarTempos(tempos) {
    localStorage.setItem("tempos", JSON.stringify(tempos));
}

function inicializarSistema() {

    const usuarios = obterUsuarios();

    if (usuarios.length === 0) {

        usuarios.push({

            id: 1,

            nome: "Yan Admin",

            email: "yanaugustoscholze@gmail.com",

            senha: "yan",

            tipo: "admin",

            protegido: true

        });

        usuarios.push({

            id: 2,

            nome: "Administrador Secundário",

            email: "diretoria@racehub.com",

            senha: "123",

            tipo: "admin",

            protegido: true

        });

        salvarUsuarios(usuarios);
    }
}

inicializarSistema();
