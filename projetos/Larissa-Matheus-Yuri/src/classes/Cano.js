export default class Cano {

    constructor(x, espaco, imagem, canvasHeight) {

        this.x = x;

        this.largura = 60;

        this.espaco = espaco;

        this.sprite = imagem;

        this.passou = false;

        this.canvasHeight =
            canvasHeight;

        let areaSegura =

            this.canvasHeight -
            this.espaco -
            120;

        this.alturaSuperior =

            Math.floor(
                Math.random() * areaSegura
            ) + 60;
    }

    atualizarCano(velocidade) {

        this.x -= velocidade;
    }

    atualizar(velocidade) {
        this.atualizarCano(velocidade);
    }

    desenhar(ctx) {

        if(
            this.sprite &&
            this.sprite.complete
        ){

            // Cano superior
            ctx.save();

            ctx.translate(
                this.x,
                this.alturaSuperior
            );

            ctx.scale(1,-1);

            ctx.drawImage(

                this.sprite,

                0,
                0,

                this.largura,
                this.alturaSuperior
            );

            ctx.restore();

            // Cano inferior
            ctx.drawImage(

                this.sprite,

                this.x,

                this.alturaSuperior +
                this.espaco,

                this.largura,

                this.canvasHeight -

                (
                    this.alturaSuperior +
                    this.espaco
                )
            );
        }
    }

    colidiu(pato){

        return (

            pato.x <
            this.x + this.largura &&

            pato.x + pato.largura >
            this.x &&

            (

                pato.y <
                this.alturaSuperior ||

                pato.y + pato.altura >

                this.alturaSuperior +
                this.espaco

            )
        );
    }
}