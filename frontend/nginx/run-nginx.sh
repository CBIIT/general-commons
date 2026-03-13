#!/bin/bash

# Script to run nginx in Docker for General Commons development
# This script creates a Docker container that proxies requests to local backend and frontend services

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NGINX_CONF="${SCRIPT_DIR}/docker-nginx.conf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Nginx in Docker${NC}"
echo "=================================================="
echo ""

# Check if docker-nginx.conf exists
if [ ! -f "$NGINX_CONF" ]; then
    echo -e "${RED}❌ Error: docker-nginx.conf not found at ${NGINX_CONF}${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^general-commons-nginx$"; then
    echo -e "${YELLOW}⚠️  Container 'general-commons-nginx' already exists${NC}"
    read -p "Do you want to remove and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Stopping and removing existing container...${NC}"
        docker stop general-commons-nginx > /dev/null 2>&1
        docker rm general-commons-nginx > /dev/null 2>&1
    else
        echo -e "${YELLOW}Exiting. Use 'docker start general-commons-nginx' to start the existing container${NC}"
        exit 0
    fi
fi

# Create and start the container
echo -e "${BLUE}Creating nginx container...${NC}"
docker run -d \
  --name general-commons-nginx \
  -p 3000:3000 \
  -v "${NGINX_CONF}:/etc/nginx/nginx.conf:ro" \
  --restart unless-stopped \
  nginx:1.27.2

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx container started successfully${NC}"
    echo ""
    echo -e "${BLUE}Container Information:${NC}"
    echo -e "  Name: general-commons-nginx"
    echo -e "  Port: 3000"
    echo -e "  Config: ${NGINX_CONF}"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "  View logs:    ${GREEN}docker logs general-commons-nginx${NC}"
    echo -e "  Stop:         ${GREEN}docker stop general-commons-nginx${NC}"
    echo -e "  Start:        ${GREEN}docker start general-commons-nginx${NC}"
    echo -e "  Remove:       ${GREEN}docker rm -f general-commons-nginx${NC}"
    echo -e "  Reload config: ${GREEN}docker exec general-commons-nginx nginx -s reload${NC}"
    echo ""
    echo -e "${GREEN}✓ Nginx is now running and accessible at http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Failed to start nginx container${NC}"
    exit 1
fi

