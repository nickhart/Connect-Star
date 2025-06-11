import React from 'react';
import type { Player } from '@connect-star/types';

interface PlayerIndicatorProps {
  currentPlayer: Player;
  winner?: Player | null;
  className?: string;
}

export function PlayerIndicator({ currentPlayer, winner, className = '' }: PlayerIndicatorProps) {
  if (winner) {
    return (
      <div className={`player-indicator winner ${className}`}>
        <div className={`player-piece player-${winner}`} />
        <span>Player {winner} wins!</span>
      </div>
    );
  }

  return (
    <div className={`player-indicator current ${className}`}>
      <div className={`player-piece player-${currentPlayer}`} />
      <span>Player {currentPlayer}'s turn</span>
    </div>
  );
}