const M = 'M'
let c = [-1, -1, 0, 0, 0, 0, M, M]

let A = [
  [1, 0, -1, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, -1, 0, 0, 1],
  [0, 1, 0, 0, 0, 1, 0, 0],
]

let b = [2, 4, 2, 4]

/* 
  Método que contrói o vetor de custo, sem os custos artificiais
  e o vetor de custo artificial
*/

function construirVetoresDeCusto() {
  // Vetor custo sem variáveis artificiais
  const cSemArtificiais = c.map((x) => {
    if (x === M) {
      return 0
    }

    return x
  })

  // Vetor custo artificial
  const cArtificial = c.map((x) => {
    if (x === M) {
      return 1
    }

    return 0
  })

  return { cSemArtificiais, cArtificial }
}

function construirVetorDeBasesIniciais() {
  const indicePrimeiraVariavelFolga = c.findIndex((x) => x === 0)
  let indiceLinha = 0
  const vetorDeBasesIniciais = []

  while (indiceLinha < A.length) {
    for (
      let indiceColuna = indicePrimeiraVariavelFolga;
      indiceColuna < c.length;
      indiceColuna++
    ) {
      if (A[indiceLinha][indiceColuna] === 1) {
        vetorDeBasesIniciais.push({
          indice: indiceColuna,
          valor: A[indiceLinha][indiceColuna],
        })
      }
    }

    indiceLinha++
  }

  return vetorDeBasesIniciais
}

function construirVetorCustosReduzidos(vetorCusto, bases) {
  const custosReduzidos = []

  for (let indiceColuna = 0; indiceColuna < vetorCusto.length; indiceColuna++) {
    let custoReduzido = 0

    for (let indiceLinha = 0; indiceLinha < A.length; indiceLinha++) {
      const indiceVetorCusto = bases[indiceLinha].indice

      custoReduzido +=
        vetorCusto[indiceVetorCusto] * A[indiceLinha][indiceColuna]
    }

    custosReduzidos.push(vetorCusto[indiceColuna] - custoReduzido)
  }

  return custosReduzidos
}

function verificaQuemSaiDaBase(vetorCustoReduzido) {
  let menorCusto = 0
  let indiceColunaPivo = -1

  for (let i = 0; i < vetorCustoReduzido.length; i++) {
    if (vetorCustoReduzido[i] < menorCusto) {
      menorCusto = vetorCustoReduzido[i]
      indiceColunaPivo = i
    }
  }

  return indiceColunaPivo
}

function verificaQuemEntraNaBase(indiceMenorCusto) {
  let pivo = null
  let indiceLinhaPivo = -1

  for (let i = 0; i < A.length; i++) {
    const candidatoPivo = b[i] / A[i][indiceMenorCusto]
    if (
      candidatoPivo !== Infinity &&
      candidatoPivo >= 0 &&
      (pivo === null || candidatoPivo < pivo)
    ) {
      pivo = candidatoPivo
      indiceLinhaPivo = i
    }
  }

  return indiceLinhaPivo
}

function atualizaMatrizAeVetorB(indiceLinhaPivo, indiceColunaPivo) {
  let novaA = [...A]
  let novoB = [...b]

  const pivo = novaA[indiceLinhaPivo][indiceColunaPivo]

  for (let indiceLinha = 0; indiceLinha < novaA.length; indiceLinha++) {
    if (indiceLinha !== indiceLinhaPivo) {
      const coeficienteLinear = novaA[indiceLinha][indiceColunaPivo] / pivo

      for (
        let indiceColuna = 0;
        indiceColuna < novaA[0].length;
        indiceColuna++
      ) {
        novaA[indiceLinha][indiceColuna] =
          novaA[indiceLinha][indiceColuna] -
          coeficienteLinear * novaA[indiceLinhaPivo][indiceColuna]
      }

      novoB[indiceLinha] =
        novoB[indiceLinha] - coeficienteLinear * novoB[indiceLinhaPivo]
    }
  }

  return { novaA, novoB }
}

function atualizaBases(indiceLinhaPivo, indiceColunaPivo, bases) {
  const novasBases = [...bases]

  novasBases[indiceLinhaPivo] = {
    indice: indiceColunaPivo,
    valor: A[indiceLinhaPivo][indiceColunaPivo],
  }

  return novasBases
}

function removerColunasVariaveisArtificiais(A, custosReduzidos) {
  let aSemColunasArtificiais = [...A]
  let custosReduzidosSemColunasArtificiais = [...custosReduzidos]

  while (c.some((x) => x === M)) {
    const indiceColuna = c.findIndex((x) => x === M)
    console.log(indiceColuna)

    aSemColunasArtificiais.forEach((row, index) => {
      row.splice(indiceColuna, 1)
    })

    custosReduzidosSemColunasArtificiais.splice(indiceColuna, 1)

    c.splice(indiceColuna, 1)
  }

  return { aSemColunasArtificiais, custosReduzidosSemColunasArtificiais }
}

function simplex(c, A, b, custosReduzidosPreviamenteCalculados, bases) {
  let custosReduzidos = []
  if (custosReduzidosPreviamenteCalculados) {
    custosReduzidos = [...custosReduzidosPreviamenteCalculados]
  } else {
    custosReduzidos = construirVetorCustosReduzidos(c, bases)
  }

  while (custosReduzidos.some((x) => x < 0)) {
    const indiceColunaPivo = verificaQuemSaiDaBase(custosReduzidos)
    const indiceLinhaPivo = verificaQuemEntraNaBase(indiceColunaPivo)

    const { novaA, novoB } = atualizaMatrizAeVetorB(
      indiceLinhaPivo,
      indiceColunaPivo,
    )

    let novasBases = atualizaBases(indiceLinhaPivo, indiceColunaPivo, bases)

    A = [...novaA]
    b.forEach((_, index) => (b[index] = novoB[index]))
    bases = [...novasBases]

    custosReduzidos = construirVetorCustosReduzidos(c, bases)
  }

  console.log('A: ', A)
  console.log('b: ', b)
  console.log('bases: ', bases)
  console.log('cr: ', custosReduzidos)
}

/*
  A: Matriz de coeficientes das restrições
  b: Vetor de termos independentes das restrições
  c: Vetor de coeficientes da função objetivo
*/
function simplexDuasFases(c, A, b) {
  const { cSemArtificiais, cArtificial } = construirVetoresDeCusto()

  let bases = construirVetorDeBasesIniciais()

  let custosReduzidos = construirVetorCustosReduzidos(cSemArtificiais, bases)
  let custosReduzidosArtificial = construirVetorCustosReduzidos(
    cArtificial,
    bases,
  )

  let contadorIteracao = 1
  while (custosReduzidosArtificial.some((x) => x < 0)) {
    const indiceColunaPivo = verificaQuemSaiDaBase(custosReduzidosArtificial)
    const indiceLinhaPivo = verificaQuemEntraNaBase(indiceColunaPivo)

    let { novaA, novoB } = atualizaMatrizAeVetorB(
      indiceLinhaPivo,
      indiceColunaPivo,
    )

    let novasBases = atualizaBases(indiceLinhaPivo, indiceColunaPivo, bases)

    A = [...novaA]
    b.forEach((_, index) => (b[index] = novoB[index]))
    bases = [...novasBases]

    custosReduzidos = construirVetorCustosReduzidos(cSemArtificiais, bases)
    custosReduzidosArtificial = construirVetorCustosReduzidos(
      cArtificial,
      bases,
    )

    console.log(`Iteração ${contadorIteracao}`)
    console.log('A: ', A)
    console.log('b: ', b)
    console.log('bases: ', bases)
    console.log('cr: ', custosReduzidos)
    console.log('cra: ', custosReduzidosArtificial)

    contadorIteracao++
  }

  console.log('Fim da primeira fase. Iniciando segunda fase...')

  let { aSemColunasArtificiais, custosReduzidosSemColunasArtificiais } =
    removerColunasVariaveisArtificiais(A, custosReduzidos)

  A = [...aSemColunasArtificiais]
  custosReduzidos = [...custosReduzidosSemColunasArtificiais]

  simplex(c, A, b, custosReduzidos, bases)
}

simplexDuasFases(c, A, b)
