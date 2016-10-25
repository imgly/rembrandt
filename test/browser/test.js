/* global Rembrandt */
window.onload = function () {
  const rembrandt = new Rembrandt({
    imageA: 'test.jpg',
    imageB: 'test2.jpg',
    renderComposition: true
  })

  rembrandt.compare()
    .then(function (result) {
      document.body.appendChild(result.compositionImage)
    })
    .catch(function (e) {
      console.error(e)
    })
}
