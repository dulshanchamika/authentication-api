# Production deployment script for Auth App (PowerShell version)

Write-Host "🚀 Starting Auth App in Production Mode" -ForegroundColor Cyan
Write-Host "==============================================="

# Get the root directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
Set-Location $rootDir

# Check if .env.production exists in root
if (!(Test-Path ".env.production")) {
    Write-Host "❌ Error: .env.production file not found in root!" -ForegroundColor Red
    Write-Host "   Please create it and fill in your production environment variables."
    exit 1
}

# Check if Docker is running
docker info >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Docker is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again."
    exit 1
}

Write-Host "📦 Building and starting production containers..."
Write-Host "   - Connecting to Neon Cloud Database"
Write-Host "   - Running in optimized production mode"
Write-Host ""

# Start production environment using the prod compose file
docker compose -f "docker-compose.prod.yml" up --build -d

# Run migrations with Drizzle
Write-Host "📜 Applying latest schema with Drizzle to Production DB..."
Push-Location backend
$env:NODE_ENV="production"
npm run db:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed! Check your production database connection." -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host ""
Write-Host "🎉 Production environment started!" -ForegroundColor Green
Write-Host "   Frontend:  http://localhost:80"
Write-Host "   Backend:   http://localhost:3000"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "   View logs: docker compose -f docker-compose.prod.yml logs -f"
Write-Host "   Stop app: docker compose -f docker-compose.prod.yml down"
