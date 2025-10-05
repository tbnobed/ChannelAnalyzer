#!/bin/bash

# YouTube Channel Analyzer - Docker Deployment Script

set -e

echo "🚀 YouTube Channel Analyzer Deployment Script"
echo "=============================================="

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
docker-compose build

# Start services
echo ""
echo "🚀 Starting services..."
docker-compose up -d

# Wait for database to be ready
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo ""
echo "📊 Running database migrations..."
docker-compose exec app npm run db:push

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is running at: http://localhost:5000"
echo ""
echo "📝 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change the admin password after first login!"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo "To restart: docker-compose restart"
