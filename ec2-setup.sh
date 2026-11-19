#!/bin/bash
# ==============================================================================
# Sweety Diabetic Telemetry Platform - AWS EC2 Backend Automated Setup Script
# Ubuntu 22.04 / 24.04 LTS (t3.micro / t3.small / t4g.small)
# ==============================================================================

set -e

echo ">>> Updating system packages..."
sudo apt update -y && sudo apt upgrade -y

echo ">>> Installing Node.js 20 LTS, Git, and build essentials..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

echo ">>> Installing PM2 process manager globally..."
sudo npm install -g pm2

echo ">>> Setting up Sweety application directory..."
mkdir -p /home/ubuntu/sweety-app
cd /home/ubuntu/sweety-app

# If cloning directly from GitHub:
# git clone https://github.com/Subhash6102003/Sweety.git .

cd server
npm install --production

# Create Production Environment File (Provide keys via environment or edit .env)
cat << 'EOF' > .env
PORT=5000
NODE_ENV=production
JWT_SECRET=sweety-super-secret-jwt-key-2026-production
SUPABASE_URL=https://mrcundazfshhgyxainld.supabase.co
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-"enter_supabase_anon_key"}
SUPABASE_SECRET_KEY=${SUPABASE_SECRET_KEY:-"enter_supabase_secret_key"}
NODE_TLS_REJECT_UNAUTHORIZED=0
EOF

echo ">>> Starting backend server with PM2..."
pm2 start src/server.js --name "sweety-api"
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo ">>> Sweety Backend is LIVE on port 5000!"
curl http://localhost:5000/api/health
