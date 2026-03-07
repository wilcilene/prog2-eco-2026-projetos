class Pagamento{
    processar(){
        console.log("Fazendo Pagamento")
    }
}

class PagamentoCartao extends Pagamento{

    processar(){
        console.log("Fazendo pagamento em Cartao");
    }
}

class PagamentoPix extends Pagamento{
    
    processar(){
        console.log("Fazendo pagamento em Pix");
    }
}

class PagamentoBoleto extends Pagamento{
    
    processar(){
        console.log("Fazendo pagamento em Boleto");
    }
}

function pagar(pagamento){
    pagamento.processar();
}


cartao = new PagamentoCartao();
pix = new PagamentoPix();
boleto = new PagamentoBoleto();

pagar(cartao);
pagar(pix);
pagar(boleto);