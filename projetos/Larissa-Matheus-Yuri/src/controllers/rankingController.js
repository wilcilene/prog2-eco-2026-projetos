// consumir a api de ranking para mostrar os 10 melhores jogadores e suas pontuações, e mostrar na view de ranking
// verificar se o usuario ta na lista dos 10 melhores jogadores, se estiver não faz nada, se não estiver, colocar o usuario na 11 linha, mostrando seu nome e pontuação

import { telaRanking } from '../view/ranking.js';
import { getConta } from "../state/session.js";

export async function rankingController(navegarPara) {
    telaRanking();
    
    try {
        const response = await fetch("/ranking/top10");
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.message);
            return;
        }
        
        const ranking = data.ranking;
        const contaLogada = getConta();
        const usuarioNoTop10 = ranking.some(user => user.username === contaLogada.nome);
        
        mostrarRanking(ranking, usuarioNoTop10, contaLogada);
        
    } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        alert("Erro ao carregar ranking");
    }
    document.getElementById("btn-voltar").addEventListener("click", () => {
        navegarPara("menu");
    });
}

function mostrarRanking(ranking, usuarioNoTop10, contaLogada) {
    const rankingContainer = document.getElementById("ranking-list");
    if (!rankingContainer) return;
    
    rankingContainer.innerHTML = "";
    
    ranking.forEach((user, index) => {
        const rankingItem = document.createElement("div");
        rankingItem.className = "ranking-item";
        if (user.username === contaLogada.nome) {
            rankingItem.classList.add("current-user");
        }
        rankingItem.innerHTML = `
            <span class="ranking-position">${index + 1}º</span>
            <span class="ranking-name">${user.username}</span>
            <span class="ranking-score">${user.maximum_score} pts</span>
        `;
        rankingContainer.appendChild(rankingItem);
    });
    if (!usuarioNoTop10) {
        const separator = document.createElement("div");
        separator.className = "ranking-separator";
        separator.innerHTML = "<span>...</span>";
        rankingContainer.appendChild(separator);
        
        const userItem = document.createElement("div");
        userItem.className = "ranking-item current-user";
        userItem.innerHTML = `
            <span class="ranking-position">11º</span>
            <span class="ranking-name">${contaLogada.nome}</span>
            <span class="ranking-score">${contaLogada.pontuacao} pts</span>
        `;
        rankingContainer.appendChild(userItem);
    }
}