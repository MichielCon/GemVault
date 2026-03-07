using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Dashboard;

public record RecentItemDto(Guid Id, string Name, string Type, string? Species, string? Variety, DateTime CreatedAt);

public record DashboardStatsDto(
    int GemCount,
    int ParcelCount,
    int ParcelTotalQuantity,
    decimal TotalPurchaseValue,
    decimal TotalSalesValue,
    int SupplierCount,
    int PurchaseOrderCount,
    int SaleCount,
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

        var gems = await context.Gems
            .Where(g => g.OwnerId == userId && !g.IsDeleted)
            .Select(g => new { g.PurchasePrice })
            .ToListAsync(ct);

        var parcels = await context.GemParcels
            .Where(p => p.OwnerId == userId && !p.IsDeleted)
            .Select(p => new { p.PurchasePrice, p.Quantity })
            .ToListAsync(ct);

        var supplierCount = await context.Suppliers
            .CountAsync(s => s.OwnerId == userId && !s.IsDeleted, ct);

        var purchaseOrderCount = await context.PurchaseOrders
            .CountAsync(o => o.OwnerId == userId && !o.IsDeleted, ct);

        var saleCount = await context.Sales
            .CountAsync(s => s.OwnerId == userId && !s.IsDeleted, ct);

        var saleItems = await context.SaleItems
            .Include(i => i.Sale)
            .Where(i => i.Sale.OwnerId == userId && !i.Sale.IsDeleted && !i.IsDeleted)
            .Select(i => new { i.SalePrice, i.Quantity })
            .ToListAsync(ct);

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

        var recentItems = recentGems
            .Concat(recentParcels)
            .OrderByDescending(x => x.CreatedAt)
            .Take(5)
            .ToList();

        var totalPurchaseValue =
            gems.Sum(g => g.PurchasePrice ?? 0m) +
            parcels.Sum(p => p.PurchasePrice ?? 0m);

        var totalSalesValue = saleItems.Sum(i => i.SalePrice * i.Quantity);

        return new DashboardStatsDto(
            gems.Count,
            parcels.Count,
            parcels.Sum(p => p.Quantity),
            totalPurchaseValue,
            totalSalesValue,
            supplierCount,
            purchaseOrderCount,
            saleCount,
            recentItems);
    }
}
