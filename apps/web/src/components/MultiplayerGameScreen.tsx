'use client';

import { useState, useEffect } from 'react';
import { GameBoard, PlayerIndicator, Button } from '@connect-star/ui';
import { GameServerClient } from '@simple-game-server/client';
import type { Game, GameSession } from '@simple-game-server/client';
import { useAuth } from '@connect-star/ui';

interface MultiplayerGameScreenProps {
  gameSession: GameSession;
  game: Game;
  onBackToLobby: () => void;
}

export function MultiplayerGameScreen({
  gameSession,
  game,
  onBackToLobby,
}: MultiplayerGameScreenProps) {
  const { tokens, player } = useAuth();
  const [currentSession, setCurrentSession] =
    useState<GameSession>(gameSession);
  const [error, setError] = useState<string | null>(null);

  // Helper function to create authenticated client
  const createClient = () => {
    if (!tokens?.access_token) {
      throw new Error('No authentication token available');
    }
    return new GameServerClient({
      apiUrl: 'http://localhost:3000',
      token: tokens.access_token,
    });
  };

  // Parse game state from session data
  const gameState = currentSession.state;
  const board =
    gameState?.board ||
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));
  const currentPlayer = gameState?.current_player || 'red';
  const winner = gameState?.winner || null;
  const status = currentSession.status;

  // Check if current player is the creator
  const isCreator = player?.id === currentSession.creator_id;

  const handleColumnClick = async (col: number) => {
    if (status !== 'active') return;

    try {
      const client = createClient();
      // TODO: Implement makeMove API call when available
      console.log('Making move in column:', col);
      // const updatedSession = await client.makeMove(game.id, currentSession.id, { column: col });
      // setCurrentSession(updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make move');
    }
  };

  const handleStartGame = async () => {
    try {
      const client = createClient();
      const updatedSession = await client.startGameSession(game.id, currentSession.id);
      setCurrentSession(updatedSession);
      console.log('Game started:', updatedSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    }
  };

  // Auto-refresh game session every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const client = createClient();
        const updatedSession = await client.getGameSession(
          game.id,
          currentSession.id
        );
        setCurrentSession(updatedSession);
      } catch (err) {
        console.error('Failed to refresh game session:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [game.id, currentSession.id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={onBackToLobby} variant="secondary">
            Back to Lobby
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBackToLobby} variant="secondary">
            ← Back to Lobby
          </Button>
          <h1 className="text-4xl font-bold text-gray-800">Multiplayer Game</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        {/* Game Info */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
          <p className="text-gray-600">
            Game #{currentSession.id} • Status: {status}
          </p>
          <p className="text-sm text-gray-500">
            Players: {currentSession.players?.length || 0}/{game.max_players}
          </p>
        </div>

        {status === 'waiting' && (
          <div className="text-center mb-8">
            {(currentSession.players?.length || 0) < game.min_players ? (
              <>
                <p className="text-gray-600 mb-4">
                  Waiting for more players to join...
                </p>
                <div className="animate-pulse text-blue-500">
                  Players joined: {currentSession.players?.length || 0}/
                  {game.max_players}
                </div>
              </>
            ) : (
              <>
                <p className="text-green-600 mb-4 font-semibold">
                  Ready to start! All players have joined.
                </p>
                <div className="text-blue-600 mb-4">
                  Players: {currentSession.players?.length || 0}/
                  {game.max_players}
                </div>
                {isCreator ? (
                  <Button onClick={handleStartGame} size="large">
                    Start Game
                  </Button>
                ) : (
                  <p className="text-gray-600 italic">
                    Waiting for game creator to start the game...
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {status === 'active' && (
          <>
            <div className="mb-6">
              <PlayerIndicator
                currentPlayer={currentPlayer}
                winner={winner}
                className="justify-center"
              />
            </div>

            <GameBoard
              board={board}
              onColumnClick={handleColumnClick}
              disabled={status !== 'active'}
              className="mb-6"
              mode="multiplayer"
            />
          </>
        )}

        {status === 'finished' && (
          <div className="text-center mb-6">
            <p className="text-xl font-semibold mb-4">
              {winner
                ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`
                : 'Game ended'}
            </p>
            <Button onClick={onBackToLobby}>Return to Lobby</Button>
          </div>
        )}
      </div>
    </div>
  );
}
