export function telaMenu() {
    const app = document.getElementById('app');
    app.innerHTML = `
        
    <div id="menuScreen" class="screen">
        <div class="card">

            <h1>MENU</h1>
            <button id="btn-jogar" type="click">Jogar</button>
            <button id="btn-conta" type="click">Conta</button>
            <button id="btn-ranking" type="click">Ranking</button>
            <button id="btn-sair" type="click">Sair</button>

        </div>
    </div>
    `;
}