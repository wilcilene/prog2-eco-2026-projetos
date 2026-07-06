// chamar a view de jogo, e quando o jogo acabar navegar para a view de gameover
import { telaJogar } from "../view/jogar.js";
import { getConta } from "../state/session.js";
import Jogo from "../classes/Jogo.js";

export function jogarController(navegarPara) {
    telaJogar();

    const jogar = document.getElementById('gameScreen');
    jogar.style.display = 'none';

    const gameover = document.getElementById('gameOverScreen');
    gameover.style.display = 'none';

    // Se já existir um jogo em execução, descartar antes de criar outro.
    if (typeof window !== 'undefined' && window.__currentJogo) {
        try {
            window.__currentJogo.dispose();
            window.__currentJogo = null;
        } catch (error) {
            console.warn('Erro ao descartar jogo anterior', error);
        }
    }

    const jogo = new Jogo(navegarPara);
    jogo.iniciar(getConta());

}