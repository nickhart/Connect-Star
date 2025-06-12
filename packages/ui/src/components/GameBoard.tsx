import React, { useState, useEffect, useRef } from 'react';
import type { Board } from '@connect-star/types';
import { ROWS, COLS } from '@connect-star/game-logic';
import './GameBoard.css';

interface GameBoardProps {
  board: Board;
  onColumnClick?: (col: number) => void;
  disabled?: boolean;
  className?: string;
}

interface DroppingPiece {
  col: number;
  row: number;
  player: 'red' | 'yellow';
  id: string;
}

export function GameBoard({
  board,
  onColumnClick,
  disabled = false,
  className = '',
}: GameBoardProps) {
  const [droppingPieces, setDroppingPieces] = useState<DroppingPiece[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevBoardRef = useRef<Board>(board);
  const animationIdRef = useRef<string | null>(null);

  useEffect(() => {
    const prevBoard = prevBoardRef.current;
    const newPieces: DroppingPiece[] = [];

    // Find newly placed pieces by comparing boards
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        const prevCell = prevBoard[row][col];
        const currentCell = board[row][col];

        if (!prevCell && currentCell) {
          // New piece found
          const id = `${Date.now()}-${col}-${row}`;
          newPieces.push({
            col,
            row,
            player: currentCell,
            id,
          });
        }
      }
    }

    if (newPieces.length > 0) {
      setIsAnimating(true);
      setDroppingPieces(newPieces);
      animationIdRef.current = newPieces[0].id;

      // Animation completes after gravity + bounce duration
      setTimeout(() => {
        setIsAnimating(false);
        setDroppingPieces([]);
        animationIdRef.current = null;
      }, 800); // 600ms drop + 200ms bounce
    }

    prevBoardRef.current = board;
  }, [board]);

  const handleColumnClick = (col: number) => {
    if (!disabled && !isAnimating && onColumnClick) {
      onColumnClick(col);
    }
  };

  return (
    <div className={`game-board ${className}`}>
      <div className="board-grid">
        {Array.from({ length: COLS }).map((_, col) => (
          <button
            key={col}
            className="column-button"
            onClick={() => handleColumnClick(col)}
            disabled={disabled || isAnimating}
            aria-label={`Drop piece in column ${col + 1}`}
          >
            {Array.from({ length: ROWS }).map((_, row) => {
              const droppingPiece = droppingPieces.find(
                p => p.col === col && p.row === row
              );
              const shouldHideStaticPiece =
                droppingPiece && animationIdRef.current === droppingPiece.id;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell ${
                    shouldHideStaticPiece
                      ? 'cell-empty'
                      : board[row][col]
                        ? `cell-${board[row][col]}`
                        : 'cell-empty'
                  }`}
                >
                  {droppingPiece && (
                    <div
                      className={`dropping-piece cell-${droppingPiece.player}`}
                      style={
                        {
                          '--target-row': row,
                          '--column': col,
                        } as React.CSSProperties
                      }
                    />
                  )}
                </div>
              );
            })}
          </button>
        ))}
      </div>
    </div>
  );
}
