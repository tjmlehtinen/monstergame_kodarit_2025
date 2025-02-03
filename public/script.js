const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const BOARDSIZE = 15;
let gameBoard;


document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameBoard = generateRandomBoard();
    console.log(gameBoard);
}

function generateRandomBoard() {
    const newBoard = Array.from({ length: BOARDSIZE }, () => Array(BOARDSIZE).fill(" "));
    return newBoard;
}