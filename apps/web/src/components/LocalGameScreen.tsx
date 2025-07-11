'use client';

import { useState } from 'react';
import { GameBoard, PlayerIndicator, Button } from '@connect-star/ui';
import { createInitialGameState, makeMove } from '@connect-star/game-logic';
import type { GameState } from '@connect-star/types';

interface LocalGameScreenProps {
  onBackToMenu: () => void;
}

export function LocalGameScreen({ onBackToMenu }: LocalGameScreenProps) {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );

  const handleColumnClick = (col: number) => {
    if (gameState.status !== 'playing') return;

    try {
      const newGameState = makeMove(gameState, col);
      setGameState(newGameState);
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  const startNewGame = () => {
    setGameState({ ...createInitialGameState(), status: 'playing' });
  };

  const resetGame = () => {
    setGameState(createInitialGameState());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBackToMenu} variant="secondary">
            ← Back to Menu
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Local Play</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {gameState.status === 'waiting' && (
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Two players alternating on this device
            </p>
            <Button onClick={startNewGame} size="large">
              Start Game
            </Button>
          </div>
        )}

        {gameState.status !== 'waiting' && (
          <>
            <div className="mb-6">
              <PlayerIndicator
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                className="justify-center"
              />
            </div>

            <GameBoard
              board={gameState.board}
              onColumnClick={handleColumnClick}
              disabled={gameState.status === 'finished'}
              className="mb-6"
              mode="local"
            />

            <div className="flex justify-center gap-4">
              <Button onClick={resetGame} variant="secondary">
                Reset Game
              </Button>
              {gameState.status === 'finished' && (
                <Button onClick={startNewGame}>New Game</Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
