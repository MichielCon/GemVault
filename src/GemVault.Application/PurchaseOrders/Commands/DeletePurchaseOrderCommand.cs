using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.PurchaseOrders.Commands;

public record DeletePurchaseOrderCommand(Guid Id) : IRequest;

public class DeletePurchaseOrderCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<DeletePurchaseOrderCommand>
{
    public async Task Handle(DeletePurchaseOrderCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var order = await context.PurchaseOrders
            .FirstOrDefaultAsync(o => o.Id == request.Id && !o.IsDeleted, ct)
            ?? throw new NotFoundException("PurchaseOrder", request.Id);

        if (order.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        order.IsDeleted = true;
        order.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
    }
}
