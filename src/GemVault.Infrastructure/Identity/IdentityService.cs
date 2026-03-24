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

    public async Task<(bool Found, string? DisplayName, string Email, UserRole Role, DateTime CreatedAt)>
        GetProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        return user is null || user.IsDeleted
            ? (false, null, string.Empty, UserRole.Collector, default)
            : (true, user.DisplayName, user.Email!, user.Role, user.CreatedAt);
    }

    public async Task<IReadOnlyList<string>> UpdateDisplayNameAsync(Guid userId, string? displayName, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return ["User not found."];

        user.DisplayName = displayName;
        user.UpdatedAt = DateTime.UtcNow;
        var result = await userManager.UpdateAsync(user);
        return result.Succeeded
            ? Array.Empty<string>()
            : result.Errors.Select(e => e.Description).ToList();
    }

    public async Task<IReadOnlyList<string>> UpdateEmailAsync(Guid userId, string newEmail, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return ["User not found."];

        var token = await userManager.GenerateChangeEmailTokenAsync(user, newEmail);
        var result = await userManager.ChangeEmailAsync(user, newEmail, token);
        if (!result.Succeeded)
            return result.Errors.Select(e => e.Description).ToList();

        // Keep UserName in sync with Email
        user.UserName = newEmail;
        user.UpdatedAt = DateTime.UtcNow;
        var updateResult = await userManager.UpdateAsync(user);
        return updateResult.Succeeded
            ? Array.Empty<string>()
            : updateResult.Errors.Select(e => e.Description).ToList();
    }

    public async Task<IReadOnlyList<string>> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return ["User not found."];

        var result = await userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        if (!result.Succeeded)
            return result.Errors.Select(e => e.Description).ToList();

        user.UpdatedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);
        return Array.Empty<string>();
    }

    public async Task<IReadOnlyList<string>> SoftDeleteUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return ["User not found."];

        user.IsDeleted = true;
        user.UpdatedAt = DateTime.UtcNow;
        var result = await userManager.UpdateAsync(user);
        return result.Succeeded
            ? Array.Empty<string>()
            : result.Errors.Select(e => e.Description).ToList();
    }

    public async Task<(bool Found, string Token)> GeneratePasswordResetTokenAsync(
        string email, CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || user.IsDeleted)
            return (false, string.Empty);

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        return (true, token);
    }

    public async Task<IReadOnlyList<string>> ResetPasswordAsync(
        string email, string token, string newPassword, CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || user.IsDeleted)
            return ["User not found."];

        var result = await userManager.ResetPasswordAsync(user, token, newPassword);
        return result.Succeeded
            ? Array.Empty<string>()
            : result.Errors.Select(e => e.Description).ToList();
    }

    public async Task<(bool Found, string Token)> GenerateEmailConfirmationTokenAsync(
        Guid userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null || user.IsDeleted)
            return (false, string.Empty);
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        return (true, token);
    }

    public async Task<IReadOnlyList<string>> ConfirmEmailAsync(
        string email, string token, CancellationToken ct = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || user.IsDeleted)
            return ["User not found."];
        var result = await userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded
            ? Array.Empty<string>()
            : result.Errors.Select(e => e.Description).ToList();
    }

    public async Task<bool> IsEmailConfirmedAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        return user is not null && !user.IsDeleted && user.EmailConfirmed;
    }
}
