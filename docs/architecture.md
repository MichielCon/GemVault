# GemVault — Architecture

## Overview

GemVault uses **Clean Architecture** for the backend and **Next.js App Router** for the frontend, running as 7 Docker services behind an nginx reverse proxy.

```
Browser / Mobile
      │
      ▼
   nginx (port 80/443)
   ├── /api/*  ──────────► ASP.NET Core 10 API (port 5000)
   │                              │
   └── /*  ──────────────► Next.js 16 Frontend (port 3000)
                                  │ (SSR server-side API calls)
                                  ▼
                           ASP.NET Core 10 API
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
             PostgreSQL 16                   MinIO
             (port 5432)               (S3 storage, 9000)
```

Additional services:
- **Seq** (port 5341 ingestion, 8080 UI dev) — structured log aggregation
- **backup** — daily pg_dump to compressed file

---

## Backend: Clean Architecture

The backend is split into four projects with strict dependency rules:

```
GemVault.Domain          ← no external dependencies
       ▲
GemVault.Application     ← depends on Domain only
       ▲
GemVault.Infrastructure  ← depends on Domain + Application
       ▲
GemVault.Api             ← depends on all three; DI wiring point
```

### GemVault.Domain
Pure business objects with no framework dependencies.
- **Entities** — `Gem`, `GemParcel`, `GemPhoto`, `Origin`, `Supplier`, `PurchaseOrder`, `Sale`, `PublicToken`, `Certificate`, `GemVocabulary`
- All entities inherit from `BaseEntity`: `Id` (GUID), `CreatedAt`, `UpdatedAt`, `IsDeleted`
- **No EF Core, no ASP.NET, no external NuGet packages**

### GemVault.Application
Use cases, orchestration, DTOs. Everything the API needs to do lives here.
- **MediatR Commands** (mutations) and **Queries** (reads) — one class per use case
- **FluentValidation** validators for all commands
- **DTOs** — request/response shapes, never expose domain entities directly
- **Interfaces** — `ICurrentUserService`, `IStorageService`, `IIdentityService` (implemented in Infrastructure)

### GemVault.Infrastructure
All external concerns: database, file storage, identity.
- **EF Core 10** `ApplicationDbContext` + entity configurations + migrations
- **MinIO** client (S3-compatible photo/certificate storage)
- **ASP.NET Identity** — `ApplicationUser`, `UserManager`, token hashing
- **Background services** — `RefreshTokenCleanupService`
- Global EF query filters for soft delete (`WHERE IsDeleted = FALSE`) — applied automatically to all queries

### GemVault.Api
Thin HTTP layer. No business logic.
- **Controllers** — receive HTTP request, call `mediator.Send()`, return result
- **Middleware** — `CorrelationIdMiddleware`, `ExceptionHandlingMiddleware`
- **Program.cs** — DI registration, pipeline configuration, Serilog setup

---

## CQRS Pattern

Every operation is a MediatR command or query:

```csharp
// Query (read-only, no side effects)
var result = await mediator.Send(new GetGemByIdQuery(id));

// Command (mutates state)
var gemId = await mediator.Send(new CreateGemCommand { ... });
```

Controllers are intentionally thin:
```csharp
[HttpGet("{id}")]
public async Task<IActionResult> Get(Guid id)
    => Ok(await mediator.Send(new GetGemByIdQuery(id)));
```

Validation runs as a MediatR pipeline behavior — commands are validated by FluentValidation before the handler runs. Invalid requests never reach the handler.

---

## Domain Model

```
User              roles: Admin | Business | Collector
  │
  ├── Gem                 individual gemstone
  │     ├── GemPhoto[]    photos (stored in MinIO)
  │     ├── Certificate[] lab certificates (PDF in MinIO)
  │     ├── PublicToken   UUID for QR/RFID scan link
  │     ├── Origin        mine/region/country reference
  │     └── SaleItem      (backlink) if sold
  │
  ├── GemParcel           bulk lot of identical gems
  │     ├── GemPhoto[]
  │     ├── PublicToken
  │     ├── Origin
  │     └── SaleItem[]    (backlink)
  │
  ├── Supplier
  │     └── PurchaseOrder[]
  │           └── OrderItem[]   optional link to Gem or GemParcel
  │
  └── Sale
        └── SaleItem[]          link to Gem or GemParcel with price/qty
```

### Key Design Decisions

**PublicToken is separate from entity ID**
The gem's database GUID is never exposed in public URLs. Each gem/parcel has a separate `PublicToken` UUID. This prevents enumeration attacks and allows token rotation without changing the gem's identity.

**Soft delete everywhere**
Nothing is ever hard-deleted. `IsDeleted = true` + global EF query filter. This design choice supports future offline MAUI sync (which needs tombstones to sync deletions).

**GemAttribute as JSONB**
Gem-type-specific fields (dimensions, weight, carat, cut grade) are stored in a PostgreSQL JSONB column rather than a wide table with many nullable columns. Avoids EAV complexity while keeping the schema flexible.

**GemVocabulary in database**
Species, varieties, colors, cuts, shapes, clarities, and treatments are stored in a `GemVocabulary` table (not hardcoded enums). This allows admins to add new values without a code deploy. The seeded data comes from mineralogical constants in `frontend/lib/gem-options.ts`.

**Varieties linked to parent species**
Each variety has a `ParentValue` (e.g. `"Corundum"`) so the frontend can filter varieties dynamically when a species is selected.

---

## Frontend Architecture

The frontend uses **Next.js 16 App Router** with a strict server/client boundary:

```
app/
├── layout.tsx          ← Root layout (Server Component)
├── dashboard/
│   ├── layout.tsx      ← Dashboard shell — sidebar, email banner (Server Component)
│   ├── page.tsx        ← Dashboard home with SSR data fetch (Server Component)
│   └── gems/
│       ├── page.tsx    ← SSR list page (Server Component, fetches data)
│       └── [id]/
│           ├── page.tsx   ← SSR detail page (Server Component)
│           └── edit/
│               ├── page.tsx   ← Server Component (fetches initial data)
│               └── form.tsx   ← Client Component ("use client", useActionState)
```

### Server vs Client Components

**Server Components** (default in App Router):
- Run on the server, have direct access to cookies and can call `authHeader()`
- Fetch data from the API using `INTERNAL_API_URL` (container-to-container in Docker)
- Pass data down as props to Client Components
- Cannot use `useState`, `useEffect`, browser APIs

**Client Components** (`"use client"` directive):
- Run in the browser for interactivity
- Use `useActionState` to wire Server Actions to forms
- Cannot `import` async Server Components directly — receive them as `ReactNode` props

### Server Actions
All data mutations go through Server Actions (`lib/*-actions.ts`). They:
1. Read form data on the server
2. Add the auth header from the httpOnly cookie
3. Call the API
4. Return `{ id?, error? }` (never `redirect()` inside `useActionState`)
5. The Client Component navigates via `useRouter().push()` on success

### Auth Flow (Frontend)
- Login → Server Action → API returns JWT + refresh token → stored in httpOnly cookies
- All subsequent requests → Server Action reads cookie → adds `Authorization: Bearer {token}` header
- The JWT **never touches client-side JavaScript**
- Token refresh happens server-side when the API returns 401

### SSR API Calls in Docker
When Next.js SSR runs inside Docker, it cannot reach `localhost:5000`. It uses:
- `INTERNAL_API_URL=http://api:5000` (container-to-container, set in docker-compose)
- `NEXT_PUBLIC_API_URL=http://localhost/api` (browser requests, through nginx)

This is handled in `frontend/lib/server-utils.ts`:
```typescript
export function baseUrl() {
  return process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
}
```

---

## Infrastructure: Docker Services

| Service | Image | Internal Port | Purpose |
|---------|-------|--------------|---------|
| `db` | postgres:16-alpine | 5432 | PostgreSQL database |
| `minio` | minio/minio:latest | 9000, 9001 | S3-compatible object storage + admin console |
| `api` | Custom (Dockerfile.api) | 5000 | ASP.NET Core 10 REST API |
| `frontend` | Custom (Dockerfile.frontend) | 3000 | Next.js 16 standalone SSR server |
| `nginx` | nginx:1.27-alpine | 80, 443 | Reverse proxy, SSL termination, JSON access logs |
| `seq` | datalust/seq:latest | 5341, 80 | Structured log ingestion + search UI |
| `backup` | postgres:16-alpine | — | Daily pg_dump with 7-day retention |

### nginx Routing
```
/api/*    →  http://api:5000/         (strips /api prefix)
/         →  http://frontend:3000/    (WebSocket upgrade support for HMR)
```

nginx also:
- Forwards `X-Correlation-ID` header to the API (so the same correlation ID appears in both nginx access logs and Seq)
- Writes JSON-formatted access logs (parseable if needed)
- Sets security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy`, `Strict-Transport-Security`

---

## Observability Architecture

Every API request gets a `X-Correlation-ID` header (generated if not provided by the caller). This ID flows:

1. **nginx** — logs it in the JSON access log
2. **CorrelationIdMiddleware** — pushes it to Serilog `LogContext`
3. **Serilog** — attaches `CorrelationId` to every log event for that request
4. **Seq** — stores all events; filter `CorrelationId = 'some-uuid'` to see the full trace of one request

Every request log also includes:
- `UserId` — the authenticated user's GUID (or `"anonymous"`)
- `StatusCode`, `Elapsed`, `RequestPath`, `RequestMethod`
- `MachineName`, `EnvironmentName`

Health endpoint at `/health` checks both PostgreSQL connectivity (EF Core health check) and MinIO reachability (HTTP ping to `/minio/health/live`).
