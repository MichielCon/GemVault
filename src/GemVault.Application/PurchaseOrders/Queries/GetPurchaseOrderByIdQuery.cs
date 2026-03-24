using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.PurchaseOrders.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.PurchaseOrders.Queries;

public record GetPurchaseOrderByIdQuery(Guid Id) : IRequest<PurchaseOrderDto>;

public class GetPurchaseOrderByIdQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetPurchaseOrderByIdQuery, PurchaseOrderDto>
{
    public async Task<PurchaseOrderDto> Handle(GetPurchaseOrderByIdQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var order = await context.PurchaseOrders
            .Include(o => o.Supplier)
            .Include(o => o.Items)
                .ThenInclude(i => i.Gem)
            .Include(o => o.Items)
                .ThenInclude(i => i.GemParcel)
            .FirstOrDefaultAsync(o => o.Id == request.Id && !o.IsDeleted, ct)
            ?? throw new NotFoundException("PurchaseOrder", request.Id);

        if (order.OwnerId != currentUser.UserId)
            throw new NotFoundException("PurchaseOrder", request.Id);

        var itemDtos = order.Items
            .Where(i => !i.IsDeleted)
            .Select(i => new OrderItemDto(
                i.Id,
                i.GemId,
                i.Gem?.Name,
                i.GemParcelId,
                i.GemParcel?.Name,
                i.CostPrice,
                i.Notes))
            .ToList();

        return new PurchaseOrderDto(
            order.Id,
            order.Reference,
            order.OrderDate,
            order.SupplierId,
            order.Supplier?.Name,
            order.BoughtFrom,
            order.Notes,
            itemDtos,
            itemDtos.Sum(i => i.CostPrice),
            order.CreatedAt);
    }
}
