'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import type { LoginRequest } from '@connect-star/types';

interface LoginFormProps {
  onLogin: (request: LoginRequest) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({
  onLogin,
  onSwitchToRegister,
  isLoading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    await onLogin({
      email: email.trim(),
      password: password.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-header">
        <h2>Welcome Back!</h2>
        <p>Sign in to your account to play online</p>
      </div>

      {error && (
        <div className="form-error">
          <p>{error}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !email.trim() || !password.trim()}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="form-switch">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
