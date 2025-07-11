import React from 'react';
import { Button } from './Button';
import type { GameMode, User, GamePlayer } from '@connect-star/types';

export interface MainMenuProps {
  onGameModeSelect: (mode: GameMode) => void;
  onAbout: () => void;
  className?: string;
  user?: User | null;
  player?: GamePlayer | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function MainMenu({
  onGameModeSelect,
  onAbout,
  className = '',
  user,
  player,
  onLogin,
  onLogout,
}: MainMenuProps) {
  return (
    <div className={`main-menu ${className}`}>
      <div className="main-menu__header">
        <h1 className="main-menu__title">Connect Star</h1>
        <p className="main-menu__subtitle">🔴🟡 Connect Four</p>

        {user && (
          <div className="main-menu__user-info">
            <p className="main-menu__user-welcome">
              Welcome, {player?.name || user.email}! 👋
            </p>
            <Button
              onClick={onLogout}
              variant="secondary"
              className="main-menu__logout-button"
            >
              Logout
            </Button>
          </div>
        )}
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
          onClick={() => (user ? onGameModeSelect('multiplayer') : onLogin?.())}
          variant="secondary"
          className="main-menu__button"
        >
          {user ? 'Play Online' : 'Play Online (Login Required)'}
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
