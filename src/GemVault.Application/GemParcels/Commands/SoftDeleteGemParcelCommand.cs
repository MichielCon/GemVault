using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Commands;

public record SoftDeleteGemParcelCommand(Guid Id) : IRequest;

public class SoftDeleteGemParcelCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<SoftDeleteGemParcelCommand>
{
    public async Task Handle(SoftDeleteGemParcelCommand request, CancellationToken ct)
    {
        var parcel = await context.GemParcels
            .FirstOrDefaultAsync(p => p.Id == request.Id && !p.IsDeleted, ct)
            ?? throw new NotFoundException("GemParcel", request.Id);

        if (parcel.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        parcel.IsDeleted = true;
        await context.SaveChangesAsync(ct);
    }
}
