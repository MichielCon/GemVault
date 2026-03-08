using FluentValidation;
using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Sales.DTOs;
using GemVault.Domain.Entities;
using GemVault.Domain.Interfaces;
using MediatR;

namespace GemVault.Application.Sales.Commands;

public record CreateSaleItemCommand(Guid? GemId, Guid? GemParcelId, int Quantity, decimal SalePrice);

public record CreateSaleCommand(
    DateTime SaleDate,
    string? BuyerName,
    string? BuyerEmail,
    string? Notes,
    List<CreateSaleItemCommand> Items) : IRequest<SaleDto>;

public class CreateSaleCommandValidator : AbstractValidator<CreateSaleCommand>
{
    public CreateSaleCommandValidator()
    {
        RuleFor(x => x.SaleDate).NotEmpty();
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.Quantity).GreaterThan(0);
            item.RuleFor(i => i.SalePrice).GreaterThanOrEqualTo(0);
        });
    }
}

public class CreateSaleCommandHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<CreateSaleCommand, SaleDto>
{
    public async Task<SaleDto> Handle(CreateSaleCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var sale = new Sale
        {
            SaleDate = DateTime.SpecifyKind(request.SaleDate, DateTimeKind.Utc),
            BuyerName = request.BuyerName,
            BuyerEmail = request.BuyerEmail,
            Notes = request.Notes,
            OwnerId = currentUser.UserId.Value,
        };

        foreach (var item in request.Items)
        {
            sale.Items.Add(new SaleItem
            {
                GemId = item.GemId,
                GemParcelId = item.GemParcelId,
                Quantity = item.Quantity,
                SalePrice = item.SalePrice,
            });
        }

        context.Sales.Add(sale);
        await context.SaveChangesAsync(ct);

        var itemDtos = sale.Items.Select(i => new SaleItemDto(
            i.Id,
            i.GemId,
            null,
            i.GemParcelId,
            null,
            i.Quantity,
            i.SalePrice)).ToList();

        return new SaleDto(
            sale.Id,
            sale.SaleDate,
            sale.BuyerName,
            sale.BuyerEmail,
            sale.Notes,
            itemDtos,
            itemDtos.Sum(i => i.SalePrice * i.Quantity),
            sale.CreatedAt);
    }
}
