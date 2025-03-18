// Select Elements
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('.reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const line = document.querySelector('.line');

let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = false;
let vsCPU = false;

// Winning Conditions
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Start Game
function startGame() {
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  isGameActive = true;
}

// Handle Cell Click
function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute('data-index');

  if (board[index] || !isGameActive) return;

  updateCell(cell, index);
  checkWinner();

  if (vsCPU && isGameActive) cpuMove();
}

// Update Cell
function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
}

// Check Winner
function checkWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      drawLine(condition);
      statusText.textContent = `Player ${currentPlayer} Wins!`;
      isGameActive = false;
      return;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    isGameActive = false;
    return;
  }

  swapPlayer();
}

// Draw Line
function drawLine(condition) {
  const [a, , c] = condition;
  const start = cells[a].getBoundingClientRect();
  const end = cells[c].getBoundingClientRect();
  const container = document.querySelector('.game-container').getBoundingClientRect();

  const x1 = start.left + start.width / 2 - container.left;
  const y1 = start.top + start.height / 2 - container.top;
  const x2 = end.left + end.width / 2 - container.left;
  const y2 = end.top + end.height / 2 - container.top;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  line.style.width = `${length}px`;
  line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;
}

// CPU Move
function cpuMove() {
  let available = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  let choice = available[Math.floor(Math.random() * available.length)];
  updateCell(cells[choice], choice);
  checkWinner();
}

// Swap Player
function swapPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Reset
resetButton.addEventListener('click', () => location.reload());

modeButtons.forEach(button => {
  button.addEventListener('click', () => {
    vsCPU = button.dataset.mode === 'cpu';
    startGame();
  });
});
