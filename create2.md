# Multiplayer Grid Game - Minimal Creation Guide

## 🎯 Goal
Create a real-time multiplayer 2D grid game where players move around collecting items. All interactions persist to database.

## 🚨 Critical Operational Rules

**MANDATORY COMPLIANCE CONFIRMATION:**
Every 3 commands, the agent MUST confirm: "✅ OPERATIONAL COMPLIANCE: I am following all rules - no status checking, using npm run reset, background processes only"

**BEFORE EVERY COMMAND**: State "Rule: [reason] - [command]"

**FORBIDDEN (Will hang terminal):**
- `npm run dev`, `node server.js` (without `nohup ... &`)
- `curl`, `wget` for status checking
- `docker ps`, `ps aux | grep` for status checking  
- `pkill -f node` (kills IDE)

**REQUIRED:**
- Use `npm run reset` instead of status checking
- Background servers: `nohup node server.js &`
- Kill by port: `lsof -ti:3000 | xargs kill`

**USER INTERRUPTION TRIGGERS:**
If agent says ANY of these phrases, immediately type "STOP":
- "let me check if..."
- "let me see if the server..."
- "I'll test the connection..."
- "wait for the service to be ready..."
- Uses `curl`, `wget`, `docker ps` commands

## 🛠 Tech Stack
- **Backend**: Node.js + Express + Socket.IO + PostgreSQL + Redis
- **Frontend**: HTML5 Canvas + WebSocket client
- **Testing**: Playwright with screenshots
- **Infrastructure**: Docker Compose

## 📋 Implementation Steps

### 1. Setup
```bash
npm init -y
npm install express socket.io pg redis cors dotenv
npm install -D @playwright/test playwright
```

### 2. Docker Services
**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: gridgame
      POSTGRES_USER: gameuser
      POSTGRES_PASSWORD: gamepass
    ports:
      - "5432:5432"
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### 3. Core Files Required

**server.js** - Express server with Socket.IO, connects to PostgreSQL + Redis
**public/index.html** - Game UI with canvas and controls  
**public/client.js** - WebSocket client with game logic
**tests/game.spec.js** - Playwright tests with screenshots

### 4. Game Features
- **Grid**: 20x20 grid with player movement (arrow keys)
- **Players**: Join with username, visible to others
- **Items**: Spawn randomly, collect by walking over
- **Persistence**: Save all actions to PostgreSQL
- **Real-time**: WebSocket updates for all players

### 5. Database Schema
```sql
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_actions (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  action_type VARCHAR(20),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Reset Script (npm run reset)
```javascript
#!/usr/bin/env node
async function reset() {
  // Kill processes by port
  exec('lsof -ti:3000,5432,6379 | xargs kill -9 2>/dev/null || true');
  
  // Start services
  exec('docker-compose up -d');
  await sleep(10000); // Fixed wait
  
  // Initialize DB
  await runMigrations();
  
  // Start server in background
  exec('nohup node server.js > server.log 2>&1 &');
  
  console.log('✅ Environment ready');
}
```

### 7. Critical Tests
```javascript
// tests/game.spec.js
test('Player can join and move', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#username', 'TestPlayer');
  await page.click('#join');
  
  await page.keyboard.press('ArrowRight');
  await page.screenshot({ path: 'screenshots/player-movement.png' });
  
  // Verify player moved
  const position = await page.evaluate(() => window.game.player.x);
  expect(position).toBe(1);
});

test('Items spawn and can be collected', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#username', 'TestPlayer');
  await page.click('#join');
  
  // Wait for item to spawn
  await page.waitForFunction(() => window.game.items.length > 0);
  await page.screenshot({ path: 'screenshots/items-visible.png' });
  
  // Move to item and collect
  const item = await page.evaluate(() => window.game.items[0]);
  // Navigate to item position...
  
  await page.screenshot({ path: 'screenshots/item-collected.png' });
});
```

## ✅ Success Criteria
- Multiple players can join simultaneously
- Real-time movement visible to all players  
- Items spawn and can be collected
- Score updates when collecting items
- All actions saved to database
- Tests pass with screenshot evidence

## 🔧 Commands Summary
```bash
npm run reset    # Complete environment setup
npm run test     # Run all tests with screenshots
```

## 🚫 What NOT to do
- Never check if server is running - use `npm run reset`
- Never start server in foreground
- Never use curl/wget for testing
- Never manually resolve port conflicts
- Never skip the screenshot tests

## 🚨 COMPLIANCE CHECKPOINTS

**MANDATORY**: Agent must confirm compliance at these milestones:

1. **After setup**: "✅ CHECKPOINT 1: Setup complete using only allowed commands, no status checking performed"

2. **After services start**: "✅ CHECKPOINT 2: Services started in background only, no verification attempts made"

3. **Before testing**: "✅ CHECKPOINT 3: Using npm run reset for fresh environment, no manual health checks"

4. **After each major feature**: "✅ CHECKPOINT: Feature implemented without status checking violations"

**USER: Watch for missing checkpoints - demand confirmation if agent skips them!**

## 🛑 INSTANT VIOLATION DETECTION

**Type "STOP" immediately if agent:**
- Runs commands without "Rule:" prefix
- Uses forbidden phrases like "let me check if..."
- Skips compliance checkpoints
- Uses `curl`, `docker ps`, `ps aux | grep`
- Starts servers in foreground

---

**Key Insight**: Trust the reset process completely. If `npm run reset` completes successfully, everything is ready. No status checking needed.