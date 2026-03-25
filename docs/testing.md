# GemVault — Testing

## Running Tests

```bash
# All tests (unit + integration)
dotnet test src/GemVault.slnx

# Unit tests only (fast, no Docker required)
dotnet test src/GemVault.Tests

# Integration tests only (requires Docker Desktop running)
dotnet test src/GemVault.Tests.Integration

# Run a specific test by name
dotnet test src/GemVault.slnx --filter "FullyQualifiedName~CreateGem"

# Run with verbose output
dotnet test src/GemVault.slnx -v normal
```

Integration tests require Docker Desktop — Testcontainers automatically spins up a temporary PostgreSQL container.

---

## Test Projects

### GemVault.Tests (Unit Tests — 26 tests)

Fast tests with no external dependencies. Mocks everything outside the class under test.

**Covers:**
- FluentValidation validators (`RegisterCommandValidator`, `CreateGemCommandValidator`)
- MediatR command handlers (`CreateGemCommandHandler`, `GetGemByIdQueryHandler`)

**Location:** `src/GemVault.Tests/`

### GemVault.Tests.Integration (Integration Tests — 30 tests)

Full pipeline tests against a real PostgreSQL database. Uses `WebApplicationFactory<Program>` to boot the entire ASP.NET Core app in-process.

**Covers:**
- Auth (register, login, refresh, token isolation between users)
- Gems (CRUD, photo upload, user isolation, status filter, pagination)
- Gem Parcels (CRUD, split workflow)
- Certificates (upload, delete)
- Origins (CRUD, map data)
- Vocabulary (read, Admin-only create/update/delete)
- Suppliers (CRUD)
- Purchase Orders (CRUD, DateTime UTC regression)
- Sales (CRUD, DateTime UTC regression, sold-status linking)
- Dashboard (stats endpoint)
- Public scan (token resolution, 404 for missing/private)

**Location:** `src/GemVault.Tests.Integration/`

---

## Integration Test Infrastructure

### DatabaseFixture

One PostgreSQL container is created per `dotnet test` run via Testcontainers (`postgres:16-alpine`). The container is shared across all integration tests via xUnit's `[Collection]` attribute — no per-test container startup overhead.

**Respawn** resets the database between tests by truncating all tables (~50ms). The `GemVocabularies` table is excluded from reset (seed data must persist).

### GemVaultWebApplicationFactory

Overrides the real dependencies with test equivalents:

- **Connection string** — points to the Testcontainers PostgreSQL (not the dev DB)
- **JWT config** — overrides both `JwtOptions` and `JwtBearerOptions` via `PostConfigure` so the same test secret is used for token generation and validation
- **MinIO** — replaced with `Mock<IMinioClient>` and `Mock<IStorageService>` (no file I/O in tests)

> **Critical:** JWT middleware captures the signing key eagerly at startup. Use `PostConfigure<JwtBearerOptions>` AND `PostConfigure<JwtOptions>` to override. `ConfigureAppConfiguration` override alone is not reliable — the options may already be bound.

### IntegrationTestBase

All integration test classes inherit from `IntegrationTestBase`. It provides:

```csharp
// Authenticate as a new random user
await AuthenticateAsync();

// Authenticate and return the token (for multi-user tests)
var token = await RegisterAndLoginAsync("user@test.com");
Authenticate(token);

// Direct DB access for low-level assertions
var db = CreateDbContext();
```

---

## Writing Unit Tests

### Validator test pattern

```csharp
public class CreateGemCommandValidatorTests
{
    private readonly CreateGemCommandValidator _validator = new();

    [Fact]
    public async Task Name_Required()
    {
        var result = await _validator.ValidateAsync(new CreateGemCommand { Name = "" });
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public async Task Valid_Command_Passes()
    {
        var result = await _validator.ValidateAsync(new CreateGemCommand { Name = "Ruby" });
        result.IsValid.Should().BeTrue();
    }
}
```

### Handler test pattern

Mock `ApplicationDbContext` using `MockQueryable`:

```csharp
var gems = new List<Gem> { new() { Id = Guid.NewGuid(), Name = "Ruby", OwnerId = userId } };

// CORRECT — call BuildMockDbSet() directly on the list
var mockSet = gems.BuildMockDbSet();

// WRONG — .AsQueryable() loses the async provider
var mockSet = gems.AsQueryable().BuildMockDbSet();  // DON'T DO THIS

var mockDb = new Mock<ApplicationDbContext>(...);
mockDb.Setup(d => d.Gems).Returns(mockSet.Object);
```

---

## Writing Integration Tests

### Basic CRUD test

```csharp
public class GemsTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task CreateGem_ReturnsId()
    {
        await AuthenticateAsync();
        var res = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Ruby" });
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var id = await res.Content.ReadFromJsonAsync<string>();
        id.Should().NotBeNullOrEmpty();
    }
}
```

### Deserializing API responses

The API serializes enums as strings. Always pass `JsonOptions`:

```csharp
// IntegrationTestBase.JsonOptions has JsonStringEnumConverter
var gem = await res.Content.ReadFromJsonAsync<GemDto>(JsonOptions);
```

### Testing list endpoints

All list endpoints return `PagedResult<T>`, not `List<T>`:

```csharp
var result = await res.Content.ReadFromJsonAsync<PagedResult<GemDto>>(JsonOptions);
result!.Items.Should().HaveCount(1);
result.TotalCount.Should().Be(1);
```

### User isolation test

```csharp
[Fact]
public async Task GetGem_OtherUsersGem_Returns403()
{
    // User A creates a gem
    var tokenA = await RegisterAndLoginAsync();
    Authenticate(tokenA);
    var res = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Ruby" });
    var id = await res.Content.ReadFromJsonAsync<string>();

    // User B tries to access it
    var tokenB = await RegisterAndLoginAsync();
    Authenticate(tokenB);
    var getRes = await Client.GetAsync($"/api/v1/gems/{id}");
    getRes.StatusCode.Should().Be(HttpStatusCode.Forbidden);
}
```

### DateTime UTC regression test

```csharp
[Fact]
public async Task CreateOrder_DatePickerString_PersistsAsUtc()
{
    await AuthenticateAsync();
    var res = await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
    {
        supplierId = ...,
        orderDate = "2026-03-01",  // String as sent by a date picker
        items = Array.Empty<object>()
    });
    res.StatusCode.Should().Be(HttpStatusCode.OK);

    // Verify Kind is UTC in the database
    using var db = CreateDbContext();
    var order = await db.PurchaseOrders.FirstAsync();
    order.OrderDate.Kind.Should().Be(DateTimeKind.Utc);
}
```

---

## Key Regression Tests

These tests guard against specific bugs that were found and fixed. Do not delete them.

| Test | Guard Against |
|------|--------------|
| `CreateOrder_DatePickerString_PersistsAsUtc` | Npgsql rejecting `DateTime.Kind=Unspecified` from JSON date picker strings |
| `CreateSale_DatePickerString_PersistsAsUtc` | Same bug in sale creation |
| `CreateSale_WithGemLinked_GemEndpointReturnsSoldInfo` | Gem `isSold` flag not propagating after sale creation |
| `GetGem_OtherUsersGem_Returns403` | User isolation — ensure gems are not accessible across accounts |

---

## Test Conventions

- **Test names:** `MethodName_Scenario_ExpectedResult` — e.g. `CreateGem_WithoutAuth_Returns401`
- **Assertions:** Use `FluentAssertions` (`should.Be`, `should.HaveCount`, etc.)
- **Arrange / Act / Assert:** Separate sections, blank line between each
- **No shared state:** `Respawn` resets the DB before each test — tests are fully independent
- **No mocking in integration tests:** The whole point is to test the real pipeline. Mock only `IStorageService` (MinIO) to avoid file I/O.

---

## CI Test Execution

Tests run on every PR in GitHub Actions (`ci.yml`):

1. Unit tests run first (no Docker required)
2. Integration tests run next (GitHub Actions runner has Docker available for Testcontainers)
3. Test results uploaded as artifacts

A failed test blocks PR merge.
