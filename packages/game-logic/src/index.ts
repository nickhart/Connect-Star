import type { Board, Player, GameState, CellState } from '@connect-star/types';

export const ROWS = 6;
export const COLS = 7;

export function createEmptyBoard(): Board {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
}

export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'red',
    status: 'waiting',
    winner: null,
    lastMove: null,
    moveCount: 0,
  };
}

export function isValidMove(board: Board, col: number): boolean {
  if (col < 0 || col >= COLS) return false;
  return board[0][col] === null;
}

export function makeMove(gameState: GameState, col: number): GameState {
  if (!isValidMove(gameState.board, col)) {
    throw new Error('Invalid move');
  }

  const newBoard = gameState.board.map(row => [...row]);
  
  let row = ROWS - 1;
  while (row >= 0 && newBoard[row][col] !== null) {
    row--;
  }

  newBoard[row][col] = gameState.currentPlayer;

  const winner = checkWinner(newBoard, row, col);
  const isDraw = gameState.moveCount + 1 >= ROWS * COLS;

  return {
    ...gameState,
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'red' ? 'yellow' : 'red',
    status: winner || isDraw ? 'finished' : 'playing',
    winner,
    lastMove: { row, col },
    moveCount: gameState.moveCount + 1,
  };
}

export function checkWinner(board: Board, row: number, col: number): Player | null {
  const player = board[row][col];
  if (!player) return null;

  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal /
    [1, -1],  // diagonal \
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    
    // Check positive direction
    let r = row + dx;
    let c = col + dy;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      r += dx;
      c += dy;
    }
    
    // Check negative direction
    r = row - dx;
    c = col - dy;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      r -= dx;
      c -= dy;
    }
    
    if (count >= 4) {
      return player;
    }
  }

  return null;
}

export function getValidMoves(board: Board): number[] {
  const validMoves: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (isValidMove(board, col)) {
      validMoves.push(col);
    }
  }
  return validMoves;
}

export function isGameFinished(gameState: GameState): boolean {
  return gameState.status === 'finished';
}