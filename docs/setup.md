# GemVault — Developer Setup

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Docker Desktop | Latest | Required for all local services |
| .NET SDK | 10.0 | For running/building the API outside Docker |
| Node.js | 20.x | For running the frontend outside Docker |
| Git | Any | Standard |

> **Minimum setup:** Docker Desktop only. All services run in containers — you do not need .NET or Node.js installed locally unless you want to run them outside Docker.

---

## First-Time Setup

```bash
# 1. Clone the repo
git clone https://github.com/MichielCon/GemVault.git
cd GemVault

# 2. Copy environment file and review defaults
cp .env.example .env
# The defaults in .env.example work for local dev — no edits needed to get started

# 3. Start all services
docker compose up -d

# 4. Verify everything is up
docker compose ps
```

After startup (takes ~30s on first run for image pulls):

| Service | URL | Purpose |
|---------|-----|---------|
| App | http://localhost:3000 | Next.js frontend |
| API | http://localhost:5000 | ASP.NET Core API (direct, bypasses nginx) |
| API via nginx | http://localhost/api | API through reverse proxy |
| API health | http://localhost:5000/health | Returns `Healthy` if DB + MinIO reachable |
| MinIO console | http://localhost:9001 | Object storage admin UI |
| Seq logs | http://localhost:8080 | Structured log viewer |

On first run, the API automatically applies all EF Core migrations. Register your first account at http://localhost:3000/auth/register.

---

## Environment Variables

All variables live in `.env` (copied from `.env.example`). Never commit `.env`.

### Database
```bash
POSTGRES_DB=gemvault            # Database name
POSTGRES_USER=gemvault          # PostgreSQL username
POSTGRES_PASSWORD=changeme_dev  # PostgreSQL password (change in production!)

# Connection string used by the API (must match the above)
ConnectionStrings__DefaultConnection=Host=db;Port=5432;Database=gemvault;Username=gemvault;Password=changeme_dev
```

### MinIO (Object Storage)
```bash
MINIO_ROOT_USER=minioadmin       # MinIO admin username
MINIO_ROOT_PASSWORD=changeme_dev # MinIO admin password (change in production!)
MINIO_BUCKET=gemvault-images     # Bucket name for photos and certificates
```

### JWT Authentication
```bash
JWT_SECRET=changeme_jwt_secret_must_be_at_least_32_chars  # MUST be 32+ chars; use a random string in production
JWT_ISSUER=GemVault
JWT_AUDIENCE=GemVaultClient
JWT_EXPIRY_MINUTES=60       # Access token lifetime
JWT_REFRESH_EXPIRY_DAYS=30  # Refresh token lifetime
```

### Application
```bash
ASPNETCORE_ENVIRONMENT=Development  # Development | Production
API_PORT=5000                       # Host port for direct API access
FRONTEND_PORT=3000                  # Host port for frontend
CORS_ORIGINS=http://localhost:3000,http://localhost  # Comma-separated allowed origins
```

---

## Running Without Docker

### API Only (requires PostgreSQL running)
```bash
# Set up a local PostgreSQL instance or use Docker for DB only:
docker compose up -d db minio seq

# Run the API
dotnet run --project src/GemVault.Api
# API starts at http://localhost:5000
```

### Frontend Only (requires API running)
```bash
cd frontend

# Windows (nvm4w):
export PATH="/c/nvm4w/nodejs:$PATH"

npm install
npm run dev
# Frontend starts at http://localhost:3001 if 3000 is in use
```

---

## Rebuilding After Code Changes

The containers do **not** hot-reload — you need to rebuild after changes:

```bash
# API changes
docker compose build api && docker compose up -d api

# Frontend changes
docker compose build frontend && docker compose up -d frontend

# Both
docker compose build api frontend && docker compose up -d api frontend
```

> **Why not just `up -d`?** `docker compose up -d` restarts existing containers but does not rebuild images. The build step is required to pick up code changes.

---

## Running Tests

```bash
# All tests (unit + integration)
dotnet test src/GemVault.slnx

# Unit tests only (fast, no Docker required)
dotnet test src/GemVault.Tests

# Integration tests only (spins up a real PostgreSQL container via Testcontainers)
dotnet test src/GemVault.Tests.Integration

# Run a specific test
dotnet test src/GemVault.slnx --filter "FullyQualifiedName~CreateGem"
```

Integration tests require Docker Desktop to be running (Testcontainers spins up a temporary PostgreSQL container automatically).

---

## Database Migrations

```bash
# Add a new migration
dotnet ef migrations add YourMigrationName \
  --project src/GemVault.Infrastructure \
  --startup-project src/GemVault.Api \
  --output-dir Persistence/Migrations

# Migrations are applied automatically on API startup (no manual step needed)
```

---

## Git Workflow

```
main        ← production; auto-deploys to VPS on merge
dev         ← integration branch; CI runs on every push
feature/*   ← feature branches; PR into dev
hotfix/*    ← hotfix branches; PR into main + backmerge to dev
```

- Never push directly to `main` or `dev`
- All changes via Pull Request
- CI (build + test) must pass before merge
- After merging to `main`, GitHub Actions deploys automatically to the VPS

---

## Common Issues

**`docker compose up` fails with "port already in use"**
Another process is using port 80, 3000, 5000, or 5432. Either stop the conflicting process or change the ports in `.env` (`API_PORT`, `FRONTEND_PORT`).

**API starts but health check fails**
The DB or MinIO container may not have finished starting. Run `docker compose ps` to check health status. Wait a few seconds and retry.

**`dotnet test` fails with "cannot connect to PostgreSQL"**
Testcontainers requires Docker Desktop to be running. Start Docker Desktop and retry.

**Frontend shows stale data after code change**
Rebuild the frontend image: `docker compose build frontend && docker compose up -d frontend`.
