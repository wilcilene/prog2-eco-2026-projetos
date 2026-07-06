export function telaConta() {
    document.getElementById('app').innerHTML = `
    
        <div class="screen">

            <div class="card">

                <h1>Perfil</h1>

                <p>ID: <span id="profileId"></span></p>
                <p>Nome: <span id="profileName"></span></p>
                <p>Maior Pontuação: <span id="profileScore"></span></p>

                <button id="btn-voltar" type="click">Voltar</button>

            </div>

        </div>
    `;
}