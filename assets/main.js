
//Available moves 
let left = false
let right = false
let down = false
let up = false

// Initialize game
let board = new Array
let score = 0
let rows = 4
let columns = 4
let difficulty = 'easy'

//Get Elements
const scores = document.querySelector("#score")
const gameBoard = document.querySelector("#board")
const start = document.querySelector('#new-game')
const classic = document.querySelector('#easy')
const normal = document.querySelector('#normal')
const hard = document.querySelector('#hard')

//Get local Storage Hi-score
const topScoreKey = document.querySelector('#best')
let bestScoreKey = 'bestScore'

// Continue or Reset Game
const showWrapper = document.querySelector('.wrapper-hidden')
const scaleDiv = document.querySelector('.bg-div')
const opacityDiv = document.querySelector('.bg-wrapper')
const btnContinue = document.querySelector('#continue')
const btnNewGame = document.querySelector('#newGame')
const wrapper = document.querySelector('#wrapper')
const userStatus = document.querySelector('#status')
const userSubStatus = document.querySelector('#sub-status')

// Check Game if no moves or Win
let copyBoard = new Array //Copy board to check whether its the same as last move Game Over condition
let gameStatus = false //To continue even whenishing 2048
let keyStatus = false  // To continue in using the keyboard

// Touch Method
let startX, startY, endX, endY
let resultX = ""
let resultY = ""

//Reinitialize Game
window.onload = function () {
    setGameCanvas()
    setBoard()
    setGame()
}

// Set Difficulty
function setVariant(difficult) {
    gameStatus = false
    keyStatus = false
    if (difficult == 'hard') {
        hard.classList.add('btn-selected')
        normal.classList.remove('btn-selected')
        easy.classList.remove('btn-selected')
        difficulty = 'hard'

    }
    else if (difficult == 'normal') {
        hard.classList.remove('btn-selected')
        normal.classList.add('btn-selected')
        easy.classList.remove('btn-selected')
        difficulty = 'normal'
    }
    else {
        hard.classList.remove('btn-selected')
        normal.classList.remove('btn-selected')
        easy.classList.add('btn-selected')
        difficulty = 'easy'
    }
    resetGame()
    setGameCanvas()
    setBoard()
    setGame()
}

// Interface buttons
hard.addEventListener('click', (e) => {
    setVariant('hard')
})

normal.addEventListener('click', (e) => {
    setVariant('normal')
})

classic.addEventListener('click', (e) => {
    setVariant('easy')
})

start.addEventListener('click', (e) => {
    setVariant(difficulty)
})

//Re-new the board
function resetGame() {
    gameBoard.classList = ''
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.lastChild)
    }
}

//Initialize the Board
function setBoard() {
    if (difficulty == 'easy') {
        rows = columns = 4
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    } else if (difficulty == 'normal') {
        rows = columns = 5
        board = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    }
    else if (difficulty == 'hard') {
        rows = columns = 8
        board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ]

    }
}

//Initialize the size of the board
function setGameCanvas() {
    gameBoard.classList.add(`boardSize-${difficulty}`)
    difficulty == 'hard' ? wrapper.classList.add('wrapper') : wrapper.classList.value = ''
}

//Initialize the Game
function setGame() {

    topScoreKey.textContent = getBestScore()
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            let tile = document.createElement("div")
            tile.id = r.toString() + "-" + c.toString()
            let num = board[r][c]
            updateTile(tile, num)
            gameBoard.append(tile)
        }
    }
    //create random 2 or 4 to begin the game
    setRandomNum()
    setRandomNum()
}

//Update the tile
function updateTile(tile, num) {
    tile.innerText = ""
    tile.classList.value = ""; //clear the classList
    tile.classList.add('transition-tile')
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num.toString();
        if (num == 2048 && !gameStatus) {
            tile.classList.add("x" + num.toString())
            endGame()
        } else if (num <= 16384) { //8192) {
            tile.classList.add("x" + num.toString())
        } else if (num < 1048576) {
            tile.classList.add('x32768')
        } else {
            tile.classList.add('x1048576')
        }

    }
}

/* Touch Events */

// Desktop
gameBoard.addEventListener('mousedown', userActionDown)
gameBoard.addEventListener('mouseup', userActionUp)

// Mobile
gameBoard.addEventListener('touchstart', userActionDown)
gameBoard.addEventListener('touchend', userActionUp)

//Keyboard
document.addEventListener('keyup', (e) => {
    if (keyStatus) {
        return;
    }
    keyBoardSwipe(e)
    if (topScoreKey.textContent == '0' || getBestScore() == 0 || getBestScore() < score) {
        topScoreKey.innerText = score;
    }
    scores.innerText = score;

})

//Get the Starting Point of the mouse or touch
function userActionDown(event) {

    startX = startY = 0
    startX = (event.type === 'mousedown') ? event.screenX : event.changedTouches[0].screenX
    startY = (event.type === 'mousedown') ? event.screenY : event.changedTouches[0].screenY
}

//Set the Ending Point of the mouse or touch
function userActionUp(event) {
    if (keyStatus) {
        return;
    }
    if (!startX) { return } //if startx = null or 0 or Nan
    endX = (event.type === 'mouseup') ? event.screenX : event.changedTouches[0].screenX
    endY = (event.type === 'mouseup') ? event.screenY : event.changedTouches[0].screenY
    handleSwipe(event)
}




//Event Handler of every touch events
function handleSwipe(e) {
    if (!keyStatus) {   //Mouse and Touch Events
        if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
            if (endX < startX) { //left
                slideLeft()
                setRandomNum()
                left = hasValidMove() ? true : resetMoves()
                checkboard()
                return
            }
            else { //right  

                slideRight()
                setRandomNum()
                right = hasValidMove() ? true : resetMoves()
                checkboard()
                return
            }
        } else {
            if (endY < startY) { //up
                slideUp()
                setRandomNum()
                up = hasValidMove() ? true : resetMoves()
                checkboard()
                return
            }
            else { //down
                slideDown()
                setRandomNum()
                down = hasValidMove() ? true : resetMoves()
                checkboard()
                return
            }
        }
    }
    else {
        return
    }
}
function keyBoardSwipe(e) {
    //Keyboard Events
    if (e.code == "ArrowLeft" || e.code == 'KeyA' || e.code == "ArrowRight" || e.code == 'KeyD') {
        if (e.code == "ArrowLeft" || e.code == 'KeyA') {
            slideLeft()
            setRandomNum()
            left = hasValidMove() ? true : resetMoves()
            checkboard()
        }
        else {

            slideRight()
            setRandomNum()
            right = hasValidMove() ? true : resetMoves()
            checkboard()
        }
    } else if (e.code == "ArrowUp" || e.code == 'KeyW' || e.code == "ArrowDown" || e.code == 'KeyS') {
        if (e.code == "ArrowUp" || e.code == 'KeyW') {
            slideUp()
            setRandomNum()
            up = hasValidMove() ? true : resetMoves()
            checkboard()
        }
        else {
            slideDown()
            setRandomNum()
            down = hasValidMove() ? true : resetMoves()
            checkboard()
        }
    }
    else  {
        e.preventDefault();
        return;
        
    }
}

//Populate the array with zeroes
function filterZero(row) {
    return row.filter(num => num != 0); //create new array of all nums != 0
}

//Funciton to slid the tiles
function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

//Slide left
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r.toString()}-${c.toString()}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//Slide Right
function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r.toString()}-${c.toString()}`)
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//Slide Up 
function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = setRow(c);
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(`${r.toString()}-${c.toString()}`)
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

//Slide Down
function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = setRow(c);
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(`${r.toString()}-${c.toString()}`)
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// let row =  [board[0][c], board[1][c], board[2][c], board[3][c],board[4][c]];
// board[0][c] = row[0];
// board[1][c] = row[1];
// board[2][c] = row[2];
// board[3][c] = row[3];
function setRow(counter) {
    let row = []
    for (let r = 0; r < rows; r++) {
        row.push(board[r][counter])
    }
    return row
}

//Set random number between 2 and 4
function setRandomNum() {
    validateBoard()
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            let randomNum = Math.random(1)
            let popOutNum =randomNum > 0.1 ? 2 : 4
            board[r][c] = popOutNum
            let tile = document.getElementById(`${r.toString()}-${c.toString()}`)
            tile.innerText = popOutNum.toString()
            tile.classList.add(`x${popOutNum}`)
            found = true
        }
    }
}

//Check whether their is a available tile for zero
function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}

//Victory function
function endGame() {
    userStatus.textContent = 'You win!'
    userSubStatus.textContent = 'Do you wish to CONTINUE or NEW GAME'
    if (!gameStatus) {
        keyStatus = true
    }
    document.querySelector('#win-score').textContent = score;
    continueGame()
    if (getBestScore() < score) {
        setBestScore(score)
    }
    
}

//Check whether it no more moves Game Over
function checkboard() {
    if (left && right && down && up) {
        
      alert('What a loser!')

        if (getBestScore() < score) {
            setBestScore(score)
        }
        score = 0;
        scores.innerText = score;
        setVariant(difficulty)

    }
}

//Check whether its a copyboard and board the same
function validateBoard() {
    copyBoard = new Array
    for (let r = 0; r < rows; r++) {
        let copyRow = [];
        for (let c = 0; c < columns; c++) {
            copyRow.push(board[r][c]);
        }
        copyBoard.push(copyRow);
    }
}

//Check whether the Tile has empty Tile
function hasValidMove() {
    if (!hasEmptyTile() && JSON.stringify(copyBoard) == JSON.stringify(board)) {
        return true;
    }
    return false;
}
//Reset moves
function resetMoves() {
    left = right = up = down = false;
}

//Continue game
function continueGame() {
    showWrapper.classList.toggle('show-div')
    scaleDiv.classList.toggle('scale-div')
    opacityDiv.classList.toggle('opacity-div')

}

//Save the Hi-Score
function setBestScore(setScore) {
    localStorage.setItem(bestScoreKey, setScore)
}

//Get the Hi-Score return 0
function getBestScore() {
    return localStorage.getItem(bestScoreKey) || 0
}

//Set the user if will continue
btnContinue.addEventListener('click', function () {
    showWrapper.classList.toggle('show-div')
    scaleDiv.classList.toggle('scale-div')
    opacityDiv.classList.toggle('opacity-div')
    keyStatus = false
    gameStatus = true

})

//Set the New user if will continue
btnNewGame.addEventListener('click', function () {
    setVariant(difficulty)
    showWrapper.classList.toggle('show-div')
    scaleDiv.classList.toggle('scale-div')
    opacityDiv.classList.toggle('opacity-div')
    gameStatus = false
    keyStatus = false
})
