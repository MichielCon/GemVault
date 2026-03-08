using GemVault.Application.Common.Models;
using GemVault.Application.Gems.DTOs;
using GemVault.Application.Sales.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class SalesTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    [Fact]
    public async Task CreateSale_Returns201WithCorrectTotal()
    {
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/sales", new
        {
            saleDate = "2026-03-08",
            buyerName = "Alice",
            items = new[]
            {
                new { quantity = 1, salePrice = 500.00m },
                new { quantity = 2, salePrice = 250.00m },
            },
        });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var sale = await res.Content.ReadFromJsonAsync<SaleDto>(JsonOptions);
        Assert.NotNull(sale);
        Assert.Equal("Alice", sale.BuyerName);
        Assert.Equal(1000.00m, sale.TotalSaleValue);
    }

    [Fact]
    public async Task CreateSale_DatePickerString_PersistsAsUtc()
    {
        // Regression test: "2026-03-08" (date-only string) must not crash with
        // "Cannot write DateTimeKind.Unspecified with timestamptz" from Npgsql.
        await AuthenticateAsync();

        var res = await Client.PostAsJsonAsync("/api/v1/sales", new
        {
            saleDate = "2026-03-08",
            items = new[] { new { quantity = 1, salePrice = 100.00m } },
        });

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var sale = await res.Content.ReadFromJsonAsync<SaleDto>(JsonOptions);

        using var db = CreateDbContext();
        var persisted = await db.Sales
            .IgnoreQueryFilters()
            .FirstAsync(s => s.Id == sale!.Id);
        Assert.Equal(DateTimeKind.Utc, persisted.SaleDate.Kind);
    }

    [Fact]
    public async Task CreateSale_WithGemLinked_GemEndpointReturnsSoldInfo()
    {
        await AuthenticateAsync();

        // Create a gem
        var gemRes = await Client.PostAsJsonAsync("/api/v1/gems", new { name = "Sold Gem" });
        gemRes.EnsureSuccessStatusCode();
        var gem = await gemRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        // Create a sale with that gem
        var saleRes = await Client.PostAsJsonAsync("/api/v1/sales", new
        {
            saleDate = "2026-03-08",
            buyerName = "Bob",
            items = new[] { new { gemId = gem!.Id, quantity = 1, salePrice = 750.00m } },
        });
        saleRes.EnsureSuccessStatusCode();
        var sale = await saleRes.Content.ReadFromJsonAsync<SaleDto>(JsonOptions);

        // Fetch gem — should now have soldInfo populated
        var gemAfterRes = await Client.GetAsync($"/api/v1/gems/{gem.Id}");
        Assert.Equal(HttpStatusCode.OK, gemAfterRes.StatusCode);
        var gemAfter = await gemAfterRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);
        Assert.NotNull(gemAfter);
        Assert.NotNull(gemAfter.SoldInfo);
        Assert.Equal(sale!.Id, gemAfter.SoldInfo.SaleId);
        Assert.Equal(750.00m, gemAfter.SoldInfo.SalePrice);
    }

    [Fact]
    public async Task GetSales_ReturnsOnlyOwnedSales()
    {
        // User A creates a sale
        var tokenA = await RegisterAndLoginAsync();
        Authenticate(tokenA);
        await Client.PostAsJsonAsync("/api/v1/sales", new
        {
            saleDate = "2026-03-08",
            items = new[] { new { quantity = 1, salePrice = 100m } },
        });

        // User B creates a sale and lists
        var tokenB = await RegisterAndLoginAsync();
        Authenticate(tokenB);
        await Client.PostAsJsonAsync("/api/v1/sales", new
        {
            saleDate = "2026-03-08",
            buyerName = "B's Buyer",
            items = new[] { new { quantity = 1, salePrice = 200m } },
        });

        var res = await Client.GetAsync("/api/v1/sales");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var paged = await res.Content.ReadFromJsonAsync<PagedResult<SaleSummaryDto>>(JsonOptions);
        Assert.NotNull(paged);
        Assert.Single(paged.Items);
        Assert.Equal("B's Buyer", paged.Items[0].BuyerName);
    }
}
