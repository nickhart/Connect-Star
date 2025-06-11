'use client'

import { useState } from 'react'
import { GameBoard, PlayerIndicator, Button } from '@connect-star/ui'
import { createInitialGameState, makeMove } from '@connect-star/game-logic'
import type { GameState } from '@connect-star/types'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())

  const handleColumnClick = (col: number) => {
    if (gameState.status !== 'playing') return
    
    try {
      const newGameState = makeMove(gameState, col)
      setGameState(newGameState)
    } catch (error) {
      console.error('Invalid move:', error)
    }
  }

  const startNewGame = () => {
    setGameState({ ...createInitialGameState(), status: 'playing' })
  }

  const resetGame = () => {
    setGameState(createInitialGameState())
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Connect Star
        </h1>
        
        {gameState.status === 'waiting' && (
          <div className="text-center mb-8">
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
            />

            <div className="flex justify-center gap-4">
              <Button onClick={resetGame} variant="secondary">
                Reset Game
              </Button>
              {gameState.status === 'finished' && (
                <Button onClick={startNewGame}>
                  New Game
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}