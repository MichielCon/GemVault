using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.DesignFiles;

public record UploadDesignFileCommand(
    Guid GemId,
    Stream FileStream,
    string FileName,
    string ContentType,
    long FileSize) : IRequest<DesignFileDto>;

public class UploadDesignFileCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<UploadDesignFileCommand, DesignFileDto>
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".gem", ".gcs", ".asc"
    };

    private const long MaxFileSize = 50 * 1024 * 1024; // 50 MB

    public async Task<DesignFileDto> Handle(UploadDesignFileCommand request, CancellationToken ct)
    {
        var ext = Path.GetExtension(request.FileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
            throw new Application.Common.Exceptions.ValidationException(
                "Unsupported file type. Allowed: images (jpg/png/webp/gif), PDF, GemCutStudio (.gem/.gcs), GemCAD (.asc).");

        if (request.FileSize > MaxFileSize)
            throw new Application.Common.Exceptions.ValidationException("File size must not exceed 50 MB.");

        var gem = await context.Gems
            .FirstOrDefaultAsync(g => g.Id == request.GemId && !g.IsDeleted, ct)
            ?? throw new NotFoundException("Gem", request.GemId);

        if (gem.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        var fileId = Guid.NewGuid();
        var objectKey = $"designs/{request.GemId}/{fileId}{ext}";

        var designFile = new GemDesignFile
        {
            Id = fileId,
            GemId = request.GemId,
            FileName = Path.GetFileName(request.FileName),
            ObjectKey = objectKey,
            ContentType = request.ContentType,
            FileSize = request.FileSize,
        };

        context.DesignFiles.Add(designFile);
        await context.SaveChangesAsync(ct);

        try
        {
            await storage.UploadAsync(objectKey, request.FileStream, request.ContentType, request.FileSize, ct);
        }
        catch
        {
            designFile.IsDeleted = true;
            await context.SaveChangesAsync(ct);
            throw;
        }

        var fileUrl = storage.GetPublicUrl(objectKey);
        return new DesignFileDto(designFile.Id, designFile.FileName, fileUrl, designFile.ContentType, designFile.FileSize, designFile.CreatedAt);
    }
}
