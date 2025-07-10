'use client';

import { useState } from 'react';
import { MainMenu } from '@connect-star/ui';
import { LocalGameScreen } from '../components/LocalGameScreen';
import { AboutScreen } from '../components/AboutScreen';
import type { GameMode } from '@connect-star/types';
import '../styles/MainMenu.css';

type AppScreen = 'menu' | 'local-game' | 'about' | 'multiplayer';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');

  const handleGameModeSelect = (mode: GameMode) => {
    if (mode === 'local') {
      setCurrentScreen('local-game');
    } else if (mode === 'multiplayer') {
      // For now, show alert that multiplayer is coming soon
      alert('Online multiplayer is coming soon! Please check back later.');
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

  return (
    <main className="min-h-screen">
      {currentScreen === 'menu' && (
        <MainMenu
          onGameModeSelect={handleGameModeSelect}
          onAbout={handleAbout}
        />
      )}

      {currentScreen === 'local-game' && (
        <LocalGameScreen onBackToMenu={handleBackToMenu} />
      )}

      {currentScreen === 'about' && (
        <AboutScreen onBackToMenu={handleBackToMenu} />
      )}
    </main>
  );
}
