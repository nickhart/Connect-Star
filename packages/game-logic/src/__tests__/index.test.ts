import {
  ROWS,
  COLS,
  createEmptyBoard,
  createInitialGameState,
  isValidMove,
  makeMove,
  checkWinner,
  getValidMoves,
  isGameFinished,
} from '../index';
import type { Board, GameState } from '@connect-star/types';

describe('Game Logic', () => {
  describe('Constants', () => {
    test('should have correct board dimensions', () => {
      expect(ROWS).toBe(6);
      expect(COLS).toBe(7);
    });
  });

  describe('createEmptyBoard', () => {
    test('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      expect(board).toHaveLength(ROWS);
      expect(board[0]).toHaveLength(COLS);
    });

    test('should create a board with all null values', () => {
      const board = createEmptyBoard();
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          expect(board[row][col]).toBeNull();
        }
      }
    });
  });

  describe('createInitialGameState', () => {
    test('should create initial game state with correct properties', () => {
      const gameState = createInitialGameState();
      expect(gameState.board).toEqual(createEmptyBoard());
      expect(gameState.currentPlayer).toBe('red');
      expect(gameState.status).toBe('waiting');
      expect(gameState.winner).toBeNull();
      expect(gameState.lastMove).toBeNull();
      expect(gameState.moveCount).toBe(0);
    });
  });

  describe('isValidMove', () => {
    test('should return true for valid moves', () => {
      const board = createEmptyBoard();
      for (let col = 0; col < COLS; col++) {
        expect(isValidMove(board, col)).toBe(true);
      }
    });

    test('should return false for out-of-bounds columns', () => {
      const board = createEmptyBoard();
      expect(isValidMove(board, -1)).toBe(false);
      expect(isValidMove(board, COLS)).toBe(false);
      expect(isValidMove(board, COLS + 1)).toBe(false);
    });

    test('should return false for full columns', () => {
      const board = createEmptyBoard();
      // Fill the first column
      for (let row = 0; row < ROWS; row++) {
        board[row][0] = 'red';
      }
      expect(isValidMove(board, 0)).toBe(false);
      expect(isValidMove(board, 1)).toBe(true);
    });
  });

  describe('makeMove', () => {
    test('should place piece in the bottom-most available position', () => {
      const gameState = createInitialGameState();
      const newState = makeMove(gameState, 3);

      expect(newState.board[ROWS - 1][3]).toBe('red');
      expect(newState.currentPlayer).toBe('yellow');
      expect(newState.moveCount).toBe(1);
      expect(newState.lastMove).toEqual({ row: ROWS - 1, col: 3 });
    });

    test('should stack pieces correctly', () => {
      let gameState = createInitialGameState();

      // First move: red in column 3
      gameState = makeMove(gameState, 3);
      expect(gameState.board[ROWS - 1][3]).toBe('red');
      expect(gameState.currentPlayer).toBe('yellow');

      // Second move: yellow in column 3
      gameState = makeMove(gameState, 3);
      expect(gameState.board[ROWS - 2][3]).toBe('yellow');
      expect(gameState.currentPlayer).toBe('red');
    });

    test('should throw error for invalid moves', () => {
      const gameState = createInitialGameState();
      expect(() => makeMove(gameState, -1)).toThrow('Invalid move');
      expect(() => makeMove(gameState, COLS)).toThrow('Invalid move');
    });

    test('should throw error when column is full', () => {
      let gameState = createInitialGameState();

      // Fill column 0
      for (let i = 0; i < ROWS; i++) {
        gameState = makeMove(gameState, 0);
        if (i < ROWS - 1) {
          gameState = makeMove(gameState, 1); // Alternate to keep players switching
        }
      }

      expect(() => makeMove(gameState, 0)).toThrow('Invalid move');
    });

    test('should detect when board is full', () => {
      // Create a simple full board scenario
      const gameState = createInitialGameState();
      gameState.moveCount = ROWS * COLS - 1;
      gameState.currentPlayer = 'red';

      // Fill all but one position
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (row === 0 && col === 0) continue; // Leave top-left empty
          gameState.board[row][col] = col % 2 === 0 ? 'red' : 'yellow';
        }
      }

      const finalState = makeMove(gameState, 0);
      expect(finalState.status).toBe('finished');
      expect(finalState.moveCount).toBe(ROWS * COLS);
    });
  });

  describe('checkWinner', () => {
    test('should detect horizontal win', () => {
      const board = createEmptyBoard();
      const row = ROWS - 1;

      // Place 4 red pieces horizontally
      for (let col = 1; col <= 4; col++) {
        board[row][col] = 'red';
      }

      expect(checkWinner(board, row, 2)).toBe('red');
      expect(checkWinner(board, row, 1)).toBe('red');
      expect(checkWinner(board, row, 4)).toBe('red');
    });

    test('should detect vertical win', () => {
      const board = createEmptyBoard();
      const col = 3;

      // Place 4 yellow pieces vertically
      for (let row = ROWS - 4; row < ROWS; row++) {
        board[row][col] = 'yellow';
      }

      expect(checkWinner(board, ROWS - 1, col)).toBe('yellow');
      expect(checkWinner(board, ROWS - 2, col)).toBe('yellow');
    });

    test('should detect diagonal win (bottom-left to top-right)', () => {
      const board = createEmptyBoard();

      // Place 4 red pieces diagonally
      board[ROWS - 1][0] = 'red';
      board[ROWS - 2][1] = 'red';
      board[ROWS - 3][2] = 'red';
      board[ROWS - 4][3] = 'red';

      expect(checkWinner(board, ROWS - 1, 0)).toBe('red');
      expect(checkWinner(board, ROWS - 3, 2)).toBe('red');
    });

    test('should detect diagonal win (top-left to bottom-right)', () => {
      const board = createEmptyBoard();

      // Place 4 yellow pieces diagonally
      board[0][0] = 'yellow';
      board[1][1] = 'yellow';
      board[2][2] = 'yellow';
      board[3][3] = 'yellow';

      expect(checkWinner(board, 0, 0)).toBe('yellow');
      expect(checkWinner(board, 2, 2)).toBe('yellow');
    });

    test('should return null when no winner', () => {
      const board = createEmptyBoard();
      board[ROWS - 1][0] = 'red';
      board[ROWS - 1][1] = 'yellow';
      board[ROWS - 1][2] = 'red';

      expect(checkWinner(board, ROWS - 1, 0)).toBeNull();
      expect(checkWinner(board, ROWS - 1, 2)).toBeNull();
    });

    test('should handle edge cases', () => {
      const board = createEmptyBoard();
      board[0][0] = 'red';

      expect(checkWinner(board, 0, 0)).toBeNull();
    });
  });

  describe('getValidMoves', () => {
    test('should return all columns for empty board', () => {
      const board = createEmptyBoard();
      const validMoves = getValidMoves(board);
      expect(validMoves).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    test('should exclude full columns', () => {
      const board = createEmptyBoard();

      // Fill first and last columns
      for (let row = 0; row < ROWS; row++) {
        board[row][0] = 'red';
        board[row][COLS - 1] = 'yellow';
      }

      const validMoves = getValidMoves(board);
      expect(validMoves).toEqual([1, 2, 3, 4, 5]);
    });

    test('should return empty array when board is full', () => {
      const board = createEmptyBoard();

      // Fill entire board
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          board[row][col] = 'red';
        }
      }

      const validMoves = getValidMoves(board);
      expect(validMoves).toEqual([]);
    });
  });

  describe('isGameFinished', () => {
    test('should return true for finished games', () => {
      const gameState = createInitialGameState();
      gameState.status = 'finished';
      expect(isGameFinished(gameState)).toBe(true);
    });

    test('should return false for ongoing games', () => {
      const gameState = createInitialGameState();
      gameState.status = 'playing';
      expect(isGameFinished(gameState)).toBe(false);

      gameState.status = 'waiting';
      expect(isGameFinished(gameState)).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('should play a complete game with red winning horizontally', () => {
      let gameState = createInitialGameState();

      // Red moves: 0, 1, 2, 3 (horizontal win)
      // Yellow moves: 0, 1, 2 (blocking moves above red)

      gameState = makeMove(gameState, 0); // Red
      gameState = makeMove(gameState, 0); // Yellow
      gameState = makeMove(gameState, 1); // Red
      gameState = makeMove(gameState, 1); // Yellow
      gameState = makeMove(gameState, 2); // Red
      gameState = makeMove(gameState, 2); // Yellow
      gameState = makeMove(gameState, 3); // Red wins

      expect(gameState.winner).toBe('red');
      expect(gameState.status).toBe('finished');
      expect(isGameFinished(gameState)).toBe(true);
    });

    test('should play a complete game with yellow winning vertically', () => {
      let gameState = createInitialGameState();

      // Yellow wins in column 3 vertically
      gameState = makeMove(gameState, 0); // Red
      gameState = makeMove(gameState, 3); // Yellow
      gameState = makeMove(gameState, 1); // Red
      gameState = makeMove(gameState, 3); // Yellow
      gameState = makeMove(gameState, 2); // Red
      gameState = makeMove(gameState, 3); // Yellow
      gameState = makeMove(gameState, 4); // Red
      gameState = makeMove(gameState, 3); // Yellow wins

      expect(gameState.winner).toBe('yellow');
      expect(gameState.status).toBe('finished');
    });
  });
});
