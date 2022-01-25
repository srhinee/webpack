(function () {
  const button = document.getElementById ('button')
  let original = true

  function toggle () {
    original = !original
    button.innerHTML = original ? 'original' : 'optimized'
    graph.changeData (original ? originalData : optimizeData)
    graph.fitView ()
  }
  button.innerHTML = original ? 'original' : 'optimized'
  button.addEventListener ('click', toggle)
} ())
