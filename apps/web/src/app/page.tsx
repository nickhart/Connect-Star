'use client';

import { useState } from 'react';
import {
  MainMenu,
  useAuth,
  AuthScreen,
  PlayerSetupScreen,
  MultiplayerLobby,
} from '@connect-star/ui';
import { LocalGameScreen } from '../components/LocalGameScreen';
import { MultiplayerGameScreen } from '../components/MultiplayerGameScreen';
import { AboutScreen } from '../components/AboutScreen';
import type { GameMode } from '@connect-star/types';
import type { Game, GameSession } from '@simple-game-server/client';
import '../styles/MainMenu.css';

type AppScreen =
  | 'menu'
  | 'local-game'
  | 'about'
  | 'auth'
  | 'player-setup'
  | 'multiplayer'
  | 'multiplayer-game';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [currentGameSession, setCurrentGameSession] =
    useState<GameSession | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const { user, player, logout, isLoading } = useAuth();

  const handleGameModeSelect = (mode: GameMode) => {
    if (mode === 'local') {
      setCurrentScreen('local-game');
    } else if (mode === 'multiplayer') {
      if (!user) {
        setCurrentScreen('auth');
      } else if (!player) {
        setCurrentScreen('player-setup');
      } else {
        setCurrentScreen('multiplayer');
      }
    } else if (mode === 'ai') {
      // AI mode is disabled in the UI, but handle it here too
      alert('AI mode is coming soon! Please check back later.');
    }
  };

  const handleAbout = () => {
    setCurrentScreen('about');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleJoinGame = (gameSession: GameSession, game: Game) => {
    setCurrentGameSession(gameSession);
    setCurrentGame(game);
    setCurrentScreen('multiplayer-game');
  };

  const handleBackToLobby = () => {
    setCurrentScreen('multiplayer');
    setCurrentGameSession(null);
    setCurrentGame(null);
  };

  const handleLogin = () => {
    setCurrentScreen('auth');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('menu');
  };

  const handleAuthSuccess = () => {
    if (user && !player) {
      setCurrentScreen('player-setup');
    } else {
      setCurrentScreen('menu');
    }
  };

  const handlePlayerCreated = () => {
    setCurrentScreen('menu');
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {currentScreen === 'menu' && (
        <MainMenu
          onGameModeSelect={handleGameModeSelect}
          onAbout={handleAbout}
          user={user}
          player={player}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'local-game' && (
        <LocalGameScreen onBackToMenu={handleBackToMenu} />
      )}

      {currentScreen === 'about' && (
        <AboutScreen onBackToMenu={handleBackToMenu} />
      )}

      {currentScreen === 'auth' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        </div>
      )}

      {currentScreen === 'player-setup' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <PlayerSetupScreen onPlayerCreated={handlePlayerCreated} />
        </div>
      )}

      {currentScreen === 'multiplayer' && (
        <MultiplayerLobby
          onBackToMenu={handleBackToMenu}
          onJoinGame={handleJoinGame}
        />
      )}

      {currentScreen === 'multiplayer-game' &&
        currentGameSession &&
        currentGame && (
          <MultiplayerGameScreen
            gameSession={currentGameSession}
            game={currentGame}
            onBackToLobby={handleBackToLobby}
          />
        )}
    </main>
  );
}
