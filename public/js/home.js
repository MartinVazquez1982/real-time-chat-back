document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelector('#squares')

  const areaWindow = window.innerWidth * window.innerHeight
  const areaSquare = 11025
  const componentes = Math.floor(areaWindow / areaSquare)

  for (let i = 0; i < componentes; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    squares.appendChild(square)
  }
})
