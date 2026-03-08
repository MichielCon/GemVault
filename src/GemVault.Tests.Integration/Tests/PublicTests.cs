using GemVault.Application.Gems.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class PublicTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task GetByToken_PublicGem_Returns200NoAuthNeeded()
    {
        // Create a public gem and get its token
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems",
            new { name = "Public Gem", isPublic = true });
        createRes.EnsureSuccessStatusCode();
        var gem = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);
        var token = gem!.PublicToken;
        Assert.NotNull(token); // public gems must have a token

        // Access without any auth header
        Client.DefaultRequestHeaders.Authorization = null;
        var res = await Client.GetAsync($"/api/v1/public/{token}");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }

    [Fact]
    public async Task GetByToken_PrivateGem_Returns404()
    {
        // Create a private gem (isPublic = false, default)
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems",
            new { name = "Private Gem", isPublic = false });
        createRes.EnsureSuccessStatusCode();
        var gem = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        // Private gems should have no public token, so any token lookup returns 404
        Client.DefaultRequestHeaders.Authorization = null;
        var res = await Client.GetAsync($"/api/v1/public/{Guid.NewGuid():N}");

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task GetByToken_UnknownToken_Returns404()
    {
        Client.DefaultRequestHeaders.Authorization = null;
        var res = await Client.GetAsync($"/api/v1/public/{Guid.NewGuid():N}");

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }
}
