import React from 'react';
import { Button } from './Button';
import type { GameMode } from '@connect-star/types';

export interface MainMenuProps {
  onGameModeSelect: (mode: GameMode) => void;
  onAbout: () => void;
  className?: string;
}

export function MainMenu({
  onGameModeSelect,
  onAbout,
  className = '',
}: MainMenuProps) {
  return (
    <div className={`main-menu ${className}`}>
      <div className="main-menu__header">
        <h1 className="main-menu__title">Connect Star</h1>
        <p className="main-menu__subtitle">🔴🟡 Connect Four</p>
      </div>

      <div className="main-menu__options">
        <Button
          onClick={() => onGameModeSelect('local')}
          variant="primary"
          className="main-menu__button"
        >
          Play Locally
        </Button>

        <Button
          onClick={() => onGameModeSelect('multiplayer')}
          variant="secondary"
          className="main-menu__button"
        >
          Play Online
        </Button>

        <Button
          onClick={() => onGameModeSelect('ai')}
          variant="secondary"
          className="main-menu__button"
          disabled
        >
          Play vs Computer
          <span className="main-menu__coming-soon">(Coming Soon)</span>
        </Button>

        <Button
          onClick={onAbout}
          variant="secondary"
          className="main-menu__button main-menu__button--secondary"
        >
          About
        </Button>
      </div>

      <div className="main-menu__footer">
        <p className="main-menu__description">
          Choose your game mode to get started!
        </p>
      </div>
    </div>
  );
}
