using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.GemParcels.DTOs;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.GemParcels.Queries;

public record GetMyGemParcelsQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    Guid? OriginId = null,
    string? Status = null,
    string? Species = null,
    string? Color = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? SortBy = "date",
    string? SortDir = "desc")
    : IRequest<PagedResult<GemParcelSummaryDto>>;

public class GetMyGemParcelsQueryValidator : AbstractValidator<GetMyGemParcelsQuery>
{
    public GetMyGemParcelsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

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
            .AsNoTracking()
            .Include(p => p.Photos)
            .Include(p => p.SaleItems.Where(si => !si.IsDeleted))
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

        if (request.Status == "Sold")
            query = query.Where(p => p.SaleItems.Any(si => !si.IsDeleted));
        else if (request.Status == "InStock")
            query = query.Where(p => !p.SaleItems.Any(si => !si.IsDeleted));

        if (!string.IsNullOrWhiteSpace(request.Species))
            query = query.Where(p => p.Species != null && p.Species.ToLower() == request.Species.ToLower());

        if (!string.IsNullOrWhiteSpace(request.Color))
            query = query.Where(p => p.Color != null && p.Color.ToLower() == request.Color.ToLower());

        if (request.MinPrice.HasValue)
            query = query.Where(p => p.PurchasePrice >= request.MinPrice.Value);

        if (request.MaxPrice.HasValue)
            query = query.Where(p => p.PurchasePrice <= request.MaxPrice.Value);

        var total = await query.CountAsync(ct);

        var pageSize = Math.Min(request.PageSize, 100);

        query = (request.SortBy, request.SortDir?.ToLower()) switch
        {
            ("name", "asc")   => query.OrderBy(p => p.Name),
            ("name", _)       => query.OrderByDescending(p => p.Name),
            ("price", "asc")  => query.OrderBy(p => p.PurchasePrice),
            ("price", _)      => query.OrderByDescending(p => p.PurchasePrice),
            ("weight", "asc") => query.OrderBy(p => p.TotalWeightCarats),
            ("weight", _)     => query.OrderByDescending(p => p.TotalWeightCarats),
            _                 => query.OrderByDescending(p => p.CreatedAt),
        };

        var items = await query
            .Skip((request.Page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = items.Select(p => p.ToSummaryDto(storage, p.SaleItems.Any())).ToList();

        return new PagedResult<GemParcelSummaryDto>(dtos, total, request.Page, pageSize);
    }
}
