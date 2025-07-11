'use client';

import React, { useState } from 'react';
import { Button } from './Button';
import type { RegisterRequest } from '@connect-star/types';

interface RegisterFormProps {
  onRegister: (request: RegisterRequest) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export function RegisterForm({
  onRegister,
  onSwitchToLogin,
  isLoading = false,
  error,
}: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    await onRegister({
      user: {
        email: email.trim(),
        password: password.trim(),
        password_confirmation: confirmPassword.trim(),
      },
    });
  };

  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    email.trim() && password.trim() && confirmPassword.trim() && passwordsMatch;

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-header">
        <h2>Create Account</h2>
        <p>Join Connect Star and play with friends online!</p>
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
          autoComplete="new-password"
          minLength={6}
        />
        <small className="form-hint">Minimum 6 characters</small>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
          autoComplete="new-password"
          minLength={6}
        />
        {confirmPassword && !passwordsMatch && (
          <small className="form-error-text">Passwords do not match</small>
        )}
      </div>

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="form-switch">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
