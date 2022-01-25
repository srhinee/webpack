import mod from './d.js'

mod (100, 11)

import('./b').then (add => add (1, 2))
import('./loader.js').then (r => {
  console.log (r)
})
export default function del (n1, n2) {
  return n1 - n2
}
