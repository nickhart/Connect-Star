export type Player = 'red' | 'yellow';

export type CellState = Player | null;

export type Board = CellState[][];

export type GameStatus = 'waiting' | 'playing' | 'finished';

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
