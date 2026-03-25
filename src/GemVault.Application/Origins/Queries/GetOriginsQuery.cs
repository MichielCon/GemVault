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
        var query = context.Origins.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(o =>
                o.Country.ToLower().Contains(search) ||
                (o.Locality != null && o.Locality.ToLower().Contains(search)));
        }

        return await query
            .OrderBy(o => o.Country)
            .ThenBy(o => o.Locality)
            .Select(o => new OriginDto(
                o.Id, o.Country, o.Locality, o.CreatedAt))
            .ToListAsync(ct);
    }
}
