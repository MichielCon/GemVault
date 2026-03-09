using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class OriginsTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    private record OriginResult(Guid Id, string Country, string? Mine, string? Region, int GemCount, int ParcelCount);

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
            new { country = "Colombia", mine = "Muzo", region = "Boyacá" });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var origin = await res.Content.ReadFromJsonAsync<OriginResult>(JsonOptions);
        Assert.NotNull(origin);
        Assert.Equal("Colombia", origin.Country);
        Assert.Equal("Muzo", origin.Mine);
        Assert.Equal("Boyacá", origin.Region);
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
            new { country = "Sri Lanka", mine = "Ratnapura" });

        var res = await Client.GetAsync("/api/v1/origins");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var list = await res.Content.ReadFromJsonAsync<List<OriginResult>>(JsonOptions);
        Assert.NotNull(list);
        Assert.Contains(list, o => o.Country == "Sri Lanka" && o.Mine == "Ratnapura");
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
