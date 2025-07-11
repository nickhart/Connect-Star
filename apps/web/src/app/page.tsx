'use client';

import { useState } from 'react';
import {
  MainMenu,
  useAuth,
  AuthScreen,
  PlayerSetupScreen,
} from '@connect-star/ui';
import { LocalGameScreen } from '../components/LocalGameScreen';
import { AboutScreen } from '../components/AboutScreen';
import type { GameMode } from '@connect-star/types';
import '../styles/MainMenu.css';

type AppScreen =
  | 'menu'
  | 'local-game'
  | 'about'
  | 'auth'
  | 'player-setup'
  | 'multiplayer';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
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
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Multiplayer Coming Soon!
            </h2>
            <p className="mb-4">
              Phase 3 will implement the multiplayer lobby.
            </p>
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
