// Monte uma página com três perguntas de revisão. Ao clicar em um botão “Mostrar resposta”, mostre a resposta usando innerHTML em uma <div> escondida.

// Comece com a <div> vazia.
// No clique, use div.innerHTML = "Resposta: ...".

const btnMostrarResposta1 = document.querySelector("#pergunta1");
const btnMostrarResposta2 = document.querySelector("#pergunta2");
const btnMostrarResposta3 = document.querySelector("#pergunta3");
const divResposta = document.querySelector("#respostas");

function atualizar_resposta(pergunta) {
    let html = "";

    if(pergunta === "pergunta1"){
        html = "<h2>Resposta da pergunta 1</h2><p>O DOM (Document Object Model) representa a página HTML como uma árvore de nós, em que cada elemento e cada texto viram objetos conectados hierarquicamente.</p>";
    }
    else if(pergunta === "pergunta2"){
        html = "<h2>Resposta da pergunta 2</h2><p>Um evento é qualquer coisa que acontece na página: clique, movimento do mouse, tecla pressionada, envio de formulário, carregamento da página, etc.</p><p>Podemos “escutar” esses eventos e executar uma função quando eles acontecem, deixando a página interativa.</p>";
    }
    else if(pergunta === "pergunta3"){
        html = "<h2>Resposta da pergunta 3</h2><p>innerHTML é uma propriedade que representa o conteúdo HTML interno de um elemento.</p><p>Podemos ler esse conteúdo ou sobrescrevê-lo com uma nova string contendo HTML.</p>";
    }

    divResposta.innerHTML = html;
}

btnMostrarResposta1.addEventListener("click", () => atualizar_resposta(btnMostrarResposta1.id));
btnMostrarResposta2.addEventListener("click", () => atualizar_resposta(btnMostrarResposta2.id));
btnMostrarResposta3.addEventListener("click", () => atualizar_resposta(btnMostrarResposta3.id));
    