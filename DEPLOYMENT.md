# YouTube Channel Analyzer - Docker Deployment Guide

This guide will help you deploy the YouTube Channel Analyzer application on your Ubuntu server using Docker.

## Prerequisites

- Ubuntu Server (20.04 or newer)
- Docker and Docker Compose installed
- YouTube Data API Key (from Google Cloud Console)

## Installation Steps

### 1. Install Docker and Docker Compose

If you haven't installed Docker yet, run these commands:

```bash
# Update package index
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker compose-plugin

# Verify installation
docker --version
docker compose version
```

Log out and log back in for the group changes to take effect.

### 2. Clone or Upload the Application

Upload your application files to your Ubuntu server, or clone from your repository:

```bash
# If using git
git clone <your-repository-url>
cd youtube-channel-analyzer

# Or upload files via scp, sftp, etc.
```

### 3. Configure Environment Variables

Create a `.env` file from the example template:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```bash
nano .env
```

Set the following variables:

```env
# Database password (choose a strong password)
DB_PASSWORD=your_secure_password_here

# YouTube Data API Key (from Google Cloud Console)
VITE_YT_API_KEY=your_youtube_api_key_here

# Session secret (generate a random string, minimum 32 characters)
SESSION_SECRET=generate_a_random_string_at_least_32_characters_long
```

To generate a secure session secret, you can use:
```bash
openssl rand -base64 32
```

### 4. Deploy with the Deployment Script

Make the deployment script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
1. Check your environment configuration
2. Build the Docker images
3. Start the services (PostgreSQL + App)
4. Run database migrations
5. Display access information

### 5. Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the images
docker compose build

# Start the services
docker compose up -d

# Wait for database to be ready
sleep 10

# Run database migrations
docker compose exec app npm run db:push
```

## Accessing the Application

Once deployed, the application will be available at:
- **Local access**: http://localhost:5000
- **Network access**: http://your-server-ip:5000

### Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

## Managing the Application

### View Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs app
docker compose logs postgres
```

### Stop the Application

```bash
docker compose down
```

### Restart the Application

```bash
docker compose restart

# Or restart specific service
docker compose restart app
```

### Update the Application

```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d

# Run migrations if schema changed
docker compose exec app npm run db:push
```

### Backup Database

```bash
# Create backup
docker compose exec postgres pg_dump -U ytanalyzer ytanalyzer > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
cat backup_file.sql | docker compose exec -T postgres psql -U ytanalyzer ytanalyzer
```

## Exposing to the Internet

### Using Nginx as Reverse Proxy

1. Install Nginx:
```bash
sudo apt install nginx
```

2. Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/youtube-analyzer
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

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

3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/youtube-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. Install SSL certificate (recommended):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Application won't start

Check logs:
```bash
docker compose logs app
```

Common issues:
- Database not ready: Wait a few seconds and try again
- Environment variables not set: Check your `.env` file
- Port 5000 already in use: Stop other services or change port in `docker compose.yml`

### Database connection errors

```bash
# Check database status
docker compose ps

# Restart database
docker compose restart postgres

# Check database logs
docker compose logs postgres
```

### Out of disk space

```bash
# Remove unused Docker resources
docker system prune -a

# Remove old images
docker image prune -a
```

## Security Recommendations

1. **Change default admin password** immediately
2. **Use strong database password** in `.env`
3. **Keep SESSION_SECRET secure** and random
4. **Enable firewall**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
5. **Regular backups** of database
6. **Keep Docker updated**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

## Performance Tuning

For production use, you may want to adjust:

1. **PostgreSQL connection pool** in `db.ts`
2. **Docker resource limits** in `docker compose.yml`:
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
   ```

## Getting Help

If you encounter issues:
1. Check the logs: `docker compose logs -f`
2. Verify environment variables: `cat .env`
3. Check Docker status: `docker compose ps`
4. Review this guide for missed steps

## Uninstalling

To completely remove the application:

```bash
# Stop and remove containers
docker compose down

# Remove volumes (this deletes the database!)
docker compose down -v

# Remove images
docker rmi $(docker images | grep youtube-analyzer | awk '{print $3}')
```
