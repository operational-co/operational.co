#!/bin/bash

{

# === Step 0: Check if the 'operational.co' directory already exists ===
if [ -d "operational-test" ]; then
  echo "⚠️  The directory 'operational.co' already exists in this location."
  echo "🛑 Script will now exit to avoid overwriting existing files."
  exit 1
fi

# Welcome message
echo "👋 Welcome to the Operational.co Self-Hosted Setup"
echo ""
echo "📦 This script will help you get started quickly by:"
echo "   - Cloning the repository"
echo "   - Creating required environment files"
echo "   - Installing dependencies"
echo ""
echo "⚠️  Requirements:"
echo "   - Node.js v18.18.x or higher (v18.18.x to v22.x supported)"
echo "   - MySQL 8.x running locally or remotely"
echo ""
read -p "Press ENTER to continue..."

# Step 1: Create the directory
echo "[1] Creating directory" 
mkdir -p operational-test
echo "[1] Created directory 'operational.co'"

cd operational-test || exit
echo "[1] Changed into 'operational.co' directory"

# Step 2: Clone the GitHub repository
echo "[2] Cloning GitHub repo"
git clone https://github.com/operational-co/operational.co .
echo "[2] Cloned repository into current directory"

# Step 3: Generate a random secret
echo "[3] Generating secret"
SECRET=$(openssl rand -hex 32)
echo "[3] Generated random secret"

# Step 4: Check for MySQL installation
echo "[4] Checking for MySQL installation..."
if ! command -v mysql >/dev/null 2>&1; then
  echo "❌ MySQL is not installed on this machine."
  echo "👉 Please ensure MySQL 8.x is installed OR you have an external MySQL server available."
else
  echo "✅ MySQL is installed."
fi

# Prompt for DATABASE_URL with default
DEFAULT_DB_URL="mysql://root:password@localhost:3306/operational"
read -p "🔑 Enter your MySQL connection string [default: $DEFAULT_DB_URL]: " DB_URL
DB_URL=${DB_URL:-$DEFAULT_DB_URL}

# Step 5: Create .env in /backend
echo "[5] Creating .env file inside /backend"
mkdir -p backend
{
  echo "SECRET=\"$SECRET\""
  echo "DATABASE_URL=\"$DB_URL\""
} > backend/.env
echo "[5] .env file created with SECRET and DATABASE_URL"

# Step 6: Check if Node.js is installed and version is sufficient
echo "[6] Checking for Node.js..."
MIN_REQUIRED_VERSION="18.18.0"

version_to_number() {
  echo "$1" | awk -F. '{ printf("%d%02d%02d", $1,$2,$3); }'
}

NEEDS_NODE_INSTALL=false

if command -v node >/dev/null 2>&1; then
  NODE_VERSION=$(node -v | sed 's/v//')
  echo "✅ Node.js is installed: v$NODE_VERSION"

  if [ "$(version_to_number "$NODE_VERSION")" -lt "$(version_to_number "$MIN_REQUIRED_VERSION")" ]; then
    echo "⚠️ Node.js version is too old. v$MIN_REQUIRED_VERSION or higher is required."
    NEEDS_NODE_INSTALL=true
  fi
else
  echo "❌ Node.js is not installed."
  NEEDS_NODE_INSTALL=true
fi

if [ "$NEEDS_NODE_INSTALL" = true ]; then
  read -p "Would you like to install Node.js 20.x using nvm? (y/n): " INSTALL_NVM
  if [[ "$INSTALL_NVM" == "y" ]]; then
    echo "📦 Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    echo "📦 Installing Node.js 20..."
    nvm install 20

    echo "✅ Node.js $(node -v) installed via nvm"
  else
    echo "🛑 Node.js is required to proceed. Exiting setup."
    exit 1
  fi
fi

# Step 7: Install dependencies in /backend
echo "[7] Installing dependencies in /backend"
cd backend && npm install && cd ..

# Step 8: Install dependencies in /app if it exists
if [ -d "app" ]; then
  echo "[8] Installing dependencies in /app"
  cd app && npm install && cd ..
else
  echo "[8] ⚠️ Skipping /app – folder does not exist."
fi

echo "---------------------------------------------"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "✅ Operational.co has been installed locally."
echo ""
echo "▶️ To start the frontend:"
echo "   cd app && npm run dev"
echo ""
echo "▶️ To start the backend:"
echo "   cd backend && npm run build && npm run dev"
echo ""
echo "📘 For deployment, hosting, or troubleshooting:"
echo "   Visit the official docs 👉 https://operational.co/api"
echo ""

}