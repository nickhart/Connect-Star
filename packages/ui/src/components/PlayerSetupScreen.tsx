'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css';

interface PlayerSetupScreenProps {
  onPlayerCreated?: () => void;
}

export function PlayerSetupScreen({ onPlayerCreated }: PlayerSetupScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { createPlayer, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError('Please enter a player name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createPlayer({ name: playerName.trim() });
      onPlayerCreated?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create player';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-header">
          <h2>Create Your Player Profile</h2>
          <p>
            Welcome, {user?.email}! 🎉
            <br />
            Choose a name for your player profile to start playing online.
          </p>
        </div>

        {error && (
          <div className="form-error">
            <p>{error}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="playerName">Player Name</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            disabled={isLoading}
            required
            maxLength={50}
            placeholder="Enter your player name"
          />
          <small className="form-hint">
            This is how other players will see you in games
          </small>
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !playerName.trim()}
          >
            {isLoading ? 'Creating Profile...' : 'Create Player Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
