# Docker Deployment Guide for Ubuntu Server

This guide will help you deploy the YouTube Channel Analyzer application on your Ubuntu server using Docker and PostgreSQL.

## Prerequisites

- Ubuntu Server (20.04 or later)
- Docker and Docker Compose installed
- A YouTube Data API key

## Installation Steps

### 1. Install Docker and Docker Compose

```bash
# Update package list
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin
```

### 2. Clone or Upload Your Application

Upload your application files to your server, or clone from your repository:

```bash
# If using git
git clone <your-repo-url>
cd <your-app-directory>

# Or upload files using scp:
scp -r /path/to/local/app user@server:/path/to/deployment
```

### 3. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
nano .env
```

Update the following values in `.env`:

```env
# Database Configuration
POSTGRES_USER=ytanalyzer
POSTGRES_PASSWORD=your_secure_password_here  # Change this!
POSTGRES_DB=youtube_analyzer
POSTGRES_PORT=5432

# Application Configuration
APP_PORT=5000

# API Keys
VITE_YT_API_KEY=your_youtube_api_key_here  # Your YouTube API key
```

### 4. Build and Start the Application

```bash
# Build and start all services
docker compose up -d

# Check logs to ensure everything started correctly
docker compose logs -f
```

The application will:
1. Start PostgreSQL database
2. Wait for database to be healthy
3. Build and start the application
4. Run database migrations automatically

### 5. Initialize the Database Schema

Run the database migration to create tables:

```bash
# Access the app container
docker compose exec app sh

# Run database migration
npm run db:push

# Exit the container
exit
```

### 6. Verify Installation

Check that services are running:

```bash
# Check service status
docker compose ps

# Test the health endpoint
curl http://localhost:5000/api/health
```

You should see: `{"status":"ok","timestamp":"..."}`

## Accessing Your Application

- Application: `http://your-server-ip:5000`
- Database: `postgresql://ytanalyzer:your_password@your-server-ip:5432/youtube_analyzer`

## Setting up Nginx Reverse Proxy (Optional)

For production, it's recommended to use Nginx as a reverse proxy:

### Install Nginx

```bash
sudo apt install nginx
```

### Configure Nginx

Create a new site configuration:

```bash
sudo nano /etc/nginx/sites-available/youtube-analyzer
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/youtube-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Add SSL with Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Managing the Application

### View logs

```bash
# All services
docker compose logs -f

# Just the app
docker compose logs -f app

# Just the database
docker compose logs -f postgres
```

### Stop the application

```bash
docker compose down
```

### Stop and remove all data (including database)

```bash
docker compose down -v
```

### Restart the application

```bash
docker compose restart
```

### Update the application

```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker compose up -d --build
```

## Backup and Restore Database

### Backup

```bash
docker compose exec postgres pg_dump -U ytanalyzer youtube_analyzer > backup.sql
```

### Restore

```bash
cat backup.sql | docker compose exec -T postgres psql -U ytanalyzer youtube_analyzer
```

## Troubleshooting

### Check if ports are available

```bash
sudo netstat -tulpn | grep -E '5000|5432'
```

### Database connection issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Test database connection
docker compose exec postgres psql -U ytanalyzer -d youtube_analyzer -c "SELECT 1;"
```

### Application won't start

```bash
# Check logs for errors
docker compose logs app

# Rebuild from scratch
docker compose down -v
docker compose up -d --build
```

### Reset everything

```bash
# Stop and remove all containers and volumes
docker compose down -v

# Remove built images
docker rmi youtube-analyzer-app

# Start fresh
docker compose up -d --build
```

## Security Recommendations

1. **Change default passwords** in `.env` file
2. **Use a firewall** (ufw):
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```
3. **Use SSL/TLS** with Let's Encrypt
4. **Restrict database access** - Don't expose PostgreSQL port externally
5. **Keep Docker updated**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```
6. **Regular backups** of your database

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `POSTGRES_USER` | Database username | Yes | ytanalyzer |
| `POSTGRES_PASSWORD` | Database password | Yes | - |
| `POSTGRES_DB` | Database name | Yes | youtube_analyzer |
| `POSTGRES_PORT` | PostgreSQL port | No | 5432 |
| `APP_PORT` | Application port | No | 5000 |
| `VITE_YT_API_KEY` | YouTube Data API key | Yes | - |
| `DATABASE_URL` | Full database connection string | Auto-generated | - |

## Support

If you encounter issues:
1. Check the logs: `docker compose logs -f`
2. Verify environment variables are set correctly
3. Ensure all ports are available
4. Check database connectivity
