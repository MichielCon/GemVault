using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Commands;

public record BulkDeleteGemParcelsCommand(List<Guid> ParcelIds) : IRequest;

public class BulkDeleteGemParcelsCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<BulkDeleteGemParcelsCommand>
{
    public async Task Handle(BulkDeleteGemParcelsCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var userId = currentUser.UserId.Value;

        var parcels = await context.GemParcels
            .Where(p => request.ParcelIds.Contains(p.Id) && p.OwnerId == userId && !p.IsDeleted)
            .ToListAsync(ct);

        foreach (var parcel in parcels)
            parcel.IsDeleted = true;

        await context.SaveChangesAsync(ct);
    }
}
