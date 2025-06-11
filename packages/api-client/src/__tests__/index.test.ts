import { ConnectStarApiClient } from '../index';
import type {
  CreateRoomRequest,
  JoinRoomRequest,
  MakeMoveRequest,
} from '@connect-star/types';

// Mock fetch and WebSocket
const mockFetch = jest.fn();
const mockWebSocket = jest.fn();
const mockWebSocketInstance = {
  onmessage: null as unknown,
  onerror: null as unknown,
  onclose: null as unknown,
  close: jest.fn(),
};

// @ts-expect-error - Mock global fetch for testing
global.fetch = mockFetch;
// @ts-expect-error - Mock global WebSocket for testing
global.WebSocket = mockWebSocket.mockImplementation(
  () => mockWebSocketInstance
);

describe('ConnectStarApiClient', () => {
  let client: ConnectStarApiClient;
  const baseUrl = 'https://api.example.com';

  beforeEach(() => {
    client = new ConnectStarApiClient(baseUrl);
    jest.clearAllMocks();
  });

  afterEach(() => {
    client.disconnectWebSocket();
  });

  describe('constructor', () => {
    test('should initialize with base URL', () => {
      expect(client).toBeInstanceOf(ConnectStarApiClient);
    });

    test('should handle base URL with trailing slash', () => {
      const clientWithSlash = new ConnectStarApiClient(
        'https://api.example.com/'
      );
      expect(clientWithSlash).toBeInstanceOf(ConnectStarApiClient);
    });
  });

  describe('createRoom', () => {
    const mockRequest: CreateRoomRequest = {
      playerName: 'Alice',
    };

    const mockResponse = {
      success: true,
      data: {
        id: 'room-123',
        players: { red: 'Alice' },
        gameState: {
          board: Array(6)
            .fill(null)
            .map(() => Array(7).fill(null)),
          currentPlayer: 'red' as const,
          status: 'waiting' as const,
          winner: null,
          lastMove: null,
          moveCount: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    test('should create room successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.createRoom(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockRequest),
      });
      expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ success: false, error: 'Bad Request' }),
      });

      const result = await client.createRoom(mockRequest);
      expect(result).toBeDefined();
    });
  });

  describe('joinRoom', () => {
    const mockRequest: JoinRoomRequest = {
      roomId: 'room-123',
      playerName: 'Bob',
    };

    test('should join room successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'room-123',
          players: { red: 'Alice', yellow: 'Bob' },
          gameState: {
            board: Array(6)
              .fill(null)
              .map(() => Array(7).fill(null)),
            currentPlayer: 'red' as const,
            status: 'playing' as const,
            winner: null,
            lastMove: null,
            moveCount: 0,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.joinRoom(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/rooms/${mockRequest.roomId}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerName: mockRequest.playerName }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('makeMove', () => {
    const mockRequest: MakeMoveRequest = {
      roomId: 'room-123',
      col: 3,
    };

    test('should make move successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'room-123',
          players: { red: 'Alice', yellow: 'Bob' },
          gameState: {
            board: Array(6)
              .fill(null)
              .map(() => Array(7).fill(null)),
            currentPlayer: 'yellow' as const,
            status: 'playing' as const,
            winner: null,
            lastMove: { row: 5, col: 3 },
            moveCount: 1,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.makeMove(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/api/rooms/${mockRequest.roomId}/move`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ col: mockRequest.col }),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('WebSocket connection', () => {
    const roomId = 'room-123';

    test('should connect to WebSocket successfully', () => {
      client.connectWebSocket(roomId);

      expect(mockWebSocket).toHaveBeenCalledWith(
        `wss://api.example.com/ws/${roomId}`
      );
    });

    test('should disconnect WebSocket', () => {
      client.connectWebSocket(roomId);
      client.disconnectWebSocket();

      expect(mockWebSocketInstance.close).toHaveBeenCalled();
    });

    test('should handle disconnect when not connected', () => {
      // Should not throw when disconnecting without connecting
      expect(() => client.disconnectWebSocket()).not.toThrow();
    });

    test('should convert HTTP URL to WebSocket URL', () => {
      const httpClient = new ConnectStarApiClient('http://localhost:3000');
      httpClient.connectWebSocket(roomId);

      expect(mockWebSocket).toHaveBeenCalledWith(
        `ws://localhost:3000/ws/${roomId}`
      );
    });
  });

  describe('Event listeners', () => {
    test('should add and remove event listeners', () => {
      const listener = jest.fn();

      client.addEventListener('move', listener);
      client.removeEventListener('move', listener);

      // Should not throw
      expect(() => {
        client.addEventListener('player-joined', listener);
        client.removeEventListener('player-joined', listener);
      }).not.toThrow();
    });

    test('should handle multiple listeners for same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      client.addEventListener('move', listener1);
      client.addEventListener('move', listener2);

      // Test passes if no errors are thrown
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });
  });

  describe('Integration scenarios', () => {
    test('should handle complete API flow', async () => {
      // Create room
      const createResponse = {
        success: true,
        data: {
          id: 'room-123',
          players: { red: 'Alice' },
          gameState: {
            board: Array(6)
              .fill(null)
              .map(() => Array(7).fill(null)),
            currentPlayer: 'red' as const,
            status: 'waiting' as const,
            winner: null,
            lastMove: null,
            moveCount: 0,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createResponse),
      });

      const room = await client.createRoom({
        playerName: 'Alice',
      });

      expect(room.success).toBe(true);
      expect(room.data?.id).toBe('room-123');

      // Connect to WebSocket
      client.connectWebSocket(room.data!.id);
      expect(mockWebSocket).toHaveBeenCalled();

      // Disconnect
      client.disconnectWebSocket();
      expect(mockWebSocketInstance.close).toHaveBeenCalled();
    });
  });
});
