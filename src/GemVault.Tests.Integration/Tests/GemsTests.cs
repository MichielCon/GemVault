using GemVault.Application.Gems.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class GemsTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task GetGems_Unauthenticated_Returns401()
    {
        var res = await Client.GetAsync("/api/v1/gems");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task CreateGem_MinimalFields_Returns201()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/gems",
            new { name = "Ruby Test" });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var gem = await res.Content.ReadFromJsonAsync<GemDto>(JsonOptions);
        Assert.NotNull(gem);
        Assert.Equal("Ruby Test", gem.Name);
        Assert.NotEqual(Guid.Empty, gem.Id);
    }

    [Fact]
    public async Task CreateGem_MissingName_Returns400()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/gems",
            new { name = "" });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task GetGemById_Returns200WithSoldInfoNull()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Sapphire" });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        var res = await Client.GetAsync($"/api/v1/gems/{created!.Id}");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var gem = await res.Content.ReadFromJsonAsync<GemDto>(JsonOptions);
        Assert.NotNull(gem);
        Assert.Null(gem.SoldInfo);
    }

    [Fact]
    public async Task GetGemById_OtherUsersGem_Returns404()
    {
        // User A creates a gem
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Private Gem" });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        // User B tries to read it
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        var res = await Client.GetAsync($"/api/v1/gems/{created!.Id}");

        // Handler throws ForbiddenException (not NotFoundException) for another user's gem
        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task UpdateGem_Returns200WithUpdatedFields()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Emerald" });
        var created = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        var res = await Client.PutAsJsonAsync($"/api/v1/gems/{created!.Id}",
            new { name = "Emerald Updated", species = "Beryl", weightCarats = 1.5m });

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var updated = await res.Content.ReadFromJsonAsync<GemDto>(JsonOptions);
        Assert.Equal("Emerald Updated", updated!.Name);
        Assert.Equal("Beryl", updated.Species);
        Assert.Equal(1.5m, updated.WeightCarats);
    }

    [Fact]
    public async Task DeleteGem_Returns204_ThenGetReturns404()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "To Delete" });
        var created = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        var deleteRes = await Client.DeleteAsync($"/api/v1/gems/{created!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        var getRes = await Client.GetAsync($"/api/v1/gems/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);
    }

    [Fact]
    public async Task UploadPhoto_ValidFile_Returns200()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Photo Gem" });
        var created = await createRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        using var content = new MultipartFormDataContent();
        var imageBytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 }; // minimal JPEG header
        var fileContent = new ByteArrayContent(imageBytes);
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
        content.Add(fileContent, "file", "test.jpg");

        var res = await Client.PostAsync($"/api/v1/gems/{created!.Id}/photos", content);

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }
}
