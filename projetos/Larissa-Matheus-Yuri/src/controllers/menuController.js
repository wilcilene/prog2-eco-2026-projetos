//chamar a view de menu e chamar a navegação para as outras views dependendo do botao apertado
import { telaMenu } from '../view/menu.js';

export function menuController(navegarPara){

    telaMenu();

    const btnRanking = document.getElementById('btn-ranking');
    const btnJogar = document.getElementById('btn-jogar');
    const btnConta = document.getElementById('btn-conta');
    const btnSair = document.getElementById('btn-sair');
    
    btnRanking.addEventListener('click', () => {
        navegarPara('ranking');
    });

    btnJogar.addEventListener('click', () => {
        navegarPara('jogar');
    });

    btnConta.addEventListener('click', () => {
        navegarPara('conta');
    });

    
    btnSair.addEventListener('click', () => {
        window.location.reload(true);
    });

}
