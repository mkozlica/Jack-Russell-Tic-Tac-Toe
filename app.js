const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');
const boardWrapper = document.getElementById('board-wrapper');

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, Draw: 0 };

function updateTilt(player) {
  boardWrapper.classList.remove('tilt-right', 'tilt-none');
  if (player === 'O') boardWrapper.classList.add('tilt-right');
}

function checkWinner() {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== null)) return { winner: 'Draw', combo: [] };
  return null;
}

function handleClick(e) {
  const idx = parseInt(e.currentTarget.dataset.index);
  if (board[idx] || gameOver) return;

  board[idx] = currentPlayer;
  const cell = e.currentTarget;
  cell.textContent = currentPlayer;
  cell.classList.add('taken', currentPlayer.toLowerCase());

  const result = checkWinner();
  if (result) {
    gameOver = true;
    boardWrapper.classList.remove('tilt-right');
    boardWrapper.classList.add('tilt-none');

    if (result.winner === 'Draw') {
      statusEl.textContent = "It's a draw!";
      scores.Draw++;
      scoreDraw.textContent = scores.Draw;
    } else {
      statusEl.textContent = `Player ${result.winner} wins!`;
      result.combo.forEach(i => cells[i].classList.add('winning'));
      scores[result.winner]++;
      if (result.winner === 'X') scoreX.textContent = scores.X;
      else scoreO.textContent = scores.O;
    }
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${currentPlayer}'s turn`;
  updateTilt(currentPlayer);
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  statusEl.textContent = "Player X's turn";
  boardWrapper.classList.remove('tilt-right', 'tilt-none');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
