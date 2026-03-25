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

    private static bool HasValidMagicBytes(Stream stream, string contentType)
    {
        Span<byte> header = stackalloc byte[12];
        var read = stream.Read(header);
        stream.Seek(0, SeekOrigin.Begin);
        if (read < 3) return false;
        return contentType.ToLowerInvariant() switch
        {
            "image/jpeg" => header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF,
            "image/png"  => read >= 4 && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47,
            "image/webp" => read == 12 && header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46
                                       && header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50,
            _ => false
        };
    }

    public async Task<GemParcelPhotoDto> Handle(UploadGemParcelPhotoCommand request, CancellationToken ct)
    {
        if (!AllowedContentTypes.Contains(request.ContentType.ToLower()))
            throw new ValidationException("Only JPEG, PNG, and WebP images are allowed.");

        if (request.FileSize > 25 * 1024 * 1024)
            throw new ValidationException("File size must not exceed 25 MB.");

        if (!HasValidMagicBytes(request.FileStream, request.ContentType))
            throw new ValidationException("File content does not match the declared image type.");

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

        var photo = new GemPhoto
        {
            GemParcelId = parcel.Id,
            ObjectKey = objectKey,
            FileName = request.FileName,
            ContentType = request.ContentType,
            FileSizeBytes = request.FileSize,
            IsCover = request.IsCover,
        };

        // Save DB record first — if MinIO fails the record is detectable and recoverable.
        context.GemPhotos.Add(photo);
        await context.SaveChangesAsync(ct);

        try
        {
            await storage.UploadAsync(objectKey, request.FileStream, request.ContentType, request.FileSize, ct);
        }
        catch
        {
            photo.IsDeleted = true;
            await context.SaveChangesAsync(ct);
            throw;
        }

        return new GemParcelPhotoDto(photo.Id, storage.GetPublicUrl(objectKey), photo.IsCover, photo.CreatedAt);
    }
}
