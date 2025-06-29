import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';

import { connectRedis } from '../database/redis';
import { pool } from '../database/pool';
import { initDatabase } from '../database/init';
import { Game } from './game';
import { createOrGetPlayer, updatePlayerMoney } from '../database/queries';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

const game = new Game();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join', async (username) => {
    try {
      const dbPlayer = await createOrGetPlayer(username);
      const player = game.addPlayer(socket.id, username);
      
      socket.data.username = username;
      socket.data.playerId = dbPlayer.id;

      socket.emit('gameState', game.getState());
      socket.broadcast.emit('playerJoined', player);

      console.log(`Player joined: ${username} (${socket.id})`);
    } catch (error) {
      console.error('Error joining game:', error);
      socket.emit('error', 'Failed to join game');
    }
  });

  socket.on('move', async (direction) => {
    const newPosition = game.movePlayer(socket.id, direction);
    
    if (newPosition) {
      io.emit('playerMoved', socket.id, newPosition);

      const collectedMoney = game.checkMoneyCollection(socket.id);
      if (collectedMoney && socket.data.playerId) {
        try {
          await updatePlayerMoney(socket.data.playerId, collectedMoney.amount);
          const player = game.getPlayer(socket.id);
          if (player) {
            io.emit('moneyCollected', socket.id, collectedMoney.id, player.money);
          }
        } catch (error) {
          console.error('Error updating player money:', error);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    game.removePlayer(socket.id);
    socket.broadcast.emit('playerLeft', socket.id);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Money spawning is handled internally by the Game class
// We'll emit the moneySpawned event when it happens
const moneySpawnInterval = setInterval(() => {
  const money = game.spawnMoney();
  if (money) {
    io.emit('moneySpawned', money);
  }
}, 7500);

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { getTopPlayers } = await import('../database/queries');
    const topPlayers = await getTopPlayers(10);
    res.json(topPlayers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

async function start() {
  try {
    console.log('Starting server...');
    
    await connectRedis();
    console.log('Connected to Redis');
    
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL');
    
    await initDatabase();
    console.log('Database initialized');
    
    await game.init();
    console.log('Game initialized');
    
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  clearInterval(moneySpawnInterval);
  game.destroy();
  httpServer.close();
  await pool.end();
  process.exit(0);
});

start();