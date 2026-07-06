// logica de guardar a conta do usuario logado, para ser usada em outras telas, como a tela de conta e a tela de gameover (para atualizar a pontuação do usuario)

export let contaLogada = null;

export function setConta(conta) {
    contaLogada = conta;
}

export function getConta() {
    return contaLogada;
}