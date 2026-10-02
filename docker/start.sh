#!/bin/bash

set -e
set -o pipefail

echo "🤖 Operational DockerFile setup"

# Function to print environment variables
print_env_vars() {
  echo "🔧 Environment Variables:"
  if [ -n "$DATABASE_URL" ]; then echo "  DATABASE_URL=[set]"; else echo "  DATABASE_URL=[unset]"; fi
  echo "  VITE_API_URL=$VITE_API_URL"
  echo "  VITE_PUSH_SERVER_KEY=$VITE_PUSH_SERVER_KEY"
  echo "  APP_URL=$APP_URL"
  echo "  VAPID_EMAIL=$VAPID_EMAIL"
  echo "  VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY"
  if [ -n "$VAPID_PRIVATE_KEY" ]; then echo "  VAPID_PRIVATE_KEY=[set]"; else echo "  VAPID_PRIVATE_KEY=[unset]"; fi
  if [ -n "$RESEND" ]; then echo "  RESEND=[set]"; else echo "  RESEND=[unset]"; fi
  echo "  PORT=$PORT"
  if [ -n "$SECRET" ]; then echo "  SECRET=[set]"; else echo "  SECRET=[unset]"; fi
  if [ -n "$MCP_OAUTH_SECRET" ]; then echo "  MCP_OAUTH_SECRET=[set]"; else echo "  MCP_OAUTH_SECRET=[unset; uses SECRET]"; fi
  echo "  ADMIN_EMAIL=$ADMIN_EMAIL"
  echo "  REMOVE_EVENTS_AFTER=$REMOVE_EVENTS_AFTER"
  echo "  REMOVE_TEST_EVENTS_AFTER=$REMOVE_TEST_EVENTS_AFTER"
  echo "  CORS=$CORS"
}

# Function to print mapped ports
print_mapped_ports() {
  echo "🔧 Mapped Ports:"
  ss -tuln
}

FRONTEND_INDEX="/var/www/html/index.html"

# Ensure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is not set."
  echo "👉 Please run with: -e DATABASE_URL=mysql://user:pass@host:3306/db"
  exit 1
fi

# Inject VITE_API_URL into index.html (inline JS)
echo "🛠 Injecting VITE_API_URL and VITE_PUSH_SERVER_KEY directly into index.html..."
sed -i '/<head>/a \
<script>window.__APP_CONFIG__ = { VITE_API_URL: "'"$VITE_API_URL"'", VITE_PUSH_SERVER_KEY: "'"$VITE_PUSH_SERVER_KEY"'" };</script>' "$FRONTEND_INDEX"

# Print environment variables
print_env_vars

# Print mapped ports
print_mapped_ports

# Start backend
echo "🚀 Starting backend from /monorepo/backend..."
cd /monorepo/backend

# Generate SECRET if needed
if [ -z "$SECRET" ]; then
  export SECRET=$(openssl rand -base64 32)
  echo "🔐 Generated SECRET for this container"
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
