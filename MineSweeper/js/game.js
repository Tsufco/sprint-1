'use strict'
var gBoard
var gLevel = {
    Size: 4,
    Mines: 2
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

init()
function init() {
    gGame.shownCount = 0
    gGame.isOn = true
    gBoard = buildBoard(gLevel.Size)
    renderBoard(gBoard, '.board-container')

    var restartGame = document.querySelector('.modal')
    restartGame.style.display = 'none'
    var victory = document.querySelector('h4')
    victory.innerText = 'Game Over'
    var elLive = document.querySelector('h2 span')
    elLive.innerText = 3
}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            var cell = board[i][j]
            cell = {
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i].push(cell)
        }
    }
    randomMines(board)
    return board
}
// gBoard.onCellMarked(addEventListener('contextmenu', (ev) => {
//     ev.preventDefault();
//     ev.target.classList.add('mark')
//     console.log(ev.target)
//   });

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            var mineCount = setMinesNegsCount(gBoard, i, j)
            gBoard[i][j].mineAroundCount = mineCount
            strHTML += `<td onclick="onCellClicked (this , ${i} , ${j})" id = "cell-${i}-${j}" ></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

}

function setMinesNegsCount(board, rowIdx, colIdx) {

    var neighMinesCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCellMine = board[i][j]
            if (currCellMine.isMine === true) {
                neighMinesCount++
            }
        }
    }
    return neighMinesCount
}
//console.table(gBoard)



function onCellClicked(elCell, i, j) {
    if (gGame.isOn) {

        if (gBoard[i][j].isMine) {
            gGame.lives--
            alert('you have clicked a mine')
            console.log(gGame.lives)
            var elLive = document.querySelector('h2 span')
            elLive.innerText = gGame.lives

            if (gGame.lives === 0) {
                isMine(gBoard)
                gameOver()
                return
            }
        }

        gGame.shownCount++

        if (gBoard[i][j].mineAroundCount === 0) {
            expandShown(gBoard, i, j)
        }
        var updateScore = document.querySelector('h3 span')
        updateScore.innerText = gGame.shownCount

        if (isWin(gBoard) === gLevel.Size ** 2 - gLevel.Mines - 1) {
            var restartGame = document.querySelector('.modal')
            restartGame.style.display = 'inline-block'
            restartGame.innerText = 'you won'
        }


        gBoard[i][j].isShown = true
        elCell.classList.add('shown')
        if (!gBoard[i][j].mineAroundCount === 0) {

            elCell.innerText = gBoard[i][j].mineAroundCount
        }
    }
}


// function onCellMarked(elCell){

//     window.addEventListener('contextmenu', (ev) => {
//         ev.preventDefault();

//         console.log('right clicked')
//       });
//elCell.classList.add('mark')



function gameOver() {

    var restartGame = document.querySelector('.modal')
    restartGame.style.display = 'inline-block'
    gGame.isOn = false
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (!gBoard[i][j].isMine) {

                if (!gBoard[i][j].isShown) gGame.shownCount++
                gBoard[i][j].isShown = true
                var cell = document.querySelector(`#cell-${i}-${j}`)
                cell.classList.add('shown')
                cell.innerText = gBoard[i][j].mineAroundCount
                console.log(gGame.shownCount)
            }
        }
    }
    gGame.shownCount--
}


function randomMines(board) {

    for (var i = 0; i < gLevel.Mines; i++) {
        var x = getRandomIntInclusive(0, board.length - 1)
        var y = getRandomIntInclusive(0, board.length - 1)
        board[x][y].isMine = true
    }
}


function changeLevel(size, mines) {
    gLevel.Size = size
    gLevel.Mines = mines
    init()
}

function isWin() {
    var score = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) {
                score += 1
            }
        }

    }
    return score
}

function isMine(gBoard) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var cell = document.querySelector(`#cell-${i}-${j}`)
                cell.classList.add('mine')
            }
        }
    }
}
