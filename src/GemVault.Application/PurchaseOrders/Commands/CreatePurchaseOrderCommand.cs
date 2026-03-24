using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.PurchaseOrders.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.PurchaseOrders.Commands;

public record CreateOrderItemCommand(Guid? GemId, Guid? GemParcelId, decimal CostPrice, string? Notes);

public record CreatePurchaseOrderCommand(
    Guid? SupplierId,
    string? BoughtFrom,
    string? Reference,
    DateTime OrderDate,
    string? Notes,
    List<CreateOrderItemCommand> Items) : IRequest<PurchaseOrderDto>;

public class CreatePurchaseOrderCommandValidator : AbstractValidator<CreatePurchaseOrderCommand>
{
    public CreatePurchaseOrderCommandValidator()
    {
        RuleFor(x => x.OrderDate).NotEmpty();
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.CostPrice).GreaterThanOrEqualTo(0);
        });
    }
}

public class CreatePurchaseOrderCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<CreatePurchaseOrderCommand, PurchaseOrderDto>
{
    public async Task<PurchaseOrderDto> Handle(CreatePurchaseOrderCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        Supplier? supplier = null;
        if (request.SupplierId.HasValue)
        {
            supplier = await context.Suppliers
                .FirstOrDefaultAsync(s => s.Id == request.SupplierId && !s.IsDeleted, ct)
                ?? throw new NotFoundException("Supplier", request.SupplierId);

            if (supplier.OwnerId != currentUser.UserId)
                throw new NotFoundException("Supplier", request.SupplierId);
        }

        var order = new PurchaseOrder
        {
            SupplierId = request.SupplierId,
            BoughtFrom = request.BoughtFrom,
            Reference = request.Reference,
            OrderDate = DateTime.SpecifyKind(request.OrderDate, DateTimeKind.Utc),
            Notes = request.Notes,
            OwnerId = currentUser.UserId.Value,
        };

        foreach (var item in request.Items)
        {
            order.Items.Add(new OrderItem
            {
                GemId = item.GemId,
                GemParcelId = item.GemParcelId,
                CostPrice = item.CostPrice,
                Notes = item.Notes,
            });
        }

        context.PurchaseOrders.Add(order);
        await context.SaveChangesAsync(ct);

        var itemDtos = order.Items.Select(i => new OrderItemDto(
            i.Id,
            i.GemId,
            null,
            i.GemParcelId,
            null,
            i.CostPrice,
            i.Notes)).ToList();

        return new PurchaseOrderDto(
            order.Id,
            order.Reference,
            order.OrderDate,
            order.SupplierId,
            supplier?.Name,
            order.BoughtFrom,
            order.Notes,
            itemDtos,
            itemDtos.Sum(i => i.CostPrice),
            order.CreatedAt);
    }
}
