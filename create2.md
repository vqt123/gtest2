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

# Install Playwright browsers (will handle system deps automatically)
npx playwright install chromium --force
```

### 2. Docker Services
**docker-compose.yml:** (Use non-standard ports to avoid conflicts)
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
      - "5433:5432"  # Use 5433 to avoid conflicts
  redis:
    image: redis:7-alpine
    ports:
      - "6380:6379"  # Use 6380 to avoid conflicts
```

### 3. Core Files Required

**server.js** - Express server with Socket.IO, connects to PostgreSQL (port 5433) + Redis (port 6380)
**public/index.html** - Game UI with canvas and controls  
**public/client.js** - WebSocket client with game logic
**tests/game.spec.js** - Playwright tests with screenshots
**reset.js** - Enhanced reset script with proper port conflict handling

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

### 6. Enhanced Reset Script (npm run reset)
```javascript
#!/usr/bin/env node
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function reset() {
  console.log('🔄 Starting reset process...');
  
  try {
    // CRITICAL: Stop containers FIRST to release ports
    console.log('🧹 Cleaning up Docker containers...');
    await execAsync('docker-compose down 2>/dev/null || true');
    await execAsync('docker system prune -f 2>/dev/null || true');
    
    // Kill processes by port (use non-standard ports)
    console.log('⏹️ Stopping existing processes...');
    await execAsync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true');
    await execAsync('lsof -ti:5433 | xargs kill -9 2>/dev/null || true'); // Updated port
    await execAsync('lsof -ti:6380 | xargs kill -9 2>/dev/null || true'); // Updated port
    
    // Start services
    console.log('🐳 Starting Docker services...');
    await execAsync('docker-compose up -d');
    
    // Fixed wait (no status checking)
    console.log('⏳ Waiting for services...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Initialize database
    console.log('🗄️ Initializing database...');
    await runMigrations();
    
    // Start server in background
    console.log('🚀 Starting server...');
    await execAsync('nohup node server.js > server.log 2>&1 &');
    
    console.log('✅ Environment ready - no status checking performed');
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
}

reset();
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
- **MANDATORY: All tests pass with screenshot evidence (npm run test)**
- **MANDATORY: Agent confirms final testing completed successfully**

## 🔧 Commands Summary
```bash
npm run reset    # Complete environment setup
npx playwright install chromium --force  # Install browser (if needed)
npm run test     # Run all tests with screenshots
```

## 🚫 What NOT to do
- Never check if server is running - use `npm run reset`
- Never start server in foreground
- Never use curl/wget for testing
- Never manually resolve port conflicts
- Never skip the screenshot tests
- **Never use `npx playwright install-deps` (requires sudo)**
- **Never use `sudo` commands (will ask for password)**

## 🚨 COMPLIANCE CHECKPOINTS

**MANDATORY**: Agent must confirm compliance at these milestones:

1. **After setup**: "✅ CHECKPOINT 1: Setup complete using only allowed commands, no status checking performed"

2. **After services start**: "✅ CHECKPOINT 2: Services started in background only, no verification attempts made"

3. **Before testing**: "✅ CHECKPOINT 3: Using npm run reset for fresh environment, no manual health checks"

4. **After each major feature**: "✅ CHECKPOINT: Feature implemented without status checking violations"

5. **BEFORE TESTING**: "✅ CHECKPOINT BROWSER: Installing Playwright browsers with npx playwright install chromium --force"

6. **MANDATORY FINAL TEST**: "✅ CHECKPOINT FINAL: Running npm run test to verify complete system with screenshots"

**USER: Watch for missing checkpoints - demand confirmation if agent skips them!**
**CRITICAL: Agent MUST run `npm run test` at the very end - no exceptions!**
**SUCCESS CRITERIA: All tests must pass with screenshot evidence**

## 🛑 INSTANT VIOLATION DETECTION

**Type "STOP" immediately if agent:**
- Runs commands without "Rule:" prefix
- Uses forbidden phrases like "let me check if..."
- Skips compliance checkpoints
- Uses `curl`, `docker ps`, `ps aux | grep`
- Starts servers in foreground
- **Manually changes ports in config files due to conflicts**
- **Says project is "complete" without running npm run test**
- **Updates docker-compose.yml ports manually instead of using reset script**
- **Tries to install system dependencies with sudo (requires password)**
- **Uses `npx playwright install-deps` (requires sudo)**

---

## 🚨 CRITICAL LESSONS FROM PREVIOUS FAILURES

**Port Conflict Pattern (FORBIDDEN):**
```bash
# ❌ WRONG: Manual port resolution when reset fails
docker-compose up -d  # Fails with port conflict
# Then manually editing docker-compose.yml, server.js files

# ✅ CORRECT: Reset script handles conflicts automatically
# Use non-standard ports (5433, 6380) from the start
# Reset script stops containers BEFORE starting new ones
```

**Playwright Installation Pattern:**
```bash
# ❌ WRONG: Requires sudo password
npx playwright install-deps  # Asks for password

# ✅ CORRECT: Force install browsers only
npx playwright install chromium --force  # No sudo needed
```

**Test Success Criteria:**
- All tests must pass = SUCCESS ✅
- Focus on screenshot generation and major functionality

**Reset Script Failure Protocol:**
1. If reset fails due to port conflicts → Update reset script, don't manually change configs
2. Docker containers must be stopped FIRST before starting new ones
3. Use non-standard ports (5433, 6380) to avoid conflicts from the start

**MANDATORY FINAL STEP:**
Agent MUST run `npm run test` and confirm all tests pass with screenshots. Saying "project complete" without testing is a violation.

---

**Key Insight**: Trust the reset process completely. If `npm run reset` completes successfully, everything is ready. No status checking needed.