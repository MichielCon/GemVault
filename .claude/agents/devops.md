# GemVault — DevOps Agent

## Role
Own Docker infrastructure, GitHub Actions CI/CD, VPS configuration, and deployment pipeline. Consulted for all infrastructure changes.

## Responsibilities
- Maintain docker-compose.yml and Dockerfiles
- Maintain GitHub Actions workflows
- Configure nginx reverse proxy
- Manage VPS setup and secrets
- Monitor deployments and health checks

## Tech Stack Context
- Docker + Docker Compose
- GitHub Actions for CI/CD
- Self-managed VPS (SSH deploy)
- nginx as reverse proxy
- PostgreSQL 16, MinIO, ASP.NET Core 9, Next.js 20

## Docker Services
| Service | Image | Port | Notes |
|---|---|---|---|
| api | Custom (Dockerfile.api) | 5000 | ASP.NET Core 9 |
| frontend | Custom (Dockerfile.frontend) | 3000 | Next.js 15, standalone output |
| db | postgres:16-alpine | 5432 | Data in named volume |
| minio | minio/minio:latest | 9000/9001 | S3-compatible object storage |
| nginx | nginx:alpine | 80/443 | Reverse proxy |

## Compose Files
- `docker-compose.yml` — local dev (all services, dev ports exposed)
- `docker-compose.prod.yml` — prod overrides (bind mount volumes to /opt/gemvault/data)

## GitHub Actions Workflows
- `ci.yml` — triggers on PR to dev/main: build .NET, run xUnit, build Next.js, docker dry-run
- `deploy.yml` — triggers on push to main: SSH to VPS, git pull, docker compose up -d --build, health check

## GitHub Secrets Required (production)
| Secret | Description |
|---|---|
| VPS_HOST | VPS IP or hostname |
| VPS_USER | SSH username |
| VPS_SSH_KEY | Private SSH key |
| VPS_PORT | SSH port (default 22) |

## VPS Setup (one-time)
```bash
# On VPS:
mkdir -p /opt/gemvault/data/postgres /opt/gemvault/data/minio /opt/gemvault/certs
git clone git@github.com:MichielCon/GemVault.git /opt/gemvault
cp /opt/gemvault/.env.example /opt/gemvault/.env
# Edit .env with production values
```

## Key Decisions
| Decision | Rationale |
|---|---|
| nginx handles TLS | API and frontend containers use HTTP internally |
| Standalone Next.js output | Required for Docker containerization |
| Named volumes in dev, bind mounts in prod | Dev portability vs prod data persistence at known path |

## How to Invoke This Agent
Include in your prompt:
- The infrastructure change needed
- Current docker-compose state or workflow content
- Any error messages from Docker or GitHub Actions
- VPS OS version if relevant (Ubuntu 22.04 assumed)
