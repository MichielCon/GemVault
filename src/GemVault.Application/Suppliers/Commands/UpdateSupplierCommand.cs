using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Suppliers.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Suppliers.Commands;

public record UpdateSupplierCommand(Guid Id, string Name, string? Email, string? Phone, string? Address, string? Notes) : IRequest<SupplierDto>;

public class UpdateSupplierCommandValidator : AbstractValidator<UpdateSupplierCommand>
{
    public UpdateSupplierCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).MaximumLength(200).When(x => x.Email != null);
        RuleFor(x => x.Notes).MaximumLength(5000).When(x => x.Notes != null);
    }
}

public class UpdateSupplierCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateSupplierCommand, SupplierDto>
{
    public async Task<SupplierDto> Handle(UpdateSupplierCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var supplier = await context.Suppliers
            .Include(s => s.PurchaseOrders)
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, ct)
            ?? throw new NotFoundException("Supplier", request.Id);

        if (supplier.OwnerId != currentUser.UserId)
            throw new NotFoundException("Supplier", request.Id);

        supplier.Name = request.Name;
        supplier.Email = request.Email;
        supplier.Phone = request.Phone;
        supplier.Address = request.Address;
        supplier.Notes = request.Notes;
        supplier.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);

        return new SupplierDto(
            supplier.Id,
            supplier.Name,
            supplier.Email,
            supplier.Phone,
            supplier.Address,
            supplier.Notes,
            supplier.PurchaseOrders.Count(o => !o.IsDeleted),
            supplier.CreatedAt);
    }
}
