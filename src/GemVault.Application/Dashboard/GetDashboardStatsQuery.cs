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

public record GetDashboardStatsQuery(DateTime? From = null, DateTime? To = null) : IRequest<DashboardStatsDto>;

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

        // All gems and parcels
        var allGems = await context.Gems
            .AsNoTracking()
            .Where(g => g.OwnerId == userId && !g.IsDeleted)
            .Select(g => new { g.Id, g.PurchasePrice, g.Species })
            .ToListAsync(ct);

        var allParcels = await context.GemParcels
            .AsNoTracking()
            .Where(p => p.OwnerId == userId && !p.IsDeleted)
            .Select(p => new { p.Id, p.PurchasePrice, p.Quantity, p.Species })
            .ToListAsync(ct);

        // Server-side subquery: gems/parcels that appear in a sale
        var unsoldGemCount = await context.Gems
            .AsNoTracking()
            .Where(g => g.OwnerId == userId && !g.IsDeleted && !g.SaleItems.Any(si => !si.IsDeleted))
            .CountAsync(ct);

        var unsoldParcelCount = await context.GemParcels
            .AsNoTracking()
            .Where(p => p.OwnerId == userId && !p.IsDeleted && !p.SaleItems.Any(si => !si.IsDeleted))
            .CountAsync(ct);

        // Gem IDs that appear in any sale (still needed for cost-of-sold calculation)
        var soldGemIds = await context.SaleItems
            .AsNoTracking()
            .Where(i => i.GemId.HasValue && !i.IsDeleted && !i.Sale.IsDeleted && i.Sale.OwnerId == userId)
            .Select(i => i.GemId!.Value)
            .Distinct()
            .ToListAsync(ct);

        var soldParcelIds = await context.SaleItems
            .AsNoTracking()
            .Where(i => i.GemParcelId.HasValue && !i.IsDeleted && !i.Sale.IsDeleted && i.Sale.OwnerId == userId)
            .Select(i => i.GemParcelId!.Value)
            .Distinct()
            .ToListAsync(ct);

        // Normalise date range (ensure UTC for Npgsql)
        var from = request.From.HasValue ? DateTime.SpecifyKind(request.From.Value, DateTimeKind.Utc) : (DateTime?)null;
        var to = request.To.HasValue ? DateTime.SpecifyKind(request.To.Value.AddDays(1), DateTimeKind.Utc) : (DateTime?)null;

        // All sale items (for revenue totals and monthly chart) — optionally date-filtered
        var saleItemsQuery = context.SaleItems
            .AsNoTracking()
            .Where(i => !i.IsDeleted && !i.Sale.IsDeleted && i.Sale.OwnerId == userId);
        if (from.HasValue) saleItemsQuery = saleItemsQuery.Where(i => i.Sale.SaleDate >= from.Value);
        if (to.HasValue)   saleItemsQuery = saleItemsQuery.Where(i => i.Sale.SaleDate < to.Value);
        var allSaleItems = await saleItemsQuery
            .Select(i => new { i.SaleId, SaleDate = i.Sale.SaleDate, i.SalePrice, i.Quantity })
            .ToListAsync(ct);

        var supplierCount = await context.Suppliers
            .AsNoTracking()
            .CountAsync(s => s.OwnerId == userId && !s.IsDeleted, ct);

        var purchaseOrdersQuery = context.PurchaseOrders.AsNoTracking().Where(o => o.OwnerId == userId && !o.IsDeleted);
        if (from.HasValue) purchaseOrdersQuery = purchaseOrdersQuery.Where(o => o.OrderDate >= from.Value);
        if (to.HasValue)   purchaseOrdersQuery = purchaseOrdersQuery.Where(o => o.OrderDate < to.Value);
        var purchaseOrderCount = await purchaseOrdersQuery.CountAsync(ct);

        var salesQuery = context.Sales.AsNoTracking().Where(s => s.OwnerId == userId && !s.IsDeleted);
        if (from.HasValue) salesQuery = salesQuery.Where(s => s.SaleDate >= from.Value);
        if (to.HasValue)   salesQuery = salesQuery.Where(s => s.SaleDate < to.Value);
        var saleCount = await salesQuery.CountAsync(ct);

        // Recent gems and parcels added
        var recentGems = await context.Gems
            .AsNoTracking()
            .Where(g => g.OwnerId == userId && !g.IsDeleted)
            .OrderByDescending(g => g.CreatedAt)
            .Take(5)
            .Select(g => new RecentItemDto(g.Id, g.Name, "Gem", g.Species, g.Variety, g.CreatedAt))
            .ToListAsync(ct);

        var recentParcels = await context.GemParcels
            .AsNoTracking()
            .Where(p => p.OwnerId == userId && !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .Select(p => new RecentItemDto(p.Id, p.Name, "Parcel", p.Species, p.Variety, p.CreatedAt))
            .ToListAsync(ct);

        // Recent sales — respect date filter
        var recentSalesQuery = context.Sales.AsNoTracking().Where(s => s.OwnerId == userId && !s.IsDeleted);
        if (from.HasValue) recentSalesQuery = recentSalesQuery.Where(s => s.SaleDate >= from.Value);
        if (to.HasValue)   recentSalesQuery = recentSalesQuery.Where(s => s.SaleDate < to.Value);
        var recentSaleEntities = await recentSalesQuery
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

        // Monthly revenue — use date range when set, otherwise last 6 months
        var chartFrom = from ?? DateTime.UtcNow.AddMonths(-6);
        var monthlyRevenue = allSaleItems
            .Where(i => i.SaleDate >= chartFrom)
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
            unsoldGemCount,
            unsoldParcelCount,
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
