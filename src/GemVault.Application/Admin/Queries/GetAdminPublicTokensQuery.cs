using GemVault.Application.Admin.DTOs;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Admin.Queries;

public record GetAdminPublicTokensQuery(
    int Page = 1,
    int PageSize = 20,
    bool? IsActive = null) : IRequest<PagedResult<AdminPublicTokenDto>>;

public class GetAdminPublicTokensQueryHandler(
    IApplicationDbContext context,
    IAdminUserService adminUserService)
    : IRequestHandler<GetAdminPublicTokensQuery, PagedResult<AdminPublicTokenDto>>
{
    public async Task<PagedResult<AdminPublicTokenDto>> Handle(GetAdminPublicTokensQuery request, CancellationToken ct)
    {
        var query = context.PublicTokens
            .Include(pt => pt.Gem)
            .Include(pt => pt.GemParcel)
            .Where(pt => !pt.IsDeleted);

        if (request.IsActive.HasValue)
            query = query.Where(pt => pt.IsActive == request.IsActive.Value);

        var total = await query.CountAsync(ct);

        var tokens = await query
            .OrderByDescending(pt => pt.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        // Collect owner IDs from linked gems/parcels
        var ownerIds = new HashSet<Guid>();
        foreach (var t in tokens)
        {
            if (t.Gem is not null) ownerIds.Add(t.Gem.OwnerId);
            else if (t.GemParcel is not null) ownerIds.Add(t.GemParcel.OwnerId);
        }

        var emailMap = await adminUserService.GetUserEmailMapAsync(ownerIds, ct);

        var dtos = tokens.Select(t =>
        {
            var ownerId = t.Gem?.OwnerId ?? t.GemParcel?.OwnerId ?? Guid.Empty;
            return new AdminPublicTokenDto(
                t.Id,
                t.Token,
                t.IsActive,
                t.ScanCount,
                t.GemId,
                t.Gem?.Name,
                t.GemParcelId,
                t.GemParcel?.Name,
                ownerId,
                emailMap.GetValueOrDefault(ownerId, "(unknown)"),
                t.CreatedAt);
        }).ToList();

        return new PagedResult<AdminPublicTokenDto>(dtos, total, request.Page, request.PageSize);
    }
}
