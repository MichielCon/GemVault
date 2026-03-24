using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Application.Gems.DTOs;
using GemVault.Domain.Enums;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Gems.Queries;

public record GetMyGemsQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    Guid? OriginId = null,
    string? Status = null,
    GemStatus? GemStatusFilter = null,
    string? Species = null,
    string? Color = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? SortBy = "date",
    string? SortDir = "desc")
    : IRequest<PagedResult<GemSummaryDto>>;

public class GetMyGemsQueryValidator : AbstractValidator<GetMyGemsQuery>
{
    public GetMyGemsQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

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
            .Include(g => g.SaleItems.Where(si => !si.IsDeleted))
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

        if (request.Status == "Sold")
            query = query.Where(g => g.SaleItems.Any(si => !si.IsDeleted));
        else if (request.Status == "InStock")
            query = query.Where(g => !g.SaleItems.Any(si => !si.IsDeleted));

        if (request.GemStatusFilter.HasValue)
            query = query.Where(g => g.Status == request.GemStatusFilter.Value);

        if (!string.IsNullOrWhiteSpace(request.Species))
            query = query.Where(g => g.Species != null && g.Species.ToLower() == request.Species.ToLower());

        if (!string.IsNullOrWhiteSpace(request.Color))
            query = query.Where(g => g.Color != null && g.Color.ToLower() == request.Color.ToLower());

        if (request.MinPrice.HasValue)
            query = query.Where(g => g.PurchasePrice >= request.MinPrice.Value);

        if (request.MaxPrice.HasValue)
            query = query.Where(g => g.PurchasePrice <= request.MaxPrice.Value);

        var total = await query.CountAsync(ct);

        var pageSize = Math.Min(request.PageSize, 100);

        query = (request.SortBy, request.SortDir?.ToLower()) switch
        {
            ("name", "asc")   => query.OrderBy(g => g.Name),
            ("name", _)       => query.OrderByDescending(g => g.Name),
            ("price", "asc")  => query.OrderBy(g => g.PurchasePrice),
            ("price", _)      => query.OrderByDescending(g => g.PurchasePrice),
            ("weight", "asc") => query.OrderBy(g => g.WeightCarats),
            ("weight", _)     => query.OrderByDescending(g => g.WeightCarats),
            _                 => query.OrderByDescending(g => g.CreatedAt),
        };

        var items = await query
            .Skip((request.Page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = items.Select(g =>
        {
            var cover = g.Photos.FirstOrDefault(p => p.IsCover) ?? g.Photos.FirstOrDefault();
            var isSold = g.SaleItems.Any();
            return new GemSummaryDto(
                g.Id, g.Name, g.Species, g.Variety, g.WeightCarats, g.Color, g.IsPublic,
                cover != null ? storage.GetPublicUrl(cover.ObjectKey) : null,
                g.CreatedAt, isSold, g.Status);
        }).ToList();

        return new PagedResult<GemSummaryDto>(dtos, total, request.Page, pageSize);
    }
}
