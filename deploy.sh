#!/bin/bash

# YouTube Channel Analyzer - Docker Deployment Script

set -e

echo "🚀 YouTube Channel Analyzer Deployment Script"
echo "=============================================="
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running on Ubuntu/Debian
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [[ ! "$ID" =~ ^(ubuntu|debian)$ ]]; then
        echo "⚠️  Warning: This script is designed for Ubuntu/Debian systems."
        echo "   Current OS: $PRETTY_NAME"
        echo ""
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Check and install Docker if needed
if ! command_exists docker; then
    echo "📦 Docker not found. Installing Docker..."
    echo ""
    
    # Update package index
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index again
    sudo apt-get update
    
    # Install Docker Engine, containerd, and Docker Compose
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    echo "✅ Docker installed successfully"
    echo ""
    echo "⚠️  IMPORTANT: You need to log out and log back in for docker group changes to take effect."
    echo "   After logging back in, run this script again."
    echo ""
    echo "Or you can run: newgrp docker"
    echo "Then run this script again."
    exit 0
else
    echo "✅ Docker is installed ($(docker --version))"
fi

# Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
    echo "⚠️  Docker is installed but not running."
    echo "Starting Docker service..."
    sudo systemctl start docker
    sudo systemctl enable docker
    echo "✅ Docker service started"
fi

# Check if Docker Compose is available
if ! docker compose version >/dev/null 2>&1; then
    echo "❌ Docker Compose plugin not found!"
    echo "   Please install Docker Compose plugin:"
    echo "   sudo apt-get install docker-compose-plugin"
    exit 1
else
    echo "✅ Docker Compose is installed ($(docker compose version))"
fi

# Check if user can run docker without sudo
if ! docker ps >/dev/null 2>&1; then
    echo "⚠️  Current user cannot run Docker without sudo."
    echo "   Adding user to docker group..."
    sudo usermod -aG docker $USER
    echo ""
    echo "⚠️  IMPORTANT: You need to log out and log back in for group changes to take effect."
    echo "   After logging back in, run this script again."
    echo ""
    echo "Or you can run: newgrp docker"
    echo "Then run this script again."
    exit 0
fi

echo ""
echo "=============================================="
echo "Starting deployment..."
echo "=============================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit the .env file with your actual values:"
    echo "   - DB_PASSWORD: Set a secure database password"
    echo "   - VITE_YT_API_KEY: Your YouTube Data API key"
    echo "   - SESSION_SECRET: A random string (min 32 characters)"
    echo ""
    echo "After editing .env, run this script again."
    exit 1
fi

echo "✅ .env file found"

# Check if required environment variables are set
source .env

if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your_secure_database_password_here" ]; then
    echo "❌ Please set DB_PASSWORD in .env file"
    exit 1
fi

if [ -z "$VITE_YT_API_KEY" ] || [ "$VITE_YT_API_KEY" = "your_youtube_api_key_here" ]; then
    echo "❌ Please set VITE_YT_API_KEY in .env file"
    exit 1
fi

if [ -z "$SESSION_SECRET" ] || [ "$SESSION_SECRET" = "your_random_session_secret_here_min_32_chars" ]; then
    echo "❌ Please set SESSION_SECRET in .env file"
    exit 1
fi

echo "✅ Environment variables configured"

# Build Docker images
echo ""
echo "🔨 Building Docker images..."
docker compose build

# Start services (migrations will run automatically via init container)
echo ""
echo "🚀 Starting services..."
echo "   Database migrations will run automatically..."
docker compose up -d

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is running at:"
echo "   - Local: http://localhost:5000"
echo "   - Network: http://$(hostname -I | awk '{print $1}'):5000"
echo ""
echo "📝 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change the admin password after first login!"
echo ""
echo "Useful commands:"
echo "  View logs:    docker compose logs -f"
echo "  Stop:         docker compose down"
echo "  Restart:      docker compose restart"
echo "  Update:       git pull && docker compose down && docker compose build && docker compose up -d"
