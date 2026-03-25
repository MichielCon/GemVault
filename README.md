# GemVault

A full-stack gemstone inventory management platform for collectors and businesses. Track individual stones and parcels, record purchases and sales, link gems to their origin mine, and generate shareable QR scan pages — all from a clean, modern web dashboard.

Built end-to-end using a multi-agent Claude Code setup where specialised AI agents (architect, backend, frontend, devops, QA, security) each own a distinct responsibility area and collaborate via shared context files.

---

## Features

**Inventory**
- Track individual gems and bulk parcels with full gemological attributes (species, variety, colour, treatment, dimensions, weight in carats)
- Photo upload per gem/parcel, with cover photo selection (stored in MinIO / S3-compatible)
- Vocabulary-backed dropdowns — species, variety, colour, treatment, cut, shape, clarity — seeded from mineralogical data and served from a database table so they can be extended without a code deploy
- Variety options filter dynamically based on selected species (e.g. selecting Corundum narrows varieties to Ruby / Sapphire)
- Origin tracking: link gems to a mine/region/country record

**Purchase Orders & Sales**
- Record supplier purchases with line items (description, cost, optional link to an inventory item)
- Inline supplier creation — add a new supplier without leaving the order form
- Record sales with buyer details and line items linked to existing gems/parcels
- Running cost/revenue totals update live as you enter prices

**Provenance**
- Origin detail pages showing all gems sourced from a given mine
- Public scan pages — each gem gets a UUID token; `/scan/{token}` is a publicly accessible SSR page (no login required), ideal for QR codes or RFID tags
- Owner view vs public view enforced server-side: purchase price and private notes are never exposed unauthenticated

**Dashboard**
- KPI cards: gems in stock, unsold inventory value, total revenue, net profit with margin %
- Revenue bar chart (last 6 months) and inventory composition donut chart (unsold gems by species)
- Recent sales table and recently-added items feed side by side
- Business counters: suppliers, purchase orders, sales

**Inventory UI**
- Grid and list view toggle with preference persisted per section (localStorage)
- Search bar filters by name, species, or variety
- Status filter: All / In Stock / Sold — applied server-side so pagination stays correct
- Sold badge (amber) and Public badge on cards and list rows

**Auth**
- JWT + refresh token auth, tokens stored in httpOnly cookies (not localStorage)
- Role-based: Collector vs Business vs Admin
- Server Actions handle all auth operations server-side; the JWT never touches client JS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 — App Router, TypeScript, Tailwind CSS v4 |
| UI Components | Custom component library (Button, Input, Card, Combobox, Badge) built on Tailwind primitives |
| Backend | ASP.NET Core 10 Web API — C#, Clean Architecture |
| CQRS | MediatR 14 — Commands / Queries / Handlers |
| Validation | FluentValidation 12 |
| ORM | Entity Framework Core 10 + Npgsql |
| Database | PostgreSQL 16 |
| File Storage | MinIO (self-hosted, S3-compatible API) |
| Auth | ASP.NET Identity + JWT + refresh tokens |
| Charts | Recharts 2 — server-data, client-rendered bar and donut charts |
| Tests | xUnit unit tests + integration tests (WebApplicationFactory + Testcontainers PostgreSQL + Respawn) |
| Logging | Serilog + Seq — structured logs, correlation IDs, per-request user/duration enrichment |
| Infrastructure | Docker Compose (7 services: api, frontend, db, minio, nginx, seq, backup) |
| CI/CD | GitHub Actions — build + test on PR, SSH deploy on merge to main |

---

## Architecture

```
GemVault/
├── src/
│   ├── GemVault.Api/            # ASP.NET Core — controllers, middleware, auth pipeline
│   ├── GemVault.Domain/         # Entities, value objects, domain interfaces (no dependencies)
│   ├── GemVault.Application/    # Use cases, DTOs, CQRS handlers, FluentValidation
│   ├── GemVault.Infrastructure/ # EF Core DbContext, repositories, MinIO client, Identity
│   ├── GemVault.Tests/          # xUnit unit tests — validators, command handlers
│   └── GemVault.Tests.Integration/ # Integration tests — real PostgreSQL via Testcontainers
├── frontend/
│   ├── app/                     # Next.js App Router — pages and layouts
│   │   ├── dashboard/           # Authenticated dashboard (gems, parcels, orders, sales, origins)
│   │   ├── auth/                # Login / register pages
│   │   └── scan/[token]/        # Public gem scan page (no auth)
│   ├── components/ui/           # Reusable UI components
│   └── lib/                     # API client, server actions, types
├── docker/                      # Dockerfile.api, Dockerfile.frontend, nginx.conf
├── docker-compose.yml           # Local dev — all 7 services
├── docker-compose.prod.yml      # Production overrides
└── docs/                        # Developer documentation
```

**Key design decisions:**
- Clean Architecture: Domain has zero external dependencies; Application depends only on Domain; Infrastructure depends on both
- All data mutations go through MediatR commands — no fat controllers
- `PublicToken` is a separate UUID from the entity ID — the gem's database ID is never exposed in public URLs; tokens can be rotated
- Soft delete across all entities via global EF query filters — no data is ever hard-deleted
- Frontend Server Actions run on the server and forward the auth cookie to the API — the JWT is never exposed to client JavaScript
- SSR for all list and detail pages; forms are client components using `useActionState`
- Photo proxy route (`/api/photos?url=`) streams MinIO images server-side — bypasses Next.js `remotePatterns` entirely and works inside Docker without exposing MinIO ports
- Gem/parcel list queries include SaleItems in a single EF Core filtered include; `isSold` is computed in-process, never a separate query

---

## AI-Driven Development

This project was developed using **Claude Code** with a multi-agent architecture. Instead of a single AI session, the work was split across specialised agents, each given a scoped context file defining their role, responsibilities, and a running decision log:

| Agent | File | Scope |
|---|---|---|
| Architect | `.claude/agents/architect.md` | System design, API contracts, data model decisions |
| Backend Dev | `.claude/agents/backend-dev.md` | ASP.NET Core API, EF Core, C# domain logic |
| Frontend Dev | `.claude/agents/frontend-dev.md` | Next.js pages, components, TypeScript, API integration |
| DB Architect | `.claude/agents/db-architect.md` | Schema design, migrations, query optimisation |
| DevOps | `.claude/agents/devops.md` | Docker, CI/CD, GitHub Actions, VPS config |
| QA | `.claude/agents/qa.md` | Test strategy, xUnit, coverage |
| Security | `.claude/agents/security.md` | Auth flows, authorisation, input validation, OWASP |

Each agent runs in its own Claude Code session with access to its agent file (persistent memory) plus the shared `CLAUDE.md` project guide. The main session orchestrates work and cherry-picks decisions into the agent files. This keeps context focused and prevents agents from drifting outside their lane.

The entire backend (Clean Architecture, 12 entities, CQRS, auth, MinIO integration, EF migrations, unit + integration tests) and frontend (App Router, server actions, full CRUD, photo upload, vocabulary system, public scan pages, analytics dashboard) were built through this agent workflow.

---

## Running Locally

**Prerequisites:** Docker Desktop

```bash
git clone https://github.com/MichielCon/GemVault.git
cd GemVault
cp .env.example .env
docker compose up -d
```

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | http://localhost:5000 |
| API health | http://localhost:5000/health |
| MinIO console | http://localhost:9001 |
| Seq logs | http://localhost:8080 |

The API applies EF Core migrations automatically on startup. On first run, register an account at `/auth/register`.

---

## Running Tests

```bash
# Unit tests (fast, no Docker needed)
dotnet test src/GemVault.Tests

# Integration tests (requires Docker — spins up a real PostgreSQL container)
dotnet test src/GemVault.Tests.Integration

# Both
dotnet test src/GemVault.slnx
```

Unit tests cover command validators and MediatR handler logic. Integration tests use `WebApplicationFactory` + Testcontainers PostgreSQL + Respawn to run the full ASP.NET Core pipeline against a real database, including regression tests for the `DateTime.Kind=Unspecified` / Npgsql UTC bug and end-to-end sold-status linking.

---

## Domain Model

```
User            → roles: Admin | Business | Collector
Gem             → individual stone with full gemological attributes
GemParcel       → batch of identical gems (quantity field)
GemPhoto        → photo linked to Gem or Parcel, stored in MinIO
GemVocabulary   → DB-backed vocabulary (species, variety, colour, etc.)
Origin          → country + mine + region
Supplier        → company/person with contact info
PurchaseOrder   → linked to Supplier, contains OrderItems
OrderItem       → line item with cost, optional gem/parcel link
Sale            → linked to optional buyer, contains SaleItems
SaleItem        → line item with quantity and sale price
PublicToken     → UUID per Gem/Parcel for QR/RFID scan links
```

---

## Roadmap

- [x] Phase 1 — Backend foundation (Clean Architecture, auth, Gem/Parcel CRUD, photo upload, public scan)
- [x] Phase 2 — Frontend (full dashboard, edit forms, photo uploader, public scan page)
- [x] Phase 3 — Suppliers, purchase orders, sales, dashboard stats, vocabulary system, origin picker
- [x] Phase 3.5 — Analytics dashboard (KPI cards, revenue chart, species donut), photo proxy, sold badge + status filter, grid/list toggle, integration test suite
- [x] Phase 4 — Provenance map (Leaflet), QR code generation, certificate upload (PDF → MinIO), structured logging + Seq, production backups, resource limits
- [ ] Phase 5 — .NET MAUI desktop/mobile app (offline-first, shared C# domain models), multi-tenancy, insurance valuation PDF reports
