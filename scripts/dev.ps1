# Development startup script for Auth App with Neon Local (PowerShell version)

Write-Host "🚀 Starting Auth App in Development Mode" -ForegroundColor Cyan
Write-Host "================================================"

# Get the root directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
Set-Location $rootDir

# Check if .env exists in root
if (!(Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found in root!" -ForegroundColor Red
    Write-Host "   Please create it from .env.example."
    exit 1
}

# Check if Docker is running
docker info >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again."
    exit 1
}

# Create .neon_local directory in backend if it doesn't exist
if (!(Test-Path "backend/.neon_local")) {
    New-Item -ItemType Directory -Path "backend/.neon_local" -Force >$null
}

Write-Host "📦 Starting database container..."
docker compose up -d db-proxy

Write-Host "⏳ Waiting for database to be ready..."
do {
    $status = docker inspect -f '{{.State.Health.Status}}' auth-db-proxy 2>$null
    if ($status -eq "healthy") {
        break
    }
    Write-Host "   ...waiting for auth-db-proxy to be healthy..."
    Start-Sleep -Seconds 2
} while ($true)

Write-Host "✅ Database is ready!"

# Run migrations with Drizzle (from backend dir)
Write-Host "📜 Applying latest schema with Drizzle..."
Push-Location backend
npm run db:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed! Check your database connection." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Start the rest of the environment
Write-Host "🚀 Starting application containers..."
docker compose up --build

Write-Host ""
Write-Host "🎉 Development environment started!" -ForegroundColor Green
Write-Host "   Frontend:  http://localhost:5300"
Write-Host "   Backend:   http://localhost:3000"
Write-Host ""
Write-Host "To stop, press Ctrl+C or run: docker compose down"
