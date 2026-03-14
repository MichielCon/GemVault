namespace GemVault.Application.Profile.DTOs;

public record ProfileSessionDto(
    Guid Id,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    bool IsExpired);
