// deve pegar os dados da classe conta e mostrar na view de conta
import { telaConta } from "../view/conta.js";
import { getConta } from "../state/session.js";

export function contaController(navegarPara) {
    telaConta();

    const conta = getConta();

    document.getElementById("profileId").innerText = conta.id;
    document.getElementById("profileName").innerText = conta.nome;
    document.getElementById("profileScore").innerText = conta.pontuacao;

    document.getElementById("btn-voltar").addEventListener("click", () => {
        navegarPara("menu");
    });

}
