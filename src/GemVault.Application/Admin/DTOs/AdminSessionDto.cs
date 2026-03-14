namespace GemVault.Application.Admin.DTOs;

public record AdminSessionDto(
    Guid Id,
    Guid UserId,
    string UserEmail,
    string TokenHashMasked,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    bool IsExpired);
