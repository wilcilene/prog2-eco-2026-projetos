//Atividade 5 – Sistema de pagamentos

class Pagamento{

    processar(){

        console.log('Processando pagamento...');
    }


}

class PagamentoCartao extends Pagamento{

    processar(){

        console.log('Processando pagamento com cartão de crédito...');
    }

}

class PagamentoPix extends Pagamento{

    processar(){

        console.log('Processando pagamento com Pix...');
    }

}

class PagamentoBoleto extends Pagamento{

    processar(){

        console.log('Processando pagamento com boleto bancário...');
    }

}

function pagamento(pagamento){
    pagamento.processar();
}

const cartao = new PagamentoCartao();
const pix = new PagamentoPix();
const boleto = new PagamentoBoleto();

pagamento(cartao);
pagamento(pix);
pagamento(boleto);
