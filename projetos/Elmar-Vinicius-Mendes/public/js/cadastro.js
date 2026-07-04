const telefone = document.getElementById('itelefone');
const usuario  = document.getElementById('iusuario');
const form     = document.getElementById('formCadastro');

const maskTelefone = IMask(telefone, {
    mask: '(00) 00000-0000',
});

const maskUsuario = IMask(usuario, {
    mask: '@********************',
    definitions: { '*': /[a-zA-Z0-9_]/ }
});

telefone.addEventListener('input', () => {
    telefone.style.borderColor = '';
    telefone.setCustomValidity('');
});

usuario.addEventListener('input', () => {
    usuario.style.borderColor = '';
    usuario.setCustomValidity('');
});

function mostrarErro(el, msg) {
    el.style.borderColor = '#ff4d6d';
    el.setCustomValidity(msg);
    el.reportValidity();
}

function limparErro(el) {
    el.style.borderColor = 'green';
    el.setCustomValidity('');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!maskTelefone.masked.isComplete) {
        mostrarErro(telefone, 'Preencha o telefone completo');
        return;
    } else { limparErro(telefone); }

    if (maskUsuario.unmaskedValue.length < 4) {
        mostrarErro(usuario, 'O usuário deve ter pelo menos 4 caracteres');
        return;
    } else { limparErro(usuario); }

    const nome   = document.getElementById('inome').value;
    const email  = document.getElementById('iemail').value;
    const genero = document.getElementById('igenero').value;
    const senha  = document.getElementById('isenha').value;

    try {
        const resposta = await fetch('/usuarios/cadastro', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                nome,
                telefone: maskTelefone.unmaskedValue,
                username: maskUsuario.value,
                email,
                genero,
                senha
            })
        });

        if (resposta.ok) {
            window.location.href = '/index.html';
        } else {
            const dados = await resposta.json();
            alert(dados.msg || 'Erro ao cadastrar. Verifique os dados.');
        }

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert('Erro ao conectar com o servidor');
    }
});
