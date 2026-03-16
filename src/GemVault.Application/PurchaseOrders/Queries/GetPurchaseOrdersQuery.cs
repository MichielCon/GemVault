using GemVault.Application.Common.Exceptions;
using GemVault.Application.Common.Models;
using GemVault.Application.Interfaces;
using GemVault.Application.PurchaseOrders.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.PurchaseOrders.Queries;

public record GetPurchaseOrdersQuery(int Page = 1, int PageSize = 20, string? Search = null, Guid? SupplierId = null) : IRequest<PagedResult<PurchaseOrderSummaryDto>>;

public class GetPurchaseOrdersQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetPurchaseOrdersQuery, PagedResult<PurchaseOrderSummaryDto>>
{
    public async Task<PagedResult<PurchaseOrderSummaryDto>> Handle(GetPurchaseOrdersQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var query = context.PurchaseOrders
            .Include(o => o.Supplier)
            .Include(o => o.Items)
            .Where(o => o.OwnerId == currentUser.UserId && !o.IsDeleted);

        if (request.SupplierId.HasValue)
            query = query.Where(o => o.SupplierId == request.SupplierId.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(o =>
                (o.Reference != null && o.Reference.ToLower().Contains(search)) ||
                o.Supplier.Name.ToLower().Contains(search));
        }

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(o => o.OrderDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(ct);

        var dtos = items.Select(o => new PurchaseOrderSummaryDto(
            o.Id,
            o.Reference,
            o.OrderDate,
            o.Supplier.Name,
            o.Items.Where(i => !i.IsDeleted).Sum(i => i.CostPrice),
            o.Items.Count(i => !i.IsDeleted),
            o.CreatedAt)).ToList();

        return new PagedResult<PurchaseOrderSummaryDto>(dtos, total, request.Page, request.PageSize);
    }
}
