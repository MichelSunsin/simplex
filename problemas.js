const M = 'M'
/*
  Defina os valores de c, A e b
  Importante: O problema precisa estar na forma padrão de minimização

  op: Se a função objetivo é de minimização ou maximização (atribua 'min' ou 'max')
  c: Vetor de coeficientes da função objetivo
  A: Matriz de coeficientes das restrições
  b: Vetor de termos independentes das restrições

  O programa utilizará o método simplex de duas fases se o vetor de custo
  c contiver algum valor M. Caso contrário, o programa utilizará o método
  simplex padrão.
*/

// Exemplo de duas fases com solução ótima
const op = 'max'
let c = [-1, -1, 0, 0, 0, 0, M, M]

let A = [
  [1, 0, -1, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, -1, 0, 0, 1],
  [0, 1, 0, 0, 0, 1, 0, 0],
]

let b = [2, 4, 2, 4]

// Exemplo de duas fases com solução inviável
// const op = 'max'
// let c = [-1, -1, 0, 0, M, M]

// let A = [
//   [1, -1, -1, 0, 1, 0],
//   [-3, 2, 0, -1, 0, 1],
// ]

// let b = [2, 12]

// Exemplo de uma fase com solução ótima
// const op = 'max'
// let c = [-1, -1, 0, 0]
// let A = [
//   [24, 16, 1, 0],
//   [5, 10, 0, 1],
// ]
// let b = [96, 45]

// Exemplo de uma fase com solução ilimitada
// const op = 'max'
// let c = [-1, -2, 0, 0]
// let A = [
//   [-1 / 3, 1, 1, 0],
//   [-1, 3, 0, 1],
// ]
// let b = [40, 60]

module.exports = { op, c, A, b, M }
