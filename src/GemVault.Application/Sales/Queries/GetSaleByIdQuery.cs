using GemVault.Application.Common.Exceptions;
using GemVault.Application.Interfaces;
using GemVault.Application.Sales.DTOs;
using GemVault.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GemVault.Application.Sales.Queries;

public record GetSaleByIdQuery(Guid Id) : IRequest<SaleDto>;

public class GetSaleByIdQueryHandler(
    IApplicationDbContext context,
    ICurrentUserService currentUser)
    : IRequestHandler<GetSaleByIdQuery, SaleDto>
{
    public async Task<SaleDto> Handle(GetSaleByIdQuery request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new ForbiddenException();

        var sale = await context.Sales
            .AsNoTracking()
            .Include(s => s.Items)
                .ThenInclude(i => i.Gem)
            .Include(s => s.Items)
                .ThenInclude(i => i.GemParcel)
            .FirstOrDefaultAsync(s => s.Id == request.Id && !s.IsDeleted, ct)
            ?? throw new NotFoundException("Sale", request.Id);

        if (sale.OwnerId != currentUser.UserId)
            throw new ForbiddenException();

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
