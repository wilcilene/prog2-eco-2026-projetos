export function telaLogin() {
    document.getElementById('app').innerHTML = `
    <div class="screen">
        <div class="card">

            <h1>🦆 Flappy Duck</h1>

            <div class="forms">

                <form id="registerForm" method="post">
                    <h2>Cadastro</h2>

                    <label for="registerName">Nome de Usuário:</label>
                    <input type="text" id="registerName" required placeholder="Heitorj6">

                    <label for="registerEmail">E-mail:</label>
                    <input type="email" id="registerEmail" required placeholder="heitorj6@gmail.com">

                    <label for="registerPassword">Senha:</label>
                    <input type="password" id="registerPassword" required placeholder="Hei@075732Chdf">

                    <button type="submit">Cadastrar</button>
                </form>

                <form id="loginForm" method="post">
                    <h2>Login</h2>

                    <label for="loginEmail">E-mail:</label>
                    <input type="email" id="loginEmail" required placeholder="heitorj6@gmail.com">

                    <label for="loginPassword">Senha:</label>
                    <input type="password" id="loginPassword" required placeholder="Hei@075732Chdf">

                    <button type="submit">Entrar</button>
                </form>

            </div>
        </div>
    </div>
    `;
}