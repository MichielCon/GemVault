using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Commands;

public record UploadGemPhotoCommand(
    Guid GemId,
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSize,
    bool IsCover) : IRequest<GemPhotoDto>;

public class UploadGemPhotoCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<UploadGemPhotoCommand, GemPhotoDto>
{
    private static readonly string[] AllowedContentTypes =
        ["image/jpeg", "image/png", "image/webp", "image/gif"];

    public async Task<GemPhotoDto> Handle(UploadGemPhotoCommand request, CancellationToken ct)
    {
        if (!AllowedContentTypes.Contains(request.ContentType.ToLower()))
            throw new ValidationException("Only JPEG, PNG, WebP, and GIF images are allowed.");

        if (request.FileSize > 20 * 1024 * 1024)
            throw new ValidationException("File size must not exceed 20 MB.");

        var gem = await context.Gems
            .Include(g => g.Photos)
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        var ext = Path.GetExtension(request.FileName).TrimStart('.').ToLower();
        var photoId = Guid.NewGuid();
        var objectKey = $"gems/{request.GemId}/{photoId}.{ext}";

        await storage.UploadAsync(objectKey, request.FileStream, request.ContentType, request.FileSize, ct);

        // If this is cover, unset other cover photos
        if (request.IsCover)
            foreach (var p in gem.Photos.Where(p => p.IsCover))
                p.IsCover = false;

        var photo = new GemPhoto
        {
            Id = photoId,
            GemId = gem.Id,
            ObjectKey = objectKey,
            FileName = request.FileName,
            ContentType = request.ContentType,
            FileSizeBytes = request.FileSize,
            IsCover = request.IsCover || !gem.Photos.Any(),
        };

        context.GemPhotos.Add(photo);
        await context.SaveChangesAsync(ct);

        return new GemPhotoDto(photo.Id, storage.GetPublicUrl(objectKey), photo.IsCover, photo.CreatedAt);
    }
}
