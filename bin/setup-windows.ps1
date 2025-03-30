# Simple setup script for Operational.co

# Step 0: Welcome and confirmation
Write-Host ""
Write-Host "This script will:"
Write-Host " - Clone the Operational.co repository"
Write-Host " - Set up dependencies in /app and /backend"
Write-Host ""
Read-Host "Press ENTER to continue..."

# Step 1: Clone the repo
if (Test-Path "operational.co") {
    Write-Host "The folder 'operational.co' already exists. Please delete or rename it before running this script."
    exit
}

Write-Host "`nCloning repository..."
git clone https://github.com/operational-co/operational.co
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git clone failed. Make sure git is installed."
    exit
}

# Step 2: Install frontend dependencies
Write-Host "`nInstalling frontend dependencies in /app..."
Set-Location "operational.co\app"
npm install
Set-Location ..

# Step 3: Install backend dependencies
Write-Host "`nInstalling backend dependencies in /backend..."
Set-Location "backend"
npm install
Set-Location ../..

Write-Host "`n✅ Setup complete!"
Write-Host "You can now run the dev servers:"
Write-Host "  cd operational.co\app     then: npm run dev"
Write-Host "  cd operational.co\backend then: npm run dev"
