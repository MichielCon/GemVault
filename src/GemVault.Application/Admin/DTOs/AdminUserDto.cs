namespace GemVault.Application.Admin.DTOs;

public record AdminUserDto(
    Guid Id,
    string Email,
    string Role,
    bool IsDeleted,
    DateTime CreatedAt,
    int GemCount,
    int ParcelCount);
