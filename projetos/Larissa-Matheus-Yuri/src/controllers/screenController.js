import { menuController } from '../controllers/menuController.js';
import { rankingController } from '../controllers/rankingController.js';
import { jogarController } from '../controllers/JogarController.js';
import { contaController } from '../controllers/contaController.js';
import { loginController } from '../controllers/loginController.js';

function navegarPara(tela) {

    if (tela === 'menu') {
        menuController(navegarPara);
    } else if (tela === 'ranking') {
        rankingController(navegarPara);
    }
    else if (tela === 'jogar') {
        jogarController(navegarPara);
    }
    else if (tela === 'conta') {
        contaController(navegarPara);
    }
    else if (tela === 'login') {
        loginController(navegarPara);
    }
}
// Inicia o app chamando a primeira tela
navegarPara('login');