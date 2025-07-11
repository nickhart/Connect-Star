'use client';

import { useState, useEffect } from 'react';
import { GameBoard, PlayerIndicator, Button } from '@connect-star/ui';
import { GameServerClient } from '@simple-game-server/client';
import type { Game, GameSession } from '@simple-game-server/client';
import { useAuth } from '@connect-star/ui';
import {
  makeMove,
  isValidMove,
  createInitialGameState,
} from '@connect-star/game-logic';
import type { GameState, Player } from '@connect-star/types';

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
  const parseGameState = (): GameState => {
    const sessionState = currentSession.state;

    if (!sessionState || !sessionState.board) {
      // Initialize with empty game state if none exists
      return createInitialGameState();
    }

    // Convert server format (number[][]) to our format (string[][])
    const clientBoard = sessionState.board.map((row: number[]) =>
      row.map((cell: number) =>
        cell === 0 ? null : cell === 1 ? 'red' : 'yellow'
      )
    );

    // Convert server format to our GameState format
    return {
      board: clientBoard,
      currentPlayer: sessionState.current_player === 1 ? 'red' : 'yellow',
      status:
        currentSession.status === 'active'
          ? 'playing'
          : (currentSession.status as any),
      winner:
        sessionState.winner === 1
          ? 'red'
          : sessionState.winner === 2
            ? 'yellow'
            : null,
      lastMove: sessionState.last_move || null,
      moveCount: sessionState.move_count || 0,
    };
  };

  const gameState = parseGameState();
  const { board, currentPlayer, winner } = gameState;
  const status = currentSession.status;

  // Check if current player is the creator
  const isCreator = player?.id === currentSession.creator_id;

  // Determine which player (red/yellow) the current user is
  const getCurrentPlayerIndex = (): number => {
    const playerIndex =
      currentSession.players?.findIndex(p => p.id === player?.id) ?? -1;
    return playerIndex;
  };

  const getCurrentPlayerColor = (): Player => {
    return getCurrentPlayerIndex() === 0 ? 'red' : 'yellow';
  };

  const isMyTurn = (): boolean => {
    return getCurrentPlayerColor() === currentPlayer;
  };

  const handleColumnClick = async (col: number) => {
    if (status !== 'active') {
      console.log('Game not active, cannot make move');
      return;
    }

    if (!isMyTurn()) {
      console.log('Not your turn!');
      setError("It's not your turn!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!isValidMove(board, col)) {
      console.log('Invalid move!');
      setError('Invalid move!');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const client = createClient();

      // Calculate new game state using our Connect Four logic
      const newGameState = makeMove(gameState, col);
      console.log('New game state:', newGameState);

      // Convert board from our format (string[]) to server format (number[])
      const serverBoard = newGameState.board.map(row =>
        row.map(cell => (cell === null ? 0 : cell === 'red' ? 1 : 2))
      );

      // Convert our GameState format to server format
      const serverGameState = {
        board: serverBoard,
        current_player: newGameState.currentPlayer === 'red' ? 1 : 2,
        winner:
          newGameState.winner === 'red'
            ? 1
            : newGameState.winner === 'yellow'
              ? 2
              : 0,
        game_status:
          newGameState.status === 'playing'
            ? 'in_progress'
            : newGameState.status,
        last_move: newGameState.lastMove
          ? {
              column: newGameState.lastMove.col,
              row: newGameState.lastMove.row,
              player: getCurrentPlayerIndex() + 1,
            }
          : null,
      };

      console.log('Updating session with:', serverGameState);

      // Update the game session with new state
      const updatedSession = await client.updateGameSession(
        game.id,
        currentSession.id,
        { state: serverGameState }
      );

      console.log('Session updated:', updatedSession);
      setCurrentSession(updatedSession);
    } catch (err) {
      console.error('Move failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to make move');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleStartGame = async () => {
    try {
      const client = createClient();

      // Initialize game state when starting
      const initialGameState = createInitialGameState();

      // Convert board from our format (string[]) to server format (number[])
      const serverBoard = initialGameState.board.map(row =>
        row.map(cell => (cell === null ? 0 : cell === 'red' ? 1 : 2))
      );

      const serverGameState = {
        board: serverBoard,
        current_player: 1, // Red starts first (player index 0)
        winner: 0,
        game_status: 'in_progress',
        last_move: null,
      };

      // First start the session, then initialize the game state
      const startedSession = await client.startGameSession(
        game.id,
        currentSession.id
      );

      // Update with initial game state
      const updatedSession = await client.updateGameSession(
        game.id,
        currentSession.id,
        { state: serverGameState }
      );

      setCurrentSession(updatedSession);
      console.log('Game started with initial state:', updatedSession);
    } catch (err) {
      console.error('Failed to start game:', err);
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
            <div className="mb-6 text-center">
              <PlayerIndicator
                currentPlayer={currentPlayer}
                winner={winner}
                className="justify-center mb-4"
              />

              {/* Turn Information */}
              {!winner && (
                <div className="mb-4">
                  {isMyTurn() ? (
                    <p className="text-green-600 font-semibold">
                      🎯 Your turn! Click a column to drop your piece.
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Waiting for {currentPlayer} player to make their move...
                    </p>
                  )}
                </div>
              )}

              {/* Player Info */}
              <div className="text-sm text-gray-500">
                You are:{' '}
                <span className="font-semibold text-gray-700">
                  {getCurrentPlayerColor().charAt(0).toUpperCase() +
                    getCurrentPlayerColor().slice(1)}
                </span>
              </div>
            </div>

            <GameBoard
              board={board}
              onColumnClick={handleColumnClick}
              disabled={status !== 'active' || !isMyTurn()}
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
