export default class Pato {

    constructor(sprite) {

        this.x = 50;
        this.y = 150;

        this.largura = 60;
        this.altura = 60;

        this.velocidadeY = 0;

        this.gravidade = 0.5;

        this.forcaPulo = -6;

        this.frame = 0;

        this.contadorAnim = 0;

        this.sprite = sprite;
    }

    setSprite(sprite) {
        this.sprite = sprite;
    }

    pular() {

        this.velocidadeY =
            this.forcaPulo;

        this.frame = 0;
    }

    atualizar() {

        this.velocidadeY +=
            this.gravidade;

        this.y +=
            this.velocidadeY;

        // animação
        this.contadorAnim++;

        if(
            this.contadorAnim % 6 === 0
        ){

            this.frame =
                (this.frame + 1) % 6;
        }
    }

    atualizarPosicao() {
        this.atualizar();
    }

    desenhar(ctx) {

        if(
            this.sprite &&
            this.sprite.complete
        ){

            let coluna =
                this.frame % 2;

            let linha =
                Math.floor(
                    this.frame / 2
                );

            ctx.drawImage(

                this.sprite,

                coluna * 32,
                linha * 32,

                32,
                32,

                this.x - 30,
                this.y - 30,

                this.largura,
                this.altura
            );
        }
    }
}