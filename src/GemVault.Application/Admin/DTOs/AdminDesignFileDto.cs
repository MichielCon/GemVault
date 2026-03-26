namespace GemVault.Application.Admin.DTOs;

public record AdminDesignFileDto(
    Guid Id,
    string FileName,
    string? FileUrl,
    string? ContentType,
    long FileSize,
    Guid GemId,
    string GemName,
    Guid OwnerId,
    string OwnerEmail,
    DateTime CreatedAt);
