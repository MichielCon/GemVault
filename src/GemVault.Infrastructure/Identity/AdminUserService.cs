using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Infrastructure.Identity;

public class AdminUserService(
    UserManager<ApplicationUser> userManager,
    IApplicationDbContext context) : IAdminUserService
{
    public async Task<AdminStatsDto> GetAdminStatsAsync(CancellationToken ct = default)
    {
        var users = await userManager.Users.ToListAsync(ct);

        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalUsers = users.Count;
        var adminCount = users.Count(u => u.Role == UserRole.Admin);
        var businessCount = users.Count(u => u.Role == UserRole.Business);
        var collectorCount = users.Count(u => u.Role == UserRole.Collector);
        var activeUsers = users.Count(u => !u.IsDeleted);
        var deletedUsers = users.Count(u => u.IsDeleted);
        var newUsersThisMonth = users.Count(u => u.CreatedAt >= startOfMonth);

        var totalGems = await context.Gems.CountAsync(ct);
        var totalParcels = await context.GemParcels.CountAsync(ct);
        var totalPhotos = await context.GemPhotos.CountAsync(ct);
        var totalCertificates = await context.Certificates.CountAsync(ct);
        var totalPublicTokens = await context.PublicTokens.CountAsync(ct);
        var activePublicTokens = await context.PublicTokens.CountAsync(p => p.IsActive, ct);

        var recentUsers = users
            .Where(u => !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAt)
            .Take(10)
            .Select(u => new RecentUserDto(u.Id, u.Email!, u.Role.ToString(), u.CreatedAt))
            .ToList();

        return new AdminStatsDto(
            totalUsers, adminCount, businessCount, collectorCount,
            activeUsers, deletedUsers, newUsersThisMonth,
            totalGems, totalParcels, totalPhotos, totalCertificates,
            totalPublicTokens, activePublicTokens, recentUsers);
    }

    public async Task<PagedResult<AdminUserDto>> GetUsersAsync(
        int page,
        int pageSize,
        string? search,
        string? role,
        bool? isDeleted,
        CancellationToken ct = default)
    {
        var query = userManager.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(u => u.Email != null && u.Email.ToLower().Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(role) && Enum.TryParse<UserRole>(role, out var parsedRole))
            query = query.Where(u => u.Role == parsedRole);

        if (isDeleted.HasValue)
            query = query.Where(u => u.IsDeleted == isDeleted.Value);

        var total = await query.CountAsync(ct);

        var pageUsers = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var userIds = pageUsers.Select(u => u.Id).ToList();

        var gemCounts = await context.Gems
            .Where(g => userIds.Contains(g.OwnerId))
            .GroupBy(g => g.OwnerId)
            .Select(g => new { OwnerId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.OwnerId, x => x.Count, ct);

        var parcelCounts = await context.GemParcels
            .Where(p => userIds.Contains(p.OwnerId))
            .GroupBy(p => p.OwnerId)
            .Select(p => new { OwnerId = p.Key, Count = p.Count() })
            .ToDictionaryAsync(x => x.OwnerId, x => x.Count, ct);

        var dtos = pageUsers.Select(u => new AdminUserDto(
            u.Id,
            u.Email!,
            u.Role.ToString(),
            u.IsDeleted,
            u.CreatedAt,
            gemCounts.GetValueOrDefault(u.Id, 0),
            parcelCounts.GetValueOrDefault(u.Id, 0)
        )).ToList();

        return new PagedResult<AdminUserDto>(dtos, total, page, pageSize);
    }

    public async Task<Dictionary<Guid, string>> GetUserEmailMapAsync(
        IEnumerable<Guid> ids,
        CancellationToken ct = default)
    {
        var idList = ids.Distinct().ToList();
        return await userManager.Users
            .Where(u => idList.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Email ?? "(unknown)", ct);
    }

    public async Task<IReadOnlyList<string>> ChangeUserRoleAsync(
        Guid userId,
        UserRole newRole,
        CancellationToken ct = default)
    {
        if (newRole == UserRole.Admin)
            return new[] { "Cannot promote users to Admin via this endpoint." };

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return new[] { "User not found." };

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;
        var result = await userManager.UpdateAsync(user);
        return result.Succeeded
            ? Array.Empty<string>()
            : result.Errors.Select(e => e.Description).ToList();
    }

    public async Task<IReadOnlyList<string>> SetUserDeletedAsync(
        Guid userId,
        bool isDeleted,
        CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return new[] { "User not found." };

        if (isDeleted)
            await RevokeAllUserSessionsAsync(userId, ct);

        user.IsDeleted = isDeleted;
        user.UpdatedAt = DateTime.UtcNow;
        var result = await userManager.UpdateAsync(user);
        return result.Succeeded
            ? Array.Empty<string>()
            : result.Errors.Select(e => e.Description).ToList();
    }

    public async Task<int> RevokeAllUserSessionsAsync(Guid userId, CancellationToken ct = default)
    {
        return await context.RefreshTokens
            .Where(t => t.UserId == userId && !t.IsRevoked)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.IsRevoked, true), ct);
    }

    public async Task<List<Guid>> GetUserIdsByEmailAsync(string search, CancellationToken ct = default)
    {
        var s = search.ToLower();
        return await userManager.Users
            .Where(u => u.Email != null && u.Email.ToLower().Contains(s))
            .Select(u => u.Id)
            .ToListAsync(ct);
    }

    public async Task<string?> GetUserRoleAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        return user?.Role.ToString();
    }

    public async Task<int> CountActiveAdminsAsync(CancellationToken ct = default)
    {
        return await userManager.Users
            .CountAsync(u => u.Role == UserRole.Admin && !u.IsDeleted, ct);
    }
}
