using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Queries;

public record GetOriginsByCountryQuery(string Country) : IRequest<List<OriginDto>>;

public class GetOriginsByCountryQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetOriginsByCountryQuery, List<OriginDto>>
{
    public async Task<List<OriginDto>> Handle(GetOriginsByCountryQuery request, CancellationToken ct)
    {
        return await context.Origins
            .Where(o => o.Country == request.Country)
            .OrderBy(o => o.Locality)
            .Select(o => new OriginDto(o.Id, o.Country, o.Locality, o.CreatedAt))
            .ToListAsync(ct);
    }
}
