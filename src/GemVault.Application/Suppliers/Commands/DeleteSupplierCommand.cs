using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Suppliers.Commands;

public record DeleteSupplierCommand(Guid Id) : IRequest;

public class DeleteSupplierCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<DeleteSupplierCommand>
{
    public async Task Handle(DeleteSupplierCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var supplier = await context.Suppliers
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, ct)
            ?? throw new NotFoundException("Supplier", request.Id);

        if (supplier.OwnerId != currentUser.UserId)
            throw new NotFoundException("Supplier", request.Id);

        supplier.IsDeleted = true;
        supplier.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
    }
}
