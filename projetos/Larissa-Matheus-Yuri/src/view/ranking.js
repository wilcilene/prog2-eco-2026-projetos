export function telaRanking() {
    document.getElementById('app').innerHTML = `
        <div class="screen">
            <div class="card">
                <h1>Ranking - Top 10</h1>
                
                <div id="ranking-list" class="ranking-list">
                    <!-- Ranking será inserido aqui -->
                </div>
                
                <button id="btn-voltar" type="click">Voltar</button>
            </div>
        </div>
    `;
}