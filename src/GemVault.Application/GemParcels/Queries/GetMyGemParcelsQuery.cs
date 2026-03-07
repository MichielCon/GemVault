using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Queries;

public record GetMyGemParcelsQuery(int Page = 1, int PageSize = 20, string? Search = null, Guid? OriginId = null)
    : IRequest<PagedResult<GemParcelSummaryDto>>;

public class GetMyGemParcelsQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser,
    IStorageService storage)
    : IRequestHandler<GetMyGemParcelsQuery, PagedResult<GemParcelSummaryDto>>
{
    public async Task<PagedResult<GemParcelSummaryDto>> Handle(GetMyGemParcelsQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var query = context.GemParcels
            .Include(p => p.Photos)
            .Where(p => p.OwnerId == currentUser.UserId && !p.IsDeleted);

        if (request.OriginId.HasValue)
            query = query.Where(p => p.OriginId == request.OriginId.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                (p.Species != null && p.Species.ToLower().Contains(search)) ||
                (p.Variety != null && p.Variety.ToLower().Contains(search)));
        }

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var dtos = items.Select(p => p.ToSummaryDto(storage)).ToList();

        return new PagedResult<GemParcelSummaryDto>(dtos, total, request.Page, request.PageSize);
    }
}
