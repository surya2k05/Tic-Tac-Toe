const cells = document.querySelectorAll('.cell');
const turnInfo = document.getElementById('turn');
const resetButton = document.getElementById('reset');
const startGameButton = document.getElementById('startGame');
const player1Input = document.getElementById('player1Name');
const player2Input = document.getElementById('player2Name');

let player1Name = '';
let player2Name = '';
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

  if (gameState[clickedCellIndex] !== '' || checkGameOver()) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  if (checkWin()) {
    turnInfo.textContent = `${getCurrentPlayerName()} wins!`;
    highlightWinningCells();
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    cells.forEach(cell => cell.removeEventListener('click', handleCellRefill));
  } else {
    if (gameState.every(cell => cell !== '')) {
      const filledConditions = winConditions.filter(condition => {
        return condition.every(index => gameState[index] !== '');
      });

      if (filledConditions.length > 0) {
        const conditionToRemove = filledConditions[Math.floor(Math.random() * filledConditions.length)];
        conditionToRemove.forEach(index => {
          gameState[index] = '';
          cells[index].textContent = '';
          cells[index].addEventListener('click', handleCellRefill, { once: true });
        });
      }
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnInfo.textContent = `${getCurrentPlayerName()}'s turn`;
  }
}

function handleCellRefill(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  if (checkWin()) {
    turnInfo.textContent = `${getCurrentPlayerName()} wins!`;
    highlightWinningCells();
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    cells.forEach(cell => cell.removeEventListener('click', handleCellRefill));
  } else {
    if (gameState.every(cell => cell !== '')) {
      const filledConditions = winConditions.filter(condition => {
        return condition.every(index => gameState[index] !== '');
      });

      if (filledConditions.length > 0) {
        const conditionToRemove = filledConditions[Math.floor(Math.random() * filledConditions.length)];
        conditionToRemove.forEach(index => {
          gameState[index] = '';
          cells[index].textContent = '';
          cells[index].addEventListener('click', handleCellRefill, { once: true });
        });
      }
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnInfo.textContent = `${getCurrentPlayerName()}'s turn`;
  }
}

function checkWin() {
  return winConditions.some(condition => {
    return condition.every(index => gameState[index] === currentPlayer);
  });
}

function getWinningCondition() {
  return winConditions.find(condition => {
    return condition.every(index => gameState[index] === currentPlayer);
  });
}

function checkGameOver() {
  return checkWin();
}

function resetGame() {
  currentPlayer = 'X';
  gameState = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('winning-cell');
    cell.addEventListener('click', handleCellClick, { once: true });
    cell.removeEventListener('click', handleCellRefill);
  });
  turnInfo.textContent = `${player1Name}'s turn`;
}

function getCurrentPlayerName() {
  return currentPlayer === 'X' ? player1Name : player2Name;
}

function highlightWinningCells() {
  const winningCondition = getWinningCondition();
  if (winningCondition) {
    winningCondition.forEach(index => {
      cells[index].classList.add('winning-cell');
    });
  }
}

startGameButton.addEventListener('click', () => {
  player1Name = player1Input.value || 'Player 1';
  player2Name = player2Input.value || 'Player 2';
  resetGame();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick, { once: true }));
resetButton.addEventListener('click', resetGame);
