export function telaJogar() {
    document.getElementById('app').innerHTML = `
        <div id="gameScreen" class="screen">

            <div id="score">0</div>

            <canvas id="gameCanvas" width="400" height="600"></canvas>

        </div>

        <div id="gameOverScreen" class="screen">

            <div class="card">

                <h1>💀 Game Over</h1>

                <p>Pontuação: <span id="finalScore"></span></p>
                <p>Recorde: <span id="bestScore"></span></p>

                <button type="click" id="btn-restart">Jogar Novamente</button>
                <button type="click" id="btn-menu">Voltar ao Menu</button>

            </div>

        </div>
    `;
}