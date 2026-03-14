namespace GemVault.Application.Profile.DTOs;

public record ProfileDto(
    Guid Id,
    string Email,
    string? DisplayName,
    string Role,
    DateTime JoinedAt,
    int GemCount,
    int ParcelCount);
