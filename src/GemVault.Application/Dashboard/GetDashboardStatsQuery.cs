using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Dashboard;

public record RecentItemDto(Guid Id, string Name, string Type, string? Species, string? Variety, DateTime CreatedAt);

public record MonthlyRevenueDto(int Year, int Month, decimal Revenue);

public record SpeciesBreakdownDto(string Species, int Count);

public record RecentSaleDto(Guid SaleId, DateTime SaleDate, string? BuyerName, decimal TotalValue, int ItemCount);

public record DashboardStatsDto(
    // Inventory counts
    int GemCount,
    int ParcelCount,
    int ParcelTotalQuantity,
    int UnsoldGemCount,
    int UnsoldParcelCount,
    // Financial
    decimal TotalPurchaseValue,
    decimal TotalSalesValue,
    decimal UnsoldInventoryValue,
    decimal NetProfit,
    decimal ProfitMarginPct,
    // Business counters
    int SupplierCount,
    int PurchaseOrderCount,
    int SaleCount,
    // Charts & activity
    List<MonthlyRevenueDto> MonthlyRevenue,
    List<SpeciesBreakdownDto> InventoryBySpecies,
    List<RecentSaleDto> RecentSales,
    List<RecentItemDto> RecentItems);

public record GetDashboardStatsQuery : IRequest<DashboardStatsDto>;

public class GetDashboardStatsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        // Gem IDs that appear in any sale
        var soldGemIds = await context.SaleItems
            .Where(i => i.GemId.HasValue && !i.IsDeleted && !i.Sale.IsDeleted && i.Sale.OwnerId == userId)
            .Select(i => i.GemId!.Value)
            .Distinct()
            .ToListAsync(ct);

        var soldParcelIds = await context.SaleItems
            .Where(i => i.GemParcelId.HasValue && !i.IsDeleted && !i.Sale.IsDeleted && i.Sale.OwnerId == userId)
            .Select(i => i.GemParcelId!.Value)
            .Distinct()
            .ToListAsync(ct);

        // All gems and parcels
        var allGems = await context.Gems
            .Where(g => g.OwnerId == userId && !g.IsDeleted)
            .Select(g => new { g.Id, g.PurchasePrice, g.Species })
            .ToListAsync(ct);

        var allParcels = await context.GemParcels
            .Where(p => p.OwnerId == userId && !p.IsDeleted)
            .Select(p => new { p.Id, p.PurchasePrice, p.Quantity, p.Species })
            .ToListAsync(ct);

        // All sale items (for revenue totals and monthly chart)
        var allSaleItems = await context.SaleItems
            .Where(i => !i.IsDeleted && !i.Sale.IsDeleted && i.Sale.OwnerId == userId)
            .Select(i => new { i.SaleId, SaleDate = i.Sale.SaleDate, i.SalePrice, i.Quantity })
            .ToListAsync(ct);

        var supplierCount = await context.Suppliers
            .CountAsync(s => s.OwnerId == userId && !s.IsDeleted, ct);

        var purchaseOrderCount = await context.PurchaseOrders
            .CountAsync(o => o.OwnerId == userId && !o.IsDeleted, ct);

        var saleCount = await context.Sales
            .CountAsync(s => s.OwnerId == userId && !s.IsDeleted, ct);

        // Recent gems and parcels added
        var recentGems = await context.Gems
            .Where(g => g.OwnerId == userId && !g.IsDeleted)
            .OrderByDescending(g => g.CreatedAt)
            .Take(5)
            .Select(g => new RecentItemDto(g.Id, g.Name, "Gem", g.Species, g.Variety, g.CreatedAt))
            .ToListAsync(ct);

        var recentParcels = await context.GemParcels
            .Where(p => p.OwnerId == userId && !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .Select(p => new RecentItemDto(p.Id, p.Name, "Parcel", p.Species, p.Variety, p.CreatedAt))
            .ToListAsync(ct);

        // Recent sales
        var recentSaleEntities = await context.Sales
            .Where(s => s.OwnerId == userId && !s.IsDeleted)
            .OrderByDescending(s => s.SaleDate)
            .Take(5)
            .Select(s => new { s.Id, s.SaleDate, s.BuyerName })
            .ToListAsync(ct);

        // --- In-memory derived calculations ---

        var unsoldGems = allGems.Where(g => !soldGemIds.Contains(g.Id)).ToList();
        var unsoldParcels = allParcels.Where(p => !soldParcelIds.Contains(p.Id)).ToList();
        var soldGems = allGems.Where(g => soldGemIds.Contains(g.Id)).ToList();
        var soldParcels = allParcels.Where(p => soldParcelIds.Contains(p.Id)).ToList();

        var totalPurchaseValue = allGems.Sum(g => g.PurchasePrice ?? 0m)
                               + allParcels.Sum(p => p.PurchasePrice ?? 0m);
        var totalSalesValue = allSaleItems.Sum(i => i.SalePrice * i.Quantity);
        var costOfSoldItems = soldGems.Sum(g => g.PurchasePrice ?? 0m)
                            + soldParcels.Sum(p => p.PurchasePrice ?? 0m);
        var netProfit = totalSalesValue - costOfSoldItems;
        var profitMarginPct = totalSalesValue > 0
            ? Math.Round(netProfit / totalSalesValue * 100, 1)
            : 0m;
        var unsoldInventoryValue = unsoldGems.Sum(g => g.PurchasePrice ?? 0m)
                                 + unsoldParcels.Sum(p => p.PurchasePrice ?? 0m);

        // Monthly revenue — last 6 months
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
        var monthlyRevenue = allSaleItems
            .Where(i => i.SaleDate >= sixMonthsAgo)
            .GroupBy(i => new { i.SaleDate.Year, i.SaleDate.Month })
            .Select(g => new MonthlyRevenueDto(g.Key.Year, g.Key.Month, g.Sum(i => i.SalePrice * i.Quantity)))
            .OrderBy(m => m.Year).ThenBy(m => m.Month)
            .ToList();

        // Species breakdown of unsold gems
        var inventoryBySpecies = unsoldGems
            .GroupBy(g => g.Species ?? "Unknown")
            .Select(g => new SpeciesBreakdownDto(g.Key, g.Count()))
            .OrderByDescending(s => s.Count)
            .Take(8)
            .ToList();

        // Map recent sales to DTOs using already-loaded sale items
        var saleItemsByGrouping = allSaleItems.GroupBy(i => i.SaleId).ToDictionary(g => g.Key, g => g.ToList());
        var recentSales = recentSaleEntities.Select(s =>
        {
            var items = saleItemsByGrouping.TryGetValue(s.Id, out var list) ? list : [];
            return new RecentSaleDto(
                s.Id,
                s.SaleDate,
                s.BuyerName,
                items.Sum(i => i.SalePrice * i.Quantity),
                items.Count);
        }).ToList();

        var recentItems = recentGems
            .Concat(recentParcels)
            .OrderByDescending(x => x.CreatedAt)
            .Take(5)
            .ToList();

        return new DashboardStatsDto(
            allGems.Count,
            allParcels.Count,
            allParcels.Sum(p => p.Quantity),
            unsoldGems.Count,
            unsoldParcels.Count,
            totalPurchaseValue,
            totalSalesValue,
            unsoldInventoryValue,
            netProfit,
            profitMarginPct,
            supplierCount,
            purchaseOrderCount,
            saleCount,
            monthlyRevenue,
            inventoryBySpecies,
            recentSales,
            recentItems);
    }
}
