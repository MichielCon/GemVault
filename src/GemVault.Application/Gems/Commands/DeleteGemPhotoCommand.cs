using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GemVault.Application.Gems.Commands;

public record DeleteGemPhotoCommand(Guid PhotoId) : IRequest;

public class DeleteGemPhotoCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage,
    ILogger<DeleteGemPhotoCommandHandler> logger)
    : IRequestHandler<DeleteGemPhotoCommand>
{
    public async Task Handle(DeleteGemPhotoCommand request, CancellationToken ct)
    {
        var photo = await context.GemPhotos
            .Include(p => p.Gem)
            .FirstOrDefaultAsync(p => p.Id == request.PhotoId && !p.IsDeleted, ct)
            ?? throw new NotFoundException("Photo", request.PhotoId);

        if (photo.Gem == null || photo.Gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        // Mark DB record deleted first — safer than MinIO-first approach.
        photo.IsDeleted = true;

        // If deleted photo was cover, promote the next available photo
        if (photo.IsCover)
        {
            var next = await context.GemPhotos
                .Where(p => p.GemId == photo.GemId && p.Id != photo.Id && !p.IsDeleted)
                .OrderBy(p => p.CreatedAt)
                .FirstOrDefaultAsync(ct);
            if (next != null) next.IsCover = true;
        }

        await context.SaveChangesAsync(ct);

        // Delete from MinIO after DB commit. On failure, log and continue —
        // the orphaned object can be cleaned up by a background job.
        try
        {
            await storage.DeleteAsync(photo.ObjectKey, ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to delete object {ObjectKey} from storage after photo {PhotoId} was soft-deleted",
                photo.ObjectKey, photo.Id);
        }
    }
}
