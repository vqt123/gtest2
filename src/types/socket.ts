import { Player, Money, Position } from './game';

export interface ServerToClientEvents {
  gameState: (state: {
    players: Player[];
    moneyItems: Money[];
  }) => void;
  playerJoined: (player: Player) => void;
  playerLeft: (playerId: string) => void;
  playerMoved: (playerId: string, position: Position) => void;
  moneySpawned: (money: Money) => void;
  moneyCollected: (playerId: string, moneyId: string, newTotal: number) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  join: (username: string) => void;
  move: (direction: 'up' | 'down' | 'left' | 'right') => void;
  disconnect: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  username: string;
  playerId: string;
}