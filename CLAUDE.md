# GemVault — Claude Code Project Guide

## Project Overview
GemVault is a gemstone inventory management webapp for collectors and businesses. Features include gem/parcel tracking, photo storage, QR/RFID scan pages, purchase orders, sales pipeline, and role-based dashboards.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router, TypeScript) + Tailwind CSS v4 + shadcn/ui |
| Backend | ASP.NET Core 10 Web API (C#) — Clean Architecture |
| ORM | Entity Framework Core 10 |
| Database | PostgreSQL 16 |
| Image Storage | MinIO (self-hosted Docker, S3-compatible) |
| Auth | ASP.NET Identity + JWT (+ refresh tokens) |
| Deployment | Self-managed VPS via GitHub Actions SSH |
| Future | .NET MAUI desktop/mobile app (offline, shares C# domain models) |

## Multi-Agent Architecture
Always start a new feature area by consulting the relevant agent file. Each agent has scoped responsibilities and a decision log.

| Agent File | When to Use |
|---|---|
| `.claude/agents/architect.md` | Before starting any new feature area — design, API contracts, data model |
| `.claude/agents/backend-dev.md` | ASP.NET Core API, EF Core, domain logic, C# implementation |
| `.claude/agents/frontend-dev.md` | Next.js pages, components, TypeScript, API integration |
| `.claude/agents/db-architect.md` | Schema changes, migrations, query optimization |
| `.claude/agents/devops.md` | Docker, CI/CD, GitHub Actions, VPS infrastructure |
| `.claude/agents/qa.md` | Test strategy, xUnit, Playwright E2E |
| `.claude/agents/security.md` | Auth flows, authorization, input validation, OWASP |

## Git Flow
```
main        ← production, auto-deploys to VPS on merge
dev         ← integration branch, CI runs tests on every push
feature/*   ← feature branches, PR into dev
hotfix/*    ← hotfix branches, PR into main + backmerge to dev
```

Rules:
- Never push directly to `main` or `dev`
- All changes via PR
- CI must pass before merge
- `main` is branch-protected: requires PR + passing CI

## Project Structure
```
GemVault/
├── .claude/agents/          # Agent context files
├── .github/workflows/       # ci.yml + deploy.yml
├── src/
│   ├── GemVault.Api/        # ASP.NET Core — controllers, middleware
│   ├── GemVault.Domain/     # Entities, value objects, interfaces
│   ├── GemVault.Application/ # Use cases, DTOs, CQRS (MediatR)
│   ├── GemVault.Infrastructure/ # EF Core, repos, MinIO, email
│   └── GemVault.Tests/      # xUnit unit + integration tests
├── frontend/                # Next.js app
├── docker/                  # Dockerfiles + nginx.conf
├── docker-compose.yml       # Local dev
├── docker-compose.prod.yml  # Production overrides
└── .env.example             # Template — copy to .env, never commit .env
```

## Local Development

### First-time setup
```bash
cp .env.example .env
# Edit .env with your local values (defaults work for dev)
docker compose up -d
```

### Verify
- Frontend: http://localhost:3000
- API health: http://localhost:5000/health
- MinIO console: http://localhost:9001

### .NET only (no Docker)
```bash
# Requires PostgreSQL running locally or via Docker
dotnet run --project src/GemVault.Api
```

### Next.js only
```bash
cd frontend
npm install
npm run dev
```

### Run tests
```bash
dotnet test src/GemVault.Tests
```

## Environment Variables
See `.env.example` for all required variables. Never commit `.env`.

Key variables:
- `ConnectionStrings__DefaultConnection` — PostgreSQL connection string
- `JWT_SECRET` — must be 32+ chars
- `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` — MinIO credentials

## GitHub Actions
- **CI** (`ci.yml`): runs on PR to `dev`/`main` — build, test, docker dry-run
- **Deploy** (`deploy.yml`): runs on push to `main` — SSH deploy + health check

Required GitHub Secrets for deploy: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`

## Domain Model Summary
Core entities: `User`, `Gem`, `GemParcel`, `GemPhoto`, `GemAttribute` (JSONB), `Origin`, `Supplier`, `PurchaseOrder`, `OrderItem`, `Sale`, `SaleItem`, `PublicToken`, `Certificate`

See `.claude/agents/architect.md` for full domain model and architectural decisions.
