using FluentValidation;
using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Queries;

public record GetAdminSessionsQuery(int Page = 1, int PageSize = 20, string? Search = null)
    : IRequest<PagedResult<AdminSessionDto>>;

public class GetAdminSessionsQueryValidator : AbstractValidator<GetAdminSessionsQuery>
{
    public GetAdminSessionsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public class GetAdminSessionsQueryHandler(
    IApplicationDbContext context,
    IAdminUserService adminUserService)
    : IRequestHandler<GetAdminSessionsQuery, PagedResult<AdminSessionDto>>
{
    public async Task<PagedResult<AdminSessionDto>> Handle(GetAdminSessionsQuery request, CancellationToken ct)
    {
        var query = context.RefreshTokens
            .Where(t => !t.IsDeleted && !t.IsRevoked)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var filteredUserIds = await adminUserService.GetUserIdsByEmailAsync(request.Search, ct);
            if (filteredUserIds.Count == 0)
                return new PagedResult<AdminSessionDto>([], 0, request.Page, request.PageSize);
            query = query.Where(t => filteredUserIds.Contains(t.UserId));
        }

        var total = await query.CountAsync(ct);

        var pageSize = Math.Min(request.PageSize, 100);
        var tokens = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((request.Page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var userIds = tokens.Select(t => t.UserId).Distinct();
        var emailMap = await adminUserService.GetUserEmailMapAsync(userIds, ct);

        var now = DateTime.UtcNow;
        var dtos = tokens.Select(t => new AdminSessionDto(
            t.Id,
            t.UserId,
            emailMap.GetValueOrDefault(t.UserId, "(unknown)"),
            t.TokenHash.Length >= 8 ? t.TokenHash[..8] + "…" : t.TokenHash,
            t.CreatedAt,
            t.ExpiresAt,
            t.ExpiresAt < now
        )).ToList();

        return new PagedResult<AdminSessionDto>(dtos, total, request.Page, pageSize);
    }
}
