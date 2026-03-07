using GemVault.Application.Common.Exceptions;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Queries;

public record GetGemParcelByIdQuery(Guid Id) : IRequest<GemParcelDto>;

public class GetGemParcelByIdQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<GetGemParcelByIdQuery, GemParcelDto>
{
    public async Task<GemParcelDto> Handle(GetGemParcelByIdQuery request, CancellationToken ct)
    {
        var parcel = await context.GemParcels
            .Include(p => p.Photos)
            .Include(p => p.Origin)
            .Include(p => p.PublicToken)
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, ct)
            ?? throw new NotFoundException("GemParcel", request.Id);

        if (parcel.OwnerId != currentUser.UserId)
            throw new NotFoundException("GemParcel", request.Id);

        return parcel.ToDto(storage);
    }
}
