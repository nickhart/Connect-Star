import type { 
  ApiResponse, 
  GameRoom, 
  CreateRoomRequest, 
  JoinRoomRequest, 
  MakeMoveRequest,
  GameEvent 
} from '@connect-star/types';

export class ConnectStarApiClient {
  private baseUrl: string;
  private ws: WebSocket | null = null;
  private eventListeners: Map<string, ((event: GameEvent) => void)[]> = new Map();

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async createRoom(request: CreateRoomRequest): Promise<ApiResponse<GameRoom>> {
    const response = await fetch(`${this.baseUrl}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  }

  async joinRoom(request: JoinRoomRequest): Promise<ApiResponse<GameRoom>> {
    const response = await fetch(`${this.baseUrl}/api/rooms/${request.roomId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerName: request.playerName }),
    });

    return response.json();
  }

  async getRoom(roomId: string): Promise<ApiResponse<GameRoom>> {
    const response = await fetch(`${this.baseUrl}/api/rooms/${roomId}`);
    return response.json();
  }

  async makeMove(request: MakeMoveRequest): Promise<ApiResponse<GameRoom>> {
    const response = await fetch(`${this.baseUrl}/api/rooms/${request.roomId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ col: request.col }),
    });

    return response.json();
  }

  connectWebSocket(roomId: string): void {
    const wsUrl = this.baseUrl.replace('http', 'ws');
    this.ws = new WebSocket(`${wsUrl}/ws/${roomId}`);

    this.ws.onmessage = (event) => {
      try {
        const gameEvent: GameEvent = JSON.parse(event.data);
        this.notifyListeners(gameEvent.type, gameEvent);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addEventListener(eventType: string, listener: (event: GameEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  removeEventListener(eventType: string, listener: (event: GameEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private notifyListeners(eventType: string, event: GameEvent): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => listener(event));
  }
}

export const apiClient = new ConnectStarApiClient();