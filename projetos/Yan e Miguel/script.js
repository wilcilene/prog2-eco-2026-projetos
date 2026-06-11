function abrirLogin(){
    document
        .getElementById("login")
        .scrollIntoView({
            behavior:"smooth"
        });
}

function login(){

    const tipo =
        document.getElementById("tipo").value;

    if(tipo === "admin"){
        alert("Dashboard Admin");
    }

    if(tipo === "piloto"){
        alert("Dashboard Piloto");
    }

    if(tipo === "cliente"){
        alert("Dashboard Cliente");
    }
}
function login(){

    const tipo =
        document.getElementById("tipo").value;

    if(tipo === "admin"){
        window.location.href =
            "admin.html";
    }

    if(tipo === "piloto"){
        window.location.href =
            "piloto.html";
    }

    if(tipo === "cliente"){
        window.location.href =
            "cliente.html";
    }
}