using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Queries;

public record GetOriginsQuery(string? Search) : IRequest<List<OriginDto>>;

public class GetOriginsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetOriginsQuery, List<OriginDto>>
{
    public async Task<List<OriginDto>> Handle(GetOriginsQuery request, CancellationToken ct)
    {
        var query = context.Origins.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(o =>
                o.Country.ToLower().Contains(search) ||
                (o.Mine != null && o.Mine.ToLower().Contains(search)) ||
                (o.Region != null && o.Region.ToLower().Contains(search)));
        }

        return await query
            .OrderBy(o => o.Country)
            .Select(o => new OriginDto(
                o.Id, o.Country, o.Mine, o.Region, o.CreatedAt,
                o.Gems.Count(g => !g.IsDeleted),
                o.GemParcels.Count(p => !p.IsDeleted)))
            .ToListAsync(ct);
    }
}
