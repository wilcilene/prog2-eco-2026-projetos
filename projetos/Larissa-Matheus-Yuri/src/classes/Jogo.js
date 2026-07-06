import Pato from "./Pato.js";
import Cano from "./Cano.js";

export default class Jogo {

    constructor(navegarPara) {

        this.navegarPara = navegarPara;

        const tela =
            document.getElementById(
                "gameCanvas"
            );

        const contexto =
            tela.getContext("2d");

        // Canvas
        this.canvas = tela;
        this.ctx = contexto;

        // RAF id for canceling animation frames
        this.rafId = null;

        // Pixel art
        this.ctx.imageSmoothingEnabled =
            false;

        // Estado
        this.estado = "MENU";

        // Pontuação
        this.pontuacao = 0;

        // Canos
        this.obstaculos = [];

        // Distância entre canos
        this.distanciaCanos = 280;

        // Velocidade dos canos
        this.velocidadeCano = 4;

        // Jogador atual
        this.jogador = null;

        // Carregar imagens
        this.carregarImagens();

        // Controles
        this.configurarControles();

        // Garantir apenas uma instância ativa do jogo na página
        if(typeof window !== 'undefined'){
            if(window.__currentJogo && window.__currentJogo !== this){
                try{
                    window.__currentJogo.dispose();
                }catch(e){
                    console.warn('Erro ao descartar jogo anterior', e);
                }
            }

            window.__currentJogo = this;
        }
    }

    carregarImagens(){

        // Fundo
        this.fundo = new Image();

        this.fundo.src =
            "./images/fundo.png";

        // Pato
        this.imagemPato =
            new Image();

        this.imagemPato.src =
            "./images/pato.png";

        // Cano
        this.imagemCano =
            new Image();

        this.imagemCano.src =
            "./images/cano.png";
    }

    configurarControles(){
        this._keydownHandler = e => {
            if (e.code === "Space") {
                e.preventDefault();

                if (this.estado === "JOGANDO") {
                    this.pato && this.pato.pular();
                } else if (this.estado === "GAME_OVER") {
                    this.iniciar(this.jogador);
                }
            }
        };

        document.addEventListener("keydown", this._keydownHandler);
    }

    iniciar(conta){

        this.jogador = conta;

        this.estado = "JOGANDO";

        this.pontuacao = 0;

        document.getElementById(
            "score"
        ).innerText = 0;

        this.obstaculos = [];

        // Criar pato
        this.pato = new Pato();

        // Passar sprite
        this.pato.setSprite(
            this.imagemPato
        );

        const mostratelajogo = document.getElementById('gameScreen');
        mostratelajogo.style.display = 'flex';

        const tirartelagameover = document.getElementById('gameOverScreen');
        tirartelagameover.style.display = 'none';

        // Começar loop imediatamente
        this.loop();
    }

    loop(){

        // Se morreu
        if(
            this.estado !==
            "JOGANDO"
        ){

            this.desenharGameOver();

            return;
        }

        // Atualizar
        this.atualizar();

        // Desenhar
        this.desenhar();

        // Próximo frame
        this.rafId = requestAnimationFrame(
            () => this.loop()
        );
    }

    atualizar(){

        // Atualizar pato
        this.pato.atualizar();

        // Criar canos
        if(

            this.obstaculos.length === 0 ||

            this.obstaculos[
                this.obstaculos.length - 1
            ].x

            <

            this.canvas.width -
            this.distanciaCanos

        ){

            this.obstaculos.push(

                new Cano(

                    this.canvas.width,

                    170,

                    this.imagemCano,

                    this.canvas.height
                )
            );
        }

        // Atualizar canos
        for(

            let i =
            this.obstaculos.length - 1;

            i >= 0;

            i--

        ){

            let cano =
                this.obstaculos[i];

            // Movimento
            cano.atualizar(
                this.velocidadeCano
            );

            // Colisão
            if(
                this.verificarColisao(
                    this.pato,
                    cano
                )
            ){

                this.gameOver();

                // Parar processamento deste frame para evitar
                // que outros canos incrementem a pontuação
                // ou continuem a atualização após o game over.
                return;
            }

            // Pontuação (somente se ainda estiver jogando)
            if(
                this.estado === "JOGANDO" &&
                !cano.passou &&
                cano.x + cano.largura <
                this.pato.x
            ){
                cano.passou = true;

                this.pontuacao++;

                document.getElementById(
                    "score"
                ).innerText = this.pontuacao;
            }

            // Remover cano
            if(
                cano.x <
                -cano.largura
            ){

                this.obstaculos.splice(
                    i,
                    1
                );
            }
        }

        // Limites tela
        if(

            this.pato.y +
            30 >

            this.canvas.height

            ||

            this.pato.y - 30 < 0

        ){

            this.gameOver();

            // garantir que não continua atualizando neste frame
            return;
        }
    }

    desenhar(){

        // Fundo
        this.ctx.drawImage(

            this.fundo,

            0,
            0,

            this.canvas.width,
            this.canvas.height
        );

        // Canos
        this.obstaculos.forEach(
            cano => {

                cano.desenhar(this.ctx);
            }
        );

        // Pato
        this.pato.desenhar(this.ctx);
    }

    verificarColisao(
        pato,
        cano
    ){

        let hb = 18;

        if(

            pato.x + hb >
            cano.x

            &&

            pato.x - hb <
            cano.x +
            cano.largura

        ){

            if(

                pato.y - hb <
                cano.alturaSuperior

                ||

                pato.y + hb >

                cano.alturaSuperior +
                cano.espaco

            ){

                // Debug: log positions to help identificar falsos positivos
                try{
                    console.debug('VerificarColisao: colisao detectada', {
                        pato: { x: pato.x, y: pato.y, largura: pato.largura, altura: pato.altura },
                        cano: { x: cano.x, largura: cano.largura, alturaSuperior: cano.alturaSuperior, espaco: cano.espaco }
                    });
                }catch(e){}

                return true;
            }
        }

        return false;
    }

    dispose(){
        // Forçar parada do loop e marcar como game over
        this.estado = "GAME_OVER";

        if(this.rafId){
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this._keydownHandler) {
            document.removeEventListener("keydown", this._keydownHandler);
            this._keydownHandler = null;
        }

        if (typeof window !== 'undefined' && window.__currentJogo === this) {
            window.__currentJogo = null;
        }
    }

    desenharGameOver(){

        this.ctx.fillStyle =
            "rgba(0,0,0,0.7)";

        this.ctx.fillRect(

            0,
            0,

            this.canvas.width,
            this.canvas.height
        );

        this.ctx.fillStyle =
            "white";

        this.ctx.textAlign =
            "center";

        this.ctx.font =
            "bold 40px Arial";

        this.ctx.fillText(

            "GAME OVER",

            this.canvas.width / 2,
            220
        );

        this.ctx.font =
            "bold 70px Arial";

        this.ctx.fillText(

            this.pontuacao,

            this.canvas.width / 2,
            320
        );

        this.ctx.font =
            "20px Arial";

        this.ctx.fillText(

            "ESPAÇO PARA REINICIAR",

            this.canvas.width / 2,
            400
        );
    }

    async gameOver(){

        this.estado =
            "GAME_OVER";

        if(this.rafId){
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        // Atualizar recorde
        if(this.jogador){

            if(this.pontuacao > this.jogador.pontuacao){

                this.jogador.pontuacao = this.pontuacao;

                try {
                    const response = await fetch("/game/savescore", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id_user: this.jogador.id,
                            newScore: this.jogador.pontuacao
                        })
                    });

                    const data = await response.json();

                    if(!response.ok){
                        alert(data.message);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        

        // Mostrar tela de game over
        document.getElementById(
            "finalScore"
        ).innerText = this.pontuacao;

        document.getElementById(
            "bestScore"
        ).innerText = this.jogador.pontuacao;

        const tirartelajogo = document.getElementById('gameScreen');
        tirartelajogo.style.display = 'none';

        const mostrartelagameover = document.getElementById('gameOverScreen');
        mostrartelagameover.style.display = 'flex';

        document.getElementById(
            "btn-restart"
        ).onclick = 
        () => this.iniciar(this.jogador);

        document.getElementById(
            "btn-menu"
        ).onclick =
        () => {
            this.navegarPara("menu");
        }
    }
} 
