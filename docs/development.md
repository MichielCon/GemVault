# GemVault — Development Guide

## Day-to-Day Workflow

### Feature development

```
# Create a feature branch off dev
git checkout dev && git pull
git checkout -b feature/my-feature

# ... make changes ...

# Build and test before pushing
dotnet build src/GemVault.slnx
dotnet test src/GemVault.slnx

# Commit and push
git add <files>
git commit -m "feat: short description"
git push -u origin feature/my-feature

# Open PR into dev on GitHub
```

Never push directly to `dev` or `main`. All changes go through PRs.

### Rebuild after code changes

Docker containers do **not** hot-reload — you must rebuild images after every code change.

```bash
# Backend change
docker compose build api && docker compose up -d api

# Frontend change
docker compose build frontend && docker compose up -d frontend

# Both
docker compose build api frontend && docker compose up -d api frontend
```

`docker compose up -d` alone only restarts containers; it does not rebuild images.

---

## Backend Patterns

### Adding a new endpoint (CQRS pattern)

Every operation is a MediatR command (mutation) or query (read). The pattern for a new feature is always the same four steps:

**1. Add the command/query in Application:**

```csharp
// src/GemVault.Application/Features/Gems/Commands/ArchiveGemCommand.cs
public record ArchiveGemCommand(Guid GemId) : IRequest<Unit>;

public class ArchiveGemCommandHandler(ApplicationDbContext db, ICurrentUserService currentUser)
    : IRequestHandler<ArchiveGemCommand, Unit>
{
    public async Task<Unit> Handle(ArchiveGemCommand request, CancellationToken cancellationToken)
    {
        var gem = await db.Gems.FindAsync([request.GemId], cancellationToken)
            ?? throw new NotFoundException(nameof(Gem), request.GemId);
        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();
        gem.IsArchived = true;
        await db.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
```

**2. Add a FluentValidation validator (if command has inputs):**

```csharp
public class ArchiveGemCommandValidator : AbstractValidator<ArchiveGemCommand>
{
    public ArchiveGemCommandValidator()
    {
        RuleFor(x => x.GemId).NotEmpty();
    }
}
```

**3. Add the controller action in Api:**

```csharp
[HttpPost("{id}/archive")]
public async Task<IActionResult> Archive(Guid id)
    => Ok(await mediator.Send(new ArchiveGemCommand(id)));
```

**4. Add a migration if the domain model changed:**

```bash
dotnet ef migrations add ArchiveGem \
  --project src/GemVault.Infrastructure \
  --startup-project src/GemVault.Api \
  --output-dir Persistence/Migrations
```

Migrations apply automatically on API startup — no manual step required.

---

### DateTime — always specify UTC

Frontend date pickers send strings like `"2026-03-08"` which deserialize as `DateTime.Kind = Unspecified`. Npgsql rejects these for `timestamp with time zone` columns.

**Always fix in the command handler:**

```csharp
var order = new PurchaseOrder
{
    OrderDate = DateTime.SpecifyKind(request.OrderDate, DateTimeKind.Utc),
};
```

This applies to any date field coming from a form input (`OrderDate`, `IssueDate`, `SaleDate`, etc.). Dates stored in the database or returned from EF Core already have the correct kind.

---

### Custom exceptions → HTTP status codes

Throw domain exceptions — `ExceptionHandlingMiddleware` maps them to the correct HTTP status:

| Exception | Status |
|-----------|--------|
| `NotFoundException` | 404 |
| `ForbiddenException` | 403 |
| `ValidationException` (FluentValidation) | 400 |
| Any other `Exception` | 500 |

The middleware logs 403s as Warning, 400/404 as Debug, and 500s as Error — all with `UserId` and path.

---

### Soft delete

All entities inherit `BaseEntity` which has `IsDeleted`. A global EF query filter applies `WHERE "IsDeleted" = FALSE` automatically on all queries. To delete:

```csharp
gem.IsDeleted = true;
await db.SaveChangesAsync(cancellationToken);
```

There is no hard delete anywhere in the codebase. This is intentional — tombstones are needed for future MAUI offline sync.

---

### Authorization

All controllers inherit the `[Authorize]` attribute from the base class. Per-endpoint overrides:

```csharp
[AllowAnonymous]          // Public endpoints (vocabulary, public scan)
[Authorize(Roles = "Admin")]  // Admin-only endpoints
```

User isolation is enforced in handlers:

```csharp
if (gem.OwnerId != currentUser.UserId)
    throw new ForbiddenException();
```

The `ICurrentUserService` is implemented in Infrastructure and reads `ClaimTypes.NameIdentifier` from the JWT.

---

### EF Core — query patterns

```csharp
// Get by ID with 404 guard
var gem = await db.Gems.FindAsync([id], cancellationToken)
    ?? throw new NotFoundException(nameof(Gem), id);

// Paginated list
var total = await query.CountAsync(cancellationToken);
var items = await query
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync(cancellationToken);
return new PagedResult<GemDto>(items, total, page, pageSize);

// Include related data
var gem = await db.Gems
    .Include(g => g.Photos)
    .Include(g => g.Origin)
    .FirstOrDefaultAsync(g => g.Id == id, cancellationToken)
    ?? throw new NotFoundException(nameof(Gem), id);
```

Do not use `Include` for data you don't need — EF generates joins for every include.

---

## Frontend Patterns

### Server Components vs Client Components

**Use a Server Component (default)** when the page just fetches data and renders it:

```tsx
// app/dashboard/gems/page.tsx
export default async function GemsPage() {
  const token = await authHeader();
  const data = await fetchGems(token);
  return <GemList gems={data.items} />;
}
```

**Add `"use client"`** only when you need interactivity (`useState`, `useEffect`, event handlers):

```tsx
"use client";
export function GemForm({ initialData }: Props) {
  const [state, formAction] = useActionState(createGemAction, {});
  // ...
}
```

The pattern for pages that need both: Server Component fetches initial data → passes as props to a Client Component.

---

### Server Actions

All data mutations go through Server Actions in `frontend/lib/*-actions.ts`:

```ts
"use server";
export async function createGemAction(prevState: unknown, formData: FormData) {
  const token = await authHeader();
  const res = await fetch(`${baseUrl()}/api/v1/gems`, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ name: formData.get("name"), ... }),
  });
  if (!res.ok) return { error: await res.text() };
  const gem = await res.json();
  return { id: gem.id };  // Never call redirect() here — causes issues with useActionState
}
```

On success, the Client Component navigates via `useRouter`:

```tsx
const [state, formAction] = useActionState(createGemAction, {});
useEffect(() => {
  if (state.id) router.push(`/dashboard/gems/${state.id}`);
}, [state.id]);
```

**Never call `redirect()` inside a Server Action wired to `useActionState`** — it surfaces as "An unexpected error occurred." instead of navigating.

---

### Line items in forms (hidden inputs)

When a form contains a dynamic list of items (order items, sale items), use React-controlled hidden inputs — one per field per item:

```tsx
{items.map((item) => (
  <Fragment key={item.key}>
    <input type="hidden" name="item_gemId" value={item.gemId ?? ""} />
    <input type="hidden" name="item_costPrice" value={item.costPrice} />
    <input type="hidden" name="item_notes" value={item.notes ?? ""} />
  </Fragment>
))}
```

In the Server Action:

```ts
const gemIds = formData.getAll("item_gemId") as string[];
const prices = formData.getAll("item_costPrice") as string[];
```

**Do not** put a single JSON blob in a hidden input and mutate the DOM in `onSubmit`. React snapshots `FormData` before `onSubmit` fires — DOM mutations don't appear in `formData`.

---

### Inline entity creation

When creating a related entity from within a form (e.g. adding a new supplier from the order form):

```tsx
async function handleCreateSupplier() {
  const result = await createSupplierAction({ name, contactInfo });
  if (result.error) { setError(result.error); return; }
  setSelectedSupplierId(result.entity!.id);
}
```

Call the Server Action directly as an async function — not via `useActionState`. Return `{ entity, error }` — do not redirect.

---

### Auth in frontend

- On every Server Action: `const token = await authHeader()` — reads the httpOnly cookie and returns `"Bearer {jwt}"`
- The JWT **never** appears in client-side JavaScript
- Token refresh is handled server-side: if the API returns 401, `authHeader()` calls the refresh endpoint and retries
- Route protection: `frontend/proxy.ts` middleware redirects unauthenticated requests to `/auth/login`

---

### SSR and Docker

Next.js SSR runs inside Docker and **cannot** reach `localhost:5000`. All server-side fetches use `INTERNAL_API_URL=http://api:5000` (container-to-container). Browser fetches use `NEXT_PUBLIC_API_URL=http://localhost/api` (through nginx).

```ts
// frontend/lib/server-utils.ts
export function baseUrl() {
  return process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
}
```

Always use `baseUrl()` in Server Actions and Server Components. Never hardcode `localhost:5000` in the frontend.

---

## Vocabulary System

Gem attributes (species, variety, colour, cut, shape, clarity, treatment) are stored in the `GemVocabulary` table — not hardcoded enums.

**Reading vocabulary in a form:**

```tsx
// Server Component fetches vocabulary and passes to client
const species = await fetchVocabulary("species");
const varieties = await fetchVocabulary("variety");
return <GemForm species={species} varieties={varieties} />;
```

**API:**
```
GET /api/v1/vocabulary/{field}               → all values for field
GET /api/v1/vocabulary/{field}?parentValue=X → filtered (e.g. varieties for a species)
```

Fields: `species`, `variety`, `color`, `cut`, `shape`, `clarity`, `treatment`

Varieties have a `ParentValue` (e.g. `"Corundum"`) — filter client-side when a species is selected:

```ts
const filtered = varieties.filter(v => v.parentValue === selectedSpecies);
```

---

## Database Migrations

```bash
# Add a new migration
dotnet ef migrations add MigrationName \
  --project src/GemVault.Infrastructure \
  --startup-project src/GemVault.Api \
  --output-dir Persistence/Migrations

# Verify the generated SQL (always check before committing)
dotnet ef migrations script --idempotent \
  --project src/GemVault.Infrastructure \
  --startup-project src/GemVault.Api
```

Migrations apply automatically on API startup. There is no manual `database update` step in the deployment flow.

**Migration naming convention:** `PascalCase` describing what changed — e.g. `AddGemSourceParcel`, `MakeCertificateGemIdNonNullable`.

**Current migrations:**
| Migration | Description |
|-----------|-------------|
| `20260307124736_InitialSchema` | All 12 core entities + ASP.NET Identity tables |
| `20260307144256_AddGemVocabulary` | GemVocabulary table + seed data (29 species, ~75 varieties, etc.) |
| `20260309170558_MakeCertificateGemIdNonNullable` | Certificate.GemId made non-nullable |
| `20260324194125_AddGemSourceParcel` | Gem.SourceParcelId nullable FK to GemParcel (split workflow) |

---

## Key Gotchas

1. **DateTime.Kind** — all DateTime values from form inputs must be wrapped with `DateTime.SpecifyKind(value, DateTimeKind.Utc)` in the command handler. Npgsql rejects `Kind=Unspecified` for `timestamp with time zone`.

2. **Server Actions + redirect()** — never call `redirect()` inside a Server Action wired to `useActionState`. Return `{id, error}` instead and navigate client-side via `useRouter`.

3. **Frontend rebuild** — always `docker compose build frontend && docker compose up -d frontend` after frontend code changes. `up -d` alone does not rebuild.

4. **SSR in Docker** — use `baseUrl()` from `server-utils.ts` for all server-side API calls. It returns `http://api:5000` inside Docker.

5. **Soft delete** — never hard-delete entities. Set `IsDeleted = true`. The global EF query filter hides deleted records automatically.

6. **PublicToken is separate from entity ID** — the gem's database GUID is never exposed in public URLs. Use `PublicToken.Token` for QR codes and scan links.

7. **Enums in JSON** — the API is configured with `JsonStringEnumConverter`. All enum values are serialized as strings (e.g. `"Admin"` not `2`). When deserializing API responses in tests, use `JsonOptions` from `IntegrationTestBase`.

8. **Mock DbSet in unit tests** — call `list.BuildMockDbSet()`, not `list.AsQueryable().BuildMockDbSet()`. The `.AsQueryable()` call returns a plain `IQueryable` that loses the mock's async provider.
