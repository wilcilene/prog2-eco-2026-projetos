class Pagamento {
    constructor(valor) {
        this.valor = valor;
    }
    
    processar() {
        console.log("Processando pagamento...");
    }
}


class PagamentoCartao extends Pagamento {
    processar() {
        console.log(`R$ ${this.valor} pago no CARTÃO`);
    }
}


class PagamentoPix extends Pagamento {
    processar() {
        console.log(`R$ ${this.valor} pago via PIX`);
    }
}


class PagamentoBoleto extends Pagamento {
    processar() {
        console.log(`R$ ${this.valor} pago com BOLETO`);
    }
}


function pagar(pagamento) {
    pagamento.processar();
}

let cartao = new PagamentoCartao(100);
let pix = new PagamentoPix(50);
let boleto = new PagamentoBoleto(75);

pagar(cartao);  
pagar(pix);     
pagar(boleto);  
