using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Suppliers.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Suppliers.Queries;

public record GetSupplierByIdQuery(Guid Id) : IRequest<SupplierDto>;

public class GetSupplierByIdQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetSupplierByIdQuery, SupplierDto>
{
    public async Task<SupplierDto> Handle(GetSupplierByIdQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var supplier = await context.Suppliers
            .Include(s => s.PurchaseOrders)
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, ct)
            ?? throw new NotFoundException("Supplier", request.Id);

        if (supplier.OwnerId != currentUser.UserId)
            throw new NotFoundException("Supplier", request.Id);

        return new SupplierDto(
            supplier.Id,
            supplier.Name,
            supplier.Email,
            supplier.Phone,
            supplier.Website,
            supplier.Address,
            supplier.Notes,
            supplier.PurchaseOrders.Count(o => !o.IsDeleted),
            supplier.CreatedAt);
    }
}
