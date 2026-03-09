using GemVault.Application.Common.Models;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class GemParcelsTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    // Minimal record for list deserialization — matches GemParcelSummaryDto fields we need
    private record ParcelSummaryDto(Guid Id, string Name, string? Species, int Quantity);

    [Fact]
    public async Task GetParcels_Unauthenticated_Returns401()
    {
        var res = await Client.GetAsync("/api/v1/gem-parcels");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task CreateParcel_MinimalFields_Returns201()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "Ruby Parcel", quantity = 1 });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var parcel = await res.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);
        Assert.NotNull(parcel);
        Assert.Equal("Ruby Parcel", parcel.Name);
        Assert.Equal(1, parcel.Quantity);
        Assert.NotEqual(Guid.Empty, parcel.Id);
    }

    [Fact]
    public async Task CreateParcel_MissingName_Returns400()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "", quantity = 1 });

        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task GetParcelById_Returns200()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "Sapphire Parcel", species = "Corundum", quantity = 5 });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);

        var res = await Client.GetAsync($"/api/v1/gem-parcels/{created!.Id}");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var parcel = await res.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);
        Assert.NotNull(parcel);
        Assert.Equal("Sapphire Parcel", parcel.Name);
        Assert.Equal("Corundum", parcel.Species);
        Assert.Equal(5, parcel.Quantity);
    }

    [Fact]
    public async Task GetParcelById_OtherUsersParcel_Returns404()
    {
        // User A creates a parcel
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        var createRes = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "Private Parcel", quantity = 3 });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);

        // User B tries to read it — handler throws NotFoundException for another user's parcel
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        var res = await Client.GetAsync($"/api/v1/gem-parcels/{created!.Id}");

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task UpdateParcel_Returns200WithUpdatedFields()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "Emerald Parcel", quantity = 2 });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);

        var res = await Client.PutAsJsonAsync($"/api/v1/gem-parcels/{created!.Id}", new
        {
            name = "Emerald Parcel Updated",
            species = "Beryl",
            quantity = 10,
            totalWeightCarats = 5.5m,
            isPublic = false,
        });

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var updated = await res.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);
        Assert.NotNull(updated);
        Assert.Equal("Emerald Parcel Updated", updated.Name);
        Assert.Equal("Beryl", updated.Species);
        Assert.Equal(10, updated.Quantity);
        Assert.Equal(5.5m, updated.TotalWeightCarats);
    }

    [Fact]
    public async Task DeleteParcel_Returns204_ThenGetReturns404()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "To Delete Parcel", quantity = 1 });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);

        var deleteRes = await Client.DeleteAsync($"/api/v1/gem-parcels/{created!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        var getRes = await Client.GetAsync($"/api/v1/gem-parcels/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);
    }

    [Fact]
    public async Task UploadParcelPhoto_ValidFile_Returns200()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/gem-parcels",
            new { name = "Photo Parcel", quantity = 1 });
        createRes.EnsureSuccessStatusCode();
        var created = await createRes.Content.ReadFromJsonAsync<GemParcelDto>(JsonOptions);

        using var content = new MultipartFormDataContent();
        var imageBytes = new byte[] { 0xFF, 0xD8, 0xFF, 0xE0 }; // minimal JPEG header
        var fileContent = new ByteArrayContent(imageBytes);
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
        content.Add(fileContent, "file", "test.jpg");

        var res = await Client.PostAsync($"/api/v1/gem-parcels/{created!.Id}/photos", content);

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
    }
}
