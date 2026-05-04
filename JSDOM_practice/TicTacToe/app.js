var isXturn = true

function main() {
    var wrapper = document.querySelector('.wrapper')
    createTictactoeLayout(wrapper)
}

function createTictactoeLayout(wrapper) {
    // create title
    var titleDiv = document.createElement('div')
    titleDiv.classList.add('titleDiv')

    var title = document.createElement('h1')
    title.textContent = 'Tic Tac Toe'
    title.classList.add('title')

    titleDiv.appendChild(title)
    wrapper.appendChild(titleDiv)

    // create game grid
    var gameGrid = createGameGrid()
    gameGrid.addEventListener('click', playGame)
    wrapper.appendChild(gameGrid)

    // create control butons
    var controlDiv = document.createElement('div')
    controlDiv.classList.add('controlDiv')

    var resetBtn = document.createElement('button')
    resetBtn.textContent = 'Reset'
    resetBtn.classList.add('resetBtn')
    resetBtn.addEventListener('click', clearBoard)
    controlDiv.appendChild(resetBtn)
    wrapper.appendChild(controlDiv)
}

function createGameGrid() {
    var grid = document.createElement('div')
    grid.classList.add('gameGrid')

    for (let i = 0; i < 9; i++) {
        var cell = document.createElement('div')
        cell.classList.add('cell')
        var index = i + 1
        cell.classList.add(`${index}`)
        grid.appendChild(cell)
    }

    return grid
}

function playGame(event) {
    var clickedCell = event.target
    if (clickedCell.textContent == '') {
        if (isXturn) {
            clickedCell.innerHTML = 'X'
            isXturn = false
        } else {
            clickedCell.innerHTML = 'O'
            isXturn = true
        }
        if (didWin()) {
            var gameGrid = document.querySelector('.gameGrid')
            gameGrid.removeEventListener('click', playGame)
        }
    }
}

function clearBoard() {
    var gameGrid = document.querySelector('.gameGrid')
    var cells = Array.from(gameGrid.querySelectorAll('.cell'))
    cells.forEach(element => {
        element.innerHTML = ''
        element.classList.remove('win')
        isXturn = true
        gameGrid.addEventListener('click', playGame)
    });
}

function didWin() {
    var cells = Array.from(document.querySelectorAll('.cell'))
    var diagonalLeftToRight = [cells[0], cells[4], cells[8]]
    var diagonalRightToLeft = [cells[2], cells[4], cells[6]]
    return (didWinHelper(cells, cells.length, 3, 1, 2) 
        || didWinHelper(cells, 3, 1, 3, 6) 
        || didWinHelper(diagonalLeftToRight, 1, 1, 1, 2) 
        || didWinHelper(diagonalRightToLeft, 1, 1, 1, 2))
}


function didWinHelper(cells, limit, incrementAmount, firstAdjacent, secondAdjacent) {
    var i = 0
    while (i < limit) {
        if ((cells[i].textContent == 'X' && cells[i + firstAdjacent].textContent == 'X' && cells[i + secondAdjacent].textContent == 'X')
            || (cells[i].textContent == 'O' && cells[i + firstAdjacent].textContent == 'O' && cells[i + secondAdjacent].textContent == 'O')) {
            cells[i].classList.add('win')
            cells[i + firstAdjacent].classList.add('win')
            cells[i + secondAdjacent].classList.add('win')
            return true
        }
        i += incrementAmount
    }
    return false
}