function abrirLogin() {
  document.getElementById("login").scrollIntoView({ behavior: "smooth" });
}

async function login() {
  const email = document.getElementById("email").value;

  const senha = document.getElementById("senha").value;

  try {
    const usuario = await autenticarUsuario(email, senha);

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    if (usuario.tipo === "admin") {
      window.location.href = "admin.html";
    } else if (usuario.tipo === "piloto") {
      window.location.href = "piloto.html";
    } else {
      window.location.href = "cliente.html";
    }
  } catch (erro) {
    alert(erro.message);
  }
}
