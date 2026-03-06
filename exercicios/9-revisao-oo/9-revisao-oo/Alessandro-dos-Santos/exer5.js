class Pagamento {
    constructor(valor) {
        this.valor = valor;
    }

    processar() {
        console.log(`Processando pagamento de R$${this.valor}`);
    }
}

class PagamentoCartao extends Pagamento {
    constructor(valor, numeroCartao) {
        super(valor);
        this.numeroCartao = numeroCartao;
    }

    processar() {
        console.log(`Pagamento de R$${this.valor} realizado com CARTÃO final ${this.numeroCartao.slice(-4)}`);
    }
}

class PagamentoPix extends Pagamento {
    constructor(valor, chavePix) {
        super(valor);
        this.chavePix = chavePix;
    }

    processar() {
        console.log(`Pagamento de R$${this.valor} realizado via PIX para chave ${this.chavePix}`);
    }
}

class PagamentoBoleto extends Pagamento {
    constructor(valor, codigoBoleto) {
        super(valor);
        this.codigoBoleto = codigoBoleto;
    }

    processar() {
        console.log(`Pagamento de R$${this.valor} realizado via BOLETO código ${this.codigoBoleto}`);
    }
}

function pagar(pagamento) {
    pagamento.processar();
}


// Teste
const p1 = new PagamentoCartao(150, "1234567812345678");
const p2 = new PagamentoPix(75, "email@pix.com");
const p3 = new PagamentoBoleto(200, "34191790010104351004791020150008291070000020000");

pagar(p1);
pagar(p2);
pagar(p3);