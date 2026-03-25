using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Queries;

public record GetOriginsMapDataQuery : IRequest<List<OriginMapDto>>;

public class GetOriginsMapDataQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetOriginsMapDataQuery, List<OriginMapDto>>
{
    public async Task<List<OriginMapDto>> Handle(GetOriginsMapDataQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        var gems = await context.Gems
            .AsNoTracking()
            .Where(g => g.OwnerId == userId && !g.IsDeleted && g.OriginId != null)
            .Select(g => new { g.OriginId, g.WeightCarats, g.PurchasePrice, g.Species })
            .ToListAsync(ct);

        var parcels = await context.GemParcels
            .AsNoTracking()
            .Where(p => p.OwnerId == userId && !p.IsDeleted && p.OriginId != null)
            .Select(p => new { p.OriginId, p.TotalWeightCarats, p.PurchasePrice, p.Species })
            .ToListAsync(ct);

        var originIds = gems.Select(g => g.OriginId!.Value)
            .Concat(parcels.Select(p => p.OriginId!.Value))
            .Distinct()
            .ToHashSet();

        var origins = await context.Origins
            .AsNoTracking()
            .Where(o => originIds.Contains(o.Id))
            .ToListAsync(ct);

        var gemsByOrigin = gems.GroupBy(g => g.OriginId!.Value).ToDictionary(g => g.Key, g => g.ToList());
        var parcelsByOrigin = parcels.GroupBy(p => p.OriginId!.Value).ToDictionary(p => p.Key, p => p.ToList());

        var result = origins
            .Where(o => gemsByOrigin.ContainsKey(o.Id) || parcelsByOrigin.ContainsKey(o.Id))
            .Select(o =>
            {
                var oGems = gemsByOrigin.GetValueOrDefault(o.Id) ?? [];
                var oParcels = parcelsByOrigin.GetValueOrDefault(o.Id) ?? [];
                var species = oGems.Where(g => g.Species != null).Select(g => g.Species!)
                    .Concat(oParcels.Where(p => p.Species != null).Select(p => p.Species!))
                    .Distinct().OrderBy(s => s).ToList();
                return new OriginMapDto(
                    o.Id,
                    o.Country,
                    o.Locality,
                    oGems.Count,
                    oParcels.Count,
                    oGems.Sum(g => g.WeightCarats ?? 0) + oParcels.Sum(p => p.TotalWeightCarats ?? 0),
                    oGems.Sum(g => g.PurchasePrice ?? 0) + oParcels.Sum(p => p.PurchasePrice ?? 0),
                    species,
                    o.CreatedAt);
            })
            .OrderBy(o => o.Country)
            .ToList();

        return result;
    }
}
