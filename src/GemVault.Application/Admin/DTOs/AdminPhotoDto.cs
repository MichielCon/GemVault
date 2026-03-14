namespace GemVault.Application.Admin.DTOs;

public record AdminPhotoDto(
    Guid Id,
    string Url,
    string FileName,
    long FileSizeBytes,
    string ContentType,
    Guid? GemId,
    string? GemName,
    Guid? GemParcelId,
    string? GemParcelName,
    Guid OwnerId,
    string OwnerEmail,
    bool IsCover,
    DateTime CreatedAt);
