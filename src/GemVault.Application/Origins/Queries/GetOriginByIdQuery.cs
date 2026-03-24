using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Origins.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Origins.Queries;

public record GetOriginByIdQuery(Guid Id) : IRequest<OriginDto>;

public class GetOriginByIdQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetOriginByIdQuery, OriginDto>
{
    public async Task<OriginDto> Handle(GetOriginByIdQuery request, CancellationToken ct)
    {
        var origin = await context.Origins
            .FirstOrDefaultAsync(o => o.Id == request.Id, ct)
            ?? throw new NotFoundException("Origin", request.Id);

        return new OriginDto(origin.Id, origin.Country, origin.Locality, origin.CreatedAt);
    }
}
