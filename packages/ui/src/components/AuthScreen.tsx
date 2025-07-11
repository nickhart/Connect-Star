'use client';

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import type { LoginRequest, RegisterRequest } from '@connect-star/types';
import './AuthForm.css';

type AuthMode = 'login' | 'register';

interface AuthScreenProps {
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
}

export function AuthScreen({
  initialMode = 'login',
  onAuthSuccess,
}: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleLogin = async (request: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      await login(request);
      onAuthSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (request: RegisterRequest) => {
    setIsLoading(true);
    setError('');

    try {
      await register(request);
      onAuthSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setMode('login');
    setError('');
  };

  const switchToRegister = () => {
    setMode('register');
    setError('');
  };

  return (
    <div className="auth-screen">
      {mode === 'login' ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={switchToRegister}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={switchToLogin}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}
