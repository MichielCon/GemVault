using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Sales.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Sales.Commands;

public record UpdateSaleCommand(Guid Id, DateTime SaleDate, string? BuyerName, string? BuyerEmail, string? BuyerPhone, string? Notes) : IRequest<SaleDto>;

public class UpdateSaleCommandValidator : AbstractValidator<UpdateSaleCommand>
{
    public UpdateSaleCommandValidator()
    {
        RuleFor(x => x.SaleDate).NotEmpty();
    }
}

public class UpdateSaleCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<UpdateSaleCommand, SaleDto>
{
    public async Task<SaleDto> Handle(UpdateSaleCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var sale = await context.Sales
            .Include(s => s.Items)
                .ThenInclude(i => i.Gem)
            .Include(s => s.Items)
                .ThenInclude(i => i.GemParcel)
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, ct)
            ?? throw new NotFoundException("Sale", request.Id);

        if (sale.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

        sale.SaleDate = DateTime.SpecifyKind(request.SaleDate, DateTimeKind.Utc);
        sale.BuyerName = request.BuyerName;
        sale.BuyerEmail = request.BuyerEmail;
        sale.BuyerPhone = request.BuyerPhone;
        sale.Notes = request.Notes;
        sale.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);

        var itemDtos = sale.Items
            .Where(i => !i.IsDeleted)
            .Select(i => new SaleItemDto(
                i.Id,
                i.GemId,
                i.Gem?.Name,
                i.GemParcelId,
                i.GemParcel?.Name,
                i.Quantity,
                i.SalePrice))
            .ToList();

        return new SaleDto(
            sale.Id,
            sale.SaleDate,
            sale.BuyerName,
            sale.BuyerEmail,
            sale.BuyerPhone,
            sale.Notes,
            itemDtos,
            itemDtos.Sum(i => i.SalePrice * i.Quantity),
            sale.CreatedAt);
    }
}
