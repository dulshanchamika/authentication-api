#!/bin/bash

# Development startup script for Auth App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Auth App in Development Mode"
echo "================================================"

# Get the root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Navigate to root directory
cd "$ROOT_DIR"

# Check if .env.development exists in root
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found in root!"
    echo "   Please create it from .env.example."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory in backend if it doesn't exist
mkdir -p backend/.neon_local

echo "📦 Starting database container..."
docker compose up -d db-proxy

echo "⏳ Waiting for database to be ready..."
# Wait for the healthcheck defined in docker-compose.yml
until [ "$(docker inspect -f '{{.State.Health.Status}}' auth-db-proxy 2>/dev/null)" == "healthy" ]; do
    echo "   ...waiting for auth-db-proxy to be healthy..."
    sleep 2
done

# Run migrations with Drizzle (in backend)
echo "📜 Applying latest schema with Drizzle..."
# Check if npm is available
if command -v npm >/dev/null 2>&1; then
    cd backend && npm run db:migrate && cd ..
else
    echo "⚠️ Warning: npm not found in this shell. Skipping local migrations."
    echo "   Please ensure migrations are run manually or inside the container."
fi

# Start the rest of the environment
echo "🚀 Starting application containers..."
docker compose up --build

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:5173"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"