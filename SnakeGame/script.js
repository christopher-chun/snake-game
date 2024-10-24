let blockSize = 20; // 20x20 canvas
let rows = 20;
let cols = 20;
let gameCanvas;
let context;
let gameOver = false;
let snakeX = blockSize * 5; // Snake's initial x coordinate
let snakeY = blockSize * 5; // Snake's intial y coordinate
let pX = 0; // Snake's movement in x direction
let pY = 0; // Snake's movement in y direction
let snake = [];
let foodX; // Food's x coordinate
let foodY; // Food's y coordinate
let interval;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Retrieving high score from local storage

function startGame() {
  gameOver = false;
  hideStartElements(); // Hiding all elements at the start screen
  createBoard(); // Creating canvas for the game
  placeFood();
  document.addEventListener("keydown", changeDirection); // For movements
  interval = setInterval(update, 100); // Set snake speed
  document.getElementById("highScore").textContent = "High Score: " + highScore; // Keeping track of score
  document.getElementById("score").textContent = "Score: " + score;
}

function restartGame() {
  hideEndButtons(); // Hiding buttons at the end of the game
  snakeX = blockSize * 5; // Resetting all variables to restart the game
  snakeY = blockSize * 5;
  pX = 0;
  pY = 0;
  snake = [];
  score = 0;
  updateScore(); // Resetting score to 0
  clearInterval(interval); // Resetting interval so the snake does not move faster and faster
  startGame();
}

// Function to update the score everytime the snake eats a fruit
function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
}

function hideStartElements() {
  let startButton = document.getElementById("startButton");
  startButton.style.display = "none";
  document.querySelectorAll(".startScreen").forEach(function (elements) {
    elements.style.display = "none";
  });
}

function hideEndButtons() {
  let restartButton = document.getElementById("restartButton");
  restartButton.style.display = "none";
  let resetButton = document.getElementById("resetButton");
  resetButton.style.display = "none";
}

// Function to create the game canvas
function createBoard() {
  gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.height = rows * blockSize;
  gameCanvas.width = cols * blockSize;
  context = gameCanvas.getContext("2d");
  gameCanvas.style.border = "2px solid black";
}

// Function that goes through the game logic and renders the game
function update() {
  if (gameOver) {
    return; // Stop the game if the game is over
  }
  context.fillStyle = "#77DD77";
  context.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Filling the canvas with a color
  context.strokeStyle = "lightgreen";
  context.lineWidth = 1;
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j <= rows; j++) {
      context.strokeRect(20 * i, 20 * j, blockSize, blockSize); // Drawing gridlines on the canvas to shows the blocks
    }
  }
  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize); // Drawing the fruits
  if (snakeX == foodX && snakeY == foodY) {
    // Checking if the snake eats a fruit
    snake.push([foodX, foodY]); // Add the food's position the snake's body
    score += 1;
    updateScore(); // Increment and update score
    placeFood(); // Place a new fruitat 
  }
  for (let i = snake.length - 1; i > 0; i--) {
    // Move the snake by shifting the body part to the previous part
    snake[i] = snake[i - 1];
  }
  if (snake.length) {
    // Updating the head of the snake
    snake[0] = [snakeX, snakeY];
  }
  context.fillStyle = "blue";
  snakeX += pX * blockSize; // Updating Snake position in X coordinate.
  snakeY += pY * blockSize; // Updating Snake position in Y coordinate.
  context.fillRect(snakeX, snakeY, blockSize, blockSize); // Drawing the head of the snake
  for (let i = 0; i < snake.length; i++) {
    context.fillRect(snake[i][0], snake[i][1], blockSize, blockSize); // Drawing the rest of the snake's body
  }
  if (
    snakeX < 0 ||
    snakeX > cols * blockSize - 1 ||
    snakeY < 0 ||
    snakeY > rows * blockSize - 1
  ) {
    // Checking for out of bound condition
    gameOver = true; // Ending the game
    let restartButton = document.getElementById("restartButton");
    restartButton.style.display = "block";
    let resetButton = document.getElementById("resetButton");
    resetButton.style.display = "block"; // Showing end game buttons
    checkHighScore(); // Checking if a new high score was reached
    alert("Game Over");
  }
  for (let i = 0; i < snake.length; i++) {
    if (snakeX == snake[i][0] && snakeY == snake[i][1]) {
      // Checking if snake eats own body
      gameOver = true;
      let restartButton = document.getElementById("restartButton");
      restartButton.style.display = "block";
      let resetButton = document.getElementById("resetButton");
      resetButton.style.display = "block";
      checkHighScore();
      alert("Game Over");
    }
  }
}

// Function to change the snake's direction based on the key pressed
function changeDirection(e) {
  if (e.code == "ArrowUp" && pY != 1) {
    pX = 0;
    pY = -1;
  } else if (e.code == "ArrowDown" && pY != -1) {
    pX = 0;
    pY = 1;
  } else if (e.code == "ArrowLeft" && pX != 1) {
    pX = -1;
    pY = 0;
  } else if (e.code == "ArrowRight" && pX != -1) {
    pX = 1;
    pY = 0;
  }
}

// Function that randomly places fruit on the canvas
function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

// Checking to see if a new high score was reached
function checkHighScore() {
  if (score > highScore) {
    highScore = score; // Updating high score
    saveHighScore(); // Saving high score to local storage
  }
}

// Function to save high score in local storage
function saveHighScore() {
  localStorage.setItem("highScore", highScore);
  updateHighScore();
}

// Function to reset the high score
function resetHighScore() {
  highScore = 0;
  updateHighScore();
}

//function to update the high score display
function updateHighScore() {
  document.getElementById("highScore").textContent = "High Score: " + highScore;
}
