using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Domain.Enums;

namespace GemVault.Application.Interfaces;

public interface IAdminUserService
{
    Task<AdminStatsDto> GetAdminStatsAsync(CancellationToken ct = default);

    Task<PagedResult<AdminUserDto>> GetUsersAsync(
        int page,
        int pageSize,
        string? search,
        string? role,
        bool? isDeleted,
        CancellationToken ct = default);

    Task<Dictionary<Guid, string>> GetUserEmailMapAsync(
        IEnumerable<Guid> ids,
        CancellationToken ct = default);

    Task<IReadOnlyList<string>> ChangeUserRoleAsync(
        Guid userId,
        UserRole newRole,
        CancellationToken ct = default);

    Task<IReadOnlyList<string>> SetUserDeletedAsync(
        Guid userId,
        bool isDeleted,
        CancellationToken ct = default);

    Task<int> RevokeAllUserSessionsAsync(Guid userId, CancellationToken ct = default);

    Task<List<Guid>> GetUserIdsByEmailAsync(string search, CancellationToken ct = default);
}
