class Pagamento {
    constructor(valor) {
        if (valor <= 0) {
            throw new Error("O valor do pagamento deve ser maior que zero.");
        }

        this.valor = valor;
    }

    processar() {
        throw new Error("O método processar() deve ser implementado pelas subclasses.");
    }
}

class PagamentoCartao extends Pagamento {
    constructor(valor, numeroCartao) {
        super(valor);

        if (!numeroCartao || numeroCartao.trim() === "") {
            throw new Error("Número do cartão é obrigatório.");
        }

        this.numeroCartao = numeroCartao;
    }

    processar() {
        return `Pagamento de R$${this.valor} realizado com Cartão (${this.numeroCartao}).`;
    }
}

class PagamentoPix extends Pagamento {
    constructor(valor, chavePix) {
        super(valor);

        if (!chavePix || chavePix.trim() === "") {
            throw new Error("Chave PIX é obrigatória.");
        }

        this.chavePix = chavePix;
    }

    processar() {
        return `Pagamento de R$${this.valor} realizado via PIX para a chave ${this.chavePix}.`;
    }
}

class PagamentoBoleto extends Pagamento {
    constructor(valor, codigoBarras) {
        super(valor);

        if (!codigoBarras || codigoBarras.trim() === "") {
            throw new Error("Código de barras do boleto é obrigatório.");
        }

        this.codigoBarras = codigoBarras;
    }

    processar() {
        return `Pagamento de R$${this.valor} realizado via Boleto (código ${this.codigoBarras}).`;
    }
}

function pagar(pagamento) {
    if (!(pagamento instanceof Pagamento)) {
        throw new Error("Objeto de pagamento inválido.");
    }

    console.log(pagamento.processar());
}

const pagamento1 = new PagamentoCartao(275, "1234-5678-9012-3456");
const pagamento2 = new PagamentoPix(8000, "junigrossl@gmail.com");
const pagamento3 = new PagamentoBoleto(1100, "12225.99001 01043.510022 88020.210008 5 35080000020000");

pagar(pagamento1);
pagar(pagamento2);
pagar(pagamento3);