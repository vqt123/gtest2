#!/bin/bash

echo "==================================="
echo "Grid Game - Running Tests"
echo "==================================="

# Create screenshots directory if it doesn't exist
mkdir -p screenshots

# Check if services are running
if ! docker ps | grep -q grid-game-postgres || ! docker ps | grep -q grid-game-redis; then
    echo "❌ Docker services are not running!"
    echo "Please run 'npm run docker:up' first"
    exit 1
fi

# Check if the server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Server is not running. Starting it in the background..."
    npm run dev > /dev/null 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to be ready
    echo "Waiting for server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null; then
            echo "✅ Server is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ Server failed to start"
            kill $SERVER_PID 2>/dev/null
            exit 1
        fi
        sleep 1
    done
fi

# Run the tests
echo "🧪 Running Playwright tests..."
npx playwright test

# If we started the server, stop it
if [ ! -z "$SERVER_PID" ]; then
    echo "Stopping test server..."
    kill $SERVER_PID 2>/dev/null
fi

echo "==================================="
echo "Tests complete! Check screenshots/ folder for captured images."
echo "===================================="