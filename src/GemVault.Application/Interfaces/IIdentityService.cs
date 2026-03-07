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
}
