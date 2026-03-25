using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Queries;

public record GemExportDto(
    string Name,
    string? Species,
    string? Variety,
    decimal? WeightCarats,
    string? Color,
    string? Clarity,
    string? Cut,
    string? Shape,
    string? Treatment,
    decimal? PurchasePrice,
    string? AcquiredAt,
    string Status,
    string? OriginCountry,
    string? Locality,
    string? Notes,
    string AddedOn);

public record ExportGemsQuery : IRequest<List<GemExportDto>>;

public class ExportGemsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<ExportGemsQuery, List<GemExportDto>>
{
    public async Task<List<GemExportDto>> Handle(ExportGemsQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        return await context.Gems
            .AsNoTracking()
            .Where(g => g.OwnerId == userId && !g.IsDeleted)
            .Include(g => g.Origin)
            .OrderByDescending(g => g.CreatedAt)
            .Take(10_000)
            .Select(g => new GemExportDto(
                g.Name,
                g.Species,
                g.Variety,
                g.WeightCarats,
                g.Color,
                g.Clarity,
                g.Cut,
                g.Shape,
                g.Treatment,
                g.PurchasePrice,
                g.AcquiredAt.HasValue ? g.AcquiredAt.Value.ToString("yyyy-MM-dd") : null,
                g.Status.ToString(),
                g.Origin != null ? g.Origin.Country : null,
                g.Origin != null ? g.Origin.Locality : null,
                g.Notes,
                g.CreatedAt.ToString("yyyy-MM-dd")))
            .ToListAsync(ct);
    }
}
