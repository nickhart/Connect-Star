'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type {
  AuthContextType,
  AuthState,
  LoginRequest,
  RegisterRequest,
  CreatePlayerRequest,
  User,
  GamePlayer,
  AuthTokens,
} from '@connect-star/types';
import { GameServerClient } from '@simple-game-server/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_STORAGE_KEY = 'connect-star-auth';

export function AuthProvider({ children }: AuthProviderProps) {
  // Helper function to create client with token
  const createClient = (token?: string) =>
    new GameServerClient({
      apiUrl: 'http://localhost:3000',
      token,
    });
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    player: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          const parsedAuth = JSON.parse(savedAuth);
          const { user, tokens } = parsedAuth;

          if (tokens && user) {
            // Verify tokens are still valid by fetching current player
            try {
              const client = createClient(tokens.access_token);
              const player = await client.getCurrentPlayer();

              setAuthState({
                user,
                player,
                tokens,
                isAuthenticated: true,
                isLoading: false,
              });
              return;
            } catch {
              // Token is invalid, continue to clear auth state
              console.log('Saved auth token is invalid, clearing auth state');
            }
          }
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        // Clear invalid auth data
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      setAuthState({
        user: null,
        player: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    loadAuthState();
  }, []);

  const saveAuthState = (
    user: User,
    player: GamePlayer | null,
    tokens: AuthTokens
  ) => {
    const authData = { user, player, tokens };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

    setAuthState({
      user,
      player,
      tokens,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const clearAuthState = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setAuthState({
      user: null,
      player: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const login = async (request: LoginRequest): Promise<void> => {
    try {
      const client = createClient();
      const accessToken = await client.login(request);

      // The new client doesn't return user data directly, so we need to get it separately
      // For now, we'll create a minimal auth state and get user data later
      const tokens = { access_token: accessToken, refresh_token: '' }; // TODO: Handle refresh token

      // Try to get current player
      try {
        const authenticatedClient = createClient(accessToken);
        const player = await authenticatedClient.getCurrentPlayer();
        // Create a minimal user object - we may need to adjust this based on actual API response
        const user = {
          id: player.user_id,
          email: request.email, // We know this from the login request
          role: 'player' as const,
        };

        saveAuthState(user, player, tokens);
      } catch {
        // If getting player fails, just save with user data
        const user = {
          id: 0, // Placeholder
          email: request.email,
          role: 'player' as const,
        };

        saveAuthState(user, null, tokens);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (_request: RegisterRequest): Promise<void> => {
    try {
      // TODO: Implement register functionality with new client
      // For now, throw an error since the new client doesn't have register method
      throw new Error('Registration not yet implemented with new client');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (authState.tokens) {
        const client = createClient(authState.tokens.access_token);
        await client.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthState();
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      // TODO: Implement token refresh with new client
      // For now, just clear auth state and throw error
      throw new Error('Token refresh not yet implemented with new client');
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthState();
      throw error;
    }
  };

  const createPlayer = async (request: CreatePlayerRequest): Promise<void> => {
    try {
      if (!authState.tokens) {
        throw new Error('No authentication token available');
      }

      const client = createClient(authState.tokens.access_token);
      const player = await client.createPlayer(request);

      // Update auth state with new player
      setAuthState(prev => ({
        ...prev,
        player,
      }));

      // Update localStorage
      if (authState.user && authState.tokens) {
        saveAuthState(authState.user, player, authState.tokens);
      }
    } catch (error) {
      console.error('Create player error:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    createPlayer,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
