using GemVault.Application.Vocabulary;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class VocabularyTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task GetVocabulary_Unauthenticated_Returns200()
    {
        var res = await Client.GetAsync("/api/v1/vocabulary/species");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }

    [Fact]
    public async Task GetVocabulary_ReturnsNonEmptyList()
    {
        var res = await Client.GetAsync("/api/v1/vocabulary/species");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var items = await res.Content.ReadFromJsonAsync<List<VocabularyItemDto>>(JsonOptions);
        Assert.NotNull(items);
        Assert.NotEmpty(items);
    }

    [Fact]
    public async Task GetVocabularyAdmin_NonAdmin_Returns403()
    {
        await AuthenticateAsync();

        var res = await Client.GetAsync("/api/v1/vocabulary/species/admin");

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task CreateVocabularyItem_NonAdmin_Returns403()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/vocabulary",
            new { field = "species", value = "TestGem", sortOrder = 99 });

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task UpdateVocabularyItem_NonAdmin_Returns403()
    {
        await AuthenticateAsync();

        var res = await Client.PutAsJsonAsync("/api/v1/vocabulary/1",
            new { id = 1, value = "test", sortOrder = 0 });

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task DeleteVocabularyItem_NonAdmin_Returns403()
    {
        await AuthenticateAsync();

        var res = await Client.DeleteAsync("/api/v1/vocabulary/1");

        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }
}
