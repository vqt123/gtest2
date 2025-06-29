#!/bin/bash

echo "==================================="
echo "Grid Game - Complete Reset & Restart"
echo "==================================="

# Kill only our game-related Node processes
echo "🔴 Stopping game server processes..."
# Kill processes running on our game port (3000)
lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
# Kill any nodemon watching our project
pkill -f "nodemon.*gtest2" || true
# Kill any ts-node running our project
pkill -f "ts-node.*gtest2" || true

# Kill any existing Redis/Postgres containers that might be stuck
echo "🔴 Killing any existing database containers..."
docker kill grid-game-postgres grid-game-redis 2>/dev/null || true
docker rm -f grid-game-postgres grid-game-redis 2>/dev/null || true

# Check for system services that might conflict
echo "🔴 Checking for conflicting system services..."
REDIS_PID=$(pgrep -f "redis-server.*6379" 2>/dev/null || true)
POSTGRES_PID=$(pgrep -f "postgres.*5432" 2>/dev/null || true)

if [ ! -z "$REDIS_PID" ]; then
    echo "⚠️  System Redis is running on port 6379 (PID: $REDIS_PID)"
    echo "    Please run: sudo kill -9 $REDIS_PID"
    echo "    Or run: sudo systemctl stop redis-server"
    echo "    Then re-run this script"
    exit 1
fi

if [ ! -z "$POSTGRES_PID" ]; then
    echo "⚠️  System PostgreSQL is running on port 5432 (PID: $POSTGRES_PID)"
    echo "    Please run: sudo kill -9 $POSTGRES_PID"
    echo "    Or run: sudo systemctl stop postgresql"
    echo "    Then re-run this script"
    exit 1
fi

# Kill processes using database ports
echo "🔴 Freeing up database ports..."
# Kill anything on PostgreSQL port 5432
lsof -ti:5432 | xargs -r kill -9 2>/dev/null || true
# Kill anything on Redis port 6379
lsof -ti:6379 | xargs -r kill -9 2>/dev/null || true

# Stop and remove Docker containers
echo "🔴 Tearing down Docker services..."
docker-compose down -v --remove-orphans | tee -a logs/command.log

# Clean up any dangling volumes
echo "🧹 Cleaning up Docker volumes..."
docker volume prune -f | tee -a logs/command.log

# Wait a moment
sleep 2

# Start Docker services
echo "🟢 Starting Docker services..."
docker-compose up -d | tee -a logs/command.log

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
for i in {1..30}; do
    if docker exec grid-game-postgres pg_isready -U gameuser -d gridgame &>/dev/null && \
       docker exec grid-game-redis redis-cli ping &>/dev/null; then
        echo "✅ Services are ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Services failed to start in time"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""

# Initialize database
echo "🗄️  Initializing database..."
npm run db:init | tee -a logs/command.log

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build | tee -a logs/command.log

# All services ready
echo "🚀 All services ready!"
echo "==================================="
echo "To start development server, run: npm run dev"
echo "Server will be available at http://localhost:3000"
echo "==================================="