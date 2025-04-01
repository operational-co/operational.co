#!/bin/bash

# Utility function to check installation
is_installed() {
    command -v "$1" >/dev/null 2>&1
}

echo "This script will perform the following steps:"
echo "1. Install MySQL 8.x, create database 'operational', and configure user"
echo "2. Install Node.js 22.x"
echo "3. Install web-push globally and generate VAPID keys"
echo "4. Install Nginx"
echo "5. Clone Operational Repository and set up Frontend"
echo "6. Set up Backend"
echo "7. Configure Nginx to serve frontend app with caching"
echo "8. Configure Nginx as a reverse proxy for backend app"
echo "9. Install Let's Encrypt Certbot and obtain SSL certificates"
echo "10. Install PM2 and start backend service"

read -p "Press Enter to continue..."

# Prompt for frontend and backend domains
read -p "Enter frontend domain (e.g., xyz.com): " frontend_domain
read -p "Enter backend domain (e.g., api.xyz.com): " backend_domain

# Step 1
echo "1. Checking and Installing MySQL 8.x"
if is_installed mysql; then
    echo "MySQL already installed."
else
    sudo apt update
    sudo apt install -y mysql-server
fi

sudo mysql -e "CREATE DATABASE IF NOT EXISTS operational;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'operational_user'@'localhost' IDENTIFIED BY 'secure_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON operational.* TO 'operational_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Step 2
echo "2. Checking and Installing Node.js 22.x"
if is_installed node; then
    echo "Node.js already installed."
else
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Step 3
echo "3. Installing web-push and generating VAPID keys"
sudo npm install -g web-push
VAPID_KEYS=$(web-push generate-vapid-keys --json)
VAPID_PUBLIC_KEY=$(echo $VAPID_KEYS | jq -r '.publicKey')
VAPID_PRIVATE_KEY=$(echo $VAPID_KEYS | jq -r '.privateKey')

# Step 4
echo "4. Checking and Installing Nginx"
if is_installed nginx; then
    echo "Nginx already installed."
else
    sudo apt update
    sudo apt install -y nginx
fi

# Step 5
echo "5. Cloning Operational Repository and Installing Frontend"
cd /home
sudo git clone https://github.com/operational-co/operational.co.git
cd operational.co/app
sudo npm install
cat <<EOL > .env
VITE_APP_URL=https://$frontend_domain
VITE_API_URL=https://$backend_domain
VITE_PUSH_SERVER_KEY="$VAPID_PUBLIC_KEY"
EOL
sudo npm run build

# Step 6
echo "6. Setting up Backend"
cd ../backend
sudo npm install
SECRET=$(openssl rand -base64 32)
cat <<EOL > .env
DATABASE_URL="mysql://operational_user:secure_password@localhost:3306/operational"
API_URL=https://$backend_domain
APP_URL=https://$frontend_domain
NODE_ENV=production
PORT=2000
SECRET=$SECRET
VAPID_EMAIL="mailto:placeholder@gmail.com" #REPLACE THIS with your own email
VAPID_PUBLIC_KEY="$VAPID_PUBLIC_KEY"
VAPID_PRIVATE_KEY="$VAPID_PRIVATE_KEY"
EOL
sudo npm run build

# Step 7
echo "7. Configuring Nginx to serve frontend with caching"
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/frontend.conf
sudo tee /etc/nginx/sites-available/frontend.conf > /dev/null <<EOL
server {
    listen 80;
    server_name $frontend_domain;
    root /home/operational.co/app/dist;

    location / {
        try_files \$uri \$uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
EOL
sudo ln -sf /etc/nginx/sites-available/frontend.conf /etc/nginx/sites-enabled/frontend.conf

# Step 8
echo "8. Configuring Nginx reverse proxy for backend"
sudo rm -f /etc/nginx/sites-enabled/backend.conf
sudo tee /etc/nginx/sites-available/backend.conf > /dev/null <<EOL
server {
    listen 80;
    server_name $backend_domain;

    location / {
        proxy_pass http://localhost:2000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
sudo ln -sf /etc/nginx/sites-available/backend.conf /etc/nginx/sites-enabled/backend.conf

sudo nginx -t && sudo systemctl reload nginx

# Step 9
echo "9. Checking and Installing Let's Encrypt Certbot"
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d $frontend_domain -d $backend_domain --non-interactive --agree-tos -m admin@$frontend_domain
sudo systemctl enable certbot.timer

# Step 10
echo "10. Installing PM2 and starting backend service"
sudo npm install -g pm2
cd /home/operational.co/backend
pm2 start npm --name "operational-backend" -- start
pm2 save
sudo pm2 startup systemd

echo "Installation and setup completed successfully!"