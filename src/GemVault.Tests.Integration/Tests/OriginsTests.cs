using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class OriginsTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    private record OriginResult(Guid Id, string Country, string? Locality, int GemCount, int ParcelCount);

    [Fact]
    public async Task GetOrigins_Unauthenticated_Returns200()
    {
        // Origins list is AllowAnonymous — no token required
        var res = await Client.GetAsync("/api/v1/origins");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var list = await res.Content.ReadFromJsonAsync<List<OriginResult>>(JsonOptions);
        Assert.NotNull(list);
    }

    [Fact]
    public async Task CreateOrigin_Authenticated_Returns201()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/origins",
            new { country = "Colombia", locality = "Muzo" });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var origin = await res.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);
        Assert.NotNull(origin);
        Assert.Equal("Colombia", origin.Country);
        Assert.Equal("Muzo", origin.Locality);
        Assert.NotEqual(Guid.Empty, origin.Id);
    }

    [Fact]
    public async Task CreateOrigin_Unauthenticated_Returns401()
    {
        var res = await Client.PostAsJsonAsync("/api/v1/origins",
            new { country = "Myanmar" });

        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task CreateOrigin_MissingCountry_Returns400()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/origins",
            new { country = "" });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task GetOrigins_AfterCreate_ContainsNewOrigin()
    {
        await AuthenticateAsync();

        await Client.PostAsJsonAsync("/api/v1/origins",
            new { country = "Sri Lanka", locality = "Ratnapura" });

        var res = await Client.GetAsync("/api/v1/origins");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var list = await res.Content.ReadFromJsonAsync<List<OriginResult>>(JsonOptions);
        Assert.NotNull(list);
        Assert.Contains(list, o => o.Country == "Sri Lanka" && o.Locality == "Ratnapura");
    }

    [Fact]
    public async Task GetByCountry_ReturnsMatchingOrigins()
    {
        // Sri Lanka is seeded — should be in the list
        var res = await Client.GetAsync("/api/v1/origins/by-country?country=Sri+Lanka");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var list = await res.Content.ReadFromJsonAsync<List<OriginResult>>(JsonOptions);
        Assert.NotNull(list);
        Assert.All(list, o => Assert.Equal("Sri Lanka", o.Country));
        // Seeded localities include Ratnapura and Elahera
        Assert.Contains(list, o => o.Locality == "Ratnapura");
        Assert.Contains(list, o => o.Locality == "Elahera");
    }

    [Fact]
    public async Task FindOrCreate_ExistingOrigin_ReturnsSame()
    {
        await AuthenticateAsync();

        // Colombia / Muzo is seeded
        var res1 = await Client.PostAsJsonAsync("/api/v1/origins/find-or-create",
            new { country = "Colombia", locality = "Muzo" });
        Assert.Equal(HttpStatusCode.OK, res1.StatusCode);
        var o1 = await res1.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);

        var res2 = await Client.PostAsJsonAsync("/api/v1/origins/find-or-create",
            new { country = "Colombia", locality = "Muzo" });
        Assert.Equal(HttpStatusCode.OK, res2.StatusCode);
        var o2 = await res2.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);

        Assert.NotNull(o1);
        Assert.NotNull(o2);
        Assert.Equal(o1.Id, o2.Id);
    }

    [Fact]
    public async Task FindOrCreate_NewOrigin_CreatesIt()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/origins/find-or-create",
            new { country = "France", locality = "Provence" });

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var origin = await res.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);
        Assert.NotNull(origin);
        Assert.Equal("France", origin.Country);
        Assert.Equal("Provence", origin.Locality);
        Assert.NotEqual(Guid.Empty, origin.Id);
    }

    [Fact]
    public async Task FindOrCreate_Unauthenticated_Returns401()
    {
        var res = await Client.PostAsJsonAsync("/api/v1/origins/find-or-create",
            new { country = "Myanmar" });

        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task UpdateOrigin_NonAdmin_Returns403()
    {
        // Create an origin first (any authenticated user can do this)
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/origins",
            new { country = "Brazil" });
        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);
        var created = await createRes.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);
        Assert.NotNull(created);

        // The same Collector-role user attempts to update — must be rejected
        var updateRes = await Client.PutAsJsonAsync($"/api/v1/origins/{created.Id}",
            new { country = "Brazil Updated" });

        Assert.Equal(HttpStatusCode.Forbidden, updateRes.StatusCode);
    }

    [Fact]
    public async Task DeleteOrigin_NonAdmin_Returns403()
    {
        // Create an origin first (any authenticated user can do this)
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/origins",
            new { country = "Tanzania" });
        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);
        var created = await createRes.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);
        Assert.NotNull(created);

        // The same Collector-role user attempts to delete — must be rejected
        var deleteRes = await Client.DeleteAsync($"/api/v1/origins/{created.Id}");

        Assert.Equal(HttpStatusCode.Forbidden, deleteRes.StatusCode);
    }
}
