const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const BOARDSIZE = 15;

let gameBoard;
let player;

function getCell(board, x, y) {
    return board[y][x];
}

function setCell(board, x, y, value) {
    board[y][x] = value;
}

function calculateCellSize() {
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    const gameBoardSize = 0.95 * screenSize;
    return gameBoardSize / BOARDSIZE;
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
    setCell(newBoard, 6, 4, "P");
    return newBoard;
}

function drawBoard(board) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.gridTemplateColumns = `repeat(${BOARDSIZE}, 1fr)`;

    const cellSize = calculateCellSize();

    for (let y=0; y < BOARDSIZE; ++y) {
        for (let x=0; x < BOARDSIZE; ++x) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";
            if (getCell(board, x, y) === "W") {
                cell.classList.add("wall");
            }
            else if (getCell(board, x, y) === "P") {
                cell.classList.add("player");
            }
            gameContainer.appendChild(cell);
        }
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dx, dy) {
        const currentX = this.x;
        const currentY = this.y;

        const newX = currentX + dx;
        const newY = currentY + dy;

        this.x = newX;
        this.y = newY;

        setCell(gameBoard, currentX, currentY, " ");
        setCell(gameBoard, this.x, this.y, "P");
    }
}