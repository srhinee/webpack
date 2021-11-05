import add from './b.js'

add(1, 2)

import('./c').then(del => del(1, 2))
export default function (args) {
  return args+'2222'
}
