const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const BOARDSIZE = 15;

let gameBoard;
let player;

function randomInt(min, max) {
    const randomFloat = Math.random() * (max - min) + min;
    return Math.floor(randomFloat);
}

function getCell(board, x, y) {
    return board[y][x];
}

function setCell(board, x, y, value) {
    board[y][x] = value;
}

function randomEmptyPosition(board) {
    const x = randomInt(1, BOARDSIZE - 1);
    const y = randomInt(1, BOARDSIZE - 1);
    if (getCell(board, x, y) === " ") {
        return [x, y];
    }
    else {
        return randomEmptyPosition(board);
    }
}

function calculateCellSize() {
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    const gameBoardSize = 0.95 * screenSize;
    return gameBoardSize / BOARDSIZE;
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowDown":
            player.move(0, 1);
            break;
        case "ArrowUp":
            player.move(0, -1);
            break;
        case "ArrowRight":
            player.move(1, 0);
            break;
        case "ArrowLeft":
            player.move(-1, 0);
            break;
    }
    event.preventDefault();
    drawBoard(gameBoard);
});

document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameBoard = generateRandomBoard();
    console.log(gameBoard);
    drawBoard(gameBoard);
}

function generateObstacles(board) {
    const obstacles = [
        [[0,0],[1,0],[0,1],[1,1]], // square
        [[0,0],[0,1],[0,2],[0,3]], // I
        [[0,0],[1,0],[2,0],[2,1]],
    ];
    const positions = [
        {x: 3, y: 3},
        {x: 9, y: 3},
        {x: 3, y: 9},
        {x: 9, y: 9},
    ];
    for (const position of positions) {
        const obstacle = obstacles[randomInt(0, obstacles.length)];
        placeObstacle(board, obstacle, position);
    }
}

function placeObstacle(board, obstacle, position) {
    for (const coordinatePair of obstacle) {
        const [x, y] = coordinatePair;
        setCell(board, position.x + x, position.y + y, "W");
    }
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
    generateObstacles(newBoard);
    const [playerX, playerY] = randomEmptyPosition(newBoard);
    player = new Player(playerX, playerY);
    setCell(newBoard, player.x, player.y, "P");
    return newBoard;
}


function drawBoard(board) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = "";
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
        if (getCell(gameBoard, newX, newY) === " ") {
            this.x = newX;
            this.y = newY;
    
            setCell(gameBoard, currentX, currentY, " ");
            setCell(gameBoard, this.x, this.y, "P");
        }
    }
}