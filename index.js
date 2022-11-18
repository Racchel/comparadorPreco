const { v4: uuidv4 } = require('uuid');

const listaDeProdutos = [
   {
      nome: "Café Amore",
      precoUnitario: 30.00,
      pesoUnitario: 1,
      unidadeMedida: "kg",
   },
   {
      nome: "Café 3Corações",
      precoUnitario: 13.50,
      pesoUnitario: 500,
      unidadeMedida: "g",
   },
   {
      nome: "Café Pilão",
      precoUnitario: 6,
      pesoUnitario: 250,
      unidadeMedida: "g",
   }
]

const main = (produtos = []) => {
   const listaDeProdutos = montarListaComAtributosAdicionais(produtos)

   const produtosConvertidosParaMesmaMedida = converterProdutosParaMesmaUnidadeDeMedida(listaDeProdutos)
   
   const produtoMaiorPeso = verificarQualProdutoPossuiMaiorPeso(produtosConvertidosParaMesmaMedida)

   const todosOsProdutos_ExcetoODeMaiorPeso = produtosConvertidosParaMesmaMedida.filter(produto => produto !== produtoMaiorPeso) 

   const todosOsProdutosComPesoEPrecoAtualizado_ExcetoODeMaiorPeso = 
      multiplicaOPesoEPrecoAteChegarNoPesoMaior(todosOsProdutos_ExcetoODeMaiorPeso, produtoMaiorPeso.pesoTotal)

   const todosOsProdutosComOMaiorPesoComPrecoAtualizado = [...todosOsProdutosComPesoEPrecoAtualizado_ExcetoODeMaiorPeso, produtoMaiorPeso]

   const produtoComMaiorPesoEMenorPreco = verificarQualProdutoPossuiMenorPreco(todosOsProdutosComOMaiorPesoComPrecoAtualizado)
   exibirMensagem(produtoComMaiorPesoEMenorPreco, produtoMaiorPeso)
}

// INICIAR

const montarListaComAtributosAdicionais = (produtos = []) => {
   const listaDeProdutosPronta = produtos

   produtos.forEach((produto, index) => {
      
      listaDeProdutosPronta[index] = {
         identificadorUnico: uuidv4(),
         nome: produto.nome,
         precoUnitario: produto.precoUnitario,
         precoTotal: produto.precoUnitario,
         pesoUnitario: produto.pesoUnitario,
         pesoTotal: produto.pesoUnitario,
         unidadeMedida: produto.unidadeMedida,
         unidadeMedidaConvertida: produto.unidadeMedida,
         quantidade: 1
      }

   })

   return listaDeProdutosPronta
}

// CONVERSÃO DE MOEDAS

const converterPrecoEmMoedaBR = (preco) => {
   return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco)
}

// CONVERSÃO DE MEDIDAS 

const converterProdutosParaMesmaUnidadeDeMedida = (produtos = []) => {
  
   const listaDeProdutosNaMesmaMedida = produtos
   
   produtos.forEach((produto, index) => {
      if (produto.unidadeMedida === "kg" || produto.unidadeMedida === "l") {
         produto.pesoTotal = converterPesoemKgOuL(produto.pesoUnitario )
         produto.unidadeMedidaConvertida = converterUnidadeDeMedida(produto.unidadeMedida )
         listaDeProdutosNaMesmaMedida[index] = produto
      }
   })

   return listaDeProdutosNaMesmaMedida
}


const converterPesoemKgOuL = (peso = 0) => {
   // converter Kg para g =>> gramas = kg * 1000
   // converter L para ml =>> mililitros = litros * 1000

   return peso * 1000
}

const converterUnidadeDeMedida = (unidadeMedida) => {
   if (unidadeMedida === "kg" ) return unidadeMedida = "g"
   if (unidadeMedida === "l" ) return unidadeMedida = "ml"
}

// VERIFICAR MAIOR OU MENOR

const verificarQualProdutoPossuiMaiorPeso = (produtos = []) => {
   
   const produtoMaiorPeso = produtos.reduce((saved, current) => {
      return ((!saved || current.pesoTotal > saved.pesoTotal)) ? current : saved;
   }, null)
   
   return produtoMaiorPeso
}

const verificarQualProdutoPossuiMenorPreco = (produtosAtualizado = []) => {
   
   const produtoMenorPrecoAtualizado = produtosAtualizado.reduce((saved, current) => {
      return ((!saved || current.precoTotal < saved.precoTotal)) ? current : saved;
   }, null)

   return produtoMenorPrecoAtualizado
}


// MULTIPLICAR PESO E PREÇO

const multiplicaOPesoEPrecoAteChegarNoPesoMaior = (produtos = [], maiorPeso = 0) => {
   
   const listaDeProdutosAtualizados = produtos
   
   produtos.forEach((produto, index) => {
      listaDeProdutosAtualizados[index] = formulaMultiplicaOPesoEPreco(produto, maiorPeso)
   })

   return listaDeProdutosAtualizados
}

const formulaMultiplicaOPesoEPreco = (produto = {}, maiorPeso = 0) => {
   const quantidadeProduto =  Math.ceil(maiorPeso / produto.pesoTotal)

   produto.pesoTotal = quantidadeProduto * produto.pesoTotal
   produto.precoTotal = quantidadeProduto * produto.precoUnitario
   produto.quantidade = quantidadeProduto

   return produto
}

// MENSAGEM FINAL

const exibirMensagem = (produtoVantagem, produtoMaiorPeso) => {
   const produtoVantagem_precoTotalEmReais = converterPrecoEmMoedaBR(produtoVantagem.precoTotal)
   const produtoVantagem_precoUnitarioEmReais = converterPrecoEmMoedaBR(produtoVantagem.precoUnitario)
   const produtoVantagem_pesoTotalComUnidade = exibirPesoComMedida(produtoVantagem.pesoTotal, produtoVantagem.unidadeMedidaConvertida)
   const produtoVantagem_pesoUnitarioComUnidade = exibirPesoComMedida(produtoVantagem.pesoUnitario, produtoVantagem.unidadeMedida)
   
   const produtoMaiorPeso_pesoTotalComUnidade = exibirPesoComMedida(produtoMaiorPeso.pesoTotal, produtoMaiorPeso.unidadeMedidaConvertida)
   const produtoMaiorPeso_precoTotalEmReais= converterPrecoEmMoedaBR(produtoMaiorPeso.precoTotal)

   const quantidade = exibirQuantidade(produtoVantagem.quantidade)
   const valorEconomia = converterPrecoEmMoedaBR(produtoMaiorPeso.precoTotal - produtoVantagem.precoTotal)

   let mensagemGeral = `
    O produto com maior vantagem é ${produtoVantagem.nome.toUpperCase()}. 
      ------
      
      Compre:         ${quantidade}
      Preço unitário: ${produtoVantagem_precoUnitarioEmReais}
      Peso unitário:  ${produtoVantagem_pesoUnitarioComUnidade}
      _____
   `

   let mensagemComparativa = `
      Pague:            
      Preço total:    ${produtoVantagem_precoTotalEmReais}
      Peso total:     ${produtoVantagem_pesoTotalComUnidade}
      -----

      Em relação ao ${produtoMaiorPeso.nome.toUpperCase()}, que também pesa ${produtoMaiorPeso_pesoTotalComUnidade} 
      e custa mais caro (${produtoMaiorPeso_precoTotalEmReais})
      
      Você economiza: ${valorEconomia}
   `

   if (produtoVantagem.identificadorUnico === produtoMaiorPeso.identificadorUnico) {
      return console.log(mensagemGeral)
   } else {
      return console.log(mensagemGeral + mensagemComparativa)
   }

}

const exibirPesoComMedida = (peso, unidadeMedida) => {
   return  `${peso}${unidadeMedida}`
}

const exibirQuantidade = (quantidade) => {
   if (quantidade < 2 ) return `${quantidade} unidade`
   
   return `${quantidade} unidades`
}

main(listaDeProdutos)