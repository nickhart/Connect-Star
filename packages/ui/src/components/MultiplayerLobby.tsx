import React, { useState, useEffect } from 'react';
import { GameServerClient } from '@simple-game-server/client';
import type { Game, GameSession } from '@simple-game-server/client';
import { useAuth } from '../contexts/AuthContext';

interface MultiplayerLobbyProps {
  onBackToMenu: () => void;
  onJoinGame: (gameSession: GameSession, game: Game) => void;
}

export function MultiplayerLobby({
  onBackToMenu,
  onJoinGame,
}: MultiplayerLobbyProps) {
  const { tokens } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  // Load available games
  const loadGames = async () => {
    try {
      const client = createClient();
      const gamesList = await client.getGames();
      console.log('🎮 Games loaded:', gamesList);
      console.log('🎮 Games type:', typeof gamesList);
      console.log('🎮 Is array:', Array.isArray(gamesList));
      setGames(gamesList);

      // Auto-select Connect Four if available
      const connectFour = gamesList.find(g => g.name === 'Connect Four');
      if (connectFour) {
        setSelectedGame(connectFour);
        await loadGameSessions(connectFour.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    }
  };

  // Load game sessions for selected game
  const loadGameSessions = async (gameId: number) => {
    try {
      const client = createClient();
      const sessions = await client.getGameSessions(gameId);
      setGameSessions(sessions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load game sessions'
      );
    }
  };

  // Create new game session
  const createGameSession = async () => {
    if (!selectedGame) return;

    try {
      const client = createClient();
      const newSession = await client.createGameSession(selectedGame.id, {});
      
      setShowCreateModal(false);
      
      // Creator automatically joins the game session
      try {
        const joinedSession = await client.joinGameSession(
          selectedGame.id,
          newSession.id,
          {}
        );
        console.log('Creator successfully joined:', joinedSession);
        onJoinGame(joinedSession, selectedGame);
      } catch (joinError) {
        console.log('Join failed, fetching session directly:', joinError);
        // If join fails, get the session and navigate anyway (creator might already be joined)
        const currentSession = await client.getGameSession(selectedGame.id, newSession.id);
        console.log('Fetched session after join error:', currentSession);
        onJoinGame(currentSession, selectedGame);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create game session'
      );
    }
  };

  // Join existing game session
  const joinGameSession = async (sessionId: number) => {
    if (!selectedGame) return;

    try {
      const client = createClient();
      
      // Try to join the game session
      try {
        const updatedSession = await client.joinGameSession(
          selectedGame.id,
          sessionId,
          {}
        );
        console.log('Joined game session:', updatedSession);
        onJoinGame(updatedSession, selectedGame);
      } catch (joinError) {
        // If join fails, maybe user is already in the game - just get the session and navigate
        console.log('Join failed, checking if already in game:', joinError);
        const currentSession = await client.getGameSession(selectedGame.id, sessionId);
        onJoinGame(currentSession, selectedGame);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to access game session'
      );
    }
  };

  // Auto-refresh game sessions every 5 seconds
  useEffect(() => {
    if (selectedGame) {
      const interval = setInterval(() => {
        loadGameSessions(selectedGame.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedGame]);

  // Initial load
  useEffect(() => {
    loadGames().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading multiplayer lobby...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={onBackToMenu}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Multiplayer Lobby</h1>
          <button
            onClick={onBackToMenu}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to Menu
          </button>
        </div>

        {/* Game Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Game</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game);
                  loadGameSessions(game.id);
                }}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedGame?.id === game.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold">{game.name}</h3>
                <p className="text-sm text-gray-600">{game.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {game.min_players}-{game.max_players} players
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Game Sessions */}
        {selectedGame && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedGame.name} Games
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create New Game
              </button>
            </div>

            {gameSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No active games found.</p>
                <p className="text-sm">Create a new game to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {gameSessions.map(session => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Game #{session.id}</h3>
                        <p className="text-sm text-gray-600">
                          Status: {session.status} • Players:{' '}
                          {session.players?.length || 0}/
                          {selectedGame.max_players}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created:{' '}
                          {new Date(session.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        {session.status === 'waiting' && (
                          <button
                            onClick={() => joinGameSession(session.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Join Game
                          </button>
                        )}
                        {session.status === 'active' && (
                          <button
                            onClick={() => joinGameSession(session.id)}
                            className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                          >
                            Spectate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Game Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create New Game</h3>
              <p className="text-gray-600 mb-6">
                Create a new {selectedGame?.name} game session.
              </p>

              {/* Future: Game configuration options will go here */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  Game Settings
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    Board: 6x7 (Classic){' '}
                    <span className="text-gray-400">
                      • Coming soon: Custom sizes
                    </span>
                  </p>
                  <p>
                    Win condition: 4 in a row{' '}
                    <span className="text-gray-400">
                      • Coming soon: Configurable
                    </span>
                  </p>
                  <p>
                    Mode: Classic Connect Four{' '}
                    <span className="text-gray-400">
                      • Coming soon: Variants
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createGameSession}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Create Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
