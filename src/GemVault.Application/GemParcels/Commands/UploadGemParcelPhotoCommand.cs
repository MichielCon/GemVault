using GemVault.Application.Common.Exceptions;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ValidationException = GemVault.Application.Common.Exceptions.ValidationException;

namespace GemVault.Application.GemParcels.Commands;

public record UploadGemParcelPhotoCommand(
    Guid ParcelId,
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSize,
    bool IsCover) : IRequest<GemParcelPhotoDto>;

public class UploadGemParcelPhotoCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<UploadGemParcelPhotoCommand, GemParcelPhotoDto>
{
    private static readonly string[] AllowedContentTypes =
        ["image/jpeg", "image/png", "image/webp"];

    public async Task<GemParcelPhotoDto> Handle(UploadGemParcelPhotoCommand request, CancellationToken ct)
    {
        if (!AllowedContentTypes.Contains(request.ContentType.ToLower()))
            throw new ValidationException("Only JPEG, PNG, and WebP images are allowed.");

        if (request.FileSize > 25 * 1024 * 1024)
            throw new ValidationException("File size must not exceed 25 MB.");

        var parcel = await context.GemParcels
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(p => p.Id == request.ParcelId && !p.IsDeleted, ct)
            ?? throw new NotFoundException("GemParcel", request.ParcelId);

        if (parcel.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        var objectKey = $"parcels/{request.ParcelId}/{Guid.NewGuid():N}{Path.GetExtension(request.FileName)}";

        if (request.IsCover)
            foreach (var ph in parcel.Photos.Where(ph => ph.IsCover && !ph.IsDeleted))
                ph.IsCover = false;

        await storage.UploadAsync(objectKey, request.FileStream, request.ContentType, request.FileSize, ct);

        var photo = new GemPhoto
        {
            GemParcelId = parcel.Id,
            ObjectKey = objectKey,
            FileName = request.FileName,
            ContentType = request.ContentType,
            FileSizeBytes = request.FileSize,
            IsCover = request.IsCover,
        };

        context.GemPhotos.Add(photo);
        await context.SaveChangesAsync(ct);

        return new GemParcelPhotoDto(photo.Id, storage.GetPublicUrl(objectKey), photo.IsCover, photo.CreatedAt);
    }
}
