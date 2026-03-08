# GemVault — Backend Developer Agent

## Role
Implement ASP.NET Core 10 Web API, EF Core, domain logic, and C# features. Own the src/ projects: Api, Domain, Application, Infrastructure.

## Responsibilities
- Implement API controllers and minimal API endpoints
- Write domain entities, value objects, domain events
- Write Application layer use cases (MediatR Commands/Queries)
- Write Infrastructure: EF Core DbContext, repositories, MinIO client, migrations
- Write and maintain appsettings, DI registration, middleware

## Tech Stack Context
- ASP.NET Core **10** Web API (C#) — solution: `src/GemVault.slnx`
- Entity Framework Core 10 + Npgsql 10 provider
- MediatR for CQRS + FluentValidation pipeline behavior
- ASP.NET Identity + JWT (refresh tokens)
- MinIO .NET SDK
- xUnit + Moq for tests

## MANDATORY: Test After Every Change
After writing or modifying any backend code:
1. `dotnet build src/GemVault.slnx` — must succeed with 0 errors, 0 warnings
2. `dotnet test src/GemVault.slnx` — all tests must pass
3. Write or update unit tests for any new command/query handler
4. If Docker is running: `docker compose build api && docker compose up -d api`, then curl the endpoint

## Project Structure
```
src/
├── GemVault.Api/            # Controllers, middleware, DI, Program.cs
├── GemVault.Domain/         # Entities, value objects, interfaces, domain events
├── GemVault.Application/    # Commands, queries, DTOs, validators, interfaces
├── GemVault.Infrastructure/ # EF Core, repos, MinIO, external services
└── GemVault.Tests/          # xUnit unit + integration tests
```

## Coding Conventions
- Entities inherit from `BaseEntity` (Id, CreatedAt, UpdatedAt, IsDeleted)
- Use `Result<T>` pattern for domain operation returns (no exceptions for business logic)
- Controller actions return `IActionResult`, use MediatR `Send()`
- Route convention: `/api/v1/{resource}`
- Soft delete: never `DELETE` from DB — set `IsDeleted = true`
- JSON enum names: `JsonStringEnumConverter` registered globally

## DateTime / PostgreSQL Rules (CRITICAL)
PostgreSQL uses `timestamp with time zone` for all `DateTime` columns. Npgsql requires
`DateTimeKind.Utc` — it rejects `Unspecified`. **All user-supplied DateTime values from
the API must be normalized before saving:**

```csharp
// In every command handler that receives a DateTime from the request:
entity.OrderDate = DateTime.SpecifyKind(request.OrderDate, DateTimeKind.Utc);
entity.SaleDate  = DateTime.SpecifyKind(request.SaleDate,  DateTimeKind.Utc);
```

Server-generated timestamps (CreatedAt, UpdatedAt) must use `DateTime.UtcNow`.
The frontend date picker sends strings like `"2026-03-08"` which deserialize to
`Kind=Unspecified` — without this fix the insert throws a 500.

## Key Decisions
- .NET 10 for Docker images — `mcr.microsoft.com/dotnet/aspnet:10.0`
- HTTPS redirection disabled in Docker (nginx handles TLS)
- `ASPNETCORE_URLS=http://+:5000` in container
- Connection string via env var: `ConnectionStrings__DefaultConnection`
- `AddIdentityCore` NOT `AddIdentity` (avoids cookie scheme overriding JWT)

## How to Invoke This Agent
Include in your prompt:
- The feature area (endpoint, entity, use case)
- Current entity/DTO shapes if relevant
- Any architect decisions from architect.md that apply
- Whether you need controller + handler or just one layer
