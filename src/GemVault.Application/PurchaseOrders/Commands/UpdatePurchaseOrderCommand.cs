using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.PurchaseOrders.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.PurchaseOrders.Commands;

public record UpdatePurchaseOrderCommand(Guid Id, Guid? SupplierId, string? BoughtFrom, string? Reference, DateTime OrderDate, string? Notes) : IRequest<PurchaseOrderDto>;

public class UpdatePurchaseOrderCommandValidator : AbstractValidator<UpdatePurchaseOrderCommand>
{
    public UpdatePurchaseOrderCommandValidator()
    {
        RuleFor(x => x.OrderDate).NotEmpty();
    }
}

public class UpdatePurchaseOrderCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdatePurchaseOrderCommand, PurchaseOrderDto>
{
    public async Task<PurchaseOrderDto> Handle(UpdatePurchaseOrderCommand request, CancellationToken ct)
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

        Supplier? supplier = null;
        if (request.SupplierId.HasValue)
        {
            supplier = await context.Suppliers
                .FirstOrDefaultAsync(s => s.Id == request.SupplierId && !s.IsDeleted, ct)
                ?? throw new NotFoundException("Supplier", request.SupplierId);

            if (supplier.OwnerId != currentUser.UserId)
                throw new NotFoundException("Supplier", request.SupplierId);
        }

        order.SupplierId = request.SupplierId;
        order.BoughtFrom = request.BoughtFrom;
        order.Reference = request.Reference;
        order.OrderDate = DateTime.SpecifyKind(request.OrderDate, DateTimeKind.Utc);
        order.Notes = request.Notes;
        order.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);

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
            supplier?.Name,
            order.BoughtFrom,
            order.Notes,
            itemDtos,
            itemDtos.Sum(i => i.CostPrice),
            order.CreatedAt);
    }
}
