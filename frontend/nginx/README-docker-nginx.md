# Nginx Docker Setup for General Commons Development
## Overview
Nginx runs in a Docker container and acts as a reverse proxy, routing requests to:
- **Backend** (Spring Boot) - running locally on port 8080
- **Frontend** (React) - running locally on port 3010
- **External services** - various dataservice endpoints

All requests go through nginx on port 3000, providing a unified entry point that matches production-like behavior.

## Prerequisites

- Docker Desktop installed and running
- Backend running locally on port 8080
- Frontend running locally on port 3010

## Quick Start

1. **Start your local services:**
2. **Start nginx in Docker:**
   ```bash
   cd frontend/nginx
   ./run-nginx.sh
   ```
3. **Access the application:**
   - Open your browser to `http://localhost:3000`

## Configuration Files

- **`docker-nginx.conf`** - Nginx configuration file for Docker
  - Proxies `/v1/graphql/` → Backend (port 8080)
  - Proxies `/` → Frontend (port 3010)
  - Proxies other API endpoints to external services
  - Uses `host.docker.internal` to reach local services

- **`run-nginx.sh`** - Script to start nginx container
  - Uses relative paths (works from any directory)
  - Checks for existing containers
  - Provides helpful status messages
  - Uses `docker-nginx.conf` configuration file

## Docker Commands

### Start nginx
```bash
./run-nginx.sh
```

### View logs
```bash
docker logs general-commons-nginx
```

### Follow logs (live)
```bash
docker logs -f general-commons-nginx
```

### Stop nginx
```bash
docker stop general-commons-nginx
```

### Start existing container
```bash
docker start general-commons-nginx
```

### Remove container
```bash
docker rm -f general-commons-nginx
```

### Reload nginx configuration (after editing docker-nginx.conf)
```bash
docker exec general-commons-nginx nginx -s reload
```

### Restart container (to apply config changes)
```bash
docker restart general-commons-nginx
```

## Troubleshooting

### Container won't start
- Check if Docker Desktop is running
- Check if port 3000 is already in use: `lsof -i :3000`
- Check nginx logs: `docker logs general-commons-nginx`

### 502 Bad Gateway errors
- Verify backend is running on port 8080: `lsof -i :8080`
- Verify frontend is running on port 3010: `lsof -i :3010`
- Check nginx can reach host services: The container uses `host.docker.internal` to reach local services

### Connection refused errors
- Ensure backend and frontend are running before starting nginx
- Check that services are listening on the correct ports
- Verify nginx configuration is correct

### DNS resolution errors
- The nginx config uses Docker's internal DNS resolver
- External HTTPS URLs use variables for dynamic DNS resolution
- If issues persist, check Docker's DNS settings

## Configuration Details

### Backend Proxying
- `/v1/graphql/` → `http://host.docker.internal:8080/v1/graphql/`
- `/v1/public-graphql/` → `http://host.docker.internal:8080/v1/graphql/`
- `/version/` → `http://host.docker.internal:8080/version`

### Frontend Proxying
- `/` → `http://host.docker.internal:3010/`

### External Services
- `/api/files/` → External dataservice
- `/api/auth/` → External dataservice
- `/api/users/` → External dataservice
- `/api/interoperation/graphql/` → External dataservice

## Notes

- The nginx container uses `host.docker.internal` to reach services running on your host machine
- This works on macOS and Windows Docker Desktop
- On Linux, you may need to use `--network host` or configure Docker differently
- The configuration file (`docker-nginx.conf`) is mounted as read-only (`:ro`) to prevent accidental modifications inside the container
- The script uses `docker-nginx.conf` which is specifically configured for Docker usage with `host.docker.internal` references
