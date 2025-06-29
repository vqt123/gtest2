export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  username: string;
  position: Position;
  money: number;
  color: string;
}

export interface Money {
  id: string;
  position: Position;
  amount: number;
}

export interface GameState {
  players: Map<string, Player>;
  moneyItems: Map<string, Money>;
  gridSize: number;
}

export interface PlayerMovement {
  playerId: string;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface MoneyCollection {
  playerId: string;
  moneyId: string;
  amount: number;
  timestamp: Date;
}