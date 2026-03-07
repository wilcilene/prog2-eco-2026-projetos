// Classe base para pagamentos
class Pagamento {
    constructor(valor) {
        this.valor = valor;
    }

    processar() {
        // comportamento genérico ou abstract
        throw new Error('Método processar() deve ser implementado pelas subclasses');
    }
}

// Subclasse para cartão de crédito
class PagamentoCartao extends Pagamento {
    constructor(valor, numeroCartao) {
        super(valor);
        this.numeroCartao = numeroCartao;
    }

    processar() {
        console.log(`Processando pagamento de R$${this.valor} no cartão ${this.numeroCartao}`);
        // lógica de validação, comunicação com gateway etc.
    }
}

// Subclasse para PIX
class PagamentoPix extends Pagamento {
    constructor(valor, chavePix) {
        super(valor);
        this.chavePix = chavePix;
    }

    processar() {
        console.log(`Processando PIX de R$${this.valor} para chave ${this.chavePix}`);
        // lógica de verificação de saldo, confirmação de recebimento etc.
    }
}

// Subclasse para boleto
class PagamentoBoleto extends Pagamento {
    constructor(valor, codigoBarras) {
        super(valor);
        this.codigoBarras = codigoBarras;
    }

    processar() {
        console.log(`Gerando boleto de R$${this.valor} com código ${this.codigoBarras}`);
        // geração do boleto e instruções de pagamento
    }
}

// Função que usa polimorfismo
function pagar(pagamento) {
    pagamento.processar();
}

// Demonstração
const cartao = new PagamentoCartao(150.00, '1234-5678-9012-3456');
const pix = new PagamentoPix(200.00, 'abc@pix');
const boleto = new PagamentoBoleto(75.50, '00190500954014481606906809350314337370000000100');

pagar(cartao);
pagar(pix);
pagar(boleto);
