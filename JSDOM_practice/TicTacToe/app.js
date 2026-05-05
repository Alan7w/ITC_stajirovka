var isXturn = true

var stepsList = {}
var firstTurn = 'X'

function main() {
    var wrapper = document.querySelector('.wrapper')
    createTictactoeLayout(wrapper)
    updateTurnButtonsUI()
}

function createTictactoeLayout(wrapper) {
    // create boardDiv
    var board = document.createElement('div')
    board.classList.add('boardDiv')

    // create title
    var titleDiv = document.createElement('div')
    titleDiv.classList.add('titleDiv')

    var title = document.createElement('h1')
    title.textContent = 'Tic Tac Toe'
    title.classList.add('title')

    titleDiv.appendChild(title)
    board.appendChild(titleDiv)

    // create game grid
    var gameGrid = createGameGrid()
    gameGrid.addEventListener('click', playGame)
    board.appendChild(gameGrid)

    // create control butons
    var controlDiv = document.createElement('div')
    controlDiv.classList.add('controlDiv')

    var resetBtn = document.createElement('button')
    resetBtn.textContent = 'Reset'
    resetBtn.classList.add('resetBtn')
    resetBtn.addEventListener('click', clearBoard)
    controlDiv.appendChild(resetBtn)
    board.appendChild(controlDiv)

    wrapper.appendChild(board)
    createSidePanel(wrapper)
}

function createSidePanel(wrapper) {
    var sidePanel = document.createElement('div')
    sidePanel.classList.add('sidePanel')

    sidePanel.appendChild(createStatusBar())
    sidePanel.appendChild(createTurnSelector())
    sidePanel.appendChild(createStepsTable())

    wrapper.appendChild(sidePanel)
}

function createStatusBar() {
    var statusBar = document.createElement('div')
    statusBar.classList.add('statusBar')
    statusBar.textContent = 'Game in progress'
    return statusBar
}

function createTurnSelector() {
    var turnSelector = document.createElement('div')
    turnSelector.classList.add('turnSelector')

    var label = document.createElement('p')
    label.textContent = 'First turn:'
    turnSelector.appendChild(label)

    var xBtn = document.createElement('button')
    xBtn.textContent = 'X'
    xBtn.classList.add('turnBtn')

    var oBtn = document.createElement('button')
    oBtn.textContent = 'O'
    oBtn.classList.add('turnBtn')

    xBtn.addEventListener('click', handleTurnChoice)
    oBtn.addEventListener('click', handleTurnChoice)

    turnSelector.appendChild(xBtn)
    turnSelector.appendChild(oBtn)
    return turnSelector
}

function createStepsTable() {
    var stepsTable = document.createElement('table')
    stepsTable.classList.add('stepsTable')
    var thead = stepsTable.createTHead()
    var headRow = thead.insertRow()
    headRow.insertCell(0).textContent = 'Steps #'
    headRow.insertCell(1).textContent = 'Player X'
    headRow.insertCell(2).textContent = 'Player O'

    stepsTable.createTBody()

    stepsTable.addEventListener('click', handleStepBtnClick)

    return stepsTable
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
    var clickedCell;
    var gameGrid = document.querySelector('.gameGrid')
    if (event.target.classList[0] == 'cell') {
        clickedCell = event.target
        if (clickedCell.textContent == '') {
            if (isXturn) {
                clickedCell.innerHTML = 'X'
                addToStepsList(gameGrid)
                addStep(clickedCell.classList[1], Object.keys(stepsList).length)
                isXturn = false
            } else {
                clickedCell.innerHTML = 'O'
                addToStepsList(gameGrid)
                addStep(clickedCell.classList[1], Object.keys(stepsList).length)
                isXturn = true
            }
            if (didWin()) {
                var winner = isXturn ? 'O' : 'X'
                var loser = winner === 'X' ? 'O' : 'X'
                setGameStatus(`${winner} wins, ${loser} loses`)
                gameGrid.removeEventListener('click', playGame)
                document.querySelector('table').removeEventListener('click', handleStepBtnClick)
            } else if (isTie()) {
                setGameStatus('Tie')
                gameGrid.removeEventListener('click', playGame)
                document.querySelector('table').removeEventListener('click', handleStepBtnClick)
            } else {
                setGameStatus('Game in progress')
            }
        }
    }

}

function addStep(cellIndex, currStep) {
    var stepsTableBody = document.querySelector('table').querySelector('tbody')
    var newRow = stepsTableBody.insertRow()
    newRow.insertCell(0).innerHTML = `<button id='stepBtn${currStep}'>${currStep}</button>`

    if (isXturn) {
        newRow.insertCell(1).textContent = `X(${cellIndex})`
        newRow.insertCell(2).textContent = ''
    } else {
        newRow.insertCell(1).textContent = ''
        newRow.insertCell(2).textContent = `O(${cellIndex})`
    }
}

function addToStepsList(gameGrid) {
    var cells = Array.from(gameGrid.querySelectorAll('.cell'))
    let currentCells = cells.map(function (cell) {
        return cell.textContent
    })
    var key = `step${Object.keys(stepsList).length+1}`
    var playerXValue = isXturn ? 'X' : ''
    var playerOValue = isXturn ? '' : 'O'
    stepsList[key] = [{'playerXInput': playerXValue, 'playerOInput': playerOValue}, currentCells, isXturn]
}

function handleStepBtnClick(event) {
    var stepNumber = event.target.textContent
    var currentCells = stepsList[`step${stepNumber}`][1]
    var cells = Array.from(document.querySelector('.gameGrid').querySelectorAll('.cell'))
    for (let i=0; i < 9; i++) {
        cells[i].innerHTML = currentCells[i]
    }
    var startPos = parseInt(stepNumber, 10)
    var limit = parseInt(document.querySelector('tbody').lastChild.textContent, 10)
    if (startPos != limit) {
        for (let i = startPos+1; i <= limit; i++) {
            let row = document.getElementById(`stepBtn${i}`).parentElement.parentElement
            row.parentElement.removeChild(row)
            delete stepsList[`step${i}`]
        }
    }
    isXturn = !stepsList[`step${startPos}`][2]
}

function clearBoard() {
    var gameGrid = document.querySelector('.gameGrid')
    var cells = Array.from(gameGrid.querySelectorAll('.cell'))
    cells.forEach(element => {
        element.innerHTML = ''
        element.classList.remove('win')
    });

    isXturn = firstTurn === 'X'
    gameGrid.addEventListener('click', playGame)

    var stepsBtns = document.querySelector('table').querySelectorAll('button')
    stepsBtns.forEach(btn => {
        let row = btn.parentElement.parentElement
        row.parentElement.removeChild(row)
    })

    stepsList = {}
    document.querySelector('table').addEventListener('click', handleStepBtnClick)
    setGameStatus('Game in progress')
}

function setGameStatus(statusText) {
    document.querySelector('.statusBar').textContent = statusText
}

function isTie() {
    var cells = Array.from(document.querySelectorAll('.cell'))
    return cells.every(function (cell) {
        return cell.textContent !== ''
    })
}

function handleTurnChoice(event) {
    if (Object.keys(stepsList).length > 0) {
        return
    }

    firstTurn = event.target.textContent
    isXturn = firstTurn === 'X'
    updateTurnButtonsUI()
}

function updateTurnButtonsUI() {
    var buttons = document.querySelectorAll('.turnBtn')
    buttons.forEach(function (button) {
        button.classList.remove('active')
        if (button.textContent === firstTurn) {
            button.classList.add('active')
        }
    })
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