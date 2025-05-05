const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const scoreBoard = document.getElementById("score-board");


const firebaseConfig = {
    apiKey: "AIzaSyAk7dNHJHBmqsOZ8CeJHvEAgjqsWbvkmdQ",
    authDomain: "monstergame-22e2b.firebaseapp.com",
    projectId: "monstergame-22e2b",
    storageBucket: "monstergame-22e2b.firebasestorage.app",
    messagingSenderId: "819356303708",
    appId: "1:819356303708:web:0c5172893aa04819818199",
    measurementId: "G-BHXC8ZC15H"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const BOARDSIZE = 15;

let gameRunning = false;

let gameBoard;
let player;
let monsters;
let monsterMoveInterval;
let monsterSpeed;
let score;

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
    if (gameRunning) {
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
            case "w":
                shootAt(player.x, player.y - 1);
                break;
            case "s":
                shootAt(player.x, player.y + 1);
                break;
            case "a":
                shootAt(player.x - 1, player.y);
                break;
            case "d":
                shootAt(player.x + 1, player.y);
                break;
        }
        event.preventDefault();
        drawBoard(gameBoard);
    }
});

document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameRunning = true;
    score = 0;
    scoreBoard.textContent = "SCORE: " + score
    gameBoard = generateRandomBoard();
    monsterSpeed = 1000;
    setTimeout(() => {monsterMoveInterval = setInterval(moveMonsters, monsterSpeed);}, 500);
    drawBoard(gameBoard);
}

function nextLevel() {
    alert("Next level");
    clearInterval(monsterMoveInterval);
    gameBoard = generateRandomBoard();
    monsterSpeed *= 0.9;
    setTimeout(() => {monsterMoveInterval = setInterval(moveMonsters, monsterSpeed);}, 500);
    drawBoard(gameBoard);
}

function endGame() {
    gameRunning = false;
    clearInterval(monsterMoveInterval);
    alert("Kuolit ja peli loppui");
    gameScreen.style.display = "none";
    startScreen.style.display = "block";
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
    monsters = [];
    for (let i=0; i<3; ++i) {
        const [monsterX, monsterY] = randomEmptyPosition(newBoard);
        monsters.push(new Monster(monsterX, monsterY));
        setCell(newBoard, monsterX, monsterY, "M");
    }
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
            else if (getCell(board, x, y) === "M") {
                cell.classList.add("monster");
            }
            else if (getCell(board, x, y) === "P") {
                cell.classList.add("player");
            }
            else if (getCell(board, x, y) === "B") {
                cell.classList.add("bullet");
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

class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isAlive = true;
    }
}

function moveMonsters() {
    for (const monster of monsters) {
        const moves = [
            {x: monster.x + 1, y: monster.y},
            {x: monster.x - 1, y: monster.y},
            {x: monster.x, y: monster.y + 1},
            {x: monster.x, y: monster.y - 1}
        ];
        const isMoveLegal = (move) => getCell(gameBoard, move.x, move.y) === " "
                                    || getCell(gameBoard, move.x, move.y) === "B"
                                    || getCell(gameBoard, move.x, move.y) === "P";
        const legalMoves = moves.filter(isMoveLegal);
        if (legalMoves.length > 0) {
            const distanceToPlayer = (pos) => Math.abs(player.x - pos.x) + Math.abs(player.y - pos.y);
            const closerToPlayer = (a, b) => distanceToPlayer(a) - distanceToPlayer(b);
            legalMoves.sort(closerToPlayer);
            const nextPosition = legalMoves[0];
            setCell(gameBoard, monster.x, monster.y, " ");
            monster.x = nextPosition.x;
            monster.y = nextPosition.y;
            if (getCell(gameBoard, monster.x, monster.y) === "P") {
                endGame();
            }
            else if (getCell(gameBoard, monster.x, monster.y) === "B") {
                score += 1;
                scoreBoard.textContent = "SCORE: " + score
                monster.isAlive = false;
            }
            else {
                setCell(gameBoard, monster.x, monster.y, "M");
            }
        }
    }
    monsters = monsters.filter(monster => monster.isAlive);
    drawBoard(gameBoard);
    if (monsters.length === 0) {
        nextLevel();
    }
}

function shootAt(x, y) {
    if (getCell(gameBoard, x, y) === "W") {
        return;
    }
    if (getCell(gameBoard, x, y) === "M") {
        const monsterIndex = monsters.findIndex(m => m.x === x && m.y === y);
        score += 1;
        scoreBoard.textContent = "SCORE: " + score
        monsters.splice(monsterIndex, 1);
    }
    setCell(gameBoard, x, y, "B");
    setTimeout(() => {setCell(gameBoard, x, y, " ");}, 500);
    drawBoard(gameBoard);
    if (monsters.length === 0) {
        nextLevel();
    }
}