using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Commands;

public record DeleteGemParcelPhotoCommand(Guid PhotoId) : IRequest;

public class DeleteGemParcelPhotoCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<DeleteGemParcelPhotoCommand>
{
    public async Task Handle(DeleteGemParcelPhotoCommand request, CancellationToken ct)
    {
        var photo = await context.GemPhotos
            .Include(p => p.GemParcel)
            .FirstOrDefaultAsync(p => p.Id == request.PhotoId && !p.IsDeleted, ct)
            ?? throw new NotFoundException("Photo", request.PhotoId);

        if (photo.GemParcel == null || photo.GemParcel.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        await storage.DeleteAsync(photo.ObjectKey, ct);

        photo.IsDeleted = true;

        // If deleted photo was cover, promote the next available photo
        if (photo.IsCover)
        {
            var next = await context.GemPhotos
                .Where(p => p.GemParcelId == photo.GemParcelId && p.Id != photo.Id && !p.IsDeleted)
                .OrderBy(p => p.CreatedAt)
                .FirstOrDefaultAsync(ct);
            if (next != null) next.IsCover = true;
        }

        await context.SaveChangesAsync(ct);
    }
}
