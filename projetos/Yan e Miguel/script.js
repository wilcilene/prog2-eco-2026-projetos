function abrirLogin(){

    document
        .getElementById("login")
        .scrollIntoView({
            behavior:"smooth"
        });
}

function login(){

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const usuarios =
        obterUsuarios();

    const usuario =
        usuarios.find(u =>

            u.email === email &&
            u.senha === senha
        );

    if(!usuario){

        alert("Usuário ou senha inválidos");

        return;
    }

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    if(usuario.tipo === "admin"){

        window.location.href =
            "admin.html";
    }

    else if(usuario.tipo === "piloto"){

        window.location.href =
            "piloto.html";
    }

    else{

        window.location.href =
            "cliente.html";
    }
}