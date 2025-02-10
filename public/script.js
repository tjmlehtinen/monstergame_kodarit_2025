const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const BOARDSIZE = 15;
let gameBoard;

function getCell(board, x, y) {
    return board[y][x];
}

function setCell(board, x, y, value) {
    board[y][x] = value;
}

document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameBoard = generateRandomBoard();
    console.log(gameBoard);
    drawBoard(gameBoard);
}

function generateRandomBoard() {
    const newBoard = Array.from({ length: BOARDSIZE }, () => Array(BOARDSIZE).fill(" "));
    for (let y=0; y < BOARDSIZE; ++y) {
        for (let x=0; x < BOARDSIZE; ++x) {
            if (y === 0 || x === 0 || y === BOARDSIZE - 1 || x === BOARDSIZE - 1) {
                setCell(newBoard, x, y, "W");
            }
        }
    }
    return newBoard;
}

function drawBoard(board) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.gridTemplateColumns = `repeat(${BOARDSIZE}, 1fr)`;

    for (let y=0; y < BOARDSIZE; ++y) {
        for (let x=0; x < BOARDSIZE; ++x) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (getCell(board, x, y) === "W") {
                cell.classList.add("wall");
            }
            gameContainer.appendChild(cell);
        }
    }
}