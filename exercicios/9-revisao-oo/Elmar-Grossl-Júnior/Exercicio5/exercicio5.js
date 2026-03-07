class Pagamento {
    constructor(valor) {
        this.valor = valor;
    }

    processar() {
        console.log("Processando pagamento...");
    }
}

class PagamentoCartao extends Pagamento {
    constructor(valor, numeroCartao) {
        super(valor);
        this.numeroCartao = numeroCartao;
    }

    processar() {
        console.log(`Pagamento de R$${this.valor} realizado no cartão final ${this.numeroCartao.slice(-4)}`);
    }
}

class PagamentoPix extends Pagamento {
    constructor(valor, chavePix) {
        super(valor);
        this.chavePix = chavePix;
    }

    processar() {
        console.log(`Pagamento de R$${this.valor} realizado via PIX para ${this.chavePix}`);
    }
}

class PagamentoBoleto extends Pagamento {
    constructor(valor, codigoBoleto) {
        super(valor);
        this.codigoBoleto = codigoBoleto;
    }

    processar() {
        console.log(`Boleto gerado no valor de R$${this.valor}. Código: ${this.codigoBoleto}`);
    }
}

function pagar(pagamento) {
    pagamento.processar();
}

const p1 = new PagamentoCartao(1500, "1234567812345678");
const p2 = new PagamentoPix(575, "viniciusdoneli@gmail.com");
const p3 = new PagamentoBoleto(1000, "172377777182391929939192931223122231231245523346");

pagar(p1);
pagar(p2);
pagar(p3);