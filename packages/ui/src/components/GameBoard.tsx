import React from 'react';
import type { Board, Player } from '@connect-star/types';
import { ROWS, COLS } from '@connect-star/game-logic';

interface GameBoardProps {
  board: Board;
  onColumnClick?: (col: number) => void;
  disabled?: boolean;
  className?: string;
}

export function GameBoard({ board, onColumnClick, disabled = false, className = '' }: GameBoardProps) {
  return (
    <div className={`game-board ${className}`}>
      <div className="board-grid">
        {Array.from({ length: COLS }).map((_, col) => (
          <button
            key={col}
            className="column-button"
            onClick={() => !disabled && onColumnClick?.(col)}
            disabled={disabled}
            aria-label={`Drop piece in column ${col + 1}`}
          >
            {Array.from({ length: ROWS }).map((_, row) => (
              <div
                key={`${row}-${col}`}
                className={`cell ${board[row][col] ? `cell-${board[row][col]}` : 'cell-empty'}`}
              />
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}