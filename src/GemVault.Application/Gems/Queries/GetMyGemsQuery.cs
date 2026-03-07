using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Queries;

public record GetMyGemsQuery(int Page = 1, int PageSize = 20, string? Search = null, Guid? OriginId = null)
    : IRequest<PagedResult<GemSummaryDto>>;

public class GetMyGemsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<GetMyGemsQuery, PagedResult<GemSummaryDto>>
{
    public async Task<PagedResult<GemSummaryDto>> Handle(GetMyGemsQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var query = context.Gems
            .Include(g => g.Photos)
            .Where(g => g.OwnerId == currentUser.UserId && !g.IsDeleted);

        if (request.OriginId.HasValue)
            query = query.Where(g => g.OriginId == request.OriginId.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(g =>
                g.Name.ToLower().Contains(search) ||
                (g.Species != null && g.Species.ToLower().Contains(search)) ||
                (g.Variety != null && g.Variety.ToLower().Contains(search)));
        }

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(g => g.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var dtos = items.Select(g =>
        {
            var cover = g.Photos.FirstOrDefault(p => p.IsCover) ?? g.Photos.FirstOrDefault();
            return new GemSummaryDto(
                g.Id, g.Name, g.Species, g.Variety, g.WeightCarats, g.Color, g.IsPublic,
                cover != null ? storage.GetPublicUrl(cover.ObjectKey) : null,
                g.CreatedAt);
        }).ToList();

        return new PagedResult<GemSummaryDto>(dtos, total, request.Page, request.PageSize);
    }
}
