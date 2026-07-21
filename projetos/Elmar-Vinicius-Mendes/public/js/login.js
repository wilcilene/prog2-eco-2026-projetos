const form = document.getElementById('formLogin');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('iemail').value;
    const senha = document.getElementById('isenha').value;
    const erroEl = document.getElementById('mensagem-erro');

    if (erroEl) erroEl.textContent = "";

    try {
        const resposta = await fetch('/usuarios/login', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, senha })
        });

        if (resposta.ok) {
            const usuario = await resposta.json();
            localStorage.setItem('usuario', JSON.stringify(usuario));
            window.location.href = '/feed.html';
        } else {
            if (erroEl) erroEl.textContent = 'Email ou senha inválidos';
        }

    } catch (erro) {
        console.error("Erro ao fazer login:", erro);
        if (erroEl) erroEl.textContent = 'Erro ao conectar com o servidor';
    }
});
