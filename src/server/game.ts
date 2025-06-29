import { GameState, Player, Money, Position } from '../types/game';
import { redisClient } from '../database/redis';
import { v4 as uuidv4 } from 'uuid';

const GRID_SIZE = 20;
const MIN_MONEY_AMOUNT = 10;
const MAX_MONEY_AMOUNT = 100;
const MONEY_SPAWN_INTERVAL_MIN = 5000;
const MONEY_SPAWN_INTERVAL_MAX = 10000;

export class Game {
  private state: GameState;
  private moneySpawnTimer?: NodeJS.Timeout;

  constructor() {
    this.state = {
      players: new Map(),
      moneyItems: new Map(),
      gridSize: GRID_SIZE,
    };
  }

  async init() {
    await this.loadStateFromRedis();
    this.startMoneySpawning();
  }

  async loadStateFromRedis() {
    try {
      const playersData = await redisClient.get('game:players');
      const moneyData = await redisClient.get('game:money');

      if (playersData) {
        const players = JSON.parse(playersData);
        this.state.players = new Map(Object.entries(players));
      }

      if (moneyData) {
        const money = JSON.parse(moneyData);
        this.state.moneyItems = new Map(Object.entries(money));
      }
    } catch (error) {
      console.error('Error loading state from Redis:', error);
    }
  }

  async saveStateToRedis() {
    try {
      const players = Object.fromEntries(this.state.players);
      const money = Object.fromEntries(this.state.moneyItems);

      await redisClient.set('game:players', JSON.stringify(players));
      await redisClient.set('game:money', JSON.stringify(money));
    } catch (error) {
      console.error('Error saving state to Redis:', error);
    }
  }

  addPlayer(id: string, username: string): Player {
    const position = this.findEmptyPosition();
    if (!position) {
      throw new Error('No empty position found for new player');
    }
    
    const player: Player = {
      id,
      username,
      position,
      money: 0,
      color: this.generatePlayerColor(),
    };

    this.state.players.set(id, player);
    this.saveStateToRedis();
    return player;
  }

  removePlayer(id: string): void {
    this.state.players.delete(id);
    this.saveStateToRedis();
  }

  movePlayer(playerId: string, direction: 'up' | 'down' | 'left' | 'right'): Position | null {
    const player = this.state.players.get(playerId);
    if (!player) return null;

    const newPosition = { ...player.position };

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case 'down':
        newPosition.y = Math.min(GRID_SIZE - 1, newPosition.y + 1);
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - 1);
        break;
      case 'right':
        newPosition.x = Math.min(GRID_SIZE - 1, newPosition.x + 1);
        break;
    }

    if (newPosition.x === player.position.x && newPosition.y === player.position.y) {
      return null;
    }

    if (this.isPositionOccupied(newPosition, playerId)) {
      return null;
    }

    player.position = newPosition;
    this.saveStateToRedis();
    return newPosition;
  }

  checkMoneyCollection(playerId: string): Money | null {
    const player = this.state.players.get(playerId);
    if (!player) return null;

    for (const [moneyId, money] of this.state.moneyItems) {
      if (money.position.x === player.position.x && money.position.y === player.position.y) {
        player.money += money.amount;
        this.state.moneyItems.delete(moneyId);
        this.saveStateToRedis();
        return money;
      }
    }

    return null;
  }

  private startMoneySpawning() {
    const spawnMoney = () => {
      const money = this.spawnMoney();
      if (money) {
        this.saveStateToRedis();
      }

      const nextInterval = Math.random() * 
        (MONEY_SPAWN_INTERVAL_MAX - MONEY_SPAWN_INTERVAL_MIN) + 
        MONEY_SPAWN_INTERVAL_MIN;

      this.moneySpawnTimer = setTimeout(spawnMoney, nextInterval);
    };

    spawnMoney();
  }

  spawnMoney(): Money | null {
    const position = this.findEmptyPosition();
    if (!position) return null;

    const money: Money = {
      id: uuidv4(),
      position,
      amount: Math.floor(Math.random() * (MAX_MONEY_AMOUNT - MIN_MONEY_AMOUNT + 1)) + MIN_MONEY_AMOUNT,
    };

    this.state.moneyItems.set(money.id, money);
    return money;
  }

  private findEmptyPosition(): Position | null {
    const maxAttempts = 100;
    
    for (let i = 0; i < maxAttempts; i++) {
      const position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      if (!this.isPositionOccupied(position)) {
        return position;
      }
    }

    return null;
  }

  private isPositionOccupied(position: Position, excludePlayerId?: string): boolean {
    // Only check for other players - money should be collectible, not act as obstacle
    for (const [playerId, player] of this.state.players) {
      if (excludePlayerId && playerId === excludePlayerId) continue;
      if (player.position.x === position.x && player.position.y === position.y) {
        return true;
      }
    }

    return false;
  }

  private generatePlayerColor(): string {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getState() {
    return {
      players: Array.from(this.state.players.values()),
      moneyItems: Array.from(this.state.moneyItems.values()),
    };
  }

  getPlayer(id: string): Player | undefined {
    return this.state.players.get(id);
  }

  destroy() {
    if (this.moneySpawnTimer) {
      clearTimeout(this.moneySpawnTimer);
    }
  }
}