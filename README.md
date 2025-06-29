# Multiplayer 2D Grid Game

A real-time multiplayer 2D grid game where players move around collecting money on a 20x20 grid.

## Quick Start

### Complete Reset & Start (Recommended)
```bash
npm run reset | tee -a logs/command.log
```
This single command will:
- Tear down all existing services
- Clean up Docker volumes
- Start fresh PostgreSQL and Redis containers
- Initialize the database
- Build TypeScript
- Start the development server

### Manual Start
1. Start Docker services:
```bash
npm run docker:up | tee -a logs/command.log
```

2. Initialize the database:
```bash
npm run db:init | tee -a logs/command.log
```

3. Start the development server:
```bash
npm run dev | tee -a logs/command.log
```

4. Open http://localhost:3000 in your browser

## Game Controls
- Use WASD or Arrow Keys to move
- Collect yellow money squares to increase your score
- See other players in real-time

## Development Commands
- `npm run reset` - Complete teardown and restart (recommended)
- `npm run docker:up` - Start PostgreSQL and Redis
- `npm run docker:down` - Stop services
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run restart` - Quick restart script

## Testing
Run automated tests with screenshots:
```bash
npm run test | tee -a logs/command.log
```

Other test commands:
- `npm run test:ui` - Run tests with UI mode
- `npm run test:headed` - Run tests in headed browser
- `bash scripts/run-tests.sh` - Run tests with automatic server management

Screenshots are saved to the `screenshots/` folder (not version controlled).

## Features
- Real-time multiplayer movement
- Money collection with persistence
- Leaderboard tracking
- Username-based player system
- Responsive web interface
- Comprehensive test suite with visual verification