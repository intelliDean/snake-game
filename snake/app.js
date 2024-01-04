const gameBoard = document.querySelector("#gameBoard");
const cntxt = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score");
const reset = document.querySelector("#reset");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBoarder = "#23395B";
const foodColor = "red";
const unitSize = 25;
let running = false;
let paused = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];


const levels = [
    {speed: 150, foodCount: 3},
    {speed: 120, foodCount: 7},
    {speed: 100, foodCount: 15},
    {speed: 80, foodCount: 25},
    {speed: 60, foodCount: 40}
];
let currentLevel = 0;

window.addEventListener("keydown", changeDirection);
reset.addEventListener("click", resetGame);


startGame();

function startGame() {
    running = true;
    scoreText.textContent = score.toString();
    createFood();
    drawFood();
    nextTick();
}

function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }

    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}


function drawFood() {
    cntxt.fillStyle = foodColor;
    cntxt.beginPath();
    cntxt.arc(foodX + unitSize / 2, foodY + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
    cntxt.fill();
}

function nextTick() {
    if (running) {
        displayLevel(currentLevel + 1)
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, levels[currentLevel].speed);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    cntxt.fillStyle = boardBackground;
    cntxt.fillRect(0, 0, gameWidth, gameHeight);
}

function displayLevel(level) {
    cntxt.font = "20px MV Boli";
    cntxt.fillStyle = "#B9E3C6";
    cntxt.textAlign = "center";
    cntxt.fillText(`Level ${level}`, gameWidth / 2, gameHeight / 25);
    cntxt.fillStyle = "#303431";
    cntxt.fillText(`o.michaeldean@gmail.com`, gameWidth / 2, gameHeight - 5);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };

    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score.toString();
        if (score % levels[currentLevel].foodCount === 0) {
            currentLevel = Math.min(currentLevel + 1, levels.length - 1);
            displayLevel(currentLevel);
        }
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((snakePart, index) => {
        if (index === 0) {
            cntxt.fillStyle = "#5FBB97";
            cntxt.beginPath();
            cntxt.arc(snakePart.x + unitSize / 2, snakePart.y + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
            cntxt.fill();
            cntxt.stroke();
        } else {
            cntxt.fillStyle = snakeColor;
            cntxt.strokeStyle = snakeBoarder;
            cntxt.beginPath();
            cntxt.arc(snakePart.x + unitSize / 2, snakePart.y + unitSize / 2, unitSize / 2, 0, Math.PI * 2);
            cntxt.fill();
            cntxt.stroke();
        }
    });
}


function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingRight = xVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;

    switch (true) {
        case keyPressed === LEFT && !goingRight:
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case keyPressed === UP && !goingDown:
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case keyPressed === RIGHT && !goingLeft:
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case keyPressed === DOWN && !goingUp:
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case snake[0].x < 0:
        case snake[0].x >= gameWidth:
        case snake[0].y < 0:
        case snake[0].y >= gameHeight:
        case snake.some((part, i) => i !== 0 && part.x === snake[0].x && part.y === snake[0].y):
            gameBoard.style.border = "3px solid red"
            running = false;
            break;
    }
}

function displayGameOver() {
    cntxt.font = "50px MV Boli";
    cntxt.fillStyle = "#23395B";
    cntxt.textAlign = "center";
    cntxt.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
    running = false;

    cntxt.font = "20px MV Boli";
    cntxt.fillText(`o.michaeldean@gmail.com`, gameWidth / 2, gameHeight - 5);
}

function resetGame() {
    score = 0;
    gameBoard.style.border = "3px solid #222"
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    currentLevel = 0;
    startGame();
}

