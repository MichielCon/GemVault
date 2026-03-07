using GemVault.Application.Interfaces;
using GemVault.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace GemVault.Infrastructure.Identity;

public class IdentityService(UserManager<ApplicationUser> userManager) : IIdentityService
{
    public async Task<(Guid UserId, IReadOnlyList<string> Errors)> CreateUserAsync(
        string email, string password, UserRole role, CancellationToken ct = default)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Role = role,
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            return (Guid.Empty, result.Errors.Select(e => e.Description).ToList());

        return (user.Id, Array.Empty<string>());
    }

    public async Task<(bool Success, Guid UserId, string Email, UserRole Role)> ValidateCredentialsAsync(
        string email, string password, CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || user.IsDeleted)
            return (false, Guid.Empty, string.Empty, UserRole.Collector);

        var valid = await userManager.CheckPasswordAsync(user, password);
        return valid
            ? (true, user.Id, user.Email!, user.Role)
            : (false, Guid.Empty, string.Empty, UserRole.Collector);
    }

    public async Task<(bool Found, string Email, UserRole Role)> GetUserByIdAsync(
        Guid userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        return user is null || user.IsDeleted
            ? (false, string.Empty, UserRole.Collector)
            : (true, user.Email!, user.Role);
    }

    public async Task<bool> UserExistsAsync(string email, CancellationToken ct = default)
        => await userManager.FindByEmailAsync(email) is not null;
}
