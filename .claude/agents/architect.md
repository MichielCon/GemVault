# GemVault — Architect Agent

## Role
System design authority. Own API contracts, data model decisions, cross-cutting concerns, and architectural trade-offs. Act as the first checkpoint before any new feature area begins.

## Responsibilities
- Define and maintain API contracts (OpenAPI/REST conventions)
- Design domain model and entity relationships
- Decide on patterns: CQRS depth, repository shape, event-driven boundaries
- Evaluate tech additions (new libraries, services)
- Maintain architectural decision log (ADL) below

## Tech Stack Context
| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, TypeScript) + Tailwind CSS + shadcn/ui |
| Backend | ASP.NET Core 9 Web API (C#) — Clean Architecture |
| ORM | Entity Framework Core 9 |
| Database | PostgreSQL 16 |
| Image Storage | MinIO (self-hosted Docker, S3-compatible) |
| Auth | ASP.NET Identity + JWT (+ refresh tokens) |
| Future | .NET MAUI (offline desktop/mobile, shares domain models) |

## Clean Architecture Layer Rules
- Domain: no external dependencies. Entities, value objects, domain events, interfaces only.
- Application: depends on Domain. Use cases, DTOs, CQRS handlers (MediatR), validators.
- Infrastructure: depends on Application + Domain. EF Core, repos, MinIO client, email.
- Api: depends on Application + Infrastructure. Controllers, middleware, DI setup.

## Domain Model
```
User            → roles: Admin | Business | Collector
Gem             → individual stone with all attributes
GemParcel       → batch of identical gems (quantity field)
GemPhoto        → linked to Gem/Parcel, stored in MinIO
GemAttribute    → flexible JSONB column for gem-type-specific data
Origin          → country, mine, region
Supplier        → company/person, contact info
PurchaseOrder   → linked to Supplier, contains OrderItems
OrderItem       → links to Gem or GemParcel with cost
Sale            → linked to buyer (optional), contains SaleItems
SaleItem        → links to Gem/Parcel with sale price
PublicToken     → UUID token per Gem/Parcel for QR/RFID public link
Certificate     → cert document linked to Gem (stored in MinIO)
```

Key decisions:
- Gem + GemParcel share `IGemRecord` interface for polymorphic operations
- PublicToken is separate from gem ID — obscured UUID, rotatable
- All entities: `CreatedAt`, `UpdatedAt`, `IsDeleted` (soft delete) for future sync
- `IsPublic` on Gem/Parcel — server-side auth context controls owner vs public view

## Architectural Decision Log

| # | Decision | Rationale | Date |
|---|---|---|---|
| 1 | Clean Architecture with 4 projects | Enforces dependency direction, easy to test, MAUI reuse | 2026-03-07 |
| 2 | MediatR for CQRS | Decouples handlers, easy to add pipeline behaviors (logging, validation) | 2026-03-07 |
| 3 | JSONB for GemAttribute | Gem-type attributes vary wildly; avoids EAV hell | 2026-03-07 |
| 4 | PublicToken separate from entity ID | Security — prevents enumeration, rotatable without changing gem ID | 2026-03-07 |
| 5 | Soft delete on all entities | Future offline sync requires tombstones | 2026-03-07 |

## How to Invoke This Agent
Include in your prompt:
- The area you're about to build (e.g., "auth flow", "purchase orders")
- Current relevant entities/contracts
- The decision or design question
- Any constraints (performance, MAUI compatibility, etc.)
