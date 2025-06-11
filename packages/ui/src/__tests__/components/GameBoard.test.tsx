import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '../../components/GameBoard';
import { ROWS, COLS } from '@connect-star/game-logic';
import type { Board } from '@connect-star/types';

// Helper function to create a test board
const createTestBoard = (): Board => {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
};

describe('GameBoard', () => {
  test('renders empty board correctly', () => {
    const board = createTestBoard();
    render(<GameBoard board={board} />);
    
    // Should render the main container
    const gameBoard = screen.getByLabelText('Drop piece in column 1').closest('.game-board');
    expect(gameBoard).toBeInTheDocument();
    
    // Should render column buttons
    const columnButtons = screen.getAllByRole('button');
    expect(columnButtons).toHaveLength(COLS);
  });

  test('renders board with pieces', () => {
    const board = createTestBoard();
    board[ROWS - 1][0] = 'red';
    board[ROWS - 1][1] = 'yellow';
    board[ROWS - 2][0] = 'yellow';
    
    const { container } = render(<GameBoard board={board} />);
    
    // Check for cells with pieces
    const cells = container.querySelectorAll('.cell');
    const redCells = container.querySelectorAll('.cell-red');
    const yellowCells = container.querySelectorAll('.cell-yellow');
    const emptyCells = container.querySelectorAll('.cell-empty');
    
    expect(cells).toHaveLength(ROWS * COLS);
    expect(redCells).toHaveLength(1);
    expect(yellowCells).toHaveLength(2);
    expect(emptyCells).toHaveLength(ROWS * COLS - 3);
  });

  test('calls onColumnClick when column is clicked', () => {
    const board = createTestBoard();
    const onColumnClick = jest.fn();
    
    render(<GameBoard board={board} onColumnClick={onColumnClick} />);
    
    const columnButtons = screen.getAllByRole('button');
    
    // Click first column
    fireEvent.click(columnButtons[0]);
    expect(onColumnClick).toHaveBeenCalledWith(0);
    
    // Click third column
    fireEvent.click(columnButtons[2]);
    expect(onColumnClick).toHaveBeenCalledWith(2);
    
    expect(onColumnClick).toHaveBeenCalledTimes(2);
  });

  test('does not call onColumnClick when disabled', () => {
    const board = createTestBoard();
    const onColumnClick = jest.fn();
    
    render(
      <GameBoard board={board} onColumnClick={onColumnClick} disabled />
    );
    
    const columnButtons = screen.getAllByRole('button');
    
    // All buttons should be disabled
    columnButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    // Click should not trigger callback
    fireEvent.click(columnButtons[0]);
    expect(onColumnClick).not.toHaveBeenCalled();
  });

  test('does not call onColumnClick when no callback provided', () => {
    const board = createTestBoard();
    
    // Should not throw error when onColumnClick is not provided
    expect(() => {
      render(<GameBoard board={board} />);
      const columnButtons = screen.getAllByRole('button');
      fireEvent.click(columnButtons[0]);
    }).not.toThrow();
  });

  test('applies custom className', () => {
    const board = createTestBoard();
    
    const { container } = render(<GameBoard board={board} className="custom-board" />);
    const gameBoard = container.querySelector('.game-board');
    expect(gameBoard).toHaveClass('custom-board');
  });

  test('renders correct number of cells per column', () => {
    const board = createTestBoard();
    render(<GameBoard board={board} />);
    
    const columnButtons = screen.getAllByRole('button');
    
    columnButtons.forEach(button => {
      const cells = button.querySelectorAll('.cell');
      expect(cells).toHaveLength(ROWS);
    });
  });

  test('has accessible labels for column buttons', () => {
    const board = createTestBoard();
    render(<GameBoard board={board} />);
    
    for (let col = 0; col < COLS; col++) {
      expect(
        screen.getByLabelText(`Drop piece in column ${col + 1}`)
      ).toBeInTheDocument();
    }
  });

  test('renders full column correctly', () => {
    const board = createTestBoard();
    
    // Fill first column
    for (let row = 0; row < ROWS; row++) {
      board[row][0] = row % 2 === 0 ? 'red' : 'yellow';
    }
    
    render(<GameBoard board={board} />);
    
    const firstColumnButton = screen.getByLabelText('Drop piece in column 1');
    const cells = firstColumnButton.querySelectorAll('.cell');
    const emptyCells = firstColumnButton.querySelectorAll('.cell-empty');
    
    expect(cells).toHaveLength(ROWS);
    expect(emptyCells).toHaveLength(0); // No empty cells in full column
  });

  test('handles mixed board state', () => {
    const board = createTestBoard();
    
    // Create a realistic game state
    board[ROWS - 1][3] = 'red';
    board[ROWS - 2][3] = 'yellow';
    board[ROWS - 3][3] = 'red';
    board[ROWS - 1][4] = 'yellow';
    board[ROWS - 2][4] = 'red';
    
    const { container } = render(<GameBoard board={board} />);
    
    const redCells = container.querySelectorAll('.cell-red');
    const yellowCells = container.querySelectorAll('.cell-yellow');
    
    expect(redCells).toHaveLength(3);
    expect(yellowCells).toHaveLength(2);
  });

  test('renders with all combinations of props', () => {
    const board = createTestBoard();
    board[ROWS - 1][0] = 'red';
    
    const onColumnClick = jest.fn();
    
    const { container } = render(
      <GameBoard
        board={board}
        onColumnClick={onColumnClick}
        disabled={false}
        className="test-class"
      />
    );
    
    // Should render without errors
    const gameBoard = screen.getByLabelText('Drop piece in column 1').closest('.game-board');
    expect(gameBoard).toBeInTheDocument();
    expect(container.querySelector('.game-board')).toHaveClass('test-class');
    
    // Should be interactive
    const firstButton = screen.getByLabelText('Drop piece in column 1');
    expect(firstButton).not.toBeDisabled();
    
    fireEvent.click(firstButton);
    expect(onColumnClick).toHaveBeenCalledWith(0);
  });
});