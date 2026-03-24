using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Application.Sales.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Sales.Queries;

public record GetSalesQuery(int Page = 1, int PageSize = 20, string? Search = null) : IRequest<PagedResult<SaleSummaryDto>>;

public class GetSalesQueryValidator : AbstractValidator<GetSalesQuery>
{
    public GetSalesQueryValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}

public class GetSalesQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetSalesQuery, PagedResult<SaleSummaryDto>>
{
    public async Task<PagedResult<SaleSummaryDto>> Handle(GetSalesQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var query = context.Sales
            .Include(s => s.Items)
            .Where(s => s.OwnerId == currentUser.UserId && !s.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(s =>
                s.BuyerName != null && s.BuyerName.ToLower().Contains(search));
        }

        var total = await query.CountAsync(ct);

        var pageSize = Math.Min(request.PageSize, 100);
        var items = await query
            .OrderByDescending(s => s.SaleDate)
            .Skip((request.Page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var dtos = items.Select(s => new SaleSummaryDto(
            s.Id,
            s.SaleDate,
            s.BuyerName,
            s.Items.Where(i => !i.IsDeleted).Sum(i => i.SalePrice * i.Quantity),
            s.Items.Count(i => !i.IsDeleted),
            s.CreatedAt)).ToList();

        return new PagedResult<SaleSummaryDto>(dtos, total, request.Page, pageSize);
    }
}
