using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Queries;

public record GetGemByIdQuery(Guid GemId) : IRequest<GemDto>;

public class GetGemByIdQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<GetGemByIdQuery, GemDto>
{
    public async Task<GemDto> Handle(GetGemByIdQuery request, CancellationToken ct)
    {
        var gem = await context.Gems
            .Include(g => g.Photos)
            .Include(g => g.Origin)
            .Include(g => g.PublicToken)
            .Include(g => g.SaleItems)
                .ThenInclude(si => si.Sale)
            .Include(g => g.Certificates)
            .Include(g => g.SourceParcel)
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        return gem.ToDto(storage);
    }
}
