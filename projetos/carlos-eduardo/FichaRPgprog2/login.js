async function login() {

    const email =
        document.getElementById("email").value;

    const senha =
        document.getElementById("senha").value;

    const resposta = await fetch(
        "http://localhost:3000/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                senha
            })
        }
    );

    const dados =
        await resposta.json();

   if (dados.token) {

    localStorage.setItem(
        "token",
        dados.token
    );

    localStorage.setItem(
        "usuarioId",
        dados.usuario.id
    );

    localStorage.setItem(
        "usuario",
        JSON.stringify(dados.usuario)
    );

    window.location.href =
        "index.html";
} else {

        alert("Login inválido");
    }
}