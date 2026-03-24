namespace GemVault.Application.Admin.DTOs;

public record AdminPublicTokenDto(
    Guid Id,
    string Token,
    bool IsActive,
    int ScanCount,
    Guid? GemId,
    string? GemName,
    Guid? GemParcelId,
    string? GemParcelName,
    Guid OwnerId,
    string OwnerEmail,
    DateTime CreatedAt);
