function getRandomColor() {
    let newColor = '#'
    let possibleHexColorDigits = '0123456789ABCDEF'
    for (let i = 0; i < 6; i++) {
        newColor += possibleHexColorDigits[Math.floor(Math.random() * 16)]
    }
    return newColor
}

function assignColorToBoxes(arg = 9) {
    var grid = document.querySelector('.grid')
    for (let i = 0; i < arg; i++) {
        var box = document.createElement('div')
        box.classList.add('box')
        var randomColor = getRandomColor()
        console.log(randomColor)
        box.setAttribute('style', `background-color: ${randomColor}`)
        box.innerHTML = randomColor
        grid.appendChild(box)
    }
}

const colorGrid = document.querySelector('.grid')
var currentColor = document.querySelector('.current-value')
colorGrid.addEventListener('click', function (e) {
    if (e.target.className == 'box') {
        var boxBcolor = e.target.innerHTML
        console.log(boxBcolor)
        currentColor.innerHTML = boxBcolor
        document.querySelector('body').style.backgroundColor = boxBcolor
    }
})