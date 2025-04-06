#!/bin/bash

set -e
set -o pipefail

FRONTEND_INDEX="/var/www/html/index.html"

# Ensure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is not set."
  echo "👉 Please run with: -e DATABASE_URL=mysql://user:pass@host:3306/db"
  exit 1
fi

# Inject VITE_API_URL into index.html (inline JS)
echo "🛠 Injecting VITE_API_URL directly into index.html..."
sed -i '/<head>/a \
<script>window.__APP_CONFIG__ = { VITE_API_URL: "'"$VITE_API_URL"'" };</script>' "$FRONTEND_INDEX"

# Start backend
echo "🚀 Starting backend..."
cd /app/backend

# Generate SECRET if needed
if [ -z "$SECRET" ]; then
  export SECRET=$(openssl rand -base64 32)
  echo "🔐 Generated SECRET: $SECRET"
else
  echo "🔐 Using provided SECRET"
fi

echo "🔧 Running Prisma..."
npx prisma generate
npx prisma migrate deploy

echo "▶️ Starting Node.js backend..."
npm start &

# Start Nginx
echo "🌐 Starting Nginx..."
nginx -g 'daemon off;'
