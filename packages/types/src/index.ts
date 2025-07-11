export type Player = 'red' | 'yellow';

export type CellState = Player | null;

export type Board = CellState[][];

export type GameStatus = 'waiting' | 'playing' | 'finished';

export type GameMode = 'local' | 'multiplayer' | 'ai';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  lastMove: { row: number; col: number } | null;
  moveCount: number;
}

export interface GameMove {
  col: number;
  player: Player;
}

export interface GameConfig {
  mode: GameMode;
  roomId?: string; // for multiplayer
  aiDifficulty?: 'easy' | 'medium' | 'hard'; // for future AI
  playerNames: {
    red: string;
    yellow: string;
  };
}

export interface EnhancedGameState extends GameState {
  mode: GameMode;
  config: GameConfig;
  isMyTurn?: boolean; // for multiplayer
  playerId?: string; // for multiplayer
}

export interface GameRoom {
  id: string;
  players: {
    red?: string;
    yellow?: string;
  };
  gameState: GameState;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateRoomRequest {
  playerName: string;
}

export interface JoinRoomRequest {
  roomId: string;
  playerName: string;
}

export interface MakeMoveRequest {
  roomId: string;
  col: number;
}

export interface GameEvent {
  type: 'move' | 'player-joined' | 'player-left' | 'game-ended';
  data: any;
  timestamp: Date;
}

// Authentication Types
export type UserRole = 'admin' | 'player';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface GamePlayer {
  id: string; // UUID
  name: string;
  userId?: number; // Optional - can be null for anonymous players
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export interface CreatePlayerRequest {
  name: string;
}

export interface RefreshTokenRequest {
  token: {
    refresh_token: string;
  };
}

export interface AuthState {
  user: User | null;
  player: GamePlayer | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  createPlayer: (request: CreatePlayerRequest) => Promise<void>;
}
