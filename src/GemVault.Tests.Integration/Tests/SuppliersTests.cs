using GemVault.Application.Suppliers.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class SuppliersTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task CreateSupplier_Returns201()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/suppliers",
            new { name = "Test Supplier", email = "supplier@test.com" });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var supplier = await res.Content.ReadFromJsonAsync<SupplierDto>(JsonOptions);
        Assert.NotNull(supplier);
        Assert.Equal("Test Supplier", supplier.Name);
        Assert.NotEqual(Guid.Empty, supplier.Id);
    }

    [Fact]
    public async Task GetSuppliers_ReturnsOnlyOwned()
    {
        // User A creates a supplier
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        await Client.PostAsJsonAsync("/api/v1/suppliers", new { name = "Supplier A" });

        // User B creates a supplier and lists
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        await Client.PostAsJsonAsync("/api/v1/suppliers", new { name = "Supplier B" });

        var res = await Client.GetAsync("/api/v1/suppliers");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var list = await res.Content.ReadFromJsonAsync<List<SupplierDto>>(JsonOptions);
        Assert.NotNull(list);
        Assert.Single(list);
        Assert.Equal("Supplier B", list[0].Name);
    }

    [Fact]
    public async Task DeleteSupplier_Returns204()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/suppliers", new { name = "Delete Me" });
        var created = await createRes.Content.ReadFromJsonAsync<SupplierDto>(JsonOptions);

        var deleteRes = await Client.DeleteAsync($"/api/v1/suppliers/{created!.Id}");

        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);
    }

    [Fact]
    public async Task UpdateSupplier_Returns200WithUpdatedName()
    {
        await AuthenticateAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/suppliers",
            new { name = "Original Name", email = "orig@test.com" });
        var created = await createRes.Content.ReadFromJsonAsync<SupplierDto>(JsonOptions);

        var updateRes = await Client.PutAsJsonAsync($"/api/v1/suppliers/{created!.Id}",
            new { id = created.Id, name = "Updated Name", email = "orig@test.com" });

        Assert.Equal(HttpStatusCode.OK, updateRes.StatusCode);
        var updated = await updateRes.Content.ReadFromJsonAsync<SupplierDto>(JsonOptions);
        Assert.NotNull(updated);
        Assert.Equal("Updated Name", updated.Name);
        Assert.Equal(created.Id, updated.Id);
    }

    [Fact]
    public async Task UpdateSupplier_OtherUsersSupplier_Returns403()
    {
        // User A creates a supplier
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        var createRes = await Client.PostAsJsonAsync("/api/v1/suppliers", new { name = "User A Supplier" });
        var created = await createRes.Content.ReadFromJsonAsync<SupplierDto>(JsonOptions);

        // User B tries to update User A's supplier
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        var updateRes = await Client.PutAsJsonAsync($"/api/v1/suppliers/{created!.Id}",
            new { id = created.Id, name = "Hijacked Name" });

        Assert.Equal(HttpStatusCode.Forbidden, updateRes.StatusCode);
    }
}
