using GemVault.Application.Gems.DTOs;
using GemVault.Tests.Integration.Infrastructure;
using System.Net;
using System.Net.Http.Json;

namespace GemVault.Tests.Integration.Tests;

public class DashboardTests(DatabaseFixture fixture) : IntegrationTestBase(fixture)
{
    // Local record matching the fields we need from DashboardStatsDto
    private record StatsDto(
        int GemCount,
        int ParcelCount,
        int ParcelTotalQuantity,
        int UnsoldGemCount,
        int SaleCount,
        decimal TotalPurchaseValue,
        decimal TotalSalesValue,
        decimal NetProfit,
        decimal ProfitMarginPct);

    [Fact]
    public async Task GetStats_Unauthenticated_Returns401()
    {
        var res = await Client.GetAsync("/api/v1/dashboard/stats");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task GetStats_NewUser_ReturnsZeroCounts()
    {
        await AuthenticateAsync();

        var res = await Client.GetAsync("/api/v1/dashboard/stats");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var stats = await res.Content.ReadFromJsonAsync<StatsDto>(JsonOptions);
        Assert.NotNull(stats);
        Assert.Equal(0, stats.GemCount);
        Assert.Equal(0, stats.ParcelCount);
        Assert.Equal(0, stats.UnsoldGemCount);
        Assert.Equal(0, stats.SaleCount);
        Assert.Equal(0m, stats.TotalSalesValue);
        Assert.Equal(0m, stats.NetProfit);
    }

    [Fact]
    public async Task GetStats_WithOneGem_ReturnsGemCount1()
    {
        await AuthenticateAsync();

        var createRes = await Client.PostAsJsonAsync("/api/v1/gems",
            new { name = "Stats Gem", purchasePrice = 100.00m });
        createRes.EnsureSuccessStatusCode();

        var res = await Client.GetAsync("/api/v1/dashboard/stats");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var stats = await res.Content.ReadFromJsonAsync<StatsDto>(JsonOptions);
        Assert.NotNull(stats);
        Assert.Equal(1, stats.GemCount);
        Assert.Equal(1, stats.UnsoldGemCount);
        Assert.Equal(100.00m, stats.TotalPurchaseValue);
    }

    [Fact]
    public async Task GetStats_WithSoldGem_ReflectsInTotals()
    {
        await AuthenticateAsync("Business");

        // Create a gem with a known purchase price
        var gemRes = await Client.PostAsJsonAsync("/api/v1/gems",
            new { name = "Sold Stats Gem", purchasePrice = 200.00m });
        gemRes.EnsureSuccessStatusCode();
        var gem = await gemRes.Content.ReadFromJsonAsync<GemDto>(JsonOptions);

        // Create a sale with that gem
        var saleRes = await Client.PostAsJsonAsync("/api/v1/sales", new
        {
            saleDate = "2026-03-09",
            buyerName = "Test Buyer",
            items = new[] { new { gemId = gem!.Id, quantity = 1, salePrice = 500.00m } },
        });
        saleRes.EnsureSuccessStatusCode();

        var res = await Client.GetAsync("/api/v1/dashboard/stats");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var stats = await res.Content.ReadFromJsonAsync<StatsDto>(JsonOptions);
        Assert.NotNull(stats);
        Assert.Equal(1, stats.GemCount);
        Assert.Equal(0, stats.UnsoldGemCount);
        Assert.Equal(1, stats.SaleCount);
        Assert.Equal(500.00m, stats.TotalSalesValue);
        // NetProfit = TotalSalesValue - CostOfSoldItems = 500 - 200 = 300
        Assert.Equal(300.00m, stats.NetProfit);
        Assert.True(stats.ProfitMarginPct > 0m);
    }
}
