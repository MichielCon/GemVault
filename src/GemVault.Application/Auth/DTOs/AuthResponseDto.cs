using GemVault.Domain.Enums;

namespace GemVault.Application.Auth.DTOs;

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    Guid UserId,
    string Email,
    UserRole Role);
