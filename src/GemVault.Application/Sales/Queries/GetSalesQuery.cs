using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Application.Sales.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Sales.Queries;

public record GetSalesQuery(int Page = 1, int PageSize = 20) : IRequest<PagedResult<SaleSummaryDto>>;

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

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(s => s.SaleDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var dtos = items.Select(s => new SaleSummaryDto(
            s.Id,
            s.SaleDate,
            s.BuyerName,
            s.Items.Where(i => !i.IsDeleted).Sum(i => i.SalePrice * i.Quantity),
            s.Items.Count(i => !i.IsDeleted),
            s.CreatedAt)).ToList();

        return new PagedResult<SaleSummaryDto>(dtos, total, request.Page, request.PageSize);
    }
}
