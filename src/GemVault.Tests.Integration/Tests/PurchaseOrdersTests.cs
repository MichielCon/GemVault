using GemVault.Application.Common.Models;
using GemVault.Application.PurchaseOrders.DTOs;
using GemVault.Application.Suppliers.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class PurchaseOrdersTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    private async Task<SupplierDto> CreateSupplierAsync(string name = "Test Supplier")
    {
        var res = await Client.PostAsJsonAsync("/api/v1/suppliers", new { name });
        res.EnsureSuccessStatusCode();
        return (await res.Content.ReadFromJsonAsync<SupplierDto>(JsonOptions))!;
    }

    [Fact]
    public async Task CreateOrder_Returns201()
    {
        await AuthenticateAsync();
        var supplier = await CreateSupplierAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            reference = "PO-001",
            orderDate = "2026-03-08",
            supplierId = supplier.Id,
            items = new[] { new { costPrice = 150.00m, notes = "Test item" } },
        });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var order = await res.Content.ReadFromJsonAsync<PurchaseOrderDto>(JsonOptions);
        Assert.NotNull(order);
        Assert.Equal("PO-001", order.Reference);
        Assert.Equal(150.00m, order.TotalCost);
    }

    [Fact]
    public async Task CreateOrder_DatePickerString_PersistsAsUtc()
    {
        // Regression test: "2026-03-08" (date-only string) used to crash with
        // "Cannot write DateTimeKind.Unspecified with timestamptz" from Npgsql.
        await AuthenticateAsync();
        var supplier = await CreateSupplierAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            orderDate = "2026-03-08",
            supplierId = supplier.Id,
            items = new[] { new { costPrice = 100.00m } },
        });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var order = await res.Content.ReadFromJsonAsync<PurchaseOrderDto>(JsonOptions);

        // Verify the DateTime was stored and retrieved as UTC
        using var db = CreateDbContext();
        var persisted = await db.PurchaseOrders
            .IgnoreQueryFilters()
            .FirstAsync(o => o.Id == order!.Id);
        Assert.Equal(DateTimeKind.Utc, persisted.OrderDate.Kind);
    }

    [Fact]
    public async Task CreateOrder_UnknownSupplier_Returns404()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            orderDate = "2026-03-08",
            supplierId = Guid.NewGuid(),
            items = new[] { new { costPrice = 100.00m } },
        });

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task CreateOrder_OtherUsersSupplier_Returns404()
    {
        // User A creates a supplier
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        var supplier = await CreateSupplierAsync("A's Supplier");

        // User B tries to create an order with A's supplier
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        var res = await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            orderDate = "2026-03-08",
            supplierId = supplier.Id,
            items = new[] { new { costPrice = 100.00m } },
        });

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task GetOrders_ReturnsOnlyOwnedOrders()
    {
        // User A creates an order
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        var supplierA = await CreateSupplierAsync("A's Supplier");
        await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            orderDate = "2026-03-08",
            supplierId = supplierA.Id,
            items = new[] { new { costPrice = 50m } },
        });

        // User B creates an order and lists
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        var supplierB = await CreateSupplierAsync("B's Supplier");
        await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            orderDate = "2026-03-08",
            supplierId = supplierB.Id,
            items = new[] { new { costPrice = 75m } },
        });

        var res = await Client.GetAsync("/api/v1/purchase-orders");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var paged = await res.Content.ReadFromJsonAsync<PagedResult<PurchaseOrderSummaryDto>>(JsonOptions);
        Assert.NotNull(paged);
        Assert.Single(paged.Items);
        Assert.Equal("B's Supplier", paged.Items[0].SupplierName);
    }

    [Fact]
    public async Task DeleteOrder_Returns204_ThenGetReturns404()
    {
        await AuthenticateAsync();
        var supplier = await CreateSupplierAsync();
        var createRes = await Client.PostAsJsonAsync("/api/v1/purchase-orders", new
        {
            orderDate = "2026-03-08",
            supplierId = supplier.Id,
            items = new[] { new { costPrice = 100m } },
        });
        var order = await createRes.Content.ReadFromJsonAsync<PurchaseOrderDto>(JsonOptions);

        var deleteRes = await Client.DeleteAsync($"/api/v1/purchase-orders/{order!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        var getRes = await Client.GetAsync($"/api/v1/purchase-orders/{order.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);
    }
}
