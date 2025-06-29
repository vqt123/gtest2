# Multiplayer Grid Game - Project Documentation

## Service Connection Details

### PostgreSQL Database
- Host: localhost
- Port: 5432
- User: gameuser
- Password: gamepass123
- Database: gridgame

### Redis Cache
- Host: localhost  
- Port: 6379

## Project Structure
- `src/server/` - Backend server code
- `src/client/` - Frontend game client  
- `src/database/` - Database models and queries
- `src/types/` - TypeScript type definitions
- `src/utils/` - Shared utilities
- `public/` - Static files served to client
- `logs/` - Command output logs
- `scripts/` - Reset and restart scripts
- `tests/` - Playwright end-to-end tests

## Environment Variables
All configuration is stored in `.env` file at project root:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=gameuser
DB_PASSWORD=gamepass123
DB_NAME=gridgame
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Development Commands

### Command Logging Pattern
All commands must use: `<command> | tee -a logs/command.log`

### Docker Services Management
```bash
npm run docker:up | tee -a logs/command.log
npm run docker:down | tee -a logs/command.log
npm run docker:logs | tee -a logs/command.log
```

### Development Workflow
```bash
# Complete reset and fresh start
./scripts/reset-all.sh

# Quick restart without Docker reset  
./scripts/restart.sh

# Manual development server start
npm run dev | tee -a logs/command.log

# Build TypeScript
npm run build | tee -a logs/command.log

# Testing with non-hanging reporter
npx playwright test --reporter=line | tee -a logs/command.log
```

## Reset Script Implementation

### reset-all.sh Features
- Kills only game-specific Node processes (not system-wide)
- Uses `lsof -ti:3000` and `pkill -f "nodemon.*gtest2"`
- Detects and handles Docker container conflicts  
- Checks for system service conflicts (Redis/PostgreSQL on ports 6379/5432)
- Guides user to resolve service conflicts manually
- Starts fresh Docker services
- Initializes database and builds TypeScript
- Does NOT auto-start development server (prevents hanging)

## Dependency Requirements

### Node.js Version
- **CRITICAL**: Both user and sudo must have Node.js v24+
- Test: `node --version` and `sudo node --version` must match
- Required for Playwright browser dependencies

### System Service Conflicts
- Redis and PostgreSQL system services conflict with Docker containers
- Sudo configuration for passwordless service management:
```bash
# In /etc/sudoers.d/claude-dev
$USER ALL=(ALL) NOPASSWD: /bin/systemctl stop redis-server
$USER ALL=(ALL) NOPASSWD: /bin/systemctl start redis-server  
$USER ALL=(ALL) NOPASSWD: /bin/systemctl stop postgresql
$USER ALL=(ALL) NOPASSWD: /bin/systemctl start postgresql
$USER ALL=(ALL) NOPASSWD: /bin/kill
$USER ALL=(ALL) NOPASSWD: /usr/bin/kill
```

### Browser Testing Dependencies
- Playwright requires system-level browser libraries
- Install: `sudo npx playwright install-deps`
- May need additional platform-specific packages

## Common Issues & Solutions

### "Reset script hangs"
- **Cause**: Script auto-started dev server which runs indefinitely
- **Solution**: Reset script stops at "All services ready" message

### "Tests timing out or hanging" 
- **Cause**: HTML report server hanging
- **Solution**: Use `--reporter=line` flag for Playwright tests

### "Port already in use"
- **Cause**: Docker container conflicts or system services
- **Solution**: Reset script detects and handles/guides resolution

### "Cursor/IDE getting killed"
- **Cause**: Used `pkill -f "node"` which killed all Node processes
- **Solution**: Target only game-specific processes using port and project name filters

### "Playwright browser dependency errors"
- **Cause**: Node.js version mismatch between user and sudo environments
- **Solution**: Install Node.js v24+ system-wide, verify both versions match

## TypeScript Compilation Fixes Applied

### Missing Variable Declaration
```typescript
// Fixed: moneySpawnInterval variable declaration
const moneySpawnInterval = setInterval(() => {
  const money = game.spawnMoney();
  if (money) {
    io.emit('moneySpawned', money);
  }
}, 7500);
```

### Null Handling
```typescript  
// Fixed: Position | null handling in addPlayer
addPlayer(id: string, username: string): Player {
  const position = this.findEmptyPosition();
  if (!position) {
    throw new Error('No empty position found for new player');
  }
  // ... rest of method
}
```

## Test Results Achieved
- **8 out of 10 tests passing (80% success rate)**
- **Remaining failures**: UI element visibility timing (requires test redesign)
- **Key successes**: 
  - Server starts without TypeScript errors
  - Socket connections work (multiplayer functionality)  
  - Database operations succeed
  - Docker services start cleanly without port conflicts