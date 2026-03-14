using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Commands;

public record AdminDeletePhotoCommand(Guid PhotoId) : IRequest;

public class AdminDeletePhotoCommandHandler(
    IApplicationDbContext context,
    IStorageService storage)
    : IRequestHandler<AdminDeletePhotoCommand>
{
    public async Task Handle(AdminDeletePhotoCommand request, CancellationToken ct)
    {
        var photo = await context.GemPhotos
            .FirstOrDefaultAsync(p => p.Id == request.PhotoId && !p.IsDeleted, ct)
            ?? throw new NotFoundException("Photo", request.PhotoId);

        await storage.DeleteAsync(photo.ObjectKey, ct);

        photo.IsDeleted = true;

        // Promote next photo to cover if this was the cover
        if (photo.IsCover && photo.GemId.HasValue)
        {
            var next = await context.GemPhotos
                .Where(p => p.GemId == photo.GemId && p.Id != photo.Id && !p.IsDeleted)
                .OrderBy(p => p.CreatedAt)
                .FirstOrDefaultAsync(ct);
            if (next != null) next.IsCover = true;
        }

        await context.SaveChangesAsync(ct);
    }
}
