using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Suppliers.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;

namespace GemVault.Application.Suppliers.Commands;

public record CreateSupplierCommand(string Name, string? Email, string? Phone, string? Address, string? Notes) : IRequest<SupplierDto>;

public class CreateSupplierCommandValidator : AbstractValidator<CreateSupplierCommand>
{
    public CreateSupplierCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).MaximumLength(200).EmailAddress().When(x => x.Email != null);
        RuleFor(x => x.Notes).MaximumLength(5000).When(x => x.Notes != null);
    }
}

public class CreateSupplierCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<CreateSupplierCommand, SupplierDto>
{
    public async Task<SupplierDto> Handle(CreateSupplierCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var supplier = new Supplier
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Address = request.Address,
            Notes = request.Notes,
            OwnerId = currentUser.UserId.Value,
        };

        context.Suppliers.Add(supplier);
        await context.SaveChangesAsync(ct);

        return new SupplierDto(
            supplier.Id,
            supplier.Name,
            supplier.Email,
            supplier.Phone,
            supplier.Address,
            supplier.Notes,
            0,
            supplier.CreatedAt);
    }
}
