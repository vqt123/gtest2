#!/bin/bash

# Default to quick restart unless --full flag is provided
FULL_RESET=false
AUTO_START=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            FULL_RESET=true
            shift
            ;;
        --no-start)
            AUTO_START=false
            shift
            ;;
        *)
            echo "Usage: $0 [--full] [--no-start]"
            echo "  --full: Complete reset (same as reset-all.sh)"
            echo "  --no-start: Don't auto-start dev server"
            exit 1
            ;;
    esac
done

if [ "$FULL_RESET" = true ]; then
    echo "==================================="
    echo "Grid Game - Complete Reset & Restart"
    echo "==================================="
else
    echo "Restarting Grid Game services (quick mode)..."
    echo "Use --full for complete reset"
fi

# Kill only our game-related Node processes
echo "🔴 Stopping game server processes..."
lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
pkill -f "nodemon.*gtest2" || true
pkill -f "ts-node.*gtest2" || true

if [ "$FULL_RESET" = true ]; then
    # Full reset mode - comprehensive cleanup
    
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
    lsof -ti:5432 | xargs -r kill -9 2>/dev/null || true
    lsof -ti:6379 | xargs -r kill -9 2>/dev/null || true

    # Stop and remove Docker containers with volumes
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

    echo "🚀 All services ready!"
    echo "==================================="
    if [ "$AUTO_START" = true ]; then
        echo "Starting development server..."
    else
        echo "To start development server, run: npm run dev"
    fi
    echo "Server will be available at http://localhost:3000"
    echo "==================================="
else
    # Quick restart mode
    echo "🔴 Restarting Docker services..."
    docker-compose down
    docker-compose up -d

    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 5

    # Check if services are running
    docker-compose ps
fi

# Start the development server if requested
if [ "$AUTO_START" = true ]; then
    echo "🚀 Starting development server in background..."
    nohup npm run dev > logs/dev-server.log 2>&1 &
    echo "Development server started in background (PID: $!)"
    echo "View logs with: tail -f logs/dev-server.log"
    echo "Stop with: pkill -f 'nodemon.*gtest2'"
fi