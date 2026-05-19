#!/bin/bash

# Production deployment script for Auth App
# This script starts the application in production mode with Neon Cloud Database

echo "🚀 Starting Auth App in Production Mode"
echo "==============================================="

# Get the root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Navigate to root directory
cd "$ROOT_DIR"

# Check if .env.production exists in root
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found in root!"
    echo "   Please create .env.production with your production environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker and try again."
    exit 1
fi

echo "📦 Building and starting production container..."
echo "   - Using Neon Cloud Database"
echo "   - Running in optimized production mode"
echo ""

# Start production environment
# Note: Using the standard docker-compose.yml if a prod-specific one isn't found
COMPOSE_FILE="docker-compose.yml"
if [ -f "docker-compose.prod.yml" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

docker compose -f "$COMPOSE_FILE" up --build -d

# Run migrations with Drizzle
echo "📜 Applying latest schema with Drizzle..."
cd backend && npm run db:migrate && cd ..

echo ""
echo "🎉 Production environment started!"
echo "   Application: http://localhost:3000"
echo ""
echo "Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop app: docker compose down"