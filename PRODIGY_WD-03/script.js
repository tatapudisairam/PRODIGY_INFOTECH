const cells = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('.status');
const replayBtn = document.querySelector('.replay-btn');
const homeBtn = document.querySelector('.home-btn');
const gameModeSelection = document.getElementById('game-mode-selection');
const playerIconSelection = document.getElementById('player-icon-selection');
const gameContainer = document.getElementById('game-container');
const humanModeBtn = document.getElementById('human-mode');
const aiModeBtn = document.getElementById('ai-mode');
const xTurnIndicator = document.getElementById('x-turn');
const oTurnIndicator = document.getElementById('o-turn');
const xIconBtn = document.getElementById('x-icon');
const oIconBtn = document.getElementById('o-icon');

let playerX = 'X';
let playerO = 'O';
let currentPlayer = playerX;
let currentPlayer2 = null;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isAIMode = false;
let isPlayerX = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

function handleCellClick(e) {
  const cellIndex = e.target.getAttribute('data-index');

  if (gameState[cellIndex] !== '') {
    return;
  }

  gameState[cellIndex] = currentPlayer;
  e.target.textContent = currentPlayer;

  const winner = checkWinner();

  if (winner) {
    statusDisplay.textContent = `Player ${winner} wins!`;
    statusDisplay.style.color = '#00ff00';
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
  } else if (isTie()) {
    statusDisplay.textContent = 'It\'s a tie!';
    statusDisplay.style.color = '#fefe33';
  } else {
    toggleTurnIndicator();
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    if (isAIMode && currentPlayer === playerO) {
      setTimeout(makeAIMove, 500);  
    }
  }
}

function checkWinner() {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return gameState[a];
    }
  }
  return null;
}

function isTie() {
  return gameState.every(cell => cell !== '');
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = isAIMode ? playerX : playerO;
  statusDisplay.textContent = '';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.addEventListener('click', handleCellClick);
  });
  // Reset turn indicators based on initial player
  if(isAIMode){
    currentPlayer2 = isPlayerX ? playerX : playerO;
  }else{
    currentPlayer = playerX;
    currentPlayer2 = playerX;
  }
    if (currentPlayer2 === playerX) {
      xTurnIndicator.classList.add('active');
      oTurnIndicator.classList.remove('active');
    } else {
      oTurnIndicator.classList.add('active');
      xTurnIndicator.classList.remove('active');
    }
  
}


function replayGame() {
  resetGame();
}

function showGameModeSelection() {
  gameModeSelection.style.display = 'block';
  playerIconSelection.style.display = 'none';
  gameContainer.style.display = 'none';
  resetGame();
}

function showGameContainer() {
  gameModeSelection.style.display = 'none';
  playerIconSelection.style.display = 'none';
  gameContainer.style.display = 'block';
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  replayBtn.addEventListener('click', replayGame);
  homeBtn.addEventListener('click', showGameModeSelection);

  if (isAIMode) {
    currentPlayer2 = isPlayerX ? playerX : playerO; 
  }

  // Update turn indicator based on the selected icon
  if (currentPlayer2 === playerX) {
    xTurnIndicator.classList.add('active');
    oTurnIndicator.classList.remove('active');
  }else if (currentPlayer2 === playerO) {
    oTurnIndicator.classList.add('active');
    xTurnIndicator.classList.remove('active');
  }
}


function showPlayerIconSelection() {
  gameModeSelection.style.display = 'none';
  playerIconSelection.style.display = 'block';
  gameContainer.style.display = 'none';
}

function toggleTurnIndicator() {
  xTurnIndicator.classList.toggle('active');
  oTurnIndicator.classList.toggle('active');
}

function makeAIMove() {
  // Helper function to check potential forks and minimax algorithm implementation...
  function countPotentialWins(board, player) {
    let count = 0;
    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      const values = [board[a], board[b], board[c]];
      if (values.filter(value => value === player).length === 2 && values.includes('')) {
        count++;
      }
    }
    return count;
  }

  // Helper function to calculate the best move using minimax algorithm
  function minimax(board, depth, maximizingPlayer) {
    const result = checkWinner();
    if (result !== null) {
      return result === playerO ? 10 - depth : depth - 10;
    }

    if (isTie()) {
      return 0;
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = playerO;
          const eval = minimax(board, depth + 1, false);
          board[i] = '';
          maxEval = Math.max(maxEval, eval);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = playerX;
          const eval = minimax(board, depth + 1, true);
          board[i] = '';
          minEval = Math.min(minEval, eval);
        }
      }
      return minEval;
    }
  }
  
  // Place move and update game state
  function placeMove(index) {
    gameState[index] = playerO;
    cells[index].textContent = playerO;

    const winner = checkWinner();

    if (winner) {
      // If AI wins
      if (winner === playerO) {
        statusDisplay.textContent = `Computer wins!`;
        statusDisplay.style.color = '#00ff00';
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
      } else {
        // If AI loses
        statusDisplay.textContent = `Computer loses!`;
        statusDisplay.style.color = '#ff0000';
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
      }
    } else if (isTie()) {
      // If it's a tie
      statusDisplay.textContent = 'It\'s a tie!';
      statusDisplay.style.color = '#fefe33';
    } else {
      toggleTurnIndicator();
      currentPlayer = playerX;
    }
  }

  let bestMove = -Infinity;
  let moveIndex = null;

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      gameState[i] = playerO;
      const moveValue = minimax(gameState, 0, false);
      gameState[i] = '';
      if (moveValue > bestMove) {
        bestMove = moveValue;
        moveIndex = i;
      }
    }
  }

  placeMove(moveIndex);
}



humanModeBtn.addEventListener('click', () => {
  isAIMode = false;
  showGameContainer();
});
aiModeBtn.addEventListener('click', () => {
  isAIMode = true;
  showPlayerIconSelection();
});
xIconBtn.addEventListener('click', () => {
    isPlayerX = true;
    playerX = 'X';
    playerO = 'O';
    showGameContainer();
  });
  
  oIconBtn.addEventListener('click', () => {
    isPlayerX = false;
    playerX = 'O';
    playerO = 'X';
    currentPlayer = isAIMode ? playerX : playerO;
    showGameContainer();
  }); 