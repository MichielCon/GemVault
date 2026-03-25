using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Queries;

public record GemParcelExportDto(
    string Name,
    string? Species,
    string? Variety,
    int Quantity,
    decimal? TotalWeightCarats,
    string? Color,
    string? Treatment,
    decimal? PurchasePrice,
    string? AcquiredAt,
    string? OriginCountry,
    string? Locality,
    string? Notes,
    string AddedOn);

public record ExportGemParcelsQuery : IRequest<List<GemParcelExportDto>>;

public class ExportGemParcelsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<ExportGemParcelsQuery, List<GemParcelExportDto>>
{
    public async Task<List<GemParcelExportDto>> Handle(ExportGemParcelsQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        return await context.GemParcels
            .AsNoTracking()
            .Where(p => p.OwnerId == userId && !p.IsDeleted)
            .Include(p => p.Origin)
            .OrderByDescending(p => p.CreatedAt)
            .Take(10_000)
            .Select(p => new GemParcelExportDto(
                p.Name,
                p.Species,
                p.Variety,
                p.Quantity,
                p.TotalWeightCarats,
                p.Color,
                p.Treatment,
                p.PurchasePrice,
                p.AcquiredAt.HasValue ? p.AcquiredAt.Value.ToString("yyyy-MM-dd") : null,
                p.Origin != null ? p.Origin.Country : null,
                p.Origin != null ? p.Origin.Locality : null,
                p.Notes,
                p.CreatedAt.ToString("yyyy-MM-dd")))
            .ToListAsync(ct);
    }
}
