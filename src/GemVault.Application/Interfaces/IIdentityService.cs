using GemVault.Domain.Enums;

namespace GemVault.Application.Interfaces;

public interface IIdentityService
{
    Task<(Guid UserId, IReadOnlyList<string> Errors)> CreateUserAsync(
        string email, string password, UserRole role, CancellationToken ct = default);

    Task<(bool Success, Guid UserId, string Email, UserRole Role)> ValidateCredentialsAsync(
        string email, string password, CancellationToken ct = default);

    Task<(bool Found, string Email, UserRole Role)> GetUserByIdAsync(
        Guid userId, CancellationToken ct = default);

    Task<bool> UserExistsAsync(string email, CancellationToken ct = default);

    Task<(bool Found, string? DisplayName, string Email, UserRole Role, DateTime CreatedAt)>
        GetProfileAsync(Guid userId, CancellationToken ct = default);

    Task<IReadOnlyList<string>> UpdateDisplayNameAsync(Guid userId, string? displayName, CancellationToken ct = default);
    Task<IReadOnlyList<string>> UpdateEmailAsync(Guid userId, string newEmail, CancellationToken ct = default);
    Task<IReadOnlyList<string>> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword, CancellationToken ct = default);
    Task<IReadOnlyList<string>> SoftDeleteUserAsync(Guid userId, CancellationToken ct = default);

    Task<(bool Found, string Token)> GeneratePasswordResetTokenAsync(string email, CancellationToken ct = default);
    Task<IReadOnlyList<string>> ResetPasswordAsync(string email, string token, string newPassword, CancellationToken ct = default);
}
