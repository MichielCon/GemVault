# GemVault — Deployment

## Overview

GemVault is deployed to a self-managed VPS. Every merge to `main` triggers an automatic deployment via GitHub Actions (SSH → `git pull` → `docker compose build` → `docker compose up`). On failure, the workflow automatically rolls back to the previous image.

---

## VPS Requirements

- Ubuntu 22.04+ (or any Linux with Docker support)
- Docker Engine + Docker Compose plugin (not Docker Desktop)
- Git
- 2 GB RAM minimum (each container has a memory limit, total ~3.2 GB)
- Sufficient disk for images, backups, and logs

---

## First-Time VPS Setup

**1. Install Docker:**
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

**2. Create the app directory:**
```bash
sudo mkdir -p /opt/gemvault
sudo chown $USER:$USER /opt/gemvault
```

**3. Clone the repo:**
```bash
cd /opt/gemvault
git clone https://github.com/MichielCon/GemVault.git .
```

**4. Create the `.env` file:**
```bash
cp .env.example .env
nano .env
```

Change all `changeme_dev` values. Generate a strong JWT secret:
```bash
openssl rand -base64 48
```

**5. Create data directories:**
```bash
sudo mkdir -p /opt/gemvault/data/{postgres,minio,seq,backups}
sudo chown -R $USER:$USER /opt/gemvault/data
```

These paths are bind-mounted in `docker-compose.prod.yml` — they persist data across container restarts and rebuilds.

**6. Start all services:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**7. Verify:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
curl http://localhost/api/health
```

---

## GitHub Actions — Required Secrets

In GitHub → Settings → Secrets and variables → Actions:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | VPS IP address or hostname |
| `VPS_USER` | SSH user (e.g. `ubuntu` or `gemvault`) |
| `VPS_SSH_KEY` | Private SSH key (generate with `ssh-keygen -t ed25519`) |
| `VPS_PORT` | SSH port (optional, defaults to 22) |

The deploy workflow uses `appleboy/ssh-action` to SSH into the VPS and run the deployment script.

**Generate and add the SSH key:**
```bash
# On your local machine
ssh-keygen -t ed25519 -C "gemvault-deploy" -f ~/.ssh/gemvault_deploy

# Copy the public key to the VPS
ssh-copy-id -i ~/.ssh/gemvault_deploy.pub user@your-vps

# Add the private key to GitHub Secrets as VPS_SSH_KEY
cat ~/.ssh/gemvault_deploy
```

---

## CI/CD Pipeline

### CI (`ci.yml`) — runs on PR to `dev` or `main`

1. Build & test .NET API (`dotnet build` + `dotnet test` — both unit and integration)
2. Build Next.js frontend (`npm ci`, `npm run lint`, `npm audit`, `npm run build`)
3. Docker dry-run builds (both images, no push) — confirms Dockerfiles build cleanly

All three jobs must pass before a PR can be merged.

### Deploy (`deploy.yml`) — runs on push to `main`

1. SSH into VPS
2. Tag current images as `:previous` (rollback targets)
3. `git pull origin main`
4. `docker compose -f docker-compose.yml -f docker-compose.prod.yml build`
5. Tag new images with `$GITHUB_SHA`
6. `docker compose up -d`
7. `docker image prune -f` (removes dangling images only — keeps `:previous` and `:{sha}`)
8. Health check: `curl --retry 12 https://{VPS_HOST}/api/health` (waits up to 3 minutes)
9. On failure: automatic rollback — re-tags `:previous` as `:latest` and restarts

---

## Docker Compose — Production vs Development

The project uses two compose files merged at runtime:

```bash
# Production (on VPS)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Development (local)
docker compose up -d
```

`docker-compose.prod.yml` applies these overrides:
- **DB, MinIO ports removed** — not reachable outside the Docker network in production
- **Host bind-mounts** — data stored at `/opt/gemvault/data/{postgres,minio,seq,backups}` instead of named volumes
- **Memory limits** — prevents any one container from OOM-killing the VPS
- **`restart: always`** — containers restart automatically on crash or VPS reboot
- **Seq UI not exposed** — only port 5341 (ingestion) is exposed, not the web UI

### Memory limits (production)

| Service | Limit |
|---------|-------|
| `db` | 1 GB |
| `api` | 512 MB |
| `frontend` | 512 MB |
| `minio` | 512 MB |
| `seq` | 512 MB |
| `nginx` | 128 MB |
| `backup` | 128 MB |

---

## Backups

A `backup` service runs inside Docker and automatically pg_dumps the database every 24 hours.

**Backup location (production):** `/opt/gemvault/data/backups/`

**Backup format:** `gemvault_YYYYMMDD_HHMMSS.sql.gz` (gzip-compressed SQL dump)

**Retention:** 7 days — backups older than 7 days are automatically deleted.

**To force a backup manually:**
```bash
docker exec gemvault-backup-1 sh /backup.sh
```

**To verify backups are running:**
```bash
docker compose logs backup
ls /opt/gemvault/data/backups/
```

### Restore procedure

```bash
# 1. List available backups
ls /opt/gemvault/data/backups/

# 2. Stop the API (prevents new writes during restore)
docker compose -f docker-compose.yml -f docker-compose.prod.yml stop api

# 3. Restore
gunzip -c /opt/gemvault/data/backups/gemvault_20260325_020000.sql.gz \
  | docker exec -i gemvault-db-1 psql -U $POSTGRES_USER $POSTGRES_DB

# 4. Restart
docker compose -f docker-compose.yml -f docker-compose.prod.yml start api
```

Replace `$POSTGRES_USER` and `$POSTGRES_DB` with the values from your `.env` file.

---

## Accessing Seq in Production

The Seq UI is not publicly exposed in production. Access it via SSH tunnel:

```bash
ssh -L 8080:localhost:80 user@your-vps
```

Then browse to `http://localhost:8080`.

The tunnel forwards your local port 8080 to Seq's port 80 inside the VPS (Seq only listens on the Docker network in production).

---

## Rollback

**Automatic rollback** happens if the health check fails after deployment. The workflow re-tags `:previous` as `:latest` and restarts.

**Manual rollback:**
```bash
# SSH into VPS
cd /opt/gemvault

# Check if a previous image exists
docker image ls | grep previous

# Roll back
docker tag gemvault-api:previous gemvault-api:latest
docker tag gemvault-frontend:previous gemvault-frontend:latest
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

If no `:previous` tag exists, you can roll back via git:
```bash
git log --oneline       # find the previous commit SHA
git checkout {sha}      # detach HEAD to that commit
docker compose -f docker-compose.yml -f docker-compose.prod.yml build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
git checkout main       # re-attach
```

---

## EF Core Migrations in Production

Migrations apply automatically when the API starts. No manual `dotnet ef database update` step is needed in the deployment flow.

If a migration fails on startup, the API will crash and Docker's `restart: always` will keep retrying. Check logs:
```bash
docker compose logs api --tail=100
```

To run migrations manually (e.g. for debugging):
```bash
docker exec -it gemvault-api-1 dotnet GemVault.Api.dll --migrate-only
```

---

## Environment Variables in Production

All variables live in `/opt/gemvault/.env`. Never commit `.env` to git.

**Required production changes from `.env.example`:**

| Variable | Production value |
|----------|-----------------|
| `POSTGRES_PASSWORD` | Strong random password |
| `MINIO_ROOT_PASSWORD` | Strong random password |
| `JWT_SECRET` | 48+ char random string (`openssl rand -base64 48`) |
| `CORS_ORIGINS` | Your actual domain (e.g. `https://gemvault.example.com`) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

---

## Monitoring

- **Health endpoint:** `https://your-domain/api/health` — checked by the deploy workflow; returns 200 if DB + MinIO are reachable
- **Seq logs:** SSH tunnel → `http://localhost:8080` — all structured logs with correlation IDs
- **Container status:** `docker compose ps`
- **Container logs:** `docker compose logs {service} --tail=100`
- **Resource usage:** `docker stats`

---

## Common Production Issues

**API keeps restarting**
```bash
docker compose logs api --tail=50
```
Most common causes: DB not healthy yet (wait and retry), bad `.env` value, failed migration.

**Backup service not creating files**
```bash
docker compose logs backup
ls /opt/gemvault/data/backups/
```
Check that the bind-mount directory exists and is writable.

**Out of disk space**
```bash
df -h
docker system df
docker image prune -a   # Remove ALL unused images (careful — removes rollback targets too)
```

**Seq not receiving logs**
The API container may have started before Seq was healthy. Restart the API:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml restart api
```
